# calls-dashboard

Единый статический дашборд воронки (февраль–март): переключение источника **Каталог** / **ВК**, те же графики и схема данных. Работает в браузере (Chart.js с CDN), без сборки.

## Страницы

| Файл | Описание |
|------|----------|
| `index.html` | Месячное сравнение: KPI и графики, итоги считаются из сумм по дням в JSON |
| `days.html` | Метрики по дням, два графика (март/фев и разница) |
| `weeks.html` | Полосы по числу месяца (1–8, 9–15, …), сравнение марта и февраля в каждой полосе |
| `urman-vr-mar.html` | Урман Билд vs Важное решение за март (отдельные итоговые числа в скрипте для каждого источника) |

Навигация между страницами — ссылки в шапке. Выбранный источник сохраняется в `localStorage` (ключ `callsDashboardSource`, значения `catalog` | `vk`).

## Структура папки

```
calls-dashboard/
  index.html, days.html, weeks.html, urman-vr-mar.html
  .nojekyll          # отключает Jekyll на GitHub Pages
  css/common.css     # переключатель источника и навигация
  js/
    source-store.js   # чтение/запись источника в localStorage
    data-loader.js    # загрузка данных
    month-aggregate.js # агрегация фев/мар для index.html
  data/
    catalog.json      # срез «Каталог» (копия формата daily-data)
    vk.json           # срез «ВК»
    bundled.js        # window.__CALLS_DASHBOARD_DATA = { catalog, vk } для file://
```

## Формат данных

Файлы `catalog.json` и `vk.json` — тот же формат, что `daily-data.json` в основном проекте: поле `days`, объект `projects` с проектами **Сеосейлс**, **Kineiro**, **Урман Билд**, для каждого — блоки `feb` и `mar` с массивами `leads`, `calls`, `presentations`, `qualified` по индексам из `days`.

Загрузка: при открытии по **http(s)** запрашиваются `./data/catalog.json` или `./data/vk.json`. При протоколе **file://** используется `bundled.js` (оба набора в одном файле).

## Обновление данных из основного репозитория

Если `calls-dashboard` лежит рядом с каталогами `Catalog/` и `VK/` в корне монорепозитория, выполните из корня репозитория:

```bash
python scripts/sync_calls_dashboard_data.py
```

Скрипт перезапишет `calls-dashboard/data/catalog.json`, `vk.json` и `bundled.js` из `Catalog/daily-data.json` и `VK/daily-data.json`.

Если работаете **только с папкой calls-dashboard** (без скрипта), вручную замените `data/catalog.json` и `data/vk.json` и пересоберите `bundled.js`: объект `window.__CALLS_DASHBOARD_DATA = { "catalog": {...}, "vk": {...} }` в одну строку или с помощью любого генератора JSON→JS.

## Локальный просмотр

- **Простой способ:** локальный сервер в каталоге `calls-dashboard`, чтобы работал `fetch` к JSON, например:  
  `npx serve .` или `python -m http.server 8080`  
  затем открыть `http://localhost:8080/`.

- **Без сервера:** открыть `index.html` через проводник — сработает `bundled.js`, если файл подключён в HTML (как сейчас).

## GitHub Pages

- В настройках репозитория: **Settings → Pages**, источник — ветка **`main`**, папка **`/ (root)`**.
- Адрес проекта: `https://<user>.github.io/<repo>/` (например главная: `/index.html`).
- Файл **`.nojekyll`** в корне нужен, чтобы GitHub не прогонял сайт через Jekyll и не ломал отдачу статики.

После пуша подождите 1–3 минуты и обновите страницу.

## Зависимости

- Внешние: [Chart.js](https://www.chartjs.org/) и плагин datalabels (подключаются с jsDelivr в HTML).
- Данные и логика — только файлы в этой папке; для автосинхронизации JSON из `Catalog`/`VK` нужен родительский репозиторий и скрипт `sync_calls_dashboard_data.py`.
