# 7.3. MCP‑серверы для внутренних систем (Confluence/GitLab/логи/метрики)

- **Last reviewed**: 2026-01-15
- **Уровень**: Advanced

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

- [3.5 MCP: применение и безопасность](../Инструменты/MCP.md)
- [6.2 Threat model](../Безопасность_Соответствие/Модель_Угроз.md)

