#!/bin/sh

set -eu

if [ -z "${1:-}" ]; then
  echo "Usage: $0 /PATH/TO/ALL_STABLE_DIR"
  exit 1
fi

ALL_STABLE_DIR="$1"

if [ -z "${BASE_DOCKER_REGISTRY:-}" ]; then
  echo "BASE_DOCKER_REGISTRY is required"
  exit 1
fi

PATCH_SCRAPER_REPO="${PATCH_SCRAPER_REPO:-https://github.com/shczhen/docsearch-scraper.git}"
PATCH_SCRAPER_REF="${PATCH_SCRAPER_REF:-incrementalCrawl}"
PATCHED_DOCKER_REGISTRY="${PATCHED_DOCKER_REGISTRY:-local}"
SCRAPER_IMAGE_TAG="${SCRAPER_IMAGE_TAG:-v0.2}"
PATCH_IMAGE_ENV_FILE="${PATCH_IMAGE_ENV_FILE:-/tmp/docsearch-patched-image.env}"

BASE_SCRAPER_IMAGE="$BASE_DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:$SCRAPER_IMAGE_TAG"
PATCHED_SCRAPER_IMAGE="$PATCHED_DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:$SCRAPER_IMAGE_TAG"

echo "Prepare patched scraper image"
echo "  base image: $BASE_SCRAPER_IMAGE"
echo "  patch source: $PATCH_SCRAPER_REPO@$PATCH_SCRAPER_REF"
echo "  patched image: $PATCHED_SCRAPER_IMAGE"

patch_workdir="$(mktemp -d)"
patch_container_id=""

cleanup() {
  if [ -n "$patch_container_id" ]; then
    docker rm -f "$patch_container_id" >/dev/null 2>&1 || true
  fi
  rm -rf "$patch_workdir"
}
trap cleanup EXIT INT TERM

git clone --depth 1 --branch "$PATCH_SCRAPER_REF" "$PATCH_SCRAPER_REPO" "$patch_workdir/docsearch-scraper"

docker pull "$BASE_SCRAPER_IMAGE"

patch_container_id="$(docker create "$BASE_SCRAPER_IMAGE")"

docker cp "$patch_workdir/docsearch-scraper/scraper/src/." "$patch_container_id:/root/src/"
docker commit "$patch_container_id" "$PATCHED_SCRAPER_IMAGE" >/dev/null

echo "Verify patched urls_setter.py snippet:"
docker run --rm --entrypoint sh "$PATCHED_SCRAPER_IMAGE" -c 'nl -ba /root/src/config/urls_setter.py | sed -n "100,106p"'

printf 'PATCHED_DOCKER_REGISTRY=%s\n' "$PATCHED_DOCKER_REGISTRY" > "$PATCH_IMAGE_ENV_FILE"
printf 'PATCHED_SCRAPER_IMAGE=%s\n' "$PATCHED_SCRAPER_IMAGE" >> "$PATCH_IMAGE_ENV_FILE"

echo "Wrote patched image env file: $PATCH_IMAGE_ENV_FILE"
