#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p /opt/backups
docker compose exec -T db pg_dump -U arendatra arendatra | gzip > "/opt/backups/arendatra-$(date +%F).sql.gz"
find /opt/backups -name 'arendatra-*.sql.gz' -mtime +14 -delete
