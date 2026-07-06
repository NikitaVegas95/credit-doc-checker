# AI-агент проверки льготных кредитов

Монорепозиторий тестового задания: React-фронтенд и FastAPI мок API для проверки пакета документов по льготному кредиту.

## Быстрый запуск

```bash
docker compose up --build
```

После запуска:

- фронтенд: http://localhost:5173
- API бэкенда: http://localhost:8000
- документация Swagger: http://localhost:8000/docs

История проверок хранится в памяти контейнера бэкенда и очищается после перезапуска.

## Переменные окружения

Фронтенд читает настройки API из переменных окружения Vite:

```text
VITE_API_URL=
VITE_API_PROXY_TARGET=http://localhost:8000
```

По умолчанию локальный фронтенд обращается к относительному `/api`, а dev-сервер Vite проксирует запросы на `VITE_API_PROXY_TARGET`.

- Для локальной разработки используйте `frontend/.env.example` как шаблон `frontend/.env`.
- Для продакшен-сборки используйте `frontend/.env.production.example` как шаблон абсолютного `VITE_API_URL`.
- В Docker Compose фронтенд проксирует `/api` на сервис бэкенда `http://backend:8000`; отдельный `.env` для быстрого запуска не требуется.

## Основной сценарий

1. Пользователь выбирает программу: федеральная или областная.
2. Загружает документы.
3. Запускает проверку.
4. Видит результат: можно заявлять, нельзя заявлять или требуется ручная проверка.
5. Может скачать JSON-отчёт, открыть историю, посмотреть детали и удалить проверку.

## Тестовые файлы

Бэкенд определяет тип документа по имени файла.

Готовый набор файлов для положительного кейса лежит в `test-files/positive-approve`.
Загрузите все файлы из этой папки, чтобы получить статус `approve`.

Положительный результат:

```text
договор.pdf
спецификация.pdf
счет.pdf
акт.pdf
```

Отказ:

```text
договор.pdf
счет.pdf
```

Ручная проверка:

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

Фронтенд:

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

Бэкенд локально:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Деплой на Vercel

Фронтенд подготовлен для деплоя на Vercel из корня репозитория через `vercel.json`.
Vercel устанавливает зависимости в `frontend`, запускает `npm run build` и публикует `frontend/dist`.

Бэкенд в этот деплой не входит. FastAPI API нужно разместить отдельно, например на Render, Railway или Fly.io, а его публичный адрес передать фронтенду:

```text
VITE_API_URL=https://адрес-бэкенда
```

В настройках проекта Vercel добавьте переменную окружения `VITE_API_URL` для Production. После изменения переменной окружения нужно запустить новый деплой.

## Проверки перед коммитом

Husky запускает `scripts/pre-commit.sh`.

Проверки:

- ESLint для фронтенда;
- Stylelint для CSS;
- модульные и UI-тесты Vitest;
- e2e-тесты Playwright;
- продакшен-сборка фронтенда.

## Архитектура фронтенда

Фронтенд организован по FSD:

- `app` - инициализация, провайдеры, роутинг, макет;
- `pages` - страницы маршрутов;
- `widgets` - крупные сценарные блоки;
- `features` - пользовательские действия;
- `entities` - бизнес-сущности, типы, API;
- `shared` - общие UI, конфиг, инфраструктура.

Границы FSD-слоёв проверяются в `frontend/eslint.config.js`.

Принятые решения:

- React Hook Form для форм;
- TanStack Query для API, мутаций и кеша;
- обработчики ошибок на уровне маршрутов для разделения API-ошибок и UI-ошибок;
- Storybook для UI-документации;
- Vitest + Testing Library для модульных и UI-тестов;
- Playwright для e2e.

## API

Основные эндпоинты:

- `POST /api/checks` - загрузка файлов и запуск фоновой проверки;
- `GET /api/checks` - история проверок;
- `GET /api/checks/{check_id}` - детали проверки;
- `DELETE /api/checks/{check_id}` - удаление проверки;
- `GET /health` - проверка состояния сервиса.

## Структура

```text
.
├── backend/            # FastAPI мок API
├── frontend/           # React + Vite фронтенд
├── scripts/            # локальные рабочие скрипты
├── docker-compose.yml  # общий запуск фронтенда и бэкенда
└── README.md
```
