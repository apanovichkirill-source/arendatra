# Переезд на российский VPS

Схема: один сервер, на нём три контейнера — сайт (Next.js), база (Postgres) и Caddy (HTTPS-сертификаты выпускает сам).

## 1. Аренда сервера

Timeweb Cloud, Selectel, Beget, Reg.ru, VDSina — любой. Параметры: **Ubuntu 24.04, 2 CPU, 4 ГБ RAM, диск от 40 ГБ NVMe, дата-центр Москва или Санкт-Петербург** (~500–900 ₽/мес). После оплаты вам дадут **IP-адрес** и пароль root.

## 2. Подготовка сервера

```bash
ssh root@IP_СЕРВЕРА

fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

curl -fsSL https://get.docker.com | sh

ufw allow 22 && ufw allow 80 && ufw allow 443 && ufw allow 443/udp && ufw --force enable
```

Если Docker не скачивает образы (Docker Hub нестабилен в РФ), включите зеркало и перезапустите Docker:

```bash
echo '{"registry-mirrors":["https://mirror.gcr.io"]}' > /etc/docker/daemon.json
systemctl restart docker
```

## 3. Код и настройки

```bash
git clone https://github.com/apanovichkirill-source/arendatra.git /opt/arendatra
cd /opt/arendatra

cat > .env <<EOT
POSTGRES_PASSWORD=$(openssl rand -hex 24)
AUTH_SECRET=$(openssl rand -hex 32)
EOT
```

(Если репозиторий приватный — создайте на сервере ключ `ssh-keygen -t ed25519`, добавьте `~/.ssh/id_ed25519.pub` в GitHub → репозиторий → Settings → Deploy keys и клонируйте по адресу `git@github.com:apanovichkirill-source/arendatra.git`.)

## 4. Запуск базы и перенос данных

```bash
docker compose up -d db
```

Перенос из Neon. Возьмите строку подключения Neon, **уберите `-pooler` из адреса хоста** (для дампа нужно прямое подключение):

```bash
NEON_URL='postgresql://...прямой адрес...'
docker run --rm postgres:17-alpine pg_dump --data-only --no-owner --disable-triggers "$NEON_URL" \
  | docker compose exec -T db psql -U arendatra -d arendatra -v ON_ERROR_STOP=1
```

Проверка — должны быть ваши записи:

```bash
docker compose exec db psql -U arendatra -d arendatra -c 'select count(*) from "Vehicle"'
```

Делайте перенос прямо перед переключением DNS (шаг 5): заявки, оставленные на старом сайте после переноса, в новую базу не попадут.

## 5. DNS

За сутки до переезда поставьте TTL записей 300 сек. Затем у регистратора доменов для **обоих** доменов (аренда-транспорта.рф и арендатранспорта.рф) замените A-запись `@` на IP сервера (старые записи Vercel удалите; AAAA-записи тоже).

## 6. Запуск сайта

```bash
cd /opt/arendatra
docker compose up -d --build
docker compose logs -f caddy
```

Первая сборка занимает 5–10 минут. Когда в логе Caddy появится `certificate obtained successfully` — откройте https://аренда-транспорта.рф.

## 7. Резервные копии

```bash
(crontab -l 2>/dev/null; echo "0 3 * * * /opt/arendatra/deploy/backup.sh") | crontab -
```

Ежедневный дамп в `/opt/backups`, хранится 14 дней. Периодически скачивайте свежий дамп к себе: `scp root@IP:/opt/backups/arendatra-ГГГГ-ММ-ДД.sql.gz .`

## 8. Обновление сайта

После каждого `Push origin`:

```bash
cd /opt/arendatra && git pull && docker compose up -d --build
```

## 9. После переезда

Через 1–2 недели, когда убедитесь, что всё работает: удалите проект в Vercel и базы в Neon (персональные данные по 152-ФЗ должны храниться только в РФ).
