/* @proprietary license */

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { urlFor } from '@/lib/sanity/client';
import { useTranslation } from '@/lib/contexts/translation-context';
import { t } from '@/lib/i18n/translations';
import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/lib/sanity/types';
import { playClickSound } from '@/lib/utils/sound';

// Helper function to get category from post
const getPostCategory = (post: Post): string => {
  // First try to get from categories array
  if (
    post.categories &&
    post.categories.length > 0 &&
    post.categories[0]?.slug?.current
  ) {
    return post.categories[0].slug.current;
  }

  // Fallback to legacy category field
  return post.category || 'news';
};

// Function to get category color
const getCategoryColor = (category: string) => {
  if (!category)
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';

  const categoryColorMap: Record<string, string> = {
    news: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    opinion:
      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    edge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    spreadsheets:
      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    'case-study':
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  };

  return (
    categoryColorMap[category] ||
    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  );
};

interface BlogArticleCardProps {
  post: Post;
  isFeatured: boolean;
  isFirstOnPage: boolean;
  hoveredCard: string | null;
  onHover: (id: string | null) => void;
}

export function BlogArticleCard({
  post,
  isFeatured,
  isFirstOnPage,
  hoveredCard,
  onHover,
}: BlogArticleCardProps) {
  const { currentLanguage } = useTranslation();

  // Function to get the localized field based on current language
  const getLocalizedField = (post: Post, field: string, fallback: string) => {
    if (currentLanguage === 'fr' && post[`${field}_fr` as keyof Post]) {
      return post[`${field}_fr` as keyof Post] as string;
    }
    return (post[field as keyof Post] as string) || fallback;
  };

  return (
    <motion.div
      key={post._id}
      className={`w-full ${isFeatured && isFirstOnPage ? 'lg:col-span-2 lg:self-start' : ''}`}
      onMouseEnter={() => onHover(post._id)}
      onMouseLeave={() => onHover(null)}
    >
      <Link
        href={`/blog/${post.slug.current}`}
        className="group flex flex-col h-full"
        onMouseDown={playClickSound}
      >
        <article
          className={`flex flex-col bg-white dark:bg-zinc-900 rounded-sm overflow-hidden shadow-sm hover:shadow-sm transition-all duration-300 border border-zinc-200 dark:border-zinc-800 h-full`}
        >
          {post.image && (
            <div
              className={`overflow-hidden border-b border-zinc-200 dark:border-zinc-800 ${isFeatured && isFirstOnPage ? 'lg:aspect-21/9 aspect-3/2' : 'aspect-3/2'}`}
            >
              <Image
                src={urlFor(post.image).width(320).height(213).url()}
                alt={
                  post.image.alt || getLocalizedField(post, 'title', post.title)
                }
                width={320}
                height={213}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          )}
          <div
            className={`flex flex-col grow bg-card ${isFeatured && isFirstOnPage ? 'lg:px-5 lg:py-[5.5px] lg:pt-4 p-5' : 'p-5'}`}
          >
            <div className="grow flex flex-col">
              {post.author && post.publishedAt && (
                <div
                  className={`flex items-center ${isFeatured && isFirstOnPage ? 'lg:mb-0.5 mb-1' : 'mb-1'}`}
                >
                  <p
                    className={`text-zinc-500 dark:text-zinc-400 ${isFeatured && isFirstOnPage ? 'lg:text-[11px] text-xs' : 'text-xs'}`}
                  >
                    {new Date(post.publishedAt).toLocaleDateString(
                      currentLanguage === 'zh' ? 'zh-CN' : currentLanguage,
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      },
                    )}
                  </p>
                </div>
              )}

              {!post.author && post.publishedAt && (
                <p
                  className={`text-zinc-500 dark:text-zinc-400 ${isFeatured && isFirstOnPage ? 'lg:text-[11px] lg:mb-0.5 text-xs mb-1' : 'text-xs mb-1'}`}
                >
                  {new Date(post.publishedAt).toLocaleDateString(
                    currentLanguage === 'fr'
                      ? 'fr-FR'
                      : currentLanguage === 'es'
                        ? 'es-ES'
                        : currentLanguage === 'zh'
                          ? 'zh-CN'
                          : 'en-US',
                    {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    },
                  )}
                </p>
              )}

              <h2
                className={`font-normal leading-tight text-zinc-900 dark:text-white min-h-fit ${isFeatured && isFirstOnPage ? 'lg:text-base lg:mb-2 text-lg mb-3' : 'text-lg mb-3'}`}
              >
                {getLocalizedField(post, 'title', post.title)}
              </h2>
              <p
                className={`text-zinc-600 dark:text-zinc-400 overflow-hidden line-clamp-2 ${isFeatured && isFirstOnPage ? 'lg:text-xs lg:mb-2.5 text-sm mb-4' : 'text-sm mb-4'}`}
              >
                {getLocalizedField(post, 'excerpt', '')}
              </p>
            </div>
            <div
              className={`mt-auto flex flex-row justify-between items-center ${isFeatured && isFirstOnPage ? 'lg:mb-3' : ''}`}
            >
              <span
                className={`px-2 py-1 text-xs font-normal rounded ${getCategoryColor(getPostCategory(post))}`}
              >
                {
                  t(
                    `blog.categories.${getPostCategory(post)}`,
                    currentLanguage,
                  ) as string
                }
              </span>

              <div className="flex items-center text-primary text-sm font-normal">
                <span
                  className="transition-transform duration-300"
                  style={{
                    transform:
                      hoveredCard === post._id
                        ? 'translateX(-2px)'
                        : 'translateX(0)',
                  }}
                ></span>
                <ArrowRight
                  className={`ml-1 h-4 w-4 transition-all duration-300 ${hoveredCard === post._id ? 'opacity-100 translate-x-1' : 'opacity-0 -translate-x-3'}`}
                />
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
