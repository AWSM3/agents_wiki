# 7.1. GitLab‑ориентированный AI‑workflow (MR/Issues/Code Owners)

- **Owner**: Platform / DevEx (TBD)
- **Статус**: Draft
- **Last reviewed**: 2026-01-15
- **Уровень**: Advanced
- **Для ролей**: TL / Arch / SRE

## Зачем эта страница

В enterprise‑контуре важны аудит и предсказуемость: где фиксируем Spec/Plan, как оформляем MR, как защищаем зоны риска.

## Где хранить Spec/Plan

Рекомендуемый вариант:

- **Issue**: Spec/AC/ограничения/ссылки на контекст
- **MR description**: Plan + “как проверить” + риски + чек‑лист
- **ADR repo (/docs)**: архитектурные решения и долговечные правила

## CODEOWNERS и зоны повышенного риска

Обязательно выделить зоны, которые требуют ревью владельца:

- auth/crypto
- database migrations
- CI/CD
- security‑sensitive конфиги

## Стандартизированные шаблоны MR

Рекомендуется шаблон MR, который агент заполняет:

- что сделано (по Spec)
- как проверено (команды)
- риски/rollback
- отметка “AI‑assisted”

## Связанные страницы

- [4.1 Workflow](../04_Standard_Workflow/04_01_Spec_Plan_Implement_Verify_PR.md)
- [4.2 DoD](../04_Standard_Workflow/04_02_Definition_of_Done_AI.md)

