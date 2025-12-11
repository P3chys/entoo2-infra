View logs from Entoo2 infrastructure services.

If the user specified a service name, show logs for that service:

```bash
docker compose -f docker/docker-compose.services.yml logs -f --tail=100 [SERVICE_NAME]
```

Available services: postgres, redis, minio, meilisearch, tika

If no service specified, show combined logs from all services:

```bash
docker compose -f docker/docker-compose.services.yml logs -f --tail=50
```

Look for any errors or warnings and report them to the user.
