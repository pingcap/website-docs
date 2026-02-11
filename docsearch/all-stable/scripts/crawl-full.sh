#!/bin/sh

set -eu

now_start=$(date +"%D - %T")
echo "Fully crawl (all-stable) at: $now_start"

if [ -z "${1:-}" ]; then
  echo "Usage: $0 /PATH/TO/ALL_STABLE_DIR"
  exit 1
fi

ALL_STABLE_DIR="$1"
CONFIG_DIR="$ALL_STABLE_DIR/configs"
SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"

CRAWL_LANG="${CRAWL_LANG:-both}"
UPDATE_LATEST_COMMIT="${UPDATE_LATEST_COMMIT:-true}"

if [ ! -d "$CONFIG_DIR" ]; then
  echo "Config directory not found: $CONFIG_DIR"
  exit 1
fi

case "$CRAWL_LANG" in
  both|en|zh)
    ;;
  *)
    echo "Invalid CRAWL_LANG: $CRAWL_LANG (allowed: both|en|zh)"
    exit 1
    ;;
esac

case "$UPDATE_LATEST_COMMIT" in
  true|false)
    ;;
  *)
    echo "Invalid UPDATE_LATEST_COMMIT: $UPDATE_LATEST_COMMIT (allowed: true|false)"
    exit 1
    ;;
esac

run_one() {
  config_file="$1"

  if [ ! -f "$config_file" ]; then
    echo "Config file not found: $config_file"
    exit 1
  fi

  config_payload="$(jq -r tostring "$config_file")"

  docker run --rm --env-file=.env \
    -e "CONFIG=$config_payload" \
    -v "$CONFIG_DIR":/data \
    "$DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2"

  exit_code=$?
  if [ "$exit_code" -ne 0 ]; then
    echo "Crawler failed for $config_file (exit=$exit_code)"
    exit "$exit_code"
  fi
}

if [ "$CRAWL_LANG" = "both" ] || [ "$CRAWL_LANG" = "en" ]; then
  run_one "$CONFIG_DIR/en-all-stable-full.json"
fi

if [ "$CRAWL_LANG" = "both" ] || [ "$CRAWL_LANG" = "zh" ]; then
  run_one "$CONFIG_DIR/zh-all-stable-full.json"
fi

if [ "$UPDATE_LATEST_COMMIT" = "true" ]; then
  export CRAWL_LANG
  "$SCRIPT_DIR/sync-latest-commit.sh" "$ALL_STABLE_DIR"
else
  echo "Skip latest_commit sync (UPDATE_LATEST_COMMIT=false)"
fi

now_end=$(date +"%D - %T")
echo "Fully crawl (all-stable) finished at: $now_end"
