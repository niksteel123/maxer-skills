#!/usr/bin/env python3
"""Check the public skill package, local links and installation dependency graph."""
import hashlib
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from install import inventory, select


def main():
    manifest = inventory()
    errors = []
    names = {p.name for p in ROOT.iterdir() if (p / 'SKILL.md').is_file()}
    if names != set(manifest['skills']):
        errors.append('skills.json does not match bundled folders')
    for name in sorted(names):
        path = ROOT / name / 'SKILL.md'
        text = path.read_text()
        parts = text.split('---', 2)
        if not text.startswith('---\n') or len(parts) != 3:
            errors.append(f'{name}: missing YAML frontmatter')
            continue
        if not re.search(r'^name:\s*[\'"]?' + re.escape(name) + r'[\'"]?\s*$', parts[1], re.M):
            errors.append(f'{name}: frontmatter name differs from folder')
        if not re.search(r'^description:\s*\S', parts[1], re.M):
            errors.append(f'{name}: missing description')
        for related in manifest['skills'][name].get('related', []):
            if related not in manifest['skills']:
                errors.append(f'{name}: unknown related skill {related}')
        try:
            select(manifest, [name], [])
        except ValueError as error:
            errors.append(str(error))
    for preset in manifest['presets']:
        try:
            select(manifest, [], [preset])
        except ValueError as error:
            errors.append(str(error))
    for preset, required in manifest.get('external_requirements', {}).items():
        if preset not in manifest['presets']:
            errors.append(f'Unknown preset for external requirements: {preset}')
        for name in required:
            if name not in manifest.get('external_skills', {}):
                errors.append(f'Unknown external core companion: {name}')
    if (ROOT / 'AGENTS.md').read_bytes() != (ROOT / 'CLAUDE.md').read_bytes():
        errors.append('AGENTS.md and CLAUDE.md differ')
    for path in ROOT.rglob('*'):
        if '.git' in path.parts or '__pycache__' in path.parts:
            continue
        if path.name.startswith('._') or path.name == '.DS_Store':
            errors.append(f'OS metadata must not ship: {path.relative_to(ROOT)}')
        if path.is_symlink():
            errors.append(f'Symlink must not ship: {path.relative_to(ROOT)}')
        if not path.is_file() or path.suffix != '.md':
            continue
        text = path.read_text()
        if 'jeffreys-skills.md/terms' in text and 'JSM-WATERMARK' in text:
            errors.append(f'Subscriber content must not ship: {path.relative_to(ROOT)}')
        if re.search(r'/(?:Users/steel|home/devrunner)/', text):
            errors.append(f'Personal absolute path: {path.relative_to(ROOT)}')
        for target in re.findall(r'\]\(([^\s)]+)\)', text):
            if ':' in target or target.startswith(('#', '/', '~')) or '{' in target or '<' in target:
                continue
            local = target.split('#')[0]
            if local and not (path.parent / local).exists():
                errors.append(f'{path.relative_to(ROOT)}: missing link {target}')
    snapshot = json.loads((ROOT / 'docs/source-snapshot.json').read_text())
    adaptations = snapshot.get('public_adaptations', {})
    for entry in snapshot['skills']:
        for relative, expected in entry['files'].items():
            key = entry['name'] + '/' + relative
            expected = adaptations.get(key, {}).get('published_sha256', expected)
            path = ROOT / key
            if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != expected:
                errors.append(f'Imported source changed without snapshot update: {key}')
    for key, notice in snapshot.get('additional_notices', {}).items():
        path = ROOT / key
        if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != notice['sha256']:
            errors.append(f'Additional notice changed: {key}')
    if names & set(manifest.get('external_skills', {})):
        errors.append('External-only skill is also bundled')
    if {s['name'] for s in snapshot['skills']} != names:
        errors.append('source-snapshot.json does not cover all bundled skills')
    if errors:
        print('\n'.join(errors), file=sys.stderr)
        return 1
    print(f'PASS: {len(names)} skills; metadata, local links, dependency closure, '
          'source hashes, public packaging and agent-file parity')
    return 0


if __name__ == '__main__':
    sys.exit(main())
