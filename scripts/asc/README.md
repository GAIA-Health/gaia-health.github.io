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
```

## Important limits

- **Screenshots are not automated here.** A CPP is created *hidden* (`visible=false`) and **cannot go live without screenshots**. Add them in the ASC UI (or extend the script with the media reserve→upload→commit flow). The text/promo and page structure are what this tool manages.
- CPPs can customize **screenshots, app previews, and promotional text** — not the app-level name/keywords/description.
- `promotionalText` max **170 chars**. Keep to the guardrails: no superlatives, no medical advice, no em-dashes.
- Writes require `--apply`. Always run `audit` and a dry run first.

## Security

- `*.p8`, `scripts/asc/.env`, and `scripts/asc/verticals.json` are gitignored. Never commit keys, the Issuer ID, or a filled-in config.
- Tokens are minted in-memory and expire in 15 minutes. The key file is read from `ASC_KEY_PATH`, never copied into the repo.
