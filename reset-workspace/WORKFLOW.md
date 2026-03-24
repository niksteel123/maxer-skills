# Reset Workspace Workflow

A complete step-by-step procedure for resetting workspace state.

---

## Overview

This workflow performs a clean reset of:
1. Beads (`.beads/` directory)
2. AgentMail (messages, agents, file reservations)
3. Plan-hub outputs (optional)

**Design Principle:** Start fresh without lingering state from previous implementations.

---

## Step 0: Verify Current State (Pre-Reset)

Before resetting, document what exists:

```bash
# Check beads count
bd list --json | jq length

# Check active agents
uv run python -m mcp_agent_mail.cli agents list "/absolute/path/to/project" -s active --json

# Check for uncommitted changes
git status
```

**Decision Point:** If there's work to preserve:
- Commit any code changes first
- Export beads if needed: `bd list --json > beads-backup.json`

---

## Step 1: Reset Beads

### 1.1 Wipe Beads Directory

```bash
# Option A: Full wipe and reinitialize
rm -rf .beads/
bd init

# Option B: Selective deletion (if you want to keep some beads)
# List beads first
bd list --json | jq -r '.[].id'

# Delete specific beads
bd delete {BEAD_ID}
```

### 1.2 Verify Beads Reset

```bash
# Should return empty list or just the initialized state
bd list --json
# Expected: []
```

---

## Step 2: Reset AgentMail

### 2.1 Understand the Cleanup Order

AgentMail has foreign key relationships. Clean in this order:
1. message_recipients (references messages)
2. messages (references project, agents)
3. file_reservations (references project, agents)
4. agents (references project)

### 2.2 Find the Correct Database (CRITICAL)

The MCP server may run from a different location than `apps/mail/`. Find it first:

```bash
# Find where the MCP server is running (port 8765)
lsof -i :8765 2>&1 | grep python

# Get the server's working directory and database
lsof -p $(lsof -i :8765 -t) 2>&1 | grep -E "cwd|sqlite"

# Example output:
# cwd: /Users/steel/mcp_agent_mail
# database: /Users/steel/mcp_agent_mail/storage.sqlite3
```

**The CLI must use the SAME database as the running server.**

### 2.3 SQL Cleanup (Recommended)

Direct SQL is more reliable than CLI when versions may differ:

```bash
# Replace DB_PATH with the actual database path from step 2.2
DB_PATH="/Users/steel/mcp_agent_mail/storage.sqlite3"

# Get project ID first
sqlite3 "$DB_PATH" "SELECT id, slug FROM projects WHERE human_key = '/absolute/path/to/project';"

# Use the project_id (e.g., 5) in the cleanup commands below
```

```sql
-- IMPORTANT: Drop FTS triggers first (they cause issues with DELETE)
DROP TRIGGER IF EXISTS fts_messages_ad;
DROP TRIGGER IF EXISTS fts_messages_ai;
DROP TRIGGER IF EXISTS fts_messages_au;

-- Delete in order (replace 5 with your project_id)
DELETE FROM message_recipients
WHERE message_id IN (SELECT id FROM messages WHERE project_id = 5);

DELETE FROM messages WHERE project_id = 5;

DELETE FROM file_reservations WHERE project_id = 5;

DELETE FROM agents WHERE project_id = 5;

-- Verify cleanup
SELECT 'Messages:', count(*) FROM messages WHERE project_id = 5;
SELECT 'Agents:', count(*) FROM agents WHERE project_id = 5;
SELECT 'File Reservations:', count(*) FROM file_reservations WHERE project_id = 5;
```

### 2.4 CLI-Based Cleanup (Alternative)

If CLI schema matches the running server:

```bash
# Run from the SAME directory as the MCP server
cd /path/to/mcp_agent_mail_server_dir

# Prune agents with full cleanup
uv run python -m mcp_agent_mail.cli agents prune "/absolute/path/to/project" \
  --days 0 \
  --cleanup \
  --apply \
  --yes
```

**Note:** If you get schema errors (e.g., "no such column: agents.status"), use SQL cleanup instead.

### 2.5 Clean Git Archive (Optional)

AgentMail stores agent profiles in a git archive:

```bash
# Location
ARCHIVE_PATH="$HOME/.mcp_agent_mail_git_mailbox_repo"
PROJECT_SLUG="your-project-slug"  # lowercase version of project name

# List agent folders
ls "$ARCHIVE_PATH/projects/$PROJECT_SLUG/agents/"

# Remove agent folders
rm -rf "$ARCHIVE_PATH/projects/$PROJECT_SLUG/agents/"*

# Clean messages archive
rm -rf "$ARCHIVE_PATH/projects/$PROJECT_SLUG/messages/"*
```

### 2.6 Verify AgentMail Reset

```bash
# Via SQL (most reliable)
sqlite3 "$DB_PATH" << 'EOF'
SELECT 'Agents:', count(*) FROM agents WHERE project_id = 5;
SELECT 'Messages:', count(*) FROM messages WHERE project_id = 5;
SELECT 'File Reservations:', count(*) FROM file_reservations WHERE project_id = 5;
EOF
# Expected: all 0

# Via MCP Resource (if using MCP tools)
# Query: resource://agents/{project-slug}
# Expected: {"agents": []}
```

---

## Step 3: Reset Plan-Hub Outputs (Optional)

### 3.1 Clear Kickoff Prompts

```bash
# List existing prompts
ls docs/plan-hub/prompts/*.md

# Remove old prompts (keep directory)
rm -f docs/plan-hub/prompts/*-kickoff.md
```

### 3.2 Reset Status File

Create fresh `docs/plan-hub/status/active-plan.yaml`:

```yaml
# Active Project Configuration
# Updated after workspace reset

spec_path: docs/spec.md
arch_path: docs/ARCH-DATA.md  # optional
project_root: /absolute/path/to/project
loaded_at: {YYYY-MM-DDTHH:MM:SSZ}
feature_name: "{New Feature Name}"

# Ready for fresh beads and execution
```

---

## Step 4: Clean Swarm Core DB (Optional)

If using swarm-core for agent orchestration:

```bash
# Via CLI if available
swarm-core workspace cleanup "/absolute/path/to/project" --yes

# Or direct SQL
# DELETE FROM agents WHERE workspace_id = ?
# DELETE FROM beads WHERE workspace_id = ?
# DELETE FROM threads WHERE workspace_id = ?
# DELETE FROM events WHERE workspace_id = ?
```

---

## Verification

After completing all steps:

```bash
# Beads: Should be empty
bd list --json | jq length
# Expected: 0

# AgentMail: Use SQL on the correct database (see step 2.2)
sqlite3 "$DB_PATH" "SELECT count(*) FROM agents WHERE project_id = 5;"
# Expected: 0

# Mail server: Should be healthy
curl -s http://127.0.0.1:8765/health/liveness
# Expected: {"status":"alive"}

# Git status: Should be clean (or only show reset-related changes)
git status
```

---

## Reset Levels Quick Reference

### Minimal Reset (Beads Only)

```bash
rm -rf .beads/
bd init
```

### Standard Reset (Beads + Mail)

```bash
# Beads
rm -rf .beads/
bd init

# Mail - find DB first (see step 2.2), then SQL cleanup
DB_PATH="/path/to/mcp_agent_mail/storage.sqlite3"  # adjust based on lsof output
PROJECT_ID=5  # adjust based on SELECT id FROM projects WHERE human_key = '...'

sqlite3 "$DB_PATH" << EOF
DROP TRIGGER IF EXISTS fts_messages_ad;
DROP TRIGGER IF EXISTS fts_messages_ai;
DROP TRIGGER IF EXISTS fts_messages_au;
DELETE FROM message_recipients WHERE message_id IN (SELECT id FROM messages WHERE project_id = $PROJECT_ID);
DELETE FROM messages WHERE project_id = $PROJECT_ID;
DELETE FROM file_reservations WHERE project_id = $PROJECT_ID;
DELETE FROM agents WHERE project_id = $PROJECT_ID;
EOF
```

### Full Reset (Everything)

```bash
# Beads
rm -rf .beads/
bd init

# Mail - SQL cleanup (same as Standard Reset above)

# Git archive cleanup
rm -rf "$HOME/.mcp_agent_mail_git_mailbox_repo/projects/{slug}/agents/"*
rm -rf "$HOME/.mcp_agent_mail_git_mailbox_repo/projects/{slug}/messages/"*

# Plan-hub
rm -f docs/plan-hub/prompts/*-kickoff.md
# Update status/active-plan.yaml manually
```

---

## Troubleshooting

### "bd: command not found"

```bash
# Ensure beads CLI is installed
which bd
# Or use full path from your installation
```

### "Mail server not running"

```bash
# See AGENTS.md section 16 for current dev server location
# As of now, the dev server is at:
cd /Users/steel/mcp_agent_mail
uv run python -m mcp_agent_mail.http --host 127.0.0.1 --port 8765
```

### "Permission denied on .beads/"

```bash
# Check ownership
ls -la .beads/
# Fix if needed
chmod -R u+rw .beads/
```

### "Foreign key constraint failed"

Clean in the correct order: message_recipients → messages → file_reservations → agents

### "Project not found"

```bash
# Verify project exists via SQL
sqlite3 "$DB_PATH" "SELECT id, slug FROM projects;"
```

### "no such column: agents.status" (CLI schema mismatch)

The CLI version doesn't match the running server's database schema. Use SQL cleanup instead:

```bash
# Find the correct database (step 2.2)
lsof -p $(lsof -i :8765 -t) 2>&1 | grep sqlite

# Use SQL cleanup (step 2.3) instead of CLI
```

### "unsafe use of virtual table fts_messages"

FTS triggers prevent direct deletion. Drop them first:

```sql
DROP TRIGGER IF EXISTS fts_messages_ad;
DROP TRIGGER IF EXISTS fts_messages_ai;
DROP TRIGGER IF EXISTS fts_messages_au;
-- Then delete messages
DELETE FROM messages WHERE project_id = ?;
```

### "CLI uses wrong database"

The CLI runs from `apps/mail/` but the MCP server may use a different database location:

```bash
# Check where MCP server's database is
lsof -p $(lsof -i :8765 -t) 2>&1 | grep sqlite

# Either:
# 1. Use SQL directly on that database, OR
# 2. Run CLI from the server's working directory
```
