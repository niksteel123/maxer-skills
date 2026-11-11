# Working on Maxer Skills

This repository publishes reusable skills, not private machine configuration.
Keep this file and CLAUDE.md identical. The starter for OTHER repositories is
[examples/AGENTS.md](examples/AGENTS.md); do not install this repository's rules globally.

- Read README.md, docs/SETUP.md and docs/DEPENDENCIES.md for the affected workflow.
- Preserve the distinction between Git Contractmaxxer, Contractmaxxer and the
  older 3-SOT pipeline. Repository/user policy overrides helper defaults.
- Refresh a skill together with its templates, references, scripts and assets.
  Inspect conflicting installed copies; timestamps alone do not resolve authority.
- Add bundled skills and their install dependencies to skills.json. Document
  optional skills and executable/service prerequisites in docs/DEPENDENCIES.md.
- Never publish credentials, personal fleet endpoints, account identities,
  subscriber bundles or private runbooks. Check upstream redistribution terms.
  Link to proprietary dependencies; do not copy or recreate their content.
- Preserve third-party notices. Do not relabel an upstream work as original MIT content.
- Update docs/source-snapshot.json when importing skill sources. Its source hashes
  record the audited input; document deliberate public adaptations separately.
- Run python3 scripts/validate.py and python3 -m unittest discover -s tests
  before committing. These check packaging and installation, not model behavior
  or availability of external services.
- Keep changes focused, use descriptive Conventional Commits, and report what
  was actually tested. Do not infer deployment, account changes or paid-run
  permission from a skill installation or a workflow's AUTO mode.
