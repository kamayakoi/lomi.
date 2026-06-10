# @lomi./receipt-pdf

Shared receipt layout (React) and PDF generation ([@react-pdf/renderer](https://react-pdf.org/)) for lomi. checkout and dashboard.

## Install

```bash
pnpm add @lomi./receipt-pdf
# or
npm install @lomi./receipt-pdf
```

Peer dependency: `react` >= 18.

## Usage

```tsx
import {
  ReceiptLayout,
  buildReceiptDocumentData,
  downloadReceiptPdf,
  renderReceiptPdfBlob,
} from "@lomi./receipt-pdf";
```

## Development

```bash
npm install
npm run build
```

## Publish to npm

Same `@lomi.` scope as `@lomi./sdk`. From this directory:

```bash
npm login
npm run build
npm publish --access public
# or
npm run publish:npm
```

Set `NPM_TOKEN` in CI secrets to run the GitHub Actions publish workflow.

## Local development (before publish)

While working across separate app repos locally, use a file link:

```json
"@lomi./receipt-pdf": "file:../shared/receipt-pdf"
```

Production apps use the published package:

```json
"@lomi./receipt-pdf": "^0.1.0"
```
