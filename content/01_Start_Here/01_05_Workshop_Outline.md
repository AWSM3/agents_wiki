# 1.5. План воркшопа/лекции: “Используем LLM и Агентов правильно”

- **Owner**: DevEx / Speaker (TBD)
- **Статус**: Draft
- **Last reviewed**: 2026-01-15
- **Уровень**: Basic
- **Для ролей**: Dev / TL / QA / Analyst

## Зачем эта страница

Связать теорию и практику в последовательный маршрут: что показать, что отработать руками и куда углубляться.

## Блок 1: Агенты (в особенности coding‑агенты)

### Что показать

- агент как явление: чем отличается от “чата”
- общее между реализациями (Cursor, Claude Code и аналоги):
  - чат‑интерфейс
  - контекст vs токены сессии, “контекст‑диета”
  - tool‑use и ограничения (auto‑approve vs approve)
  - режимы (chat/plan/agent) и зачем они
  - Document‑Driven подход (markdown‑артефакты, правила, команды)
  - индексация/поиск по кодовой базе

### Демо (рекомендуемый сценарий)

1. [1.4 Быстрый старт](01_04_Quick_Start_30min.md) на “безопасной” задаче
2. [4.1 Workflow](../04_Standard_Workflow/04_01_Spec_Plan_Implement_Verify_PR.md) вживую: Spec → Plan → Patch → Verify → PR
3. Разбор рисков и guardrails ([6.4](../06_Security_Compliance/06_04_Safe_Prompting_Redaction.md), [10.4.A](../10_Appendix/Liners_and_Rubrics/10_04_Autonomy_Levels_A0_A4.md))

## Блок 2: Специализированные агенты (чат‑боты, deep research)

### Позиционирование

- чат‑боты сильны в исследованиях/брейншторме/grounding на источниках
- coding‑агенты сильны в **имплементации и итеративной проверке** (tests/build)

### Практика

- “исследование → черновик Spec/ADR → передача в coding‑agent”
- обязательная обратная связь на этапах (human‑in‑the‑loop)

## Блок 3: Психология коммуникации с моделью и агентом

- промптинг (структуры, elicitation): [2.6](../02_Foundations/02_06_Prompting_Elicitation_RE.md)
- контекст: [4.4](../04_Standard_Workflow/04_04_Context_Management.md)
- tool‑use и физические ограничения агента: [2.2](../02_Foundations/02_02_Tool_Use_Function_Calling.md)
- human‑in‑the‑loop и DoD: [4.2](../04_Standard_Workflow/04_02_Definition_of_Done_AI.md)

## Блок 4: Провайдеры инференса и шлюзы (1st/3rd‑party)

- что такое gateway и зачем: [3.7](../03_Tooling/03_07_Inference_Providers_Gateways.md)
- когда локально: [8.1](../08_Local_Models/08_01_When_Local.md)

