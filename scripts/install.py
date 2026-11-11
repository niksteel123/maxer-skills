#!/usr/bin/env python3
"""Install bundled skills without overwriting local edits by default (Python 3.10+)."""
import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import shutil
import sys
import uuid

ROOT = Path(__file__).resolve().parents[1]


def inventory():
    return json.loads((ROOT / 'skills.json').read_text())


def select(manifest, skills, presets, all_skills=False):
    selected = set(manifest['skills']) if all_skills else set(skills)
    for preset in presets:
        selected.update(manifest['presets'][preset])
    pending = list(selected)
    while pending:
        name = pending.pop()
        if name not in manifest['skills']:
            raise ValueError(f'Unknown bundled skill: {name}; external skills install separately')
        for dependency in manifest['skills'][name]['requires']:
            if dependency not in selected:
                selected.add(dependency)
                pending.append(dependency)
    return sorted(selected)


def tree(path):
    if not path.is_dir():
        return None
    result = {}
    for item in path.rglob('*'):
        if item.name == '__pycache__' or '__pycache__' in item.parts or item.suffix == '.pyc':
            continue
        if item.is_symlink():
            return None  # Never treat a linked subtree as an identical local copy.
        if item.is_file():
            result[str(item.relative_to(path))] = item.read_bytes()
    return result


def install(names, destination, replace=False, dry_run=False):
    destination = destination.expanduser()
    if destination.exists() and not destination.is_dir():
        raise ValueError(f'Destination is not a directory: {destination}')
    jobs = []
    conflicts = []
    for name in names:
        source = ROOT / name
        target = destination / name
        if destination.resolve().is_relative_to(source.resolve()):
            raise ValueError(f'Refusing to install inside a source skill: {destination}')
        if target.resolve() == source.resolve():
            raise ValueError(f'Refusing to replace the source checkout: {target}')
        exists = target.exists() or target.is_symlink()
        same = exists and not target.is_symlink() and tree(source) == tree(target)
        action = 'unchanged' if same else 'replace' if exists else 'install'
        if action == 'replace' and not replace:
            conflicts.append(str(target))
        jobs.append((source, target, action))
    for _, target, action in jobs:
        print(f'{action}: {target}')
    if conflicts:
        raise ValueError('Local differences found; no files changed. Review and use --replace to '
                         'retain backups and replace:\n' + '\n'.join(conflicts))
    if dry_run:
        print('Dry run; no files changed.')
        return
    destination.mkdir(parents=True, exist_ok=True)
    for source, target, action in jobs:
        if action == 'unchanged':
            continue
        staging = destination / ('.' + target.name + '.install-' + uuid.uuid4().hex)
        backup = None
        try:
            shutil.copytree(source, staging, ignore=shutil.ignore_patterns(
                '__pycache__', '*.pyc', '._*', '.DS_Store'))
            if action == 'replace':
                stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
                backup = destination / ('.' + target.name + '.backup-' + stamp + '-' + uuid.uuid4().hex[:8])
                target.rename(backup)
                print(f'backup: {backup}')
            staging.rename(target)
        except BaseException:
            if backup is not None and not target.exists() and not target.is_symlink():
                backup.rename(target)
            raise
        finally:
            if staging.exists():
                shutil.rmtree(staging)


def report_external_requirements(manifest, presets, destination):
    names = sorted({name for preset in presets
                    for name in manifest.get('external_requirements', {}).get(preset, [])})
    for name in names:
        source = manifest['external_skills'][name]['source']
        present = (destination.expanduser() / name / 'SKILL.md').is_file()
        status = ('found at this destination; provenance/version not verified'
                  if present else 'not found at this destination')
        print(f'External core companion: {name} ({status}).')
        print(f'  Install/update through the authorized upstream: {source}')
        print('  This installer does not download or redistribute it; verify discovery in your harness.')


def main():
    manifest = inventory()
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--skill', action='append', default=[], help='Bundled skill; repeatable')
    parser.add_argument('--preset', choices=sorted(manifest['presets']), action='append', default=[])
    parser.add_argument('--all', action='store_true', help='Install every bundled skill')
    parser.add_argument('--list', action='store_true', help='List bundled skills and presets')
    location = parser.add_mutually_exclusive_group()
    location.add_argument('--target', choices=['claude', 'codex', 'shared'], default='shared')
    location.add_argument('--dest', type=Path, help='Explicit skills directory')
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--replace', action='store_true', help='Back up differing destinations before replacement')
    args = parser.parse_args()
    if args.list:
        print('Presets: ' + ', '.join(manifest['presets']))
        print('\n'.join(manifest['skills']))
        for preset, names in manifest.get('external_requirements', {}).items():
            print(f'External core companions for {preset}: ' + ', '.join(names))
        return
    presets = args.preset or ([] if args.skill or args.all else ['starter'])
    try:
        names = select(manifest, args.skill, presets, args.all)
        roots = {'claude': '.claude', 'codex': '.codex', 'shared': '.agents'}
        destination = args.dest if args.dest is not None else Path.home() / roots[args.target] / 'skills'
        install(names, destination, args.replace, args.dry_run)
        report_external_requirements(manifest, presets, destination)
    except (ValueError, OSError) as error:
        print(f'ERROR: {error}', file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
