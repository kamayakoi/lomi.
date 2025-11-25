'use client';

import { toast as sonnerToast } from 'sonner';

interface ToastOptions {
  type?: 'success' | 'error' | 'info' | 'default';
  description: string;
}

export function toast({ type = 'info', description }: ToastOptions) {
  const isDark = document.documentElement.classList.contains('dark');

  switch (type) {
    case 'success':
      sonnerToast.success(description, {
        style: isDark
          ? {
              background: '#1a2e1f',
              color: '#86efac',
              border: '1px solid rgba(22, 101, 52, 0.3)',
              // borderRadius: "0.25rem",
            }
          : {
              background: '#dcfce7',
              color: '#166534',
              border: '1px solid rgba(187, 247, 208, 0.4)',
              // borderRadius: "0.25rem",
            },
      });
      break;
    case 'error':
      sonnerToast.error(description, {
        style: isDark
          ? {
              background: '#2d1a2d',
              color: '#f9a8d4',
              border: '1px solid rgba(190, 24, 93, 0.2)',
              // borderRadius: "0.25rem",
            }
          : {
              background: '#fce7f3',
              color: '#be185d',
              border: '1px solid rgba(249, 168, 212, 0.3)',
              // borderRadius: "0.25rem",
            },
      });
      break;
    case 'info':
      sonnerToast.info(description, {
        style: isDark
          ? {
              background: '#1e2d33',
              color: '#67e8f9',
              border: '1px solid rgba(14, 116, 144, 0.2)',
              // borderRadius: "0.25rem",
            }
          : {
              background: '#cffafe',
              color: '#0e7490',
              border: '1px solid rgba(165, 243, 252, 0.3)',
              // borderRadius: "0.25rem",
            },
      });
      break;
    default:
      sonnerToast(description, {
        style: isDark
          ? {
              background: '#242424',
              color: '#f1f5f9',
              border: '1px solid #1f1f1f',
              // borderRadius: "0.25rem",
            }
          : {
              background: '#f8fafc',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
              // borderRadius: "0.25rem",
            },
      });
  }
}
