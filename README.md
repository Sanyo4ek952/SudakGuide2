# SudakGuide2 MVP

MVP сервиса бронирования жилья в Судаке на **Next.js 16 (App Router)**, **TypeScript strict**, **Prisma + Postgres**, **NextAuth v5 beta**, **Vitest** и **Playwright**.

## Стек и версии

- Node: `>=20` (рекомендуется LTS 24)
- packageManager: `pnpm@10.30.3`
- Next.js: `16.1.6`
- React / ReactDOM: `^19.0.0`
- Prisma: `7.4.2`
- Auth: `next-auth@beta` (v5 beta)
- Vitest: `4.0.18`
- Playwright: `^1.58.0`

## Быстрый старт

1. Установить зависимости:

```bash
pnpm install
```

2. Поднять Postgres в Docker:

```bash
pnpm db:up
```

3. Создать `.env` из примера:

```bash
cp .env.example .env
```

4. Применить миграции:

```bash
pnpm db:migrate
```

5. Заполнить базу seed-данными:

```bash
pnpm db:seed
```

6. Запустить dev сервер:

```bash
pnpm dev
```

## Переменные окружения

См. `.env.example`.

Ключевые:

- `DATABASE_URL` — строка подключения к Postgres
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET` — для next-auth
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` — seed супер-админа
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — OAuth Google
- `TELEGRAM_BOT_TOKEN` — токен бота для уведомлений host

## Google OAuth (NextAuth)

1. Создайте OAuth приложение в Google Cloud Console.
2. Добавьте redirect URI вида:
   - `http://localhost:3000/api/auth/callback/google`
3. Заполните в `.env`:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

## Telegram chatId для host

### Вариант A (через БД вручную)

Выполните SQL в Postgres:

```sql
UPDATE "User"
SET "telegramChatId" = '<chat_id>'
WHERE email = 'host@example.com';
```

### Вариант B (через seed env)

Укажите `HOST_TELEGRAM_CHAT_ID` в `.env` перед `pnpm db:seed`.

## Скрипты

### Основные

- `pnpm dev`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:e2e`
- `pnpm build`
- `pnpm check` = lint + typecheck + test

### DB

- `pnpm db:up`
- `pnpm db:down`
- `pnpm db:migrate`
- `pnpm db:seed`
- `pnpm db:studio`

## CI (PR gates)

GitHub Actions на pull request выполняет:

1. `pnpm install --frozen-lockfile`
2. `pnpm check`
3. `pnpm build`

Файл workflow: `.github/workflows/ci.yml`.

## FSD структура

```text
/src
  /app
  /processes
  /widgets
  /features
  /entities
  /shared
    /ui
    /api
    /config
    /lib
    /types
    /styles
    /test
```

Для каждого слоя (кроме `app`) используется public API через `index.ts`.


## Назначение HOST и chatId через UI

В MVP это доступно на странице админки `/admin/users` для авторизованного ADMIN, где можно:

- менять роль пользователя (USER/HOST/ADMIN);
- задавать `telegramChatId` для HOST.


## Expire pending bookings (cron)

Endpoint: `POST /api/cron/expire-bookings`

Headers:

- `Authorization: Bearer <CRON_SECRET>`

This endpoint marks stale `PENDING` booking requests as `EXPIRED`.


## Авторизация и доступ по ролям

Для host/admin/user разделов используется проверка текущей сессии NextAuth и роли пользователя (без query-параметров `hostId/adminId/userId`).
