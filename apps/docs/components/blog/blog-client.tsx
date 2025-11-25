/* @proprietary license */

'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Post } from '@/lib/sanity/types';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/contexts/translation-context';
import { t } from '@/lib/i18n/translations';
import Spinner from '@/components/ui/spinner';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogArticleCard } from './blog-article-card';
import { playClickSound } from '@/lib/utils/sound';

export default function BlogClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { currentLanguage } = useTranslation();
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // For Spanish and Chinese, use English for blog display and show all articles
  const displayLanguage =
    currentLanguage === 'es' || currentLanguage === 'zh'
      ? 'en'
      : currentLanguage;

  // Pagination constants
  const POSTS_PER_PAGE = 32; // Show all posts on one page
  const MAX_POSTS = 32; // Show pagination only when we reach 32 posts

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog/posts');

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setPosts(data.posts || []);
        } else {
          throw new Error(data.error || 'Failed to fetch posts');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Show detailed error information
        if (error instanceof Error) {
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
        }
        // Set an empty array to avoid undefined errors
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Check if a post has content in the current language
  const hasLanguageContent = (post: Post) => {
    // For Spanish and Chinese, show all articles (same as English)
    if (currentLanguage === 'es' || currentLanguage === 'zh') return true;

    // For English, always show the post since it's the base language
    if (currentLanguage === 'en') return true;

    // For other languages, check if the languages field includes the current language
    // If the languages field doesn't exist, check if there's content in the current language
    if (!post.languages) {
      if (currentLanguage === 'fr') {
        return !!post.title_fr || !!post.excerpt_fr || !!post.body_fr;
      }
      return false;
    }

    return post.languages.includes(currentLanguage);
  };

  // Filter posts by language and limit to MAX_POSTS
  const filteredPosts = posts
    .filter((post) => hasLanguageContent(post))
    .slice(0, MAX_POSTS);

  // Separate featured and regular posts, with featured posts first
  const featuredPost = filteredPosts.find((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  // Create display posts array with featured first, then regular posts
  const displayPosts = featuredPost
    ? [featuredPost, ...regularPosts]
    : regularPosts;

  // Calculate pagination
  const totalPosts = displayPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = displayPosts.slice(startIndex, endIndex);

  // Reset to page 1 when language changes or posts change
  useEffect(() => {
    setCurrentPage(1);
  }, [currentLanguage, totalPosts]);

  return (
    <section className="w-full py-8 md:py-20 lg:py-24 xl:py-32">
      <div className="max-w-7xl mx-auto pl-2 pr-4 py-2">
        <div className="flex flex-col space-y-6 text-left -mt-4">
          <div className="space-y-4">
            <motion.h1
              className="text-4xl font-normal tracking-tighter text-left text-zinc-800 dark:text-white md:text-5xl max-w-7xl whitespace-pre-line mt-18 md:mt-0"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t('blog.heading', displayLanguage) as string}
            </motion.h1>
            <motion.p
              className="text-gray-500 dark:text-gray-400 text-base leading-relaxed tracking-tight max-w-4xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t('blog.subheading', displayLanguage) as string}
            </motion.p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[50vh] py-20">
              <Spinner />
            </div>
          ) : filteredPosts.length === 0 ? (
            <motion.div
              className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-sm p-8 mb-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">
                {t('blog.noPosts', displayLanguage) as string}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                {t('blog.noPostsDesc', displayLanguage) as string}
              </p>
              <Button
                variant="pink"
                onClick={() => {
                  playClickSound();
                  router.push('/');
                }}
              >
                {t('blog.backHome', displayLanguage) as string}
              </Button>
            </motion.div>
          ) : (
            <div className="mb-0 relative">
              <motion.div
                ref={scrollContainerRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {currentPosts.map((post, index) => {
                  const isFeatured = !!post.featured;
                  const isFirstOnPage = index === 0 && currentPage === 1;

                  return (
                    <BlogArticleCard
                      key={post._id}
                      post={post}
                      isFeatured={isFeatured}
                      isFirstOnPage={isFirstOnPage}
                      hoveredCard={hoveredCard}
                      onHover={setHoveredCard}
                    />
                  );
                })}
              </motion.div>

              {/* Pagination - only show when there are 32 or more posts */}
              {totalPosts >= MAX_POSTS && totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      playClickSound();
                      setCurrentPage((prev) => Math.max(1, prev - 1));
                    }}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {t('blog.previous', displayLanguage) as string}
                  </Button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            playClickSound();
                            setCurrentPage(page);
                          }}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      ),
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      playClickSound();
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                    }}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                  >
                    {t('blog.next', displayLanguage) as string}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
