#!/bin/sh

set -eu

now_start=$(date +"%D - %T")
echo "Incrementally crawl (all-stable) at: $now_start"

if [ -z "${1:-}" ]; then
  echo "Usage: $0 /PATH/TO/ALL_STABLE_DIR"
  exit 1
fi

ALL_STABLE_DIR="$1"
CONFIG_DIR="$ALL_STABLE_DIR/configs"
RUNLIST_FILE="$CONFIG_DIR/runlist-incremental.json"

if [ ! -d "$CONFIG_DIR" ]; then
  echo "Config directory not found: $CONFIG_DIR"
  exit 1
fi

if [ ! -f "$RUNLIST_FILE" ]; then
  echo "Runlist not found: $RUNLIST_FILE"
  exit 1
fi

run_one() {
  config_file="$1"

  docker run --rm --env-file=.env \
    -e "CONFIG=$(jq -r tostring "$config_file")" \
    -e "ISINCREMENTAL=True" \
    -v "$CONFIG_DIR":/data \
    "$DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2"

  exit_code=$?
  if [ "$exit_code" -ne 0 ] && [ "$exit_code" -ne 3 ]; then
    echo "Crawler failed for $config_file (exit=$exit_code)"
    exit "$exit_code"
  fi
}

config_names="$(jq -r '.en[], .zh[]' "$RUNLIST_FILE")"

for config_name in $config_names; do
  config_file="$CONFIG_DIR/$config_name"
  if [ ! -f "$config_file" ]; then
    echo "Config file not found: $config_file"
    exit 1
  fi
  run_one "$config_file"
done

now_end=$(date +"%D - %T")
echo "Incrementally crawl (all-stable) finished at: $now_end"
