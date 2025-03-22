<p align="center">
	<img src="https://res.cloudinary.com/dzrdlevfn/image/upload/v1742679490/lomi_icon_gtyyix.webp" width="120" height="120" alt="lomi. icon">
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
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://lomi.africa/blog">Blog</a>

<p align="center">
  <a href="https://discord.gg/yb4FnBmh">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=lomiafrica">
    <img src="https://img.shields.io/twitter/follow/lomiafrica.svg?label=Follow%20@lomiafrica" alt="Follow @lomiafrica" />
  </a>
  <a href="https://www.linkedin.com/company/lomiafri">
    <img src="https://img.shields.io/badge/LinkedIn-lomiafrica-blue?style=flat&logo=linkedin" alt="lomi. LinkedIn" />
  </a>
</p>

<p align="center">
  <a href="https://www.producthunt.com/posts/lomi?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-lomi" target="_blank">
    <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=720260&theme=light&t=1736800231403" 
    alt="lomi. - Simplifying payments across francophone West Africa | Product Hunt"
    width="250" height="54" />
  </a>
</p>

</div>
<hr />

## About lomi.

lomi. is a unified, scalable payment orchestration platform that integrates multiple payment service providers and provides a seamless experience for merchants and end-users across West Africa and beyond. Our platform simplifies payment management while ensuring the highest levels of security, reliability, and compliance.

## Features

<div align="left">
  <p>
    <strong>🔌 Multiple Payment Providers</strong><br/>
    Seamlessly integrate with various payment providers (Wave, MTN, Orange Money, Stripe) through a single API.
  </p>
  
  <p>
    <strong>💱 Multi-Currency Support</strong><br/>
    Process transactions in multiple currencies with automatic conversion and settlement.
  </p>
  
  <p>
    <strong>🎨 Customizable Checkout</strong><br/>
    Create beautiful, branded checkout experiences that work across all devices.
  </p>
  
  <p>
    <strong>👤 End-Customer Portal</strong><br/>
    Provide customers with a self-service portal to manage their payment methods, view transaction history, request refunds, update subscription and account details.
  </p>
  
  <p>
    <strong>📊 Comprehensive Analytics</strong><br/>
    Gain valuable insights into your customers payment behavior, conversion rates, and payment trends.
  </p>
  
  <p>
    <strong>🛡️ Fraud Detection</strong><br/>
    Advanced fraud prevention tools to protect your business and customers.
  </p>
  
  <p>
    <strong>🔔 Webhook Management</strong><br/>
    Real-time notifications for payment events to keep your systems in sync.
  </p>
  
  <p>
    <strong>🔒 Secure Tokenization</strong><br/>
    Safely store payment details for future transactions without handling sensitive data.
  </p>
  
  <p>
    <strong>👥 Role-Based Access Control</strong><br/>
    Manage team permissions with granular control over who can access what.
  </p>
</div>

## Why lomi.?

<div align="left">
  <p>
    <strong>🌍 Built for West Africa</strong><br/>
    Specifically designed to address the unique challenges of payment processing in francophone West Africa.
  </p>
  
  <p>
    <strong>🔄 Single Integration</strong><br/>
    Integrate once to access multiple payment providers instead of managing separate integrations.
  </p>
  
  <p>
    <strong>💻 Open Source</strong><br/>
    Transparent, community-driven development with the option to self-host or use our managed service.
  </p>
  
  <p>
    <strong>🚀 Developer-First</strong><br/>
    Comprehensive documentation, SDKs, and tools built with developers and non-developers experience in mind.
  </p>
</div>

## Open Source Roadmap

We are progressively open-sourcing the entire lomi. project:

- **Currently Open Source**:
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

## Repository Structure

* **[apps/api](./apps/api/README.md)** – Node.js / TypeScript / Express
* **[apps/website](./apps/website/README.md)** – Merchant Dashboard – Vite / React / TypeScript
* **[apps/developers](./apps/docs/README.md)** – Documentation Website – Nextjs / TypeScript

## Core Infrastructure

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

## Payment Infrastructure
- Wave
- Orange Money
- MTN (in progress)
- Stripe (in progress)
- More coming soon!

## Quick Start

### Prerequisites
- Node.js 18+
- Bun
- Supabase

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

## Documentation

For comprehensive documentation, visit [developers.lomi.africa](https://developers.lomi.africa)

## Use Cases

- **E-commerce and SaaS**: Accept payments on your website, application or online store with a customized checkout experience
- **Subscription services**: Manage recurring payments with automated billing
- **Mobile apps**: Integrate payment capabilities into your iOS and Android applications

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

## Community & Support

- **Discord**: Join our [community Discord](https://discord.gg/yb4FnBmh) for discussions and help
- **Twitter**: Follow [@lomiafrica](https://twitter.com/lomiafrica) for updates
- **GitHub**: Submit [issues](https://github.com/lomiafrica/lomi./issues) for bug reports and feature requests
- **Email**: Contact [hello@lomi.africa](mailto:hello@lomi.africa) for direct support

## Security

- For security vulnerabilities, please follow our [Security Policy](https://github.com/lomiafrica/lomi.?tab=security-ov-file)
- Kindly do not report security vulnerabilities through public GitHub issues