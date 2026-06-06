# lomi. CLI — Release process

Publishing replaces the legacy TypeScript `lomi.cli` npm package (v2.x) with the native Rust binary (v3.x). The npm package name stays **`lomi.cli`**.

## One-time setup

### 1. GitHub secret: `NPM_TOKEN`

In the repo: **Settings → Secrets and variables → Actions → New repository secret**

- Name: `NPM_TOKEN`
- Value: an npm automation token with **Publish** access to `lomi.cli`

Create at https://www.npmjs.com/settings/~your-user~/tokens (type: **Granular** or **Automation**).

> If a token was ever shared in chat or committed, **revoke it** and create a new one.

### 2. npm maintainer access

Ensure your npm user is a maintainer on https://www.npmjs.com/package/lomi.cli (collaborator: `princemuichkine` or add your account).

### 3. Homebrew tap (optional)

Host the formula in a tap repo, e.g. `lomiafrica/homebrew-tap`:

```bash
brew tap lomiafrica/tap
# Formula path in this repo: apps/cli/homebrew/lomi.rb
```

After each release, update `sha256` lines using:

```bash
./scripts/update-homebrew-sha256.sh 3.0.0
```

## Versioning policy

The Rust CLI uses **3.x** semver (successor to the legacy TypeScript `lomi.cli` v2.x).

**3.1.x line (current):** stay on patch bumps for routine releases — `3.1.0`, `3.1.1`, `3.1.2`, … — until a breaking change warrants `3.2.0` or `4.0.0`. Do not jump minor versions for every feature batch.

```bash
./scripts/bump-version.sh 3.1.1   # next small release
```

npm and Cargo only accept three-part semver (`major.minor.patch`), not `3.1.0.1`.

## Every release

### 1. Bump version

```bash
cd apps/cli
./scripts/bump-version.sh 3.1.0   # or next patch, e.g. 3.1.1
./scripts/generate-rules.sh       # refresh llms.txt + api-reference.md
cargo test -- --test-threads=1
```

Commit the version bump + regenerated rules.

### 2. Tag and push

```bash
git tag cli-v3.1.0
git push origin cli-v3.1.0
```

### 3. GitHub Actions (automatic)

Workflow [`.github/workflows/cli-release.yml`](../../.github/workflows/cli-release.yml) on tag `cli-v*`:

1. Cross-compiles macOS (Intel + Apple Silicon), Linux x64, Windows x64
2. Creates a GitHub Release with binaries
3. Publishes **`lomi.cli@3.0.0`** to npm from `apps/cli/npm/`

### 4. Verify

```bash
npm view lomi.cli version
npm install -g lomi.cli
lomi --version
lomi login
```

### 5. Homebrew (manual)

```bash
./scripts/update-homebrew-sha256.sh 3.0.0
# Edit homebrew/lomi.rb with printed checksums, commit to homebrew-tap repo
```

## How npm install works

```
npm install -g lomi.cli
  └─ postinstall → install.js
       └─ downloads github.com/lomiafrica/lomi./releases/download/cli-v{version}/lomi-{platform}
       └─ bin/lomi.js execs the native binary
```

Both `lomi` and `lomi.` bin names are registered (backward compatible with v2 which exposed `lomi.`).

## Manual npm publish (emergency only)

Only after the GitHub release assets exist for that version:

```bash
cd apps/cli/npm
npm publish --access public
# Requires: npm login or NODE_AUTH_TOKEN env var
```

## CI

Pull requests touching `apps/cli/**` run `cargo build` + `cargo test` via the `build-cli` job in [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml).
