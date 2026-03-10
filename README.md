# maxer-skills

Reusable agent skills for plan decomposition, iterative plan review, and documentation harmonization.

Included skills:

- `planmaxer`
- `layermaxxer`
- `harmonymaxer`

## Repository Layout

```text
planmaxer/
  SKILL.md
  references/
layermaxxer/
  SKILL.md
  references/
harmonymaxer/
  SKILL.md
  references/
```

## Install In Codex

If you already have Codex and its built-in skill installer available:

```bash
python ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo niksteel123/maxer-skills \
  --path planmaxer \
  --path layermaxxer \
  --path harmonymaxer
```

Restart Codex after installation.

## Install In Claude Code Or Other Agent-Skills Setups

Clone the repo and symlink the skills into your local skills directory:

```bash
git clone https://github.com/niksteel123/maxer-skills.git

ln -s /path/to/maxer-skills/planmaxer ~/.claude/skills/planmaxer
ln -s /path/to/maxer-skills/layermaxxer ~/.claude/skills/layermaxxer
ln -s /path/to/maxer-skills/harmonymaxer ~/.claude/skills/harmonymaxer
```

## Notes

- `harmonymaxer` is the correct skill name and directory spelling.
- Each skill is self-contained in `SKILL.md` plus bundled `references/`.
