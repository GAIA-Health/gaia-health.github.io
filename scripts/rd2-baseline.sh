#!/usr/bin/env bash
# RD-2 conversion-experiment measurement harness.
# Pulls the pooled click->download_click funnel for the commercial-intent page
# set (organic search, web platform only) plus engagement guardrails.
#
# Usage: scripts/rd2-baseline.sh [START] [END]
#   defaults: START=2026-06-09 (first clean post-instrumentation-fix day), END=today
#
# Baseline window: 2026-06-09 .. variant ship date. Data before 2026-06-09 is
# unusable for the numerator (competitor App Store taps fired download_click
# until the 2026-06-08 fix; link_text is not a registered GA4 custom dimension,
# so pre-fix data cannot be cleaned retroactively).
#
# Design doc: docs/RD-2-CONVERSION-EXPERIMENT.md
set -euo pipefail

START="${1:-2026-06-09}"
END="${2:-today}"
PROP=443880004
CREDS="$(dirname "$0")/../.ga-credentials.json"

# The 17 commercial-intent pages (Execution Reference, SEO-SCENARIO-MODEL.md).
# Guides are deliberately excluded — never add them to this set.
VS_RE='clue-vs-flo|clue-vs-natural-cycles|flo-vs-natural-cycles|flo-vs-go-go-gaia'
BEST_RE='best-ivf-tracking-app|best-pcos-tracking-app|best-endometriosis-tracking-app|best-perimenopause-tracking-app|best-fertility-tracking-app|best-pmdd-tracking-app|best-postpartum-tracking-app|best-ovulation-tracker-app|best-egg-freezing-tracking-app|best-birth-control-reminder-app|best-mood-tracking-app|best-symptom-tracker-app-women|best-pregnancy-tracking-app'
COMM_RE="^/blog/(${VS_RE}|${BEST_RE})\.html$"

ORGANIC_WEB='{"filter":{"fieldName":"platform","stringFilter":{"value":"web"}}},{"filter":{"fieldName":"sessionDefaultChannelGroup","stringFilter":{"value":"Organic Search"}}}'

ga() { # ga <dimensions> <metrics> <extra-filter-expressions...>
  local dims="$1" mets="$2" extra="${3:-}"
  local exprs="$ORGANIC_WEB"
  [ -n "$extra" ] && exprs="$exprs,$extra"
  npx --yes google-analytics-cli report --property "$PROP" --credentials "$CREDS" \
    --dimensions "$dims" --metrics "$mets" \
    --date-ranges "[{\"startDate\":\"$START\",\"endDate\":\"$END\"}]" \
    --dimension-filter "{\"andGroup\":{\"expressions\":[$exprs]}}" \
    --limit 200
}

rows() { jq -r '.rows[]? | [.dimensionValues[0].value, .metricValues[0].value] | @tsv'; }

echo "RD-2 funnel pull — organic search, web — window: $START .. $END"
echo

SESS=$(ga "landingPage" "sessions" | rows)
DL=$(ga   "pagePath" "eventCount" '{"filter":{"fieldName":"eventName","stringFilter":{"value":"download_click"}}}' | rows)
OUT=$(ga  "pagePath" "eventCount" '{"filter":{"fieldName":"eventName","stringFilter":{"value":"outbound_app_click"}}}' | rows)
ENG=$(ga  "pagePath" "eventCount" '{"filter":{"fieldName":"eventName","stringFilter":{"value":"engaged_reader"}}}' | rows)
CTA=$(ga  "pagePath" "eventCount" '{"filter":{"fieldName":"eventName","stringFilter":{"value":"cta_visible"}}}' | rows)
SCR=$(ga  "pagePath" "eventCount" '{"filter":{"fieldName":"eventName","stringFilter":{"value":"scroll_depth"}}}' | rows)

lookup() { echo "$1" | awk -F'\t' -v p="$2" '$1==p{print $2; found=1} END{if(!found)print 0}'; }
sum_matching() { echo "$1" | awk -F'\t' -v re="$2" '$1 ~ re {s+=$2} END{print s+0}'; }

ALL_PAGES=$(printf '%s\n' "$SESS" "$DL" | awk -F'\t' '{print $1}' | grep -E "$COMM_RE" | sort -u)

printf '%-55s %8s %4s %8s %8s %12s %7s\n' "page" "sessions" "dl" "outbound" "engaged" "cta_visible" "scroll"
for p in $ALL_PAGES; do
  printf '%-55s %8s %4s %8s %8s %12s %7s\n' "$p" \
    "$(lookup "$SESS" "$p")" "$(lookup "$DL" "$p")" "$(lookup "$OUT" "$p")" \
    "$(lookup "$ENG" "$p")" "$(lookup "$CTA" "$p")" "$(lookup "$SCR" "$p")"
done

echo
for label_re in "POOLED-COMMERCIAL:$COMM_RE" "vs-pages:^/blog/(${VS_RE})\.html$" "best-X:^/blog/(${BEST_RE})\.html$"; do
  label="${label_re%%:*}"; re="${label_re#*:}"
  s=$(sum_matching "$SESS" "$re"); d=$(sum_matching "$DL" "$re")
  o=$(sum_matching "$OUT" "$re"); e=$(sum_matching "$ENG" "$re"); c=$(sum_matching "$CTA" "$re")
  conv=$(awk -v d="$d" -v s="$s" 'BEGIN{ if (s>0) printf "%.1f%%", 100*d/s; else print "n/a" }')
  eng_rate=$(awk -v e="$e" -v s="$s" 'BEGIN{ if (s>0) printf "%.0f%%", 100*e/s; else print "n/a" }')
  echo "$label: sessions=$s download_click=$d (conv $conv) outbound_app=$o engaged_reader=$e (rate $eng_rate) cta_visible=$c"
done

echo
echo "NOTE: denominator = GA4 organic-search landing sessions (proxy for GSC clicks;"
echo "GSC is the authority — reconcile with a GSC Pages.csv export at each checkpoint)."
