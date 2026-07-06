# AI-агент проверки льготных кредитов

Монорепозиторий тестового задания: React frontend и FastAPI mock API для проверки пакета документов по льготному кредиту.

## Быстрый запуск

```bash
docker compose up --build
```

После запуска:

- frontend: http://localhost:5173
- backend API: http://localhost:8000
- Swagger: http://localhost:8000/docs

История проверок хранится в памяти backend-контейнера и очищается после перезапуска.

## Environment

Frontend читает настройки API из Vite env-переменных:

```text
VITE_API_URL=
VITE_API_PROXY_TARGET=http://localhost:8000
```

По умолчанию локальный frontend ходит в относительный `/api`, а Vite dev-server проксирует запросы на `VITE_API_PROXY_TARGET`.

- Для локальной разработки используйте `frontend/.env.example` как шаблон `frontend/.env`.
- Для production используйте `frontend/.env.production.example` как шаблон абсолютного `VITE_API_URL`.
- В Docker Compose frontend проксирует `/api` на backend service `http://backend:8000`; отдельный `.env` для быстрого запуска не требуется.

## Основной сценарий

1. Пользователь выбирает программу: федеральная или областная.
2. Загружает документы.
3. Запускает проверку.
4. Видит результат: можно заявлять, нельзя заявлять или требуется ручная проверка.
5. Может скачать JSON-отчёт, открыть историю, посмотреть детали и удалить проверку.

## Тестовые файлы

Backend определяет тип документа по имени файла.

Approve:

```text
договор.pdf
спецификация.pdf
счет.pdf
акт.pdf
```

Reject:

```text
договор.pdf
счет.pdf
```

Manual:

```text
договор.pdf
спецификация.pdf
счет.pdf
акт.pdf
scan0041.jpg
```

## Команды

Корневые команды:

```bash
npm run precommit
npm run stylelint
```

Frontend:

```bash
cd frontend
npm run dev
npm run lint
npm run test
npm run test:e2e
npm run test:coverage
npm run build
npm run storybook
npm run build-storybook
```

Backend локально:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Pre-commit

Husky запускает `scripts/pre-commit.sh`.

Проверки:

- frontend ESLint;
- Stylelint для CSS;
- Vitest unit/UI tests;
- Playwright e2e tests;
- frontend production build.

## Архитектура frontend

Frontend организован по FSD:

- `app` - инициализация, провайдеры, роутинг, layout;
- `pages` - страницы маршрутов;
- `widgets` - крупные сценарные блоки;
- `features` - пользовательские действия;
- `entities` - бизнес-сущности, типы, API;
- `shared` - общие UI, конфиг, инфраструктура.

Границы FSD-слоёв проверяются в `frontend/eslint.config.js`.

Принятые решения:

- React Hook Form для форм;
- TanStack Query для API, mutations и cache;
- route-level error boundaries для разделения API-ошибок и UI-ошибок;
- Storybook для UI-документации;
- Vitest + Testing Library для unit/UI тестов;
- Playwright для e2e.

## API

Основные endpoint:

- `POST /api/checks` - загрузка файлов и запуск проверки;
- `GET /api/checks` - история проверок;
- `GET /api/checks/{check_id}` - детали проверки;
- `DELETE /api/checks/{check_id}` - удаление проверки;
- `GET /health` - healthcheck.

## Структура

```text
.
├── backend/            # FastAPI mock API
├── frontend/           # React + Vite frontend
├── scripts/            # локальные workflow-скрипты
├── docker-compose.yml  # общий запуск frontend + backend
└── README.md
```
