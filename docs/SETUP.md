# Setup and updates

Use Python 3.10+ and Git. Clone the repository to a permanent location:

```sh
git clone https://github.com/niksteel123/maxer-skills.git
cd maxer-skills
python3 scripts/validate.py
python3 scripts/install.py --preset starter --target shared --dry-run
python3 scripts/install.py --preset starter --target shared
```

`shared` installs into `~/.agents/skills`, `claude` into `~/.claude/skills`, and
`codex` into `~/.codex/skills`. Use the root your harness discovers. For Claude
Code and Codex together, run the installer once with `--target claude` and once
with `--target shared`. Older/custom Codex setups may require `--target codex`.
Do not blindly maintain divergent copies in multiple discovery roots.

The installer defaults to the five-skill starter preset (`everyday` is an alias),
includes required bundled prerequisites, and copies only actual skill folders.
Optional `related` helpers do not expand automatically. The core recommendation
also includes the externally installed no-process-porn/ceremony skill; the
installer reports it but does not download it. A successful exit confirms bundled
installation only. See the [new-project guide](NEW-PROJECT.md) for the upstream
step and the [integration guide](INTEGRATION.md) for an existing codebase. It never installs
proprietary/external skills, CLIs, MCP servers, plugins or credentials. It does
not write or replace AGENTS.md, CLAUDE.md or global harness configuration.

```sh
python3 scripts/install.py --list
python3 scripts/install.py --preset contract --target claude
python3 scripts/install.py --skill git-contractmaxxer --target shared --dry-run
python3 scripts/install.py --preset swarm --target shared
python3 scripts/install.py --all --target shared --dry-run
```

`--dest /path/to/skills` selects an explicit destination instead of a target.
Matching installed folders are skipped. Differing files, directories or symlinks
cause the entire install to refuse before writing unless `--replace` is explicit.
Replacement renames each previous destination to a timestamped sibling backup;
it does not follow or delete the old symlink target. Retain backups until reviewed.

For updates, start from a clean checkout, fetch and inspect upstream changes,
fast-forward your checkout, validate, then preview installation. Review local
customizations before using `--replace`:

```sh
git fetch origin
git diff HEAD..origin/main -- README.md skills.json docs
# With a clean checkout and the inspected upstream:
git pull --ff-only
python3 scripts/validate.py
python3 scripts/install.py --preset starter --target shared --dry-run
python3 scripts/install.py --preset starter --target shared --replace
```

New sessions discover changed skills; already-running agents may retain their
loaded instructions. Reload through the harness's supported mechanism. Installing
a skill is not evidence that its CLI, account, service or runtime is operational.

## Agent instructions

Read [the project starter](../examples/AGENTS.md), adapt it to the real repository,
and merge the useful parts into its existing AGENTS.md. For a project that wants
both harness files, keep its CLAUDE.md synchronized with that adopted policy or,
if its conventions allow, use [a CLAUDE.md import bridge](../examples/CLAUDE.md).
The [integration guide](INTEGRATION.md#shared-policy-and-private-machine-notes)
explains explicit local-note loading, ignored files and per-machine configuration.
Do not overwrite existing instructions, copy personal machine settings, or adopt
standing approvals from another project. The root AGENTS.md/CLAUDE.md in this
repository govern maintenance of this collection, not consumer projects.

## Freshness

The 2026-11-11 audit compared public main `7e9b01c` against installed Linux sources.
It checked all 35 published skills, found 12 changed SKILL.md files plus supporting
resources, and added 12 owner-maintained helpers. Source-root differences were
inspected explicitly; choices and input SHA-256 hashes are recorded in
[source-snapshot.json](source-snapshot.json). AppleDouble resource forks and runtime
caches are excluded. The public browser example uses a host-resolved path instead
of a personal absolute plugin path. This audit establishes parity with the owner's
selected installed sources, not latest-release certification for every upstream
skill or a successful end-to-end fleet/UVP run.

The full [installed inventory](INSTALLED-INVENTORY.md) lists the remaining optional
Linux skills and the Google Workspace helpers found only on the Mac.
