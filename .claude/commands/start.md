Start all Entoo2 infrastructure services (PostgreSQL, Redis, MinIO, Meilisearch, Tika).

Run the following command:

```bash
docker compose -f docker/docker-compose.services.yml up -d
```

Then verify all services are running:

```bash
docker compose -f docker/docker-compose.services.yml ps
```

Report the status of each service and any issues found.
