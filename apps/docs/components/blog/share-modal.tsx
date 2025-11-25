/* @proprietary license */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  XIcon as TwitterIcon,
  FacebookIcon,
  WhatsappIcon,
  LinkedInIcon,
} from '@/components/preview/icons';
import { Send as Telegram, Mail, Copy, Check } from 'lucide-react';
import { useTranslation } from '@/lib/contexts/translation-context';
import { t } from '@/lib/i18n/translations';
import { toast } from '@/components/ui/toast';
import { playCompletionSound } from '@/lib/utils/sound';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export function ShareModal({ isOpen, onClose, url, title }: ShareModalProps) {
  const { currentLanguage } = useTranslation();
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const openMailto = (to: string, subject: string, body: string) => {
    const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  const baseButtonClasses =
    'flex items-center justify-start gap-2 text-left h-8 rounded-[4px] text-white transition-colors duration-200 border-0';

  const shareOptions = [
    {
      name: 'X',
      icon: <TwitterIcon className="h-3.5 w-3.5" />,
      url: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      className: `${baseButtonClasses} bg-black hover:bg-zinc-800 dark:bg-black dark:text-white dark:hover:bg-black`,
    },
    {
      name: 'LinkedIn',
      icon: <LinkedInIcon className="h-3.5 w-3.5" />,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      className: `${baseButtonClasses} bg-[#0077B5] hover:bg-[#005885] dark:bg-[#0077B5] dark:hover:bg-[#0099D4]`,
    },
    {
      name: 'Facebook',
      icon: <FacebookIcon className="h-3.5 w-3.5" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      className: `${baseButtonClasses} bg-[#1877F2] hover:bg-[#166FE5] dark:bg-[#1877F2] dark:hover:bg-[#3B82F6]`,
    },
    {
      name: 'WhatsApp',
      icon: <WhatsappIcon className="h-3.5 w-3.5" />,
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      className: `${baseButtonClasses} bg-[#128C7E] hover:bg-[#075E54] dark:bg-[#128C7E] dark:hover:bg-[#075E54]`,
    },
    {
      name: 'Telegram',
      icon: <Telegram className="h-3.5 w-3.5" />,
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      className: `${baseButtonClasses} bg-[#26A5E4] hover:bg-[#1E88C8] dark:bg-[#26A5E4] dark:hover:bg-[#3BADEF]`,
    },
    {
      name: 'Email',
      icon: <Mail className="h-3.5 w-3.5" />,
      onClick: () => openMailto('', title, `Check out this article: ${url}`),
      className: `${baseButtonClasses} bg-gray-500 hover:bg-gray-600 dark:bg-zinc-700 dark:hover:bg-zinc-900`,
    },
  ];

  const handleCopy = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        toast({
          type: 'success',
          description: `${t('blog.copiedDesc', currentLanguage) as string}`,
        });
        playCompletionSound();
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        toast({
          type: 'error',
          description: `${t('blog.copyErrorTitle', currentLanguage) as string}: ${t('blog.copyErrorDesc', currentLanguage) as string}`,
        });
      });
  };

  React.useEffect(() => {
    if (!isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-[425px] p-4 rounded-[4px] border border-border/40 bg-background backdrop-blur-sm"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogDescription>
            {t('blog.shareDescription', currentLanguage) as string}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2 py-2">
          {shareOptions.map((option) =>
            option.onClick ? (
              <Button
                key={option.name}
                variant="secondary"
                className={option.className}
                onClick={option.onClick} // Use onClick handler
              >
                {option.icon}
                <span>{option.name}</span>
              </Button>
            ) : (
              <Button
                key={option.name}
                variant="secondary"
                className={option.className}
                asChild
              >
                <a href={option.url} target="_blank" rel="noopener noreferrer">
                  {option.icon}
                  <span>{option.name}</span>
                </a>
              </Button>
            ),
          )}
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 -mt-2">
          <div className="flex items-center space-x-2 flex-1">
            <Input
              id="link"
              value={url}
              readOnly
              inputSize="header"
              className="flex-1 rounded-[4px]"
            />
            <Button
              type="button"
              size="small"
              variant="outline"
              onClick={handleCopy}
              className="rounded-[4px] hover:bg-accent/30"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
              <span className="sr-only">
                {copied
                  ? (t('blog.copied', currentLanguage) as string)
                  : (t('blog.copyLink', currentLanguage) as string)}
              </span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
