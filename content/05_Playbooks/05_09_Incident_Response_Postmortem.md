# 5.9. Playbook: incident response / postmortem

- **Owner**: SRE / TL (TBD)
- **Статус**: Draft
- **Last reviewed**: 2026-01-15
- **Уровень**: Advanced
- **Для ролей**: SRE / TL

## Когда применять

- инцидент или почти‑инцидент
- нужен таймлайн/гипотезы/экшены

## Safety

- запрещено вставлять секреты/внутренние схемы/уязвимости в SaaS‑чат
- для D2/D3 — только локальный/изолированный контур

## Output

- postmortem doc + action items + owners

## Template prompt

> На основе обезличенных фактов сформируй: таймлайн, гипотезы, root cause, действия, preventive measures.  
> Не проси и не включай секреты/внутренние схемы.

