#!/bin/sh

set -eu

if [ -z "${1:-}" ]; then
  echo "Usage: $0 /PATH/TO/CRAWL_LOG"
  exit 1
fi

CRAWL_LOG_FILE="$1"

if [ ! -f "$CRAWL_LOG_FILE" ]; then
  echo "Crawl log not found: $CRAWL_LOG_FILE"
  exit 1
fi

spider_error_count="$(grep -c "ERROR: Spider error processing <GET" "$CRAWL_LOG_FILE" || true)"
oversized_error_count="$(grep -c "Record at the position .* is too big" "$CRAWL_LOG_FILE" || true)"

echo "Spider errors: $spider_error_count"
echo "Oversized-record errors: $oversized_error_count"

if [ "$spider_error_count" -gt 0 ] || [ "$oversized_error_count" -gt 0 ]; then
  echo "DocSearch crawl has spider errors. Failing workflow to avoid silent partial indexing."
  exit 1
fi
