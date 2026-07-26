# App Store Connect — Custom Product Page automation

Automates creating/updating **Custom Product Pages (CPPs)** so each website vertical
(PCOS, pregnancy, perimenopause, TTC, mood, …) can have a tailored App Store page,
linked from that vertical's blog CTA. See `docs/PRODUCT-GROWTH-ASKS-2026-06.md` for why.

Zero dependencies — needs Node 18+ (you have v20). No secrets are stored in the repo.

## Setup (one time)

1. In **App Store Connect → Users and Access → Integrations → App Store Connect API**, note your **Issuer ID** (a UUID). Confirm the API key you use has the **Admin** or **App Manager** role (CPP writes require it).
2. The Admin key lives at `scripts/asc/AuthKey_6G33C3358M.p8` (gitignored via `*.p8`).
   It was moved out of `~/Downloads` on 2026-07-20 because macOS TCC blocks CLI
   tools from reading Downloads. `scripts/asc/.env` has all env vars filled in:

   ```sh
   source scripts/asc/.env    # then run any command below
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
#    Files must be named "1_foo.png" or "01-foo.png" (the frames/ render
#    pipeline emits the latter) — the leading number sets upload/display
#    order. Dry run first (no --apply):
node scripts/asc/asc-cpp.mjs screenshots "PCOS" frames/out/cpp-pcos

# 6) Apply the screenshot upload.
node scripts/asc/asc-cpp.mjs screenshots "PCOS" frames/out/cpp-pcos --apply

# If the set already has screenshots, `screenshots` SKIPS by default (no
# duplicate upload). Pass --replace to delete the existing ones first:
node scripts/asc/asc-cpp.mjs screenshots "PCOS" frames/out/cpp-pcos --replace --apply
```

## ⚠ CPP creation is currently broken in Apple's API (2026-07-20)

`POST /v1/appCustomProductPages` rejects every payload shape with contradictory
409s (verified empirically — documented deep-create shape included; details in
the header comment of `asc-cpp.mjs`). Until Apple fixes it:

1. Create each CPP shell **manually in the ASC UI**: App Store → Custom Product
   Pages → "+" → name it exactly as in `verticals.json` (PCOS, Pregnancy,
   Perimenopause, TTC, Mood) → copy from current version. ~30s each.
2. Re-run `sync --apply` — it now detects existing CPPs and sets/updates the
   en-US promo text on their editable version via PATCH (that path works).
3. Run `screenshots <NAME> frames/out/cpp-<slug> --apply --replace` per page.

## Important limits

- **A CPP is created *hidden* (`visible=false`) and cannot go live without screenshots.** `sync` builds the text/shell; `screenshots` handles the asset upload end-to-end (reserve -> upload bytes -> commit -> poll for processing -> reorder), so nothing has to be dragged into the ASC UI by hand. `screenshots` always targets the **en-US** locale and the **APP_IPHONE_67** screenshot set (the display type Apple assigns to 1290x2796 6.9"/6.7" portrait shots — confirmed by reading the live app-level listing's screenshot set, not assumed). Other locales/device sizes aren't wired up.
- CPPs can customize **screenshots, app previews, and promotional text** — not the app-level name/keywords/description.
- `promotionalText` max **170 chars**. Keep to the guardrails: no superlatives, no medical advice, no em-dashes.
- Writes require `--apply`. Always run `audit` and a dry run first.

## Security

- `*.p8`, `scripts/asc/.env`, and `scripts/asc/verticals.json` are gitignored. Never commit keys, the Issuer ID, or a filled-in config.
- Tokens are minted in-memory and expire in 15 minutes. The key file sits in `scripts/asc/` (chmod 600) and is kept out of git by the `*.p8` ignore rule — verify with `git check-ignore scripts/asc/AuthKey_6G33C3358M.p8` after any .gitignore change.
