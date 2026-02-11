#!/bin/sh

set -eu

if [ -z "${GITHUB_AUTH_TOKEN:-}" ]; then
  echo "GITHUB_AUTH_TOKEN is required"
  exit 1
fi

if [ -z "${1:-}" ]; then
  echo "Usage: $0 /PATH/TO/ALL_STABLE_DIR"
  exit 1
fi

ALL_STABLE_DIR="$1"
CONFIG_DIR="$ALL_STABLE_DIR/configs"
RUNLIST_FILE="$CONFIG_DIR/runlist-incremental.json"
LATEST_COMMIT_FILE="$CONFIG_DIR/latest_commit.json"
CRAWL_LANG="${CRAWL_LANG:-both}"

if [ ! -f "$RUNLIST_FILE" ]; then
  echo "Runlist not found: $RUNLIST_FILE"
  exit 1
fi

if [ ! -f "$LATEST_COMMIT_FILE" ]; then
  echo "latest_commit.json not found: $LATEST_COMMIT_FILE"
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

github_head_sha() {
  owner="$1"
  repo="$2"
  ref="$3"

  curl -fsS --retry 3 --retry-all-errors \
    -H "Accept: application/vnd.github.v3+json" \
    -H "Authorization: token $GITHUB_AUTH_TOKEN" \
    "https://api.github.com/repos/$owner/$repo/commits/$ref" | jq -r '.sha'
}

update_latest_commit() {
  key="$1"
  sha="$2"

  tmp_file="$(mktemp)"
  jq --arg key "$key" --arg sha "$sha" '.[$key] = $sha' "$LATEST_COMMIT_FILE" > "$tmp_file"
  mv "$tmp_file" "$LATEST_COMMIT_FILE"
}

if [ "$CRAWL_LANG" = "en" ]; then
  config_names="$(jq -r '.en[]' "$RUNLIST_FILE")"
elif [ "$CRAWL_LANG" = "zh" ]; then
  config_names="$(jq -r '.zh[]' "$RUNLIST_FILE")"
else
  config_names="$(jq -r '.en[], .zh[]' "$RUNLIST_FILE")"
fi

for config_name in $config_names; do
  config_file="$CONFIG_DIR/$config_name"
  if [ ! -f "$config_file" ]; then
    echo "Config file not found: $config_file"
    exit 1
  fi

  owner="$(jq -r '.docs_info.owner' "$config_file")"
  repo="$(jq -r '.docs_info.docs_repo' "$config_file")"
  ref="$(jq -r '.docs_info.ref' "$config_file")"
  docs_prefix="$(jq -r '.docs_info.docs_prefix' "$config_file")"
  lang="$(jq -r '.docs_info.lang' "$config_file")"
  version="$(jq -r '.docs_info.version' "$config_file")"

  if [ "$version" != "" ]; then
    key="$lang-$docs_prefix-$version"
  else
    key="$lang-$docs_prefix"
  fi

  sha="$(github_head_sha "$owner" "$repo" "$ref")"
  if [ -z "$sha" ] || [ "$sha" = "null" ]; then
    echo "Failed to get head sha for $owner/$repo@$ref"
    exit 1
  fi

  echo "Sync latest_commit.json: $key -> $sha"
  update_latest_commit "$key" "$sha"
done
