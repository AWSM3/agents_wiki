# 5.6. Playbook: документация / ADR / Mermaid

- **Owner**: Analyst / TL (TBD)
- **Статус**: Draft
- **Last reviewed**: 2026-01-15
- **Уровень**: Basic
- **Для ролей**: Dev / TL / Analyst

## Когда применять

- нужно оформить ADR по итогам изменения
- нужно быстро сделать диаграмму/описание процесса

## Input

- план изменений (Plan)
- ключевые решения и альтернативы
- ограничения безопасности (что нельзя раскрывать)

## Output

- ADR (черновик) или обновление документации
- диаграмма Mermaid (sequence/flow и т.п.)

## Safety

- не включать доменные модели/схемы/секреты
- если нужны детали D2/D3 — делаем в локальном контуре

## Template prompt

> На основе плана изменения сформируй ADR (context/decision/alternatives/consequences).  
> Добавь Mermaid‑диаграмму процесса. Не раскрывай доменные модели/секреты.

## Связанные страницы

- [10.5 Mermaid cheatsheet](../10_Appendix/10_05_Mermaid_Cheat_Sheet.md)
- [10.3 Templates](../10_Appendix/10_03_Templates_Index.md)

