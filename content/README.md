# Wiki: «ИИ coding‑агенты» — методический раздел для разработчиков

- **Owner**: TBD (Engineering Enablement / DevEx)
- **Статус**: Draft
- **Last reviewed**: 2026-01-15
- **Уровень**: Basic → Advanced
- **Для ролей**: Dev / TL / Arch / QA / SRE / Analyst

## Зачем этот раздел

Этот раздел — практическая методичка по безопасному и повторяемому применению AI‑инструментов (IDE‑агенты и terminal‑агенты вроде Cursor, Claude Code, а также Roo Code / Kilo Code / OpenCode / Codex и др.) в инженерном цикле: **Spec → Plan → Implement → Verify → PR/MR**.

Главная идея: **агент ускоряет работу**, но **источником истины остаются артефакты (Spec/AC/ADR/тесты) и проверки (tests/build/static)**, а риск управляется **ограничениями, уровнями автономности и политикой данных**.

## Как читать (рекомендуемый порядок)

1. [0) Принципы раздела и как читать](00_Principles/00_00_INDEX.md)
2. [1) START HERE — Введение и быстрый старт](01_Start_Here/01_00_INDEX.md)
3. [4) Standard Workflow — единый процесс “Spec → Plan → Implement → Verify → PR”](04_Standard_Workflow/04_00_INDEX.md)
4. [6) Security & Compliance — безопасное использование](06_Security_Compliance/06_00_INDEX.md)
5. Далее — [Tooling](03_Tooling/03_00_INDEX.md) и [Playbooks](05_Playbooks/05_00_INDEX.md) под ваши сценарии

## Быстрые ссылки (MVP)

- **Политика “что можно/нельзя отправлять в LLM” (коротко)**: [1.3](01_Start_Here/01_03_Data_Policy_Short.md)
- **Быстрый старт на 30 минут**: [1.4](01_Start_Here/01_04_Quick_Start_30min.md)
- **Единый workflow**: [4.1](04_Standard_Workflow/04_01_Spec_Plan_Implement_Verify_PR.md)
- **DoD для AI‑изменений**: [4.2](04_Standard_Workflow/04_02_Definition_of_Done_AI.md)
- **Safe prompting & redaction**: [6.4](06_Security_Compliance/06_04_Safe_Prompting_Redaction.md)
- **Локальные модели: когда и как**: [8.1](08_Local_Models/08_01_When_Local.md)

## Содержание (дерево разделов)

- [00_Principles](00_Principles/00_00_INDEX.md)
- [01_Start_Here](01_Start_Here/01_00_INDEX.md)
- [02_Foundations](02_Foundations/02_00_INDEX.md)
- [03_Tooling](03_Tooling/03_00_INDEX.md)
- [04_Standard_Workflow](04_Standard_Workflow/04_00_INDEX.md)
- [05_Playbooks](05_Playbooks/05_00_INDEX.md)
- [06_Security_Compliance](06_Security_Compliance/06_00_INDEX.md)
- [07_Enterprise_Integration](07_Enterprise_Integration/07_00_INDEX.md)
- [08_Local_Models](08_Local_Models/08_00_INDEX.md)
- [09_Governance_Adoption](09_Governance_Adoption/09_00_INDEX.md)
- [10_Appendix](10_Appendix/10_00_INDEX.md)

