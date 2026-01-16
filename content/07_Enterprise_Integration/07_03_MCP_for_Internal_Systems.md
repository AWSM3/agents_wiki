# 7.3. MCP‑серверы для внутренних систем (Confluence/GitLab/логи/метрики)

- **Owner**: Platform / Security (TBD)
- **Статус**: Draft
- **Last reviewed**: 2026-01-15
- **Уровень**: Advanced
- **Для ролей**: SRE / Security / Arch

## Зачем эта страница

Подключение внутренних систем к агентам повышает пользу, но увеличивает attack surface. Нужны правила и hardening.

## Примеры MCP‑сервисов (идея)

- Confluence read‑only
- GitLab API read‑only
- Logs/traces read‑only
- Артефакты CI read‑only

## Security requirements (чек‑лист)

- allowlist MCP‑серверов
- per‑tool scopes (least privilege)
- audit trail (кто/когда/что)
- rate limits
- redaction/DLP на входе

## Связанные страницы

- [3.5 MCP: применение и безопасность](../03_Tooling/03_05_MCP.md)
- [6.2 Threat model](../06_Security_Compliance/06_02_Threat_Model.md)

