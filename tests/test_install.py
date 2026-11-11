"""Exercise installation against disposable destinations, including local edits and symlinks."""
from contextlib import redirect_stdout
import io
from pathlib import Path
import sys
import subprocess
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
import install


class InstallationTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.dest = Path(self.temporary.name) / 'skills'
        self.output = io.StringIO()
        self.redirect = redirect_stdout(self.output)
        self.redirect.__enter__()
        self.addCleanup(self.redirect.__exit__, None, None, None)

    def test_all_resources_install_and_second_install_is_unchanged(self):
        names = install.select(install.inventory(), [], [], all_skills=True)
        install.install(names, self.dest)
        for name in names:
            self.assertEqual(install.tree(install.ROOT / name), install.tree(self.dest / name))
        self.output.seek(0)
        self.output.truncate()
        install.install(names, self.dest)
        self.assertEqual(len(names), self.output.getvalue().count('unchanged:'))
        self.assertFalse(list(self.dest.glob('.*.backup-*')))

    def test_everyday_includes_git_contract_dependencies_and_no_external_bundle(self):
        names = install.select(install.inventory(), [], ['everyday'])
        self.assertIn('git-contractmaxxer', names)
        self.assertNotIn('verify-ops', names)
        self.assertNotIn('fleet-accounts', names)
        self.assertIn('fleet-controller', names)
        self.assertNotIn('just-say-no-to-process-porn-and-ceremony', names)
        install.install(names, self.dest, dry_run=True)
        self.assertFalse(self.dest.exists())

    def test_default_cli_installs_exactly_the_documented_starter(self):
        result = subprocess.run(
            [sys.executable, str(install.ROOT / 'scripts/install.py'), '--dest', str(self.dest)],
            capture_output=True, text=True, check=True,
        )
        self.assertIn('install:', result.stdout)
        self.assertIn('External core companion: just-say-no-to-process-porn-and-ceremony', result.stdout)
        self.assertIn('not found at this destination', result.stdout)
        self.assertEqual(
            {'git-contractmaxxer', 'product-board', 'fleet-controller', 'intent-to-handoff', 'disk-janitor'},
            {path.name for path in self.dest.iterdir()},
        )
        self.assertTrue((self.dest / 'git-contractmaxxer/TAKEOVER.md').is_file())
        self.assertFalse((self.dest / 'verify-ops').exists())
        self.assertFalse((self.dest / 'codex-first').exists())

    def test_external_core_companion_is_reported_without_modifying_it(self):
        external = self.dest / 'just-say-no-to-process-porn-and-ceremony'
        external.mkdir(parents=True)
        (external / 'SKILL.md').write_text('local external-skill sentinel')
        result = subprocess.run(
            [sys.executable, str(install.ROOT / 'scripts/install.py'), '--preset', 'starter',
             '--dest', str(self.dest)], capture_output=True, text=True, check=True,
        )
        self.assertIn('found at this destination; provenance/version not verified', result.stdout)
        self.assertEqual('local external-skill sentinel', (external / 'SKILL.md').read_text())

    def test_optional_adapters_are_not_pulled_in_as_dependencies(self):
        names = install.select(install.inventory(), ['git-contractmaxxer'], [])
        self.assertIn('fleet-controller', names)
        for name in ['fleet-accounts', 'verify-ops', 'verify-authoring', 'research-to-contract']:
            self.assertNotIn(name, names)
        contract = install.select(install.inventory(), [], ['contract'])
        self.assertIn('verify-ops', contract)
        self.assertNotIn('codex-first', contract)

    def test_conflict_preflight_prevents_partial_install(self):
        changed = self.dest / 'product-board'
        changed.mkdir(parents=True)
        (changed / 'SKILL.md').write_text('local customization')
        with self.assertRaisesRegex(ValueError, 'no files changed'):
            install.install(['fleet-controller', 'product-board'], self.dest)
        self.assertFalse((self.dest / 'fleet-controller').exists())
        self.assertEqual('local customization', (changed / 'SKILL.md').read_text())

    def test_explicit_replacement_preserves_custom_directory(self):
        changed = self.dest / 'product-board'
        changed.mkdir(parents=True)
        (changed / 'SKILL.md').write_text('local customization')
        install.install(['product-board'], self.dest, replace=True)
        backups = list(self.dest.glob('.product-board.backup-*'))
        self.assertEqual(1, len(backups))
        self.assertEqual('local customization', (backups[0] / 'SKILL.md').read_text())
        self.assertEqual(install.tree(install.ROOT / 'product-board'), install.tree(changed))

    def test_replacement_backs_up_symlink_without_editing_its_target(self):
        external = Path(self.temporary.name) / 'external'
        external.mkdir()
        (external / 'SKILL.md').write_text('private upstream')
        self.dest.mkdir()
        (self.dest / 'product-board').symlink_to(external, target_is_directory=True)
        with self.assertRaises(ValueError):
            install.install(['product-board'], self.dest)
        install.install(['product-board'], self.dest, replace=True)
        backup = next(self.dest.glob('.product-board.backup-*'))
        self.assertTrue(backup.is_symlink())
        self.assertFalse((self.dest / 'product-board').is_symlink())
        self.assertEqual('private upstream', (external / 'SKILL.md').read_text())

    def test_source_checkout_and_nested_destination_are_refused(self):
        with self.assertRaises(ValueError):
            install.install(['product-board'], install.ROOT, replace=True)
        with self.assertRaises(ValueError):
            install.install(['product-board'], install.ROOT / 'product-board' / 'nested')

    def test_external_or_traversing_skill_name_is_refused(self):
        for name in ['../private', 'just-say-no-to-process-porn-and-ceremony']:
            with self.assertRaises(ValueError):
                install.select(install.inventory(), [name], [])


if __name__ == '__main__':
    unittest.main()
