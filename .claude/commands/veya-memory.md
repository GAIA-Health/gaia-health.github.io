# Other-Project Memory Loader

Memories about work outside the Go Go Gaia website — the pitch deck, the hardware strip,
the backend, iOS, genetics, grants, the financial model — are kept out of the resident
index so they don't cost tokens in every website session. This command loads them.

## 1. Load the index

Read `~/.claude/projects/-Users-abbyholland-Desktop-abby-webdev-gaia-health-github-io/memory/OTHER-PROJECTS.md`.
It is the same one-line-per-memory format as `MEMORY.md`: `- [Title](file.md) — hook`.

## 2. Open only what the task needs

Pick the entries whose hooks bear on the work at hand and read those files from the same
`memory/` directory. Do not read the whole set — the split exists precisely to avoid that.
If `$ARGUMENTS` names a topic (deck, strip, backend, ios, genetics, grants, model),
filter to it; otherwise report the topics available and ask which to open.

## 3. Writing new memories

Nothing changes about how memories are written — one fact per file in `memory/`, with the
frontmatter the global CLAUDE.md specifies. The only decision is which index gets the
pointer line:

- **`MEMORY.md`** — website, SEO, AIO, content, social, brand, analytics, app-feature
  claims used in copy, and general working preferences.
- **`OTHER-PROJECTS.md`** — everything else. Keep the hook under 80 characters here too.

Both indexes hold pointer lines only. Detail lives in the memory file, never in the index.
