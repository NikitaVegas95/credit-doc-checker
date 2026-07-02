# AI-агент проверки льготных кредитов

Монорепозиторий тестового задания: React-фронтенд и mock API поднимаются одной командой через Docker Compose.

## Запуск

```bash
docker compose up --build
```

После запуска:

- frontend: http://localhost:5173
- backend API: http://localhost:8000
- Swagger: http://localhost:8000/docs

## Frontend tooling

```bash
cd frontend
npm run storybook
```

Storybook будет доступен на http://localhost:6006.

## Структура

```text
.
├── backend/            # FastAPI mock API
├── frontend/           # React + Vite
├── docker-compose.yml  # общий запуск двух контейнеров
└── README.md
```

Frontend организован по FSD:

- `app` - инициализация и верхнеуровневая композиция;
- `pages` - страницы сценариев;
- `widgets` - крупные блоки интерфейса;
- `features` - пользовательские действия;
- `entities` - бизнес-сущности и их API;
- `shared` - общие UI, конфиг, инфраструктура.

Границы FSD-слоёв проверяются в `frontend/eslint.config.js`.

## Backend

Основные эндпоинты:

- `POST /api/checks` - загрузка файлов и запуск проверки;
- `GET /api/checks` - история проверок;
- `GET /api/checks/{check_id}` - детали проверки;
- `DELETE /api/checks/{check_id}` - удаление проверки;
- `GET /health` - healthcheck.

История хранится в памяти backend-контейнера и очищается после перезапуска.
