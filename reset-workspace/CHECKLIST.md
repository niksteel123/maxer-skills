# Reset Workspace Checklist

A quick verification checklist for workspace reset operations.

---

## Pre-Reset Checks

- [ ] **Uncommitted code saved**: `git status` shows clean or changes committed
- [ ] **Beads backed up (if needed)**: `bd list --json > beads-backup.json`
- [ ] **Confirmed project path**: Absolute path verified before destructive operations
- [ ] **Mail server accessible**: `curl http://127.0.0.1:8765/health/liveness`

**Verification:**
```bash
# Git status
git status

# Current beads
bd list --json | jq length

# Find correct database first
lsof -p $(lsof -i :8765 -t) 2>&1 | grep -E "cwd|sqlite"

# Current agents (via SQL)
DB_PATH="/path/from/lsof/storage.sqlite3"
sqlite3 "$DB_PATH" "SELECT count(*) FROM agents WHERE project_id = 5;"
```

---

## Reset Execution

### Beads Reset

- [ ] `.beads/` directory removed
- [ ] `bd init` executed
- [ ] `bd list --json` returns empty `[]`

**Commands:**
```bash
rm -rf .beads/
bd init
bd list --json | jq length  # Should be 0
```

### AgentMail Reset

- [ ] **Database located**: Found correct database path via `lsof`
- [ ] **Agents deleted**: All project agents removed
- [ ] **Messages deleted**: All project messages removed
- [ ] **File reservations cleared**: All reservations released
- [ ] **Git archive cleaned (optional)**: Agent/message folders removed

**Commands (SQL - most reliable):**
```bash
DB_PATH="/path/from/lsof/storage.sqlite3"
PROJECT_ID=5  # Get from: sqlite3 "$DB_PATH" "SELECT id FROM projects WHERE human_key = '/your/path';"

sqlite3 "$DB_PATH" << EOF
DROP TRIGGER IF EXISTS fts_messages_ad;
DROP TRIGGER IF EXISTS fts_messages_ai;
DROP TRIGGER IF EXISTS fts_messages_au;
DELETE FROM message_recipients WHERE message_id IN (SELECT id FROM messages WHERE project_id = $PROJECT_ID);
DELETE FROM messages WHERE project_id = $PROJECT_ID;
DELETE FROM file_reservations WHERE project_id = $PROJECT_ID;
DELETE FROM agents WHERE project_id = $PROJECT_ID;
EOF

# Verify empty
sqlite3 "$DB_PATH" "SELECT count(*) FROM agents WHERE project_id = $PROJECT_ID;"
# Should return: 0
```

### Plan-Hub Reset (Optional)

- [ ] **Kickoff prompts removed**: `docs/plan-hub/prompts/*-kickoff.md` deleted
- [ ] **Status file updated**: `active-plan.yaml` reset to new format

**Commands:**
```bash
rm -f docs/plan-hub/prompts/*-kickoff.md
ls docs/plan-hub/prompts/  # Should be empty
```

---

## Post-Reset Verification

| Check | Command | Expected |
|-------|---------|----------|
| Beads empty | `bd list --json \| jq length` | `0` |
| No active agents | `sqlite3 "$DB_PATH" "SELECT count(*) FROM agents WHERE project_id = $PROJECT_ID;"` | `0` |
| Mail server healthy | `curl -s http://127.0.0.1:8765/health/liveness` | `{"status":"alive"}` |
| Git clean (optional) | `git status` | Clean or expected changes |

---

## Quick Reset Commands

### Standard Reset (Copy-Paste Ready)

```bash
# 1. Find database first
lsof -p $(lsof -i :8765 -t) 2>&1 | grep sqlite
# Note the path, e.g., /Users/steel/mcp_agent_mail/storage.sqlite3

# 2. Set variables
DB_PATH="/path/from/lsof/storage.sqlite3"
PROJECT_ID=5  # Get from: sqlite3 "$DB_PATH" "SELECT id, human_key FROM projects;"

# 3. Reset beads
rm -rf .beads/ && bd init

# 4. Reset mail (SQL)
sqlite3 "$DB_PATH" << EOF
DROP TRIGGER IF EXISTS fts_messages_ad;
DROP TRIGGER IF EXISTS fts_messages_ai;
DROP TRIGGER IF EXISTS fts_messages_au;
DELETE FROM message_recipients WHERE message_id IN (SELECT id FROM messages WHERE project_id = $PROJECT_ID);
DELETE FROM messages WHERE project_id = $PROJECT_ID;
DELETE FROM file_reservations WHERE project_id = $PROJECT_ID;
DELETE FROM agents WHERE project_id = $PROJECT_ID;
EOF

# 5. Verify
echo "=== Beads ===" && bd list --json | jq length
echo "=== Agents ===" && sqlite3 "$DB_PATH" "SELECT count(*) FROM agents WHERE project_id = $PROJECT_ID;"
```

### Full Reset (Including Plan-Hub)

```bash
# Same as Standard Reset, plus:

# Reset plan-hub prompts
rm -f docs/plan-hub/prompts/*-kickoff.md

# Verify
echo "=== Prompts ===" && ls docs/plan-hub/prompts/
```

---

## Troubleshooting

### Reset Incomplete

If verification fails:

1. **Beads still showing**: Check `.beads/` wasn't recreated by another process
2. **Agents still showing**: Use SQL cleanup directly (see WORKFLOW.md step 2.3)
3. **Messages remaining**: Drop FTS triggers first, then delete (see WORKFLOW.md)

### CLI Errors

If you get errors like "no such column: agents.status", the CLI schema doesn't match the database. Use SQL cleanup instead - it's more reliable.

### Recovery

If you need to undo a reset:

```bash
# Restore beads from backup
cat beads-backup.json | jq -c '.[]' | while read bead; do
  # Re-create beads from backup (manual process)
  echo "$bead"
done

# Agents and messages cannot be recovered after deletion
# This is why pre-reset checks are important
```

---

## Next Steps After Reset

1. **Create new beads**: Use `beads-from-sources` skill or `bd create`
2. **Prepare for execution**: Use `beads-to-execution` skill
3. **Launch agents**: Start fresh agent sessions with kickoff prompts
