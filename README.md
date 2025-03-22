<p align="center">
  <a href="https://lomi.africa">
    <img src="apps/website/public/company/women_on_smartphones.webp" width="450" />
  </a>
</p>

<p align="center">
	<img src="apps/website/public/company/transparent.webp" width="120" height="120" alt="lomi. icon">
	<h1 align="center"><b>lomi.</b></h1>
<p align="center">
    Helping West African ventures sell online
    <br />
    <br />
    <a href="https://discord.gg/lomi">Discord</a>
    ·
    <a href="https://lomi.africa">Website</a>
    ·
    <a href="https://github.com/lomiafrica/website/issues">Issues</a>
  </p>
</p>

<hr />
<div align="center">

<a href="https://lomi.africa">Website</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://developers.lomi.africa">Docs</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://developers.lomi.africa/reference/core/overview">API Reference</a>

<p align="center">
  <a href="https://discord.gg/yb4FnBmh">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=lomiafrica">
    <img src="https://img.shields.io/twitter/follow/lomiafrica.svg?label=Follow%20@lomiafrica" alt="Follow @lomiafrica" />
  </a>
</p>

</div>
<hr />

## About lomi.

lomi. is a unified, scalable payment orchestration platform that integrates multiple payment service providers and provides a seamless experience for merchants and end-users across West Africa and beyond. Our platform simplifies payment management while ensuring the highest levels of security, reliability, and compliance.

## Features

**Multiple Payment Providers**: Seamlessly integrate with various payment providers (Wave, MTN, Orange Money, Stripe) through a single API.<br/>
**Multi-Currency Support**: Process transactions in multiple currencies with automatic conversion and settlement.<br/>
**Customizable Checkout**: Create beautiful, branded checkout experiences that work across all devices.<br/>
**Comprehensive Analytics**: Gain valuable insights into your customers payment behavior, conversion rates, and payment trends.<br/>
**Fraud Detection**: Advanced fraud prevention tools to protect your business and customers.<br/>
**Webhook Management**: Real-time notifications for payment events to keep your systems in sync.<br/>
**Secure Tokenization**: Safely store payment details for future transactions without handling sensitive data.<br/>
**Role-Based Access Control**: Manage team permissions with granular control over who can access what.<br/>

## Open Source Roadmap

We are progressively open-sourcing the entire lomi. project:

- **Currently Open Sourcee**:
  - Merchant Dashboard
  - Documentation Website

- **Opening Soon**:
  - Boilerplate Templates (Medusa + Nextjs / Medusa / Vite)
  - Shopify Extension
  - WooCommerce Extension
  - CLI Tool
  - API Libraries
  - Jumbo App (Online IDE)

Everything will be made available in the coming weeks. Stay tuned for updates!

## Repositories

* **[apps/api](./apps/api/README.md)** – Node.js / TypeScript / Express
* **[apps/website](./apps/website/README.md)** (Merchant Dashboard) – Vite / React / TypeScript
* **[apps/developers](./apps/docs/README.md)** – Documentation Website — Nextjs / TypeScrupt

## Core infrastrcuture

- Microservices Architecture
- TypeScript
- Node.js
- Vite
- Nextjs
- React
- Shadcn UI
- Radix UI
- PostgreSQL via Supabase
- Resend
- Upstash (Redis)
- Anthropic
- Infobip
- Tailwind CSS

## Payment infrastructure
- Wave
- Orange
- MTN (in progress)
- Stripe (in progress)

### Local Development
```bash
# Clone the repository
git clone https://github.com/lomiafrica/website.git

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local

# Start the development server
bun run dev
```

## License

This project is dual-licensed:

1. The majority of the codebase is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). This means you can freely use, modify, and distribute this code while ensuring that any modifications you make are also open source.

2. Certain files marked with `/* @proprietary license */` are under lomi.africa's LLC Commercial License. These files require a valid commercial license from lomi. for production use.

See the [LICENSE](https://github.com/lomiafrica/lomi.?tab=License-1-ov-file) file for the complete terms of both licenses.

## Contributing

We welcome contributions to the AGPL-licensed portions of this project! Before contributing, please:

1. Read our [Code of Conduct](https://github.com/lomiafrica/lomi.?tab=coc-ov-file)
2. Review our [Security Policy](https://github.com/lomiafrica/lomi.?tab=security-ov-file)
3. Ensure your contribution doesn't modify files marked with `/* @proprietary license */`

## Contact

For questions or concerns:
- Security issues: Follow our [Security Policy](https://github.com/lomiafrica/lomi.?tab=security-ov-file)
- General inquiries: hello@lomi.africa
- For direct support, email [hello@lomi.africa](mailto:hello@lomi.africa) or join our [Discord](https://discord.gg/yb4FnBmh).