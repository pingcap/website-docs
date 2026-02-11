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
ENABLE_CONTAINER_SOURCE_PROBE="${ENABLE_CONTAINER_SOURCE_PROBE:-true}"

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
echo "Enable container source probe: $ENABLE_CONTAINER_SOURCE_PROBE"

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

probe_container_runtime() {
  config_name="$1"
  config_payload="$2"

  if [ "$ENABLE_CONTAINER_SOURCE_PROBE" != "true" ]; then
    return 0
  fi

  echo "Probe scraper runtime (container code + resolved urls): $config_name"

  docker run --rm \
    -e "CONFIG=$config_payload" \
    --entrypoint sh \
    "$DOCKER_REGISTRY/algolia-docsearch-scraper-incremental:v0.2" \
    -c '
set -eu

find_urls_setter() {
  for candidate in \
    /root/scraper/src/config/urls_setter.py \
    /root/src/config/urls_setter.py \
    /scraper/src/config/urls_setter.py \
    /src/config/urls_setter.py
  do
    if [ -f "$candidate" ]; then
      echo "$candidate"
      return 0
    fi
  done

  find / -type f -path "*scraper/src/config/urls_setter.py" 2>/dev/null | head -n 1 || true
}

urls_setter_path="$(find_urls_setter)"

if [ -n "$urls_setter_path" ]; then
  echo "[probe] urls_setter.py path: $urls_setter_path"
  if command -v sha256sum >/dev/null 2>&1; then
    echo "[probe] urls_setter.py sha256:"
    sha256sum "$urls_setter_path"
  fi
  echo "[probe] urls_setter.py snippet (full-mode start_url composition):"
  nl -ba "$urls_setter_path" | sed -n "100,110p"
else
  echo "[probe] urls_setter.py path: not found"
fi

python_bin=""
if command -v python3 >/dev/null 2>&1; then
  python_bin="python3"
elif command -v python >/dev/null 2>&1; then
  python_bin="python"
fi

if [ -z "$python_bin" ]; then
  echo "[probe] python interpreter not found in container"
  exit 0
fi

"$python_bin" - <<'"'"'PY'"'"'
import os
import importlib

module_names = [
    "scraper.src.config.config_loader",
    "src.config.config_loader",
    "config.config_loader",
]

config_loader_cls = None
import_errors = []

for module_name in module_names:
    try:
        module = importlib.import_module(module_name)
        config_loader_cls = module.ConfigLoader
        print(f"[probe] using ConfigLoader module: {module_name}")
        break
    except Exception as exc:
        import_errors.append(f"{module_name}: {exc}")

if config_loader_cls is None:
    print("[probe] cannot import ConfigLoader")
    for line in import_errors:
        print(f"[probe] import error: {line}")
    raise SystemExit(0)

config = config_loader_cls(os.environ["CONFIG"], False)
print("[probe] resolved start_urls:", [item["url"] for item in config.start_urls])
print("[probe] resolved sitemap_urls:", config.sitemap_urls)
print("[probe] resolved docs_info:", config.docs_info)
PY
'
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

  probe_container_runtime "$config_name" "$config_payload"

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
