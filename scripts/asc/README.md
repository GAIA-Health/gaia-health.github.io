# App Store Connect — Custom Product Page automation

Automates creating/updating **Custom Product Pages (CPPs)** so each website vertical
(PCOS, pregnancy, perimenopause, TTC, mood, …) can have a tailored App Store page,
linked from that vertical's blog CTA. See `docs/PRODUCT-GROWTH-ASKS-2026-06.md` for why.

Zero dependencies — needs Node 18+ (you have v20). No secrets are stored in the repo.

## Setup (one time)

1. In **App Store Connect → Users and Access → Integrations → App Store Connect API**, note your **Issuer ID** (a UUID). Confirm the API key you use has the **Admin** or **App Manager** role (CPP writes require it).
2. You already have key files in `~/Downloads` (`AuthKey_<KEY_ID>.p8`). The `<KEY_ID>` in the filename is your `ASC_KEY_ID`.
3. Export the three env vars (do NOT commit them):

   ```sh
   export ASC_KEY_ID=9XR2W9PT44                      # whichever key has the right role
   export ASC_ISSUER_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   export ASC_KEY_PATH="$HOME/Downloads/AuthKey_9XR2W9PT44.p8"
   ```

## Use

```sh
# 1) Read-only — verify auth and see your app's resource id + existing CPPs.
node scripts/asc/asc-cpp.mjs audit

# 2) Copy the example config, set appId (from audit) + edit the pages.
cp scripts/asc/verticals.example.json scripts/asc/verticals.json

# 3) Dry run — prints what it WOULD create/update. No writes.
node scripts/asc/asc-cpp.mjs sync scripts/asc/verticals.json

# 4) Apply — actually writes to App Store Connect.
node scripts/asc/asc-cpp.mjs sync scripts/asc/verticals.json --apply

# 5) Screenshots — upload the framed PNGs for a CPP once its shell exists.
#    Files must be named "1_foo.png", "2_bar.png", ... — the leading number
#    sets upload/display order. Dry run first (no --apply):
node scripts/asc/asc-cpp.mjs screenshots "PCOS" ~/Desktop/GaiaScreenshots/cpp_framed/CPP-PCOS

# 6) Apply the screenshot upload.
node scripts/asc/asc-cpp.mjs screenshots "PCOS" ~/Desktop/GaiaScreenshots/cpp_framed/CPP-PCOS --apply

# If the set already has screenshots, `screenshots` SKIPS by default (no
# duplicate upload). Pass --replace to delete the existing ones first:
node scripts/asc/asc-cpp.mjs screenshots "PCOS" ~/Desktop/GaiaScreenshots/cpp_framed/CPP-PCOS --replace --apply
```

## Important limits

- **A CPP is created *hidden* (`visible=false`) and cannot go live without screenshots.** `sync` builds the text/shell; `screenshots` handles the asset upload end-to-end (reserve -> upload bytes -> commit -> poll for processing -> reorder), so nothing has to be dragged into the ASC UI by hand. `screenshots` always targets the **en-US** locale and the **APP_IPHONE_67** screenshot set (the display type Apple assigns to 1290x2796 6.9"/6.7" portrait shots — confirmed by reading the live app-level listing's screenshot set, not assumed). Other locales/device sizes aren't wired up.
- CPPs can customize **screenshots, app previews, and promotional text** — not the app-level name/keywords/description.
- `promotionalText` max **170 chars**. Keep to the guardrails: no superlatives, no medical advice, no em-dashes.
- Writes require `--apply`. Always run `audit` and a dry run first.

## Security

- `*.p8`, `scripts/asc/.env`, and `scripts/asc/verticals.json` are gitignored. Never commit keys, the Issuer ID, or a filled-in config.
- Tokens are minted in-memory and expire in 15 minutes. The key file is read from `ASC_KEY_PATH`, never copied into the repo.
