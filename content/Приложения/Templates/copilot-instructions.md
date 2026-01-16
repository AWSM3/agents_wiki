# copilot-instructions.md (template)

## Goals

- help with small, safe changes
- keep diffs minimal
- prefer tests over “assumptions”

## Guardrails

- do not introduce new dependencies without explicit request
- do not modify auth/crypto/CI/db migrations without explicit request
- do not output secrets or request them

## Output format preference

When proposing changes:

1. plan (steps + files)
2. patch/diff
3. verification commands
4. risks/rollback

