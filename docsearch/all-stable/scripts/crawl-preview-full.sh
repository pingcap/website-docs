#!/bin/sh

set -eu

now_start=$(date +"%D - %T")
echo "Preview full prewarm (all-stable) at: $now_start"

if [ -z "${1:-}" ]; then
  echo "Usage: $0 /PATH/TO/ALL_STABLE_DIR"
  exit 1
fi

ALL_STABLE_DIR="$1"
CONFIG_DIR="$ALL_STABLE_DIR/configs"
RUNLIST_FILE="$CONFIG_DIR/runlist-incremental.json"

CRAWL_LANG="${CRAWL_LANG:-both}"
CRAWL_LOCAL_URL="${CRAWL_LOCAL_URL:-}"

if [ ! -d "$CONFIG_DIR" ]; then
  echo "Config directory not found: $CONFIG_DIR"
  exit 1
fi

if [ ! -f "$RUNLIST_FILE" ]; then
  echo "Runlist not found: $RUNLIST_FILE"
  exit 1
fi

if [ -z "$CRAWL_LOCAL_URL" ]; then
  echo "CRAWL_LOCAL_URL is required for preview full prewarm"
  exit 1
fi

CRAWL_LOCAL_URL="${CRAWL_LOCAL_URL%/}/"

case "$CRAWL_LANG" in
  both|en|zh)
    ;;
  *)
    echo "Invalid CRAWL_LANG: $CRAWL_LANG (allowed: both|en|zh)"
    exit 1
    ;;
esac

TMP_CONFIG_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "$TMP_CONFIG_DIR"
}
trap cleanup EXIT INT TERM

cp "$CONFIG_DIR"/*.json "$TMP_CONFIG_DIR"/

echo "Use temporary config directory: $TMP_CONFIG_DIR"

en_config_names="$(jq -r '.en[]' "$RUNLIST_FILE")"
zh_config_names="$(jq -r '.zh[]' "$RUNLIST_FILE")"

run_one() {
  config_name="$1"
  config_file="$TMP_CONFIG_DIR/$config_name"

  if [ ! -f "$config_file" ]; then
    echo "Config file not found: $config_file"
    exit 1
  fi

  echo "Run preview full prewarm for config: $config_name"

  config_payload="$(jq -r \
    --arg crawl_local_url "$CRAWL_LOCAL_URL" \
    '.crawl_local_url = $crawl_local_url
    | .start_urls = [$crawl_local_url]
    | .sitemap_urls = []
    | .sitemap_urls_regexs = []
    | .force_sitemap_urls_crawling = false
    | tostring' "$config_file")"

  docker run --rm --env-file=.env \
    -e "CONFIG=$config_payload" \
    -v "$TMP_CONFIG_DIR":/data \
    "$DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2"

  exit_code=$?
  if [ "$exit_code" -ne 0 ]; then
    echo "Crawler failed for $config_name (exit=$exit_code)"
    exit "$exit_code"
  fi
}

if [ "$CRAWL_LANG" = "both" ] || [ "$CRAWL_LANG" = "en" ]; then
  for config_name in $en_config_names; do
    run_one "$config_name"
  done
fi

if [ "$CRAWL_LANG" = "both" ] || [ "$CRAWL_LANG" = "zh" ]; then
  for config_name in $zh_config_names; do
    run_one "$config_name"
  done
fi

now_end=$(date +"%D - %T")
echo "Preview full prewarm (all-stable) finished at: $now_end"
