/* @proprietary license */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import type { Post } from '@/lib/sanity/types';
import { urlFor } from '@/lib/sanity/client';
import { motion } from 'framer-motion';
import type { PortableTextBlock } from '@portabletext/types';
import { useTranslation } from '@/lib/contexts/translation-context';
import { t } from '@/lib/i18n/translations';
import Spinner from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { ShareModal } from '@/components/blog/share-modal';
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

interface BlogPostClientProps {
  slug: string;
}

export default function BlogPostClient({ slug }: BlogPostClientProps) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { currentLanguage } = useTranslation();

  // Added useEffect for glitch CSS
  useEffect(() => {
    if (!post && !loading) {
      // Only add styles if the post is not found (and not loading)
      const style = document.createElement('style');
      style.id = 'glitch-style'; // Add an ID for easier removal
      style.textContent = `
        .glitch-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          /* Removed fixed background color to allow theme background */
        }

          .glitch-text {
            font-size: 72px; /* Slightly smaller for blog context */
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          font-weight: 400;
          letter-spacing: -5px; /* Adjusted spacing */
          animation: glitch 1s linear infinite;
          position: relative;
          color: var(--foreground); /* Use theme color */
        }

        @keyframes glitch {
          2%,64% { transform: translate(2px,0) skew(0deg); }
          4%,60% { transform: translate(-2px,0) skew(0deg); }
          62% { transform: translate(0,0) skew(5deg); }
        }

        .glitch-text:before,
        .glitch-text:after {
          content: attr(title);
          position: absolute;
          left: 0;
          right: 0; /* Ensure centering */
          color: var(--foreground); /* Use theme color */
        }

        .glitch-text:before {
          animation: glitchTop 1s linear infinite;
          clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
          -webkit-clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
        }

        @keyframes glitchTop {
          2%,64% { transform: translate(2px,-2px); }
          4%,60% { transform: translate(-2px,2px); }
          62% { transform: translate(13px,-1px) skew(-13deg); }
        }

        .glitch-text:after {
          animation: glitchBotom 1.5s linear infinite;
          clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
          -webkit-clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
        }

        @keyframes glitchBotom {
          2%,64% { transform: translate(-2px,0); }
          4%,60% { transform: translate(-2px,0); }
          62% { transform: translate(-22px,5px) skew(21deg); }
        }

        .button-container {
          position: relative;
          z-index: 10; /* Lower z-index might be needed */
          pointer-events: auto;
        }

        .button-container button,
        .button-container a {
          pointer-events: auto;
          touch-action: manipulation;
        }
      `;
      document.head.appendChild(style);

      return () => {
        const styleElement = document.getElementById('glitch-style');
        if (styleElement) {
          document.head.removeChild(styleElement);
        }
      };
    }
    return undefined; // Explicitly return undefined for the other code path
  }, [post, loading]); // Rerun effect if post or loading state changes

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        router.push('/blog');
        return;
      }

      try {
        const response = await fetch(`/api/blog/post/${slug}`);

        if (!response.ok) {
          if (response.status === 404) {
            router.push('/blog');
            return;
          }
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.post) {
          const fetchedPost = data.post;

          const bodyKey =
            currentLanguage !== 'en' ? `body_${currentLanguage}` : 'body';
          const bodyContent = fetchedPost[bodyKey as keyof typeof fetchedPost];
          if (Array.isArray(bodyContent)) {
            console.log(
              `Body structure for ${bodyKey}:`,
              bodyContent.slice(0, 3),
            );
          } else {
            console.log(
              `Body structure for ${bodyKey}: not an array or undefined`,
            );
          }

          setPost(fetchedPost);
        } else {
          throw new Error(data.error || 'Failed to fetch post');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        router.push('/blog');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, router, currentLanguage]);

  // Function to get the localized field based on current language
  const getLocalizedField = (field: string, fallback: string): string => {
    if (!post) return fallback;

    // Check for localized field based on current language
    const localizedFieldKey = `${field}_${currentLanguage}` as keyof Post;
    if (currentLanguage !== 'en' && post[localizedFieldKey]) {
      return (post[localizedFieldKey] as string) || fallback;
    }
    return (post[field as keyof Post] as string) || fallback;
  };

  // Check if post has content in the current language
  const hasLanguageContent = () => {
    if (!post) return false;
    if (currentLanguage === 'en') return true; // English is always available as the base language
    if (['fr'].includes(currentLanguage)) {
      return post.languages?.includes(currentLanguage) || false;
    }
    return false;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] grow py-0">
        <Spinner />
      </div>
    );
  }

  if (!post || !hasLanguageContent()) {
    // Modified Not Found Block - now matches blog-client.tsx styling
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-20">
        <motion.div
          className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-sm p-8 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">
            {t('blog.notFound', currentLanguage) as string}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            {t('blog.notFoundDesc', currentLanguage) as string}
          </p>
          <Button
            variant="pink"
            onClick={() => {
              playClickSound();
              router.push('/blog');
            }}
          >
            {t('blog.backToBlog', currentLanguage) as string}
          </Button>
        </motion.div>
      </div>
    );
  }

  // Get the appropriate content based on the current language
  const title = getLocalizedField('title', post.title);

  // Get localized body content with better fallback and debugging
  let body = post.body; // Default to English body
  if (currentLanguage !== 'en') {
    const localizedBodyKey = `body_${currentLanguage}` as keyof Post;
    const localizedBody = post[localizedBodyKey] as
      | PortableTextBlock[]
      | undefined;

    // Check if localized body exists and has content
    if (localizedBody && localizedBody.length > 0) {
      body = localizedBody;
    }
  }

  const postUrl = window.location.href;

  return (
    <>
      <div className="max-w-7xl mx-auto pl-2 pr-4 py-2">
        <div className="mb-0 mt-27">
          <div className="relative mb-6 flex flex-col md:block">
            <div className="md:absolute md:left-0 md:top-2 md:w-[175px] md:-translate-x-full md:pr-8 shrink-0 mb-6 md:mb-0 flex flex-col items-start md:items-end gap-2"></div>
            <div className="space-y-4">
              <motion.h1
                className="text-4xl font-normal tracking-tighter text-left text-zinc-800 dark:text-white md:text-5xl max-w-7xl whitespace-pre-line -mt-11 md:mt-0"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {title}
              </motion.h1>
              {/* Display localized excerpt if available */}
              {post.excerpt && (
                <motion.p
                  className="text-gray-500 dark:text-gray-400 text-base leading-relaxed tracking-tight max-w-7xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {getLocalizedField('excerpt', post.excerpt)}
                </motion.p>
              )}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <article className="max-w-none mx-auto pb-16 sm: -pb-100">
            <header className="mb-6">
              <div className="flex flex-wrap items-center text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                {post.author && (
                  <div className="flex items-center mr-6 mb-2">
                    {post.author.image && (
                      <div className="w-8 h-8 overflow-hidden mr-2 rounded-sm">
                        <Image
                          src={urlFor(post.author.image)
                            .width(100)
                            .height(100)
                            .url()}
                          alt={post.author.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <span>
                      {
                        t('blog.byAuthor', currentLanguage, {
                          author: post.author.name,
                        }) as string
                      }
                    </span>
                  </div>
                )}

                {post.author && post.publishedAt && (
                  <span className="mx-2 mb-2 -ml-4">|</span>
                )}

                <div className="mb-2 flex items-center flex-wrap">
                  {post.publishedAt && (
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString(
                        currentLanguage === 'zh' ? 'zh-CN' : currentLanguage,
                        { year: 'numeric', month: 'long', day: 'numeric' },
                      )}
                    </span>
                  )}

                  {post.publishedAt && <span className="mx-2">|</span>}

                  <span
                    className={`px-3 py-1 text-xs rounded ${getCategoryColor(getPostCategory(post))}`}
                  >
                    {
                      t(
                        `blog.categories.${getPostCategory(post)}`,
                        currentLanguage,
                      ) as string
                    }
                  </span>

                  <div className="hidden md:flex items-center gap-2 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        playClickSound();
                        setIsShareModalOpen(true);
                      }}
                      className="text-zinc-600 dark:text-zinc-400 inline-flex items-center justify-center h-6 w-6 p-1 rounded-sm border border-transparent transition-colors duration-150 hover:bg-blue-400/10 dark:hover:bg-blue-400/20 hover:text-blue-500 dark:hover:text-blue-400 hover:border-blue-500/20 dark:hover:border-blue-400/30"
                      aria-label={
                        t('blog.shareTitle', currentLanguage) as string
                      }
                    >
                      <Share2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {post.image && (
                <div className="rounded-sm overflow-hidden mb-6 shadow-sm">
                  <div className="aspect-video md:aspect-video relative">
                    <Image
                      src={urlFor(post.image, {
                        width: 1200,
                        height: 675,
                        quality: 90,
                      }).url()}
                      alt={post.image.alt || title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  {post.image.caption && (
                    <div className="text-[9px] sm:text-[9px] text-zinc-500 dark:text-zinc-400 mt-1 italic px-2 md:text-right text-right border-b-transparent border-transparent dark:border-transparent pb-0 sm:border-b-transparent sm:pb-0">
                      {post.image.caption}
                    </div>
                  )}
                </div>
              )}

              {!post.image && post.mainImage && (
                <div className="rounded-sm overflow-hidden mb-6 shadow-sm">
                  <div className="aspect-video md:aspect-video relative">
                    <Image
                      src={urlFor(post.mainImage, {
                        width: 1200,
                        height: 675,
                        quality: 90,
                      }).url()}
                      alt={post.mainImage.alt || title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  {post.mainImage.caption && (
                    <div className="text-[9px] text-zinc-500 dark:text-zinc-400 mt-2 italic px-2 md:text-right text-right border-b-transparent border-transparent dark:border-transparent pb-0 sm:border-b-transparent sm:pb-0">
                      {post.mainImage.caption}
                    </div>
                  )}
                </div>
              )}
            </header>

            <div
              className="prose prose-zinc dark:prose-invert
                            prose-headings:font-semibold
                            prose-h1:text-3xl prose-h1:font-semibold prose-h1:mb-6
                            prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4
                            prose-h3:text-xl prose-h3:font-normal prose-h3:mt-6 prose-h3:mb-3
                            prose-h4:text-lg prose-h4:font-normal prose-h4:mt-4 prose-h4:mb-2
                            prose-p:text-base prose-p:leading-relaxed prose-p:my-4
                            prose-ul:my-4 prose-ul:list-disc prose-ul:pl-5
                            prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-5
                            prose-li:my-2 prose-li:pl-1
                            prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-zinc-600 dark:prose-blockquote:text-zinc-300
                            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                            prose-img:rounded-sm prose-img:shadow-sm prose-img:max-w-full prose-img:mx-auto
                            prose-strong:font-semibold prose-strong:text-zinc-900 dark:prose-strong:text-white
                            prose-em:italic
                            prose-code:bg-zinc-100 prose-code:text-zinc-800 dark:prose-code:bg-zinc-800 dark:prose-code:text-zinc-200 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                            prose-pre:bg-zinc-100 dark:prose-pre:bg-zinc-800 prose-pre:p-4 prose-pre:rounded-sm prose-pre:overflow-x-auto
                            max-w-none mx-auto px-0 sm:px-2 md:px-0"
            >
              <PortableText
                value={body}
                components={{
                  list: {
                    // Added explicit list renderers for better control
                    bullet: ({ children }) => (
                      <ul className="list-disc pl-5 my-6 space-y-2 text-zinc-800 dark:text-zinc-300">
                        {children}
                      </ul>
                    ),
                    number: ({ children }) => (
                      <ol className="list-decimal pl-5 my-6 space-y-2 text-zinc-800 dark:text-zinc-300">
                        {children}
                      </ol>
                    ),
                  },
                  listItem: {
                    // Explicitly handle list items for consistency
                    bullet: ({ children }) => (
                      <li className="pl-1 my-2">{children}</li>
                    ),
                    number: ({ children }) => (
                      <li className="pl-1 my-2">{children}</li>
                    ),
                  },
                  types: {
                    image: ({ value }) => {
                      if (!value?.asset?._ref) {
                        return null;
                      }
                      return (
                        <figure className="my-8">
                          <div className="aspect-video md:aspect-video relative rounded-sm shadow-sm overflow-hidden">
                            <Image
                              src={urlFor(value, {
                                width: 1200,
                                quality: 85,
                              }).url()}
                              alt={value.alt || title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          {value.caption && (
                            <figcaption className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 italic px-2 md:text-center text-right border-b border-zinc-200 dark:border-zinc-800 pb-2 sm:border-b-0 sm:pb-0">
                              {value.caption}
                            </figcaption>
                          )}
                        </figure>
                      );
                    },
                    codeBlock: ({ value }) => (
                      <div className="bg-zinc-100 dark:bg-zinc-800 rounded-sm p-4 my-6 overflow-x-auto border border-zinc-200 dark:border-zinc-700 shadow-sm">
                        <pre className="text-sm font-mono">{value.code}</pre>
                      </div>
                    ),
                    infoBlock: ({ value }) => (
                      <div className="flex rounded-sm border border-blue-200 bg-blue-50 dark:border-blue-200/30 dark:bg-blue-950/30 p-4 my-6">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 shrink-0 mt-1 text-blue-600 dark:text-blue-400"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 16v-4" />
                          <path d="M12 8h.01" />
                        </svg>
                        <div className="ml-3 flex-1">
                          <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">
                            {value.title || 'Information'}
                          </h4>
                          <div className="text-[14px] leading-relaxed text-blue-700 dark:text-blue-300">
                            {value.text}
                          </div>
                        </div>
                      </div>
                    ),
                    warningBlock: ({ value }) => (
                      <div className="flex rounded-sm border border-yellow-200 bg-yellow-50 dark:border-yellow-200/30 dark:bg-yellow-950/30 p-4 my-6">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 shrink-0 mt-1 text-yellow-600 dark:text-yellow-400"
                        >
                          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                          <path d="M12 9v4" />
                          <path d="M12 17h.01" />
                        </svg>
                        <div className="ml-3 flex-1">
                          <h4 className="font-semibold mb-2 text-yellow-600 dark:text-yellow-400">
                            {value.title || 'Warning'}
                          </h4>
                          <div className="text-[14px] leading-relaxed text-yellow-700 dark:text-yellow-300">
                            {value.text}
                          </div>
                        </div>
                      </div>
                    ),
                    table: ({ value }) => (
                      <div className="overflow-x-auto my-8 rounded-sm border border-zinc-200 dark:border-zinc-700 shadow-sm">
                        <table className="w-full border-collapse">
                          <thead className="bg-zinc-100 dark:bg-zinc-800">
                            <tr>
                              {value.rows[0].cells.map(
                                (cell: string, i: number) => (
                                  <th
                                    key={i}
                                    className="border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-left font-semibold"
                                  >
                                    {cell}
                                  </th>
                                ),
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {value.rows
                              .slice(1)
                              .map((row: { cells: string[] }, i: number) => (
                                <tr
                                  key={i}
                                  className={
                                    i % 2 === 0
                                      ? 'bg-white dark:bg-zinc-900'
                                      : 'bg-zinc-50 dark:bg-zinc-800/50'
                                  }
                                >
                                  {row.cells.map((cell: string, j: number) => (
                                    <td
                                      key={j}
                                      className="border border-zinc-300 dark:border-zinc-700 px-4 py-2"
                                    >
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ),
                    // Adding custom callout component for additional customization
                    callout: ({ value }) => (
                      <div className="my-6 p-4 border-l-4 border-zinc-400 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800/50 rounded-r-sm">
                        <div className="font-normal mb-2">
                          {value.title || 'Note'}
                        </div>
                        <div className="text-zinc-700 dark:text-zinc-300">
                          {value.text}
                        </div>
                      </div>
                    ),
                  },
                  marks: {
                    link: ({ value, children }) => {
                      const target = (value?.href || '').startsWith('http')
                        ? '_blank'
                        : undefined;
                      return (
                        <a
                          href={value?.href}
                          target={target}
                          rel={
                            target === '_blank'
                              ? 'noopener noreferrer'
                              : undefined
                          }
                          className="text-primary hover:underline transition-colors"
                        >
                          {children}
                        </a>
                      );
                    },
                    highlight: ({ children }) => (
                      <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-1 py-0.5 rounded">
                        {children}
                      </span>
                    ),
                    button: ({ value, children }) => (
                      <a
                        href={value?.url}
                        className="inline-block px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary/90 transition-colors my-2 font-normal shadow-sm"
                      >
                        {children}
                      </a>
                    ),
                    // Adding underline mark for additional customization
                    underline: ({ children }) => (
                      <span className="underline underline-offset-2 decoration-1">
                        {children}
                      </span>
                    ),
                    // Adding strikethrough mark for additional customization
                    strike: ({ children }) => (
                      <span className="line-through">{children}</span>
                    ),
                  },
                  block: {
                    normal: ({ children }) => (
                      <p className="text-base text-zinc-800 dark:text-zinc-300 leading-relaxed my-4">
                        {children}
                      </p>
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white mt-8 mb-4">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-8 mb-4">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-normal text-zinc-900 dark:text-white mt-6 mb-3">
                        {children}
                      </h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="text-lg font-normal text-zinc-900 dark:text-white mt-4 mb-2">
                        {children}
                      </h4>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary/30 pl-4 italic text-zinc-700 dark:text-zinc-300 my-6 py-1 bg-zinc-50 dark:bg-zinc-800/50 rounded-r-sm">
                        {children}
                      </blockquote>
                    ),
                    customList: ({ children }) => (
                      <ul className="list-disc pl-5 my-4 text-zinc-800 dark:text-zinc-300 space-y-2">
                        {children}
                      </ul>
                    ),
                    // Updated lead paragraph to be lighter with font-light instead of changing color
                    lead: ({ children }) => (
                      <p className="text-xl font-light text-zinc-800 dark:text-zinc-200 leading-relaxed my-6">
                        {children}
                      </p>
                    ),
                  },
                }}
              />
            </div>
          </article>
        </motion.div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={postUrl}
        title={title}
      />
    </>
  );
}
