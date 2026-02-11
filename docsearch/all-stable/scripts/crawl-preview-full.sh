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
PREVIEW_RUNLIST_FILE="${PREVIEW_RUNLIST_FILE:-runlist-preview-full.json}"
RUNLIST_FILE="$CONFIG_DIR/$PREVIEW_RUNLIST_FILE"

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
echo "Use preview runlist: $RUNLIST_FILE"

en_config_names="$(jq -r '.en[]' "$RUNLIST_FILE")"
zh_config_names="$(jq -r '.zh[]' "$RUNLIST_FILE")"

has_double_slash_path() {
  input_url="$1"

  url_without_scheme="${input_url#*://}"
  if [ "$url_without_scheme" = "$input_url" ]; then
    return 1
  fi

  url_path="/${url_without_scheme#*/}"
  if [ "$url_path" = "/$url_without_scheme" ]; then
    url_path="/"
  fi

  case "$url_path" in
    *"//"*)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

build_expected_full_start_url() {
  config_file="$1"

  docs_lang="$(jq -r '.docs_info.lang // "en"' "$config_file")"
  docs_prefix="$(jq -r '.docs_info.docs_prefix // ""' "$config_file")"
  docs_version="$(jq -r '.docs_info.version // ""' "$config_file")"
  docs_is_stable="$(jq -r '.docs_info.isStable // false' "$config_file")"

  effective_version="$docs_version"
  if [ "$docs_is_stable" = "true" ]; then
    effective_version="stable"
  fi

  lang_segment=""
  if [ "$docs_lang" != "en" ]; then
    lang_segment="zh/"
  fi

  version_segment=""
  if [ -n "$effective_version" ]; then
    version_segment="${effective_version}/"
  fi

  printf '%s\n' "${CRAWL_LOCAL_URL}${lang_segment}${docs_prefix}/${version_segment}"
}

print_effective_config() {
  config_file="$1"
  config_name="$2"
  expected_start_url="$3"

  effective_config="$(jq -c \
    --arg config_name "$config_name" \
    --arg crawl_local_url "$CRAWL_LOCAL_URL" \
    --arg expected_start_url "$expected_start_url" \
    '{
      config_name: $config_name,
      index_name,
      docs_info,
      crawl_local_url: $crawl_local_url,
      expected_full_start_url: $expected_start_url,
      start_urls: [$crawl_local_url],
      sitemap_urls: [],
      sitemap_urls_regexs: [],
      force_sitemap_urls_crawling: false
    }' "$config_file")"

  echo "Effective preview full config: $effective_config"
}

summarize_run_log() {
  run_log_file="$1"
  config_name="$2"

  clean_log_file="$TMP_CONFIG_DIR/${config_name%.json}.clean.log"
  perl -pe 's/\e\[[0-9;]*[A-Za-z]//g' "$run_log_file" > "$clean_log_file"

  record_lines="$(grep -E "> DocSearch: .* [0-9]+ records\)" "$clean_log_file" || true)"

  indexed_page_count="$(printf '%s\n' "$record_lines" | sed '/^$/d' | wc -l | tr -d ' ')"
  indexed_record_count="$(printf '%s\n' "$record_lines" | sed -n 's/.* \([0-9][0-9]*\) records).*/\1/p' | awk '{s+=$1} END {print s+0}')"

  ignored_start_count="$(grep -c "Ignored: from start url" "$clean_log_file" || true)"
  ignored_sitemap_count="$(grep -c "Ignored from sitemap" "$clean_log_file" || true)"
  spider_error_count="$(grep -c "ERROR: Spider error processing <GET" "$clean_log_file" || true)"
  oversized_error_count="$(grep -c "Record at the position .* is too big" "$clean_log_file" || true)"

  echo "Summary ($config_name): indexed_pages=$indexed_page_count indexed_records=$indexed_record_count ignored_start=$ignored_start_count ignored_sitemap=$ignored_sitemap_count spider_errors=$spider_error_count oversized_records=$oversized_error_count"

  sample_urls="$(printf '%s\n' "$record_lines" | sed -n 's/.*DocSearch: \(https\?:\/\/[^ ]*\).*/\1/p' | sed -n '1,5p')"
  if [ -n "$sample_urls" ]; then
    echo "Sample indexed URLs ($config_name):"
    printf '%s\n' "$sample_urls"
  fi

  all_indexed_urls="$(printf '%s\n' "$record_lines" | sed -n 's/.*DocSearch: \(https\?:\/\/[^ ]*\).*/\1/p')"
  while IFS= read -r indexed_url; do
    [ -z "$indexed_url" ] && continue
    if has_double_slash_path "$indexed_url"; then
      echo "Detected double-slash path in indexed URL ($config_name): $indexed_url"
      echo "Failing to avoid silently indexing malformed URL paths."
      exit 1
    fi
  done <<EOF_URLS
$all_indexed_urls
EOF_URLS
}

run_one() {
  config_name="$1"
  config_file="$TMP_CONFIG_DIR/$config_name"

  if [ ! -f "$config_file" ]; then
    echo "Config file not found: $config_file"
    exit 1
  fi

  echo "Run preview full prewarm for config: $config_name"

  expected_full_start_url="$(build_expected_full_start_url "$config_file")"
  if has_double_slash_path "$expected_full_start_url"; then
    echo "Invalid expected full start URL ($config_name): $expected_full_start_url"
    echo "Detected double-slash path from docs_info composition."
    exit 1
  fi

  print_effective_config "$config_file" "$config_name" "$expected_full_start_url"

  config_payload="$(jq -r \
    --arg crawl_local_url "$CRAWL_LOCAL_URL" \
    '.crawl_local_url = $crawl_local_url
    | .start_urls = [$crawl_local_url]
    | .sitemap_urls = []
    | .sitemap_urls_regexs = []
    | .force_sitemap_urls_crawling = false
    | tostring' "$config_file")"

  run_log_file="$TMP_CONFIG_DIR/${config_name%.json}.preview-full.log"
  run_status_file="$TMP_CONFIG_DIR/${config_name%.json}.preview-full.status"

  (
    set +e
    docker run --rm --env-file=.env \
      -e "CONFIG=$config_payload" \
      -v "$TMP_CONFIG_DIR":/data \
      "$DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2"
    echo "$?" > "$run_status_file"
  ) 2>&1 | tee "$run_log_file"

  if [ ! -f "$run_status_file" ]; then
    echo "Crawler status file missing for $config_name"
    exit 1
  fi

  exit_code="$(cat "$run_status_file")"

  summarize_run_log "$run_log_file" "$config_name"

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
