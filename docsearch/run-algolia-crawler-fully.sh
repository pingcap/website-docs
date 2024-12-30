#!/bin/sh

now=$(date +"%D - %T")
echo "Fully crawl at: $now"

# crawl en tidb
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-dev.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v8.5.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v8.4.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v8.3.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v8.2.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v8.1.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v8.0.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v7.6.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v7.5.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v7.4.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v7.3.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v7.2.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v7.1.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v7.0.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v6.6.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v6.5.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v6.1.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v5.4.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v5.2.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v5.1.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v5.0.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v4.0.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-v3.0.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2

# crawl zh tidb
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-dev.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v8.5.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v8.4.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v8.3.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v8.2.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v8.1.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v8.0.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v7.6.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v7.5.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v7.4.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v7.3.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v7.2.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v7.1.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v7.0.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v6.6.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v6.5.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v6.1.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v5.4.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v5.3.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v5.2.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v5.1.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v5.0.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v4.0.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-v3.0.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2

# crawl zh/en tidb-in-kubernetes
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-in-kubernetes-v1.6.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-in-kubernetes-v1.6.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2

# crawl zh/en tidb-data-migration
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-data-migration-dev.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidb-data-migration-v5.3.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-data-migration-dev.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-tidb-data-migration-v5.3.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2


# crawl zh/en appdev
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/zh-appdev-dev.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
# docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-appdev-dev.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2

# crawl en tidbcloud
docker run --rm --env-file=.env -e "CONFIG=$(cat $1/algolia_configs/en-tidbcloud.json | jq -r tostring)" -v $1/algolia_configs:/data $DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2
