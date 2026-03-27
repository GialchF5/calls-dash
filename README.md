# calls-dashboard

Проект состоит из двух независимых статических дашбордов и главного меню.

Для AI-агента: см. `AI_CONTEXT.md`.

## Структура


| Путь               | Назначение                                    |
| ------------------ | --------------------------------------------- |
| `index.html`       | Главное меню (входная точка для GitHub Pages) |
| `sravnenie-calls/` | Старый дашборд: сравнение февр-мар 2026       |
| `qual-dashboard/`  | Новый дашборд: Квал лиды дек25-мар26          |


## Изоляция разделов

- `sravnenie-calls` и `qual-dashboard` не зависят друг от друга.
- Их связывает только ссылка через главное меню `index.html`.

## Обновление данных нового дашборда

1. Экспортируйте таблицу Google Sheets в CSV.
2. Замените файл `qual-dashboard/data/qual-leads-dec25-mar26.csv`.
3. Проверьте `qual-dashboard/index.html`, `qual-dashboard/sources.html`, `qual-dashboard/roles.html`.

## Публикация на GitHub Pages

- В настройках репозитория: `Settings -> Pages`.
- Source: ветка `main`, папка `/ (root)`.
- Точка входа после публикации: `index.html`.

