# ScreenCloud interview take home assignement

## Requirement

1. `.env` (please refer to .env.example)
2. ormconfig.json (I already attached in this case)

```JSON
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "",
  "password": "",
  "database": "screencloud-dev",
  "entities": ["src/**/**.entity{.ts,.js}"],
  "synchronize": true,
  "migrations": ["migrations/*.ts"]
}
```

## Installation

```sh
yarn install
```

### Database

**Step 1**: Initialize Postgres database

```sh
docker-compose -f docker-compose-db.dev.yaml up --build
```

**Step 2**: Create Postgres database

> Create new database name `screencloud-dev`

**Step 3**: Run migration

```sh
yarn pg:migration:run
```

**Step 4**: Init mock data

```sh
yarn pg:init:data
```

## Run

### Locally

```sh
yarn start:dev
```

### Docker

```sh
docker-compose -f docker-compose.dev.yaml up --build
```
