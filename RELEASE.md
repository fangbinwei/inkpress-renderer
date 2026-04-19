# Releasing

This package uses [release-please](https://github.com/googleapis/release-please) — releases are driven by Conventional Commits, not by hand. You **never** run `pnpm version` or `pnpm publish` directly.

## Day-to-day flow

1. Commit changes to `main` using [Conventional Commits](https://www.conventionalcommits.org/):
   | Prefix | Effect |
   |---|---|
   | `feat:` | minor bump |
   | `fix:` | patch bump |
   | `feat!:` or footer `BREAKING CHANGE:` | major bump |
   | `chore:` / `docs:` / `refactor:` / `test:` | no bump |
2. `release-please.yml` opens (or updates) a release PR titled `chore(main): release X.Y.Z`
3. **Review the PR — merge it when you want to ship**
4. Merging triggers two things automatically:
   - Tag `vX.Y.Z` + GitHub Release with auto-generated changelog
   - `publish.yml` runs `pnpm check:ci`, `pnpm test`, `pnpm build`, then `pnpm publish --provenance` to npm

## Required setup (one-time)

- **NPM_TOKEN** secret — Granular Access Token with write access to `inkpress-renderer`. Set at https://github.com/fangbinwei/inkpress-renderer/settings/secrets/actions. Tokens expire; rotate at https://www.npmjs.com/settings/&lt;user&gt;/tokens.
- **Repo Settings → Actions → General → Workflow permissions**: must allow GitHub Actions to create and approve pull requests.

## Manual fallback

If the automation is broken and you must publish urgently:

```bash
git tag vX.Y.Z
git push origin vX.Y.Z
pnpm install --frozen-lockfile && pnpm check:ci && pnpm test && pnpm build
pnpm publish --access public
gh release create vX.Y.Z --title "vX.Y.Z" --notes "Manual release; see commits."
```

Fix the workflow afterwards — manual publishes lose npm provenance attestation.
