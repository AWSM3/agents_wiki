# 6.5. Advanced guardrails: DLP, sandbox, allowlist‑tools, MCP hardening, аудит

- **Owner**: Security / Platform (TBD)
- **Статус**: Draft
- **Last reviewed**: 2026-01-15
- **Уровень**: Advanced
- **Для ролей**: TL / Arch / SRE / Security

## Зачем эта страница

Собрать “жёсткие” меры, которые делают агентный процесс безопасным в enterprise‑контуре.

## DLP и редакция

- регулярки/правила на ключи/серты/JWT/private keys
- автоматическая очистка логов/пейлоадов
- запрещающие политики на D2/D3

## Secret scanning

- pre‑commit хук + скан на PR/MR
- запрет мержа при находках
- ротация скомпрометированных секретов как процесс

## Sandbox execution

- запуск агента в контейнере/изолированном runner’е
- секреты выдаются минимально и только по необходимости
- сеть по allowlist (или без сети, если возможно)

## MCP hardening

- allowlist MCP‑серверов
- per‑tool scopes (least privilege)
- tool approval (особенно write‑actions)
- аудит вызовов tools (кто/когда/что)

## Политика “что можно в SaaS, что только локально”

- D0/D1: допускается SaaS при compliance‑настройках
- D2: только on‑prem/локально
- D3: запрещено, кроме исключений

## Связанные страницы

- [7.2 Агент в CI: agent‑runner pattern](../07_Enterprise_Integration/07_02_Agent_in_CI_Agent_Runner.md)
- [2.3 RAG/MCP](../02_Foundations/02_03_RAG_Internal_Knowledge.md)

