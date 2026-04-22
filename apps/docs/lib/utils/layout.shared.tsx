/* @proprietary license */

import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Logo } from './logo';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/(docs)/layout.tsx
 */
export const logo = <Logo />;

export const linkItems: BaseLayoutProps['links'] = [];

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: logo,
    },
    // see fumadocs-ui navigation links
    links: linkItems,
  };
}
