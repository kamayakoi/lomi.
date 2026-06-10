# Publish @lomi./receipt-pdf to npm

Uses the same `@lomi.` npm organization as `@lomi./sdk`.

## One-time: log in

```bash
cd apps/shared/receipt-pdf
npm login
```

## Publish

```bash
npm run build
npm publish --access public
```

Or:

```bash
npm run publish:npm
```

## After publishing

In checkout and dashboard:

```bash
pnpm install
```

Both apps declare `"@lomi./receipt-pdf": "^0.1.0"`.

## CI

From the lomi. repo: **Actions → Publish SDKs → receipt-pdf**. Requires `NPM_TOKEN` with publish access to `@lomi.`.

## Version bumps

```bash
npm version patch   # 0.1.0 → 0.1.1
npm publish --access public
```
