# Project Brief: Vue 3 + Tailwind 4 + Vite Web App

## Цель
Создать минимально работоспособное веб-приложение на Vue 3 с поддержкой маршрутизации, стилизацией Tailwind CSS v4 и сборкой через Vite. Приложение должно загружать и отображать контент на основе Markdown файлов, запакованных в JavaScript бандлы.

## Нецели
- Сложное state management (Pinia)
- Тестирование (unit/e2e)
- Backend разработка
- Сборка Docker контейнера
- Настройка Nginx (внешний компонент)

## Ключевые требования
1. **Маршрутизация**: Vue Router v4 для SPA
2. **Данные**: Markdown файлы из директории `content/`, распарсенные и запакованные в сборку (не загружаемые на клиенте отдельными запросами)
3. **Стилизация**: Tailwind CSS v4
4. **Язык**: TypeScript
5. **Сборка**: `npm run dev` для локальной разработки, `npm run build` для production статики (готовой к развёртыванию на статическом хосте вроде Nginx)

## Constraints
- Только dev-режим + production build (no SSR, no API сервер)
- Vue Reactive API достаточно, state management не требуется
- Без тестов

## Success Metrics (Acceptance Criteria)
- [ ] `npm install` без ошибок
- [ ] `npm run dev` запускает локальный dev сервер на `http://localhost:5173`
- [ ] Приложение отображает список постов из Markdown файлов
- [ ] Переходы по роутам работают без перезагрузки страницы (SPA)
- [ ] `npm run build` создаёт папку `dist/` с готовой статикой
- [ ] `dist/index.html` + JS бандлы можно развернуть на статический хост (Nginx и т.п.)
- [ ] Нет линт ошибок (`npm run lint`)

## Definition of Done
```bash
npm install                    # установка зависимостей
npm run dev                    # dev сервер запускается
npm run lint                   # линтер проходит чисто
npm run build                  # сборка production статики успешна
dist/index.html                # файл существует и содержит правильный HTML
```

