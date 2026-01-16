# 7.2. Агент в CI (безопасно): “agent‑runner” pipeline pattern

- **Owner**: Platform / SRE / Security (TBD)
- **Статус**: Draft
- **Last reviewed**: 2026-01-15
- **Уровень**: Advanced
- **Для ролей**: SRE / Security / Arch

## Зачем эта страница

Если агент работает в CI, он должен быть максимально изолирован и приносить **артефакты для ревью**, а не делать “интеграционные действия” сам.

## Режим “CI‑агент” (паттерн)

- изолированный runner
- ограниченные секреты (least privilege)
- сеть по allowlist (если нужна)
- агент генерит **patch + отчёт**, не пушит в main

## Артефакты пайплайна (рекомендация)

- `agent_report.md` (что сделал, что не смог, какие предположения)
- `diff.patch` (патч)
- результаты тестов/линтов/сборки

## Политика безопасности

- агент **не** делает push/merge/deploy
- изменения в security/db/auth/CI — только через MR и code owners
- аудит доступа к секретам и интеграциям

## Связанные страницы

- [6.5 Advanced guardrails](../06_Security_Compliance/06_05_Advanced_Guardrails.md)
- [10.4.A Уровни автономности](../10_Appendix/Liners_and_Rubrics/10_04_Autonomy_Levels_A0_A4.md)

