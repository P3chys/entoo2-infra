Reset all Entoo2 infrastructure data. This will:
1. Stop all services
2. Remove all volumes (data will be lost!)
3. Start services fresh

**WARNING: This will delete all data including database, files, and search indexes!**

First, confirm with the user that they want to proceed.

If confirmed, run:

```bash
docker compose -f docker/docker-compose.services.yml down -v
docker compose -f docker/docker-compose.services.yml up -d
```

Wait for services to be healthy, then report status:

```bash
docker compose -f docker/docker-compose.services.yml ps
```
