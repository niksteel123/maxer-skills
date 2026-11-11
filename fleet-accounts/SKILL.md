---
name: fleet-accounts
description: Manage Claude Code and Codex subscription accounts on the Mac and Linux fleet using CAAM. Use for account enrollment, switching, authentication status, or moving existing agent sessions between accounts.
---

# Fleet accounts

Use CAAM for account inventory and isolated execution; use the NTM skill when
controlling existing panes. Resolve machine routing and the private fleet runbook
from local configuration inside the dedicated machine-operations lane. Keep
addresses, account names and access material out of shared skills and registries.

## Discover and select

- Read `caam --version`, `caam list --json`, and `caam status <provider> --json` on the target host. Read command help for the installed version before mutation.
- Account names describe identities, not credentials. Verify actual email/account ID from provider status; domain aliases can name the same account. A request to switch one provider does not switch the other.
- Never equate a saved profile or CAAM health estimate with successful inference. Check CLI auth status and a small real response after enrollment/switching. Report usage limits separately from authentication failure.
- Current source fixes may postdate the latest release. The fleet uses a pinned build with macOS Keychain support; do not downgrade through `caam update` without verifying that the replacement includes those fixes.

## Enroll and preserve

- `caam backup claude <email> --json` and `caam backup codex <email> --json` register the already-authenticated local account. Back up an existing profile before replacing it. Verify that the backup contains the actual credential, not merely account metadata or settings. On Mac, Claude's Keychain is authoritative; CAAM may maintain an owner-only credential mirror.
- Each machine/account must obtain an independent OAuth grant. Keep Claude/Codex sync policy `host-local`; never replicate their credential payloads between Mac and Linux or resurrect historical refresh-token backups as live profiles.
- Missing accounts need provider login. In this pinned build, `caam login` is for isolated profiles and explicitly does not support Claude. For Claude use `caam profile add claude <name>`, then `caam exec claude <name>` and `/login`; the native `claude auth login` SSH flow is also available when explicitly launched in the intended profile environment. Codex supports `caam login codex <name> --device-code`. Do not confuse these with enrolling the machine default into the vault using `caam backup`. Existing authorization carries forward; prompt only for genuinely missing user interaction such as a provider challenge.
- Store secrets only in owner-only credential stores. Do not print tokens, passwords, cookies, or credential file contents. Keep profile backups outside skill directories.

## Switch or launch

- Vault profiles (`backup`/`activate`) and isolated profiles (`profile add`/`exec`) are distinct stores. A vault backup does not authenticate an isolated profile.
- For a machine-default switch, inspect outgoing work first and use `caam activate <provider> <email> --backup-current --json` after confirming the target has usable credentials. Keep refreshed outgoing credentials through CAAM's snapshot mechanism.
- For parallel accounts, prefer separately authenticated isolated profiles and `caam exec <provider> <profile> -- <CLI args>`. Verify that Git/SSH, global and project skills, MCPs, and session history are available in that environment before assigning real work. Do not assume directory isolation alone proves macOS Keychain or Codex backend isolation.
- Existing processes can retain the previous account. Preserve conversation IDs and inspect live status. For Claude, verify hot reload; for Codex, verify the serving backend as well as the frontend. CAAM's `--reload-daemon` sends SIGTERM and is not a conversation-preserving migration by itself. Only restart the scoped stale backend when the affected work is safely checkpointed and restart is within the request.
- Enable bounded eligible-account selection/rotation by default, with configurable
  disable, maximum attempts and cooldowns. Discover current inventory/status;
  apply qualification and explicit project-data/model permissions before trying
  another account. Distinguish usage exhaustion, authentication failure and
  missing model access. Rotation before launch is not permission to replay a
  dispatched task: preserve conversation IDs and healthy children, record a
  blocked/unknown-outcome checkpoint, and resume explicitly only when the prior
  result and replay safety are known. Background refresh remains separately
  controlled. Do not globally alias `claude` or `codex` to `caam run`.
- Preserve backups: `safety.max_auto_backups=0`; disable `analytics.cleanup_on_startup`. Avoid `clear`, cleanup, prune, and profile deletion without the user's deletion authorization.

## Acceptance

At dispatch preparation and existing fleet reconciliation, inspect the effective
pool: enrolled profiles, enabled models/harnesses, qualification expiry and changed
parity inputs. A registry row alone does not enable a launch. Repair stale authorized
configuration or qualifications before silently collapsing to the parent's provider.
Reuse unchanged, still-valid component evidence; recheck changed parity and expired
identity/model-response evidence with a bounded non-mutating prompt. Update the
qualification only after its actual checks pass; never extend an expiry or flip a
failed field as a substitute. Run one real fleet launch to qualify a repaired route.
Record the next refresh condition in the existing private qualification/checkpoint,
not a new background rotation daemon. Authentication, exhausted usage, missing model
access and incomplete enrollment require different remedies; bound attempts and
report no eligible account honestly without replaying work.

For existing-auth enrollment, inspect installed `caam auth detect` / `auth import`
help. Import success is not consumer proof: confirm `caam exec <provider> <profile>
-- <auth-status command>` in the actual isolated environment, then a real response.
Older 0.1.18-fleet builds may store Claude's imported grant under the profile's
`.claude/` while exec sets `CLAUDE_CONFIG_DIR` to its XDG config directory. If that
exact mismatch is observed, repair the path within that same isolated profile
(preserving existing files and restrictive permissions) and recheck through exec.
Never link another host's or the live default's grant as the repair, print payloads,
or assume a successful import means the running agent adopted the identity. Prefer
a fixed CAAM build when qualified; do not blindly update the pinned installation.
Older detection can also reject modern Codex auth with nested token fields. If the
provider's own auth status works, inspect the installed import help and use its
explicit host-local source option rather than assuming a new login is necessary.
Then prove auth and inference through exec. Prefer the corrected detector/importer;
these fallbacks are conditional repairs, not permission to fabricate qualification.

For production isolated execution, consume a current qualification record rather
than inferring readiness from vault health or `profile.json`. Verify skills, MCP,
Git, SSH, configuration, session history, actual identity and a small authorized
real response. Each check needs its observation and retained evidence/hash; bind
the record to the observed identity, expiry and relevant parity-file hashes, with
explicit allowed projects and models. Missing, expired or changed qualifications
fail closed. Do not invent passing checks or infer project-data permission from
the existence of an authenticated account. `uvp-fleet` consumes this policy at
placement and dispatch; `caam exec <provider> <isolated-profile> -- <CLI args>`
passes provider CLI arguments, not another executable, and retains default locking.

Verify the selected identity, a fresh response, and adoption by any session claimed to have switched. Report whether Claude Remote Control requires reattachment. Update both fleet runbook copies with non-secret identities, backup paths, and measured outcomes; compare their SHA-256 hashes. Do not claim other accounts or isolated environments are ready until they have been independently enrolled and tested.
