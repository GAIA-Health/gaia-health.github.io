# Scheduled publishing

Each finished post is its own PR. A daily workflow (`.github/workflows/scheduled-publish.yml`, 14:00 UTC, also runnable by hand) merges every open PR whose `publish:YYYY-MM-DD` label date is today or earlier.

**Schedule:** add the label `publish:2026-11-12` to the PR (create it if it doesn't exist; any date in that format works). Leave the PR non-draft with passing checks.

**Unschedule:** remove the label, or convert the PR to draft.

**Publish now:** merge the PR yourself, or add a label dated today or earlier and run the workflow from the Actions tab (Scheduled publish, Run workflow).

**What the workflow does:** merges oldest date first with a real merge commit (never squash), one at a time, re-checking mergeability after each. Drafts and PRs with failing checks are skipped. A PR that conflicts with main (usually `sitemap.xml` or the blog index after an earlier post merged) gets a comment and is skipped; rebase or merge main into it and the next run picks it up. After merging it waits 90s for the Pages deploy and submits the changed URLs to IndexNow.

**Dates:** set the post's on-page date, `datePublished`, and `dateModified` to the publish date, since the post can sit in a PR for days before it goes live.
