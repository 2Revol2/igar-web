# Igar-web

Для разработки нужен docker.

Запускать разработку:

```bash
rm -rf .next
docker compose down -v
docker compose build --no-cache
docker compose up
```

## CSS

К сожалению, чтобы применить свои цвета, нам нужно сгенерировать свой CSS файл. Для того, чтобы запустить парсер нужно установить куку.

Запустите в консоли браузера:
```javascript
document.cookie = "ab-market=1; path=/; max-age=31536000";
```

Важно! Кука сотрётся после успешного применения.