# AdminPanel

Веб-панель для просмотра и управления клиентами и заказами. Проект состоит из React-клиента, REST API на Node.js/Express с TypeScript и базы данных PostgreSQL.

Клиент позволяет просматривать список клиентов и заказов, добавлять, изменять и удалять клиентов. Сервер предоставляет API для работы с клиентами и заказами и хранит данные в PostgreSQL.

## Требования

- Node.js и npm
- PostgreSQL и утилита командной строки `psql`

## Структура проекта

- `client/` — React-приложение
- `server/` — Express API на TypeScript
- `init-db.sql` — создание базы `dashboard`, таблиц и начальных данных
- `run.bat` — запуск SQL-скрипта в Windows от имени пользователя PostgreSQL `postgres`

## Установка и настройка

Откройте терминал в корневой папке проекта и установите зависимости клиента и сервера:

```powershell
cd server
npm install
cd ../client
npm install
cd ..
```

Создайте файлы окружения из шаблонов:

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

Для локального запуска согласуйте настройки сервера и клиента. В `server/.env` укажите порт API `2000` и адрес клиента `http://localhost:3000`:

```dotenv
PORT=2000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=dashboard
DB_USER=postgres
DB_PASSWORD=ваш_пароль_postgres

CLIENT_ORIGIN=http://localhost:3000
```

В `client/.env` укажите адрес API:

```dotenv
REACT_APP_BASE_API=http://localhost:2000
```

Замените `ваш_пароль_postgres` на пароль своего пользователя PostgreSQL. Если вы используете другие учётные данные или порт PostgreSQL, укажите их в `server/.env`.

## Создание базы данных

Убедитесь, что сервер PostgreSQL запущен. Из корневой папки проекта выполните:

```powershell
psql -U postgres -f init-db.sql
```

Если `psql` не находится в `PATH`, запустите `psql.exe` с полным путём, например из каталога установки PostgreSQL. Скрипт может запросить пароль пользователя `postgres`.

В Windows также можно запустить `run.bat` из корневой папки проекта. Скрипт выполняет ту же команду и рассчитан на пользователя `postgres`.

> **Внимание:** `init-db.sql` сначала удаляет существующую базу `dashboard`, затем создаёт её заново и загружает начальные данные. Повторный запуск удалит данные, уже сохранённые в этой базе.

## Запуск сервера

Откройте отдельный терминал:

```powershell
cd server
npm run dev
```

Сервер проверит подключение к базе данных и запустит API на `http://localhost:2000`. Если соединение с PostgreSQL не настроено, проверьте параметры `server/.env` и убедитесь, что база `dashboard` создана.

## Запуск клиента

Откройте ещё один терминал:

```powershell
cd client
npm start
```

React-приложение откроется на `http://localhost:3000`. Если браузер не открылся автоматически, перейдите по этому адресу вручную. Для работы панели оставьте запущенными и сервер, и клиент.

## Сборка

Сборка сервера:

```powershell
cd server
npm run build
```

После сборки сервер можно запустить командой `npm start` из папки `server`.

Сборка клиента:

```powershell
cd client
npm run build
```
