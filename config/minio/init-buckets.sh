#!/bin/bash
# MinIO bucket initialization script
# This is also handled by docker-compose, but kept for reference

set -e

# Wait for MinIO to be ready
until curl -sf http://localhost:9000/minio/health/live; do
    echo "Waiting for MinIO..."
    sleep 2
done

# Configure mc client
mc alias set entoo2 http://localhost:9000 ${MINIO_ROOT_USER:-minioadmin} ${MINIO_ROOT_PASSWORD:-minioadmin}

# Create buckets
mc mb entoo2/documents --ignore-existing
mc mb entoo2/avatars --ignore-existing
mc mb entoo2/temp --ignore-existing

# Set public read access for avatars
mc anonymous set download entoo2/avatars

# Set lifecycle policy for temp bucket (delete after 1 day)
cat > /tmp/lifecycle.json << EOF
{
    "Rules": [
        {
            "ID": "expire-temp-files",
            "Status": "Enabled",
            "Filter": {
                "Prefix": ""
            },
            "Expiration": {
                "Days": 1
            }
        }
    ]
}
EOF

mc ilm import entoo2/temp < /tmp/lifecycle.json

echo "MinIO buckets initialized successfully"
