#!/bin/sh

now=$(date +"%D - %T")
echo "Incrementally crawl at: $now"

# crawl en tidb
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-dev.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v6.6.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v6.5.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v6.1.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v5.4.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v5.3.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v5.2.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v5.1.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v5.0.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v4.0.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v3.0.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2

# crawl zh tidb
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-dev.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v6.6.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v6.5.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v6.1.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v5.4.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v5.3.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v5.2.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v5.1.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v5.0.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v4.0.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v3.1.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2

# crawl zh/en tidb-in-kubernetes
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-in-kubernetes-dev.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-in-kubernetes-v1.2.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-in-kubernetes-v1.3.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-in-kubernetes-v1.4.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-in-kubernetes-dev.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-in-kubernetes-v1.2.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-in-kubernetes-v1.3.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-in-kubernetes-v1.4.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2

# crawl zh/en tidb-data-migration
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-data-migration-dev.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-data-migration-v5.3.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-data-migration-dev.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-data-migration-v5.3.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2

# # crawl zh/en appdev
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-appdev-dev.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-appdev-dev.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2

# crawl en tidbcloud
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidbcloud.json | jq -r tostring)" -e  "ISINCREMENTAL=True" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2

echo "Incrementally crawl finished at: $now"
