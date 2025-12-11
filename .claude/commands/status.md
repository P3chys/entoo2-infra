Check the status of all Entoo2 infrastructure services.

Run the following commands to gather status:

```bash
# Check container status
docker compose -f docker/docker-compose.services.yml ps

# Check PostgreSQL
docker exec entoo2-postgres pg_isready -U entoo2 2>/dev/null && echo "PostgreSQL: OK" || echo "PostgreSQL: FAILED"

# Check Redis
docker exec entoo2-redis redis-cli -a redis_dev ping 2>/dev/null | grep -q PONG && echo "Redis: OK" || echo "Redis: FAILED"

# Check MinIO
curl -sf http://localhost:9000/minio/health/live && echo "MinIO: OK" || echo "MinIO: FAILED"

# Check Meilisearch
curl -sf http://localhost:7700/health && echo "Meilisearch: OK" || echo "Meilisearch: FAILED"

# Check Tika
curl -sf http://localhost:9998/tika && echo "Tika: OK" || echo "Tika: FAILED"
```

Summarize the health status of all services in a clear table format.
