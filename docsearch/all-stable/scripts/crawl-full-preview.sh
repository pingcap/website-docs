#!/bin/sh

set -eu

now_start=$(date +"%D - %T")
echo "Preview full prewarm with sitemap (all-stable) at: $now_start"

if [ -z "${1:-}" ]; then
  echo "Usage: $0 /PATH/TO/ALL_STABLE_DIR"
  exit 1
fi

ALL_STABLE_DIR="$1"
CONFIG_DIR="$ALL_STABLE_DIR/configs"

CRAWL_LANG="${CRAWL_LANG:-both}"
CRAWL_LOCAL_URL="${CRAWL_LOCAL_URL:-}"
PREVIEW_SITEMAP_URL="${PREVIEW_SITEMAP_URL:-}"

if [ ! -d "$CONFIG_DIR" ]; then
  echo "Config directory not found: $CONFIG_DIR"
  exit 1
fi

if [ -z "$CRAWL_LOCAL_URL" ]; then
  echo "CRAWL_LOCAL_URL is required for preview full prewarm"
  exit 1
fi

if ! printf '%s' "$CRAWL_LOCAL_URL" | grep -Eq '^https?://'; then
  echo "Invalid CRAWL_LOCAL_URL: $CRAWL_LOCAL_URL"
  exit 1
fi

CRAWL_LOCAL_URL="${CRAWL_LOCAL_URL%/}/"
PREVIEW_REGEX_BASE="$CRAWL_LOCAL_URL"

if [ -z "$PREVIEW_SITEMAP_URL" ]; then
  PREVIEW_SITEMAP_URL="${CRAWL_LOCAL_URL}sitemap/sitemap-index.xml"
fi

case "$CRAWL_LANG" in
  both|en|zh)
    ;;
  *)
    echo "Invalid CRAWL_LANG: $CRAWL_LANG (allowed: both|en|zh)"
    exit 1
    ;;
esac

echo "Preview base URL: $CRAWL_LOCAL_URL"
echo "Preview sitemap URL: $PREVIEW_SITEMAP_URL"

TMP_LOG_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "$TMP_LOG_DIR"
}
trap cleanup EXIT INT TERM

build_preview_config_payload() {
  config_file="$1"

  jq -r \
    --arg crawl_local_url "$CRAWL_LOCAL_URL" \
    --arg preview_sitemap_url "$PREVIEW_SITEMAP_URL" \
    --arg preview_regex_base "$PREVIEW_REGEX_BASE" \
    '.crawl_local_url = $crawl_local_url
    | .sitemap_urls = [$preview_sitemap_url]
    | .sitemap_urls_regexs = ((.sitemap_urls_regexs // [])
      | map(sub("^https?://docs\\.pingcap\\.com/?"; $preview_regex_base)))
    | .force_sitemap_urls_crawling = true
    | tostring' "$config_file"
}

print_run_summary() {
  run_log_file="$1"
  config_name="$2"

  record_lines="$(grep -E "> DocSearch: .* [0-9]+ records\)" "$run_log_file" || true)"
  indexed_page_count="$(printf '%s\n' "$record_lines" | sed '/^$/d' | wc -l | tr -d ' ')"
  indexed_record_count="$(printf '%s\n' "$record_lines" | sed -n 's/.* \([0-9][0-9]*\) records).*/\1/p' | awk '{s+=$1} END {print s+0}')"
  ignored_start_count="$(grep -c "Ignored: from start url" "$run_log_file" || true)"
  ignored_sitemap_count="$(grep -c "Ignored from sitemap" "$run_log_file" || true)"
  spider_error_count="$(grep -c "ERROR: Spider error processing <GET" "$run_log_file" || true)"
  oversized_error_count="$(grep -c "Record at the position .* is too big" "$run_log_file" || true)"

  echo "Summary ($config_name): indexed_pages=$indexed_page_count indexed_records=$indexed_record_count ignored_start=$ignored_start_count ignored_sitemap=$ignored_sitemap_count spider_errors=$spider_error_count oversized_records=$oversized_error_count"
}

run_one() {
  config_file="$1"
  config_name="$(basename "$config_file")"

  if [ ! -f "$config_file" ]; then
    echo "Config file not found: $config_file"
    exit 1
  fi

  echo "Run preview full prewarm (sitemap) for config: $config_name"

  config_payload="$(build_preview_config_payload "$config_file")"

  run_log_file="$TMP_LOG_DIR/${config_name%.json}.preview-full.log"
  set +e
  docker run --rm --env-file=.env \
    -e "CONFIG=$config_payload" \
    -v "$CONFIG_DIR":/data \
    "$DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2" \
    > "$run_log_file" 2>&1
  exit_code="$?"
  set -e

  cat "$run_log_file"
  print_run_summary "$run_log_file" "$config_name"

  if [ "$exit_code" -ne 0 ]; then
    echo "Crawler failed for $config_name (exit=$exit_code)"
    exit "$exit_code"
  fi
}

if [ "$CRAWL_LANG" = "both" ] || [ "$CRAWL_LANG" = "en" ]; then
  run_one "$CONFIG_DIR/en-all-stable-full.json"
fi

if [ "$CRAWL_LANG" = "both" ] || [ "$CRAWL_LANG" = "zh" ]; then
  run_one "$CONFIG_DIR/zh-all-stable-full.json"
fi

now_end=$(date +"%D - %T")
echo "Preview full prewarm with sitemap (all-stable) finished at: $now_end"
