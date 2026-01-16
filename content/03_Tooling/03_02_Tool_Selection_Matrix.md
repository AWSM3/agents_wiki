# 3.2. Матрица выбора инструмента под задачу

- **Owner**: DevEx (TBD)
- **Статус**: Draft
- **Last reviewed**: 2026-01-15
- **Уровень**: Basic
- **Для ролей**: Dev / TL / QA / SRE / Analyst

## Зачем эта страница

Чтобы выбирать инструмент не “по вкусу”, а по признакам задачи: среда, автономность, приватность, интеграции.

## Оси выбора

- **Где работает**: IDE / CLI / CI / Chat
- **Степень автономности**: A0–A4 (см. [10.4.A](../10_Appendix/Liners_and_Rubrics/10_04_Autonomy_Levels_A0_A4.md))
- **Приватность/ретеншн**: D0–D3 (см. [10.4.D](../10_Appendix/Liners_and_Rubrics/10_04_Data_Sensitivity_D0_D3.md))
- **Интеграции**: MCP, плагины, web access

## Практические рекомендации (быстрый выбор)

- **Быстрые правки в IDE (A1–A2)** → Cursor / Copilot agent mode / Roo.
- **Сложные многошаговые тех‑задачи (A2–A3)** → Claude Code / OpenCode / Codex‑style CLI.
- **Spec‑first “в прод”** → инструменты/процессы с явной поддержкой SDD (и ваш workflow 4.x).
- **Open‑source IDE‑агент + MCP** → Roo Code / Kilo Code (при наличии hardening).
- **D2/D3 контекст** → локальный контур (см. [8.1](../08_Local_Models/08_01_When_Local.md)).

## Анти‑паттерн выбора

Если задача high‑risk (S2/S3) — не выбирайте “самый автономный” инструмент. Выбирайте **самый контролируемый** (PR‑agent или A2 с жёсткими guardrails).

## Связанные страницы

- [3.3 Tool Cards](03_03_Tool_Cards_INDEX.md)
- [6) Security](../06_Security_Compliance/06_00_INDEX.md)

