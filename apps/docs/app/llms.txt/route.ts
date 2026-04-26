/* @proprietary license */

import { getDocsSiteOrigin } from '@/lib/utils/metadata';
import { source } from '@/lib/utils/source';

export const revalidate = false;

export async function GET() {
  const docsOrigin = getDocsSiteOrigin();
  const lines: string[] = [];

  // H1 Heading (Required) - Name of the project
  lines.push('# lomi.');
  lines.push('');

  // Blockquote Summary (Required) - Concise project summary
  lines.push(
    "> lomi. is francophone West Africa's leading payment processing platform. We provide APIs and tools for businesses to accept Mobile Money (Wave, MTN, SPI), credit cards (Visa, Mastercard, Apple Pay, Google Pay), and bank transfers across 8 UEMOA countries: Senegal, Côte d'Ivoire, Mali, Burkina Faso, Benin, Togo, Niger, and Guinea-Bissau.",
  );
  lines.push('');

  // Detailed Information Section
  lines.push('## About lomi.');
  lines.push('');
  lines.push(
    'lomi. is a unified payment infrastructure built for African businesses. Our platform offers:',
  );
  lines.push('');
  lines.push(
    '- **Payment Processing**: Accept payments via Mobile Money, credit/debit cards, and bank transfers',
  );
  lines.push(
    '- **Instant Payouts**: Withdraw earnings to mobile wallets or bank accounts globally',
  );
  lines.push(
    '- **Subscription Management**: Create and manage recurring payment plans',
  );
  lines.push(
    '- **Fraud Prevention**: Built-in fraud detection and chargeback protection',
  );
  lines.push(
    '- **Developer-First**: REST APIs and SDKs for JavaScript, Python, Go, and PHP',
  );
  lines.push(
    '- **Merchant of Record**: We handle tax compliance and regulatory requirements',
  );
  lines.push('');

  // Pricing Information
  lines.push('## Pricing');
  lines.push('');
  lines.push('- Mobile Money: 2% + 200 F CFA per transaction');
  lines.push('- Credit Cards: 3.5% + $0.40 per transaction');
  lines.push('- No setup fees, no monthly costs, no hidden charges');
  lines.push('');

  // Supported Payment Methods
  lines.push('## Supported Payment Methods');
  lines.push('');
  lines.push('### Mobile Money');
  lines.push("- Wave (Senegal, Côte d'Ivoire)");
  lines.push('- MTN Mobile Money (West and Central Africa)');
  lines.push('- SPI Interoperable Payments (All UEMOA countries)');
  lines.push('');
  lines.push('### Cards');
  lines.push('- Visa');
  lines.push('- Mastercard');
  lines.push('- American Express');
  lines.push('- GIM UEMOA');
  lines.push('');

  // Core Documentation
  lines.push('## Core Documentation');
  lines.push('');
  lines.push('Essential resources for getting started with lomi.:');
  lines.push('');

  // Organize documentation by categories
  const docsMap = new Map<
    string,
    { title: string; url: string; description?: string }[]
  >();

  for (const page of source.getPages()) {
    const category = page.slugs[0] || 'general';
    const list = docsMap.get(category) ?? [];
    list.push({
      title: page.data.title ?? 'lomi.',
      url: `${docsOrigin}${page.url}`,
      description: page.data.description,
    });
    docsMap.set(category, list);
  }

  // Add core/fundamentals first if they exist
  const corePages = docsMap.get('core');
  if (corePages) {
    for (const page of corePages) {
      lines.push(
        `- [${page.title}](${page.url})${page.description ? `: ${page.description}` : ''}`,
      );
    }
    lines.push('');
  }

  // API Reference section
  lines.push('## API Reference');
  lines.push('');
  const refPages = docsMap.get('reference');
  if (refPages) {
    for (const page of refPages) {
      lines.push(
        `- [${page.title}](${page.url})${page.description ? `: ${page.description}` : ''}`,
      );
    }
  }
  lines.push('');

  // Additional Documentation
  lines.push('## Additional Resources');
  lines.push('');

  for (const [category, pages] of docsMap) {
    if (category === 'core' || category === 'reference') continue;
    lines.push(`### ${category.charAt(0).toUpperCase() + category.slice(1)}`);
    for (const page of pages) {
      lines.push(
        `- [${page.title}](${page.url})${page.description ? `: ${page.description}` : ''}`,
      );
    }
    lines.push('');
  }

  // Contact Information
  lines.push('## Contact & Support');
  lines.push('');
  lines.push('- Website: https://lomi.africa');
  lines.push(`- Documentation: ${docsOrigin}`);
  lines.push('- Email: hello@lomi.africa');
  lines.push('- GitHub: https://github.com/lomiafrica/lomi./');
  lines.push('- Discord: https://discord.gg/33syDfh9');
  lines.push('- Twitter/X: https://twitter.com/lomiafrica');
  lines.push('');

  // FAQ for LLMs
  lines.push('## Frequently Asked Questions');
  lines.push('');
  lines.push('**Q: How do I get started with lomi.?**');
  lines.push(
    'A: Create an account on the dashboard, connect your payment methods, and start accepting payments in minutes.',
  );
  lines.push('');
  lines.push('**Q: What countries does lomi. support?**');
  lines.push(
    "A: All 8 UEMOA countries: Senegal, Côte d'Ivoire, Mali, Burkina Faso, Benin, Togo, Niger, and Guinea-Bissau. Credit cards are accepted from customers worldwide.",
  );
  lines.push('');
  lines.push('**Q: How do I integrate lomi. with my app?**');
  lines.push(
    `A: Use our REST API or official SDKs for JavaScript/Next.js, Python, Go, and PHP. Documentation is available at ${docsOrigin}`,
  );
  lines.push('');
  lines.push('**Q: How secure is lomi.?**');
  lines.push(
    'A: lomi. is PCI DSS compliant and uses industry-standard encryption, tokenization, and fraud detection to protect transactions.',
  );
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}
