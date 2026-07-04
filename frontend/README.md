# Frontend

React + TypeScript + Vite приложение для проверки пакета документов по льготному кредиту.

## Стек

- React 19;
- React Router;
- React Hook Form;
- TanStack Query;
- CSS Modules;
- Storybook;
- Vitest + Testing Library;
- Playwright.

## Запуск

```bash
npm install
npm run dev
```

По умолчанию frontend использует API:

```text
http://localhost:8000
```

Переопределить можно через `VITE_API_URL`.

## Команды

```bash
npm run lint
npm run test
npm run test:watch
npm run test:coverage
npm run test:e2e
npm run test:all
npm run build
npm run preview
npm run storybook
npm run build-storybook
```

## Архитектура

Код организован по FSD:

- `app` - провайдеры, layout, роутинг;
- `pages` - страницы маршрутов;
- `widgets` - крупные блоки сценариев;
- `features` - действия пользователя;
- `entities` - бизнес-сущности, API, типы;
- `shared` - общие UI, конфиг и инфраструктура.

Правила импортов между слоями проверяются ESLint.

## Состояние и API

- Формы реализуются через React Hook Form.
- Серверное состояние, mutations и cache ведёт TanStack Query.
- Отдельный клиентский state используется только локально в компонентах.
- Отдельный глобальный state manager сейчас не нужен.

## Тесты

Unit/UI:

```bash
npm run test
```

Coverage:

```bash
npm run test:coverage
```

E2E:

```bash
npm run test:e2e
```

Playwright поднимает Vite dev server автоматически.

## Storybook

```bash
npm run storybook
```

Сборка:

```bash
npm run build-storybook
```

Stories описывают текущие UI-компоненты, их props и ключевые состояния.
