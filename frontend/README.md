# Фронтенд

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

По умолчанию фронтенд использует API:

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

## Деплой на Vercel

Проект можно деплоить на Vercel из корня репозитория. Корневой `vercel.json` собирает только эту папку и публикует `frontend/dist`.

В Vercel задайте переменную окружения:

```text
VITE_API_URL=https://адрес-бэкенда
```

Бэкенд должен быть опубликован отдельно и доступен по HTTPS.

## Архитектура

Код организован по FSD:

- `app` - провайдеры, макет, роутинг;
- `pages` - страницы маршрутов;
- `widgets` - крупные блоки сценариев;
- `features` - действия пользователя;
- `entities` - бизнес-сущности, API, типы;
- `shared` - общие UI, конфиг и инфраструктура.

Правила импортов между слоями проверяются ESLint.

## Состояние и API

- Формы реализуются через React Hook Form.
- Серверное состояние, мутации и кеш ведёт TanStack Query.
- Отдельное клиентское состояние используется локально в компонентах.
- Для сохранения формы проверки между маршрутами используется Zustand.

## Тесты

Unit/UI-тесты:

```bash
npm run test
```

Покрытие:

```bash
npm run test:coverage
```

E2E-тесты:

```bash
npm run test:e2e
```

Playwright поднимает dev-сервер Vite автоматически.

## Storybook

```bash
npm run storybook
```

Сборка:

```bash
npm run build-storybook
```

Истории описывают текущие UI-компоненты, их свойства и ключевые состояния.
