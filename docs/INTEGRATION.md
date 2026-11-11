# Integrate skills into an existing project

Adopt the useful helpers without replacing the project's current operating model.
The [new-project guide](NEW-PROJECT.md) gives the recommended core install
(five bundled skills plus the external ceremony/honesty helper).
This guide covers an existing repository and the boundary between team policy
and one developer's machine setup. It is guidance, not an automatic migration:
the installer writes only selected skill directories.

## 1. Inspect the current project

Read its AGENTS.md/CLAUDE.md, relevant directory rules, local instruction files,
current plan, active issue/PR and real build/test commands. Determine which facts
already have an authoritative home. Check which harnesses and skill roots the
team actually uses and whether a compatible skill is already installed.

Continue from current work. Preserve issue IDs, acceptance, ownership, pauses,
valid evidence, required review and any scoped standing approvals. A new skill
is not a reason to initialize Beads/UVP, open duplicate issues, add a model
registry or replace the existing tracker.

## 2. Preview the smallest installation

Run the starter command for your harness from the Maxer Skills checkout; see
[the exact commands](NEW-PROJECT.md#install-for-the-harness-you-use).
Review differing destinations before `--replace`; replacement preserves backups.
Keep custom changes until reviewed. Install extra adapters only for operations
that consume them. No external CLI, plugin, service or account is provisioned.

## 3. Make a small shared policy change

Merge the following block into the project's existing AGENTS.md rather than
replacing that file. Keep existing conventions and approval rules intact:

```markdown
## Workflow helpers

Use git-contractmaxxer for feature delivery or takeover from the current work.
Use product-board for related product outcomes in our existing tracker.
Use fleet-controller before useful, authorized delegation; use the available
approved models/adapters, without introducing a registry unless we adopt one.
Use intent-to-handoff when another session or person needs continuity.
Use disk-janitor for disk-pressure work and ownership-aware cleanup; installing it
is not deletion permission. Use just-say-no-to-process-porn-and-ceremony for relevant
ceremony/evidence checks when available from its authorized upstream. If unavailable,
report that limitation and continue independent work without claiming it ran.
Load other skills only for the work that consumes them. Missing optional helpers
block only that operation. Skills do not override our project policy, required
proof or current user authorization.

## Local operating context

After reading the shared rules, read AGENTS.local.md in this directory if it
exists. Treat it as private operational context for this checkout, not a change
to team requirements. It may identify local tool paths, service setup or execution
hosts; it does not grant approvals or waive shared checks. Apply actual scoped
user authorizations from their source rather than inferring them from a template.
```

That last paragraph is an explicit agent instruction to open a local file; it is
not a claim of automatic discovery or an access-control mechanism.

If the project requires identical AGENTS.md and CLAUDE.md, apply the shared edit
to both and keep that rule. Otherwise, a single-policy layout is useful:

```text
AGENTS.md           shared product/workflow policy
CLAUDE.md           imports AGENTS.md; contains only any real Claude-specific rules
AGENTS.local.md     private machine/checkout notes, loaded by the shared paragraph
CLAUDE.local.md     optional private Claude-specific notes
```

The repository's own AGENTS.md/CLAUDE.md in Maxer Skills remain identical; the
single-policy layout above is an option for consumer projects, not a change to
this repository's maintenance policy.

## Shared policy and private machine notes

| Location | Appropriate contents | Version control |
| --- | --- | --- |
| Project AGENTS.md / CLAUDE.md | Product boundaries, canonical docs, portable commands, conventions, proof/review and team permissions | Shared and reviewed |
| Nested project instructions | Rules that apply to everyone working on that directory | Shared and reviewed |
| AGENTS.local.md | This checkout's paths, local service setup, hardware limits and pointers to a private runbook | Ignored; explicitly read through the shared instruction above |
| CLAUDE.local.md | Private Claude-specific operating notes | Ignored; use the harness behavior below |
| User-level harness instructions | Personal defaults that really apply across your projects | Outside the repository |
| Local harness settings | Personal MCP connections, hooks and model/account configuration | Use the harness's local/user settings scope |

Keep actual credentials in the intended secret store or environment. Private
instruction files can contain non-secret setup facts, but are not secret stores.
Examples in this collection contain placeholders, not your real machine values.
A machine-specific path or command belongs locally; a portable project command
that every developer needs belongs in shared policy. A new required team tool
needs a project decision, not one person's local preference becoming policy.

### Codex: local file behavior

Codex loads a maximum of one instruction file per directory: a non-empty
AGENTS.override.md takes priority over AGENTS.md. Global defaults live under
CODEX_HOME (normally ~/.codex). AGENTS.local.md is not a standard auto-loaded
filename, and adding it as a fallback does not append it beside an existing
AGENTS.md. Use the explicit shared read rule above for an additive local note.
Do not assume Claude's `@` imports are a Codex import mechanism.
[Official Codex discovery rules](https://learn.chatgpt.com/docs/agent-configuration/agents-md).

If a checkout already uses AGENTS.override.md, review it before adding anything:
it can hide the shared file at that directory. Preserve the shared rules through
an explicit read instruction or the project's existing reviewed mechanism. Do not
create an override containing only local notes and assume both files will load.

### Claude Code: local file behavior

CLAUDE.local.md loads alongside CLAUDE.md. For a predictable shared-policy bridge,
put `@AGENTS.md` in CLAUDE.md, preserving existing Claude-specific rules below it.
This also avoids the current default where a CLAUDE.local.md can suppress direct
AGENTS.md discovery. AGENTS.local.md and AGENTS.override.md are not auto-read by
Claude; the shared instruction above covers the former. Confirm memory sources
with `/context all` or `/memory`; behavior can vary with version/settings.
[Official Claude Code memory rules](https://code.claude.com/docs/en/memory).

Use [examples/CLAUDE.md](../examples/CLAUDE.md) for the import bridge. If an existing
project chooses Claude's native combined instruction-file mode instead, use its
supported configuration and verify the effective sources rather than changing
an organization-wide setting merely for this guide.

## 4. Keep local files local

For personal exclusions, locate this checkout's Git exclude file:

```sh
git rev-parse --git-path info/exclude
```

Add only missing patterns there. A team can instead agree on the same patterns
in .gitignore so everyone gets the convention:

```gitignore
/AGENTS.local.md
/CLAUDE.local.md
/AGENTS.override.md
/.claude/settings.local.json
```

Only ignore AGENTS.override.md if it is genuinely private in this repository;
some projects intentionally track shared overrides. For a personal project-scoped
skill install, also exclude its selected .agents/skills or .claude/skills directory
unless the team already tracks that directory. Use the host's supported local
configuration scope for machine-specific settings; the [Claude settings guide](https://code.claude.com/docs/en/settings)
describes its user/project/local split. Do not commit private endpoints, account
inventories, plugin activation or another developer's credential setup.

Inspect existing tracking before assuming an ignore rule is enough:

```sh
git ls-files -- AGENTS.local.md CLAUDE.local.md AGENTS.override.md .claude/settings.local.json
git check-ignore -v AGENTS.local.md CLAUDE.local.md
```

If a private file is already tracked, ignoring it does not untrack it. Handle the
tracked change deliberately under project policy; do not blindly remove a shared
file. Review the actual staged diff before publishing. Each worktree/clone needs
its intended local context; verify presence rather than assuming ignored notes
are present in a new checkout.

Copy and adapt [the common local example](../examples/AGENTS.local.md.example)
and, only if needed, [the Claude local example](../examples/CLAUDE.local.md.example).
Neither example is active merely because it is present in this collection.

## 5. Verify a representative read-only session

Start or refresh a session in the target project and ask:

```text
Without editing files, installing tools, launching agents or changing services:
list the instruction sources you loaded, distinguish shared policy from local
machine notes, name the canonical current work, and explain which skill you would
use for the next real task. Identify any missing optional adapter honestly.
```

Check that shared product/permission rules remain present, the intended local
facts are recognized, unrelated skills are not loaded, and no stage-chain or
permission change was introduced. Then run the project's real checks for any
actual code changes. This is a suggested consumer smoke check, not a claimed
run against your project. Successful file installation alone does not prove
instruction discovery, tool availability or correct behavior in an active session.
