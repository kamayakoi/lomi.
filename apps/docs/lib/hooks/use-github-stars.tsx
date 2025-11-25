/* @proprietary license */

'use client';

import React, { createContext, useState, useEffect } from 'react';

interface GithubStarsContextType {
  stars: number | null;
  isLoading: boolean;
}

export const GithubStarsContext = createContext<
  GithubStarsContextType | undefined
>(undefined);

let cachedStars: number | null = null;
let isLoading = false;
let hasFetched = false;

const fetchStarsOnce = async (): Promise<number | null> => {
  if (hasFetched) return cachedStars;
  if (isLoading) return null;

  hasFetched = true;
  isLoading = true;

  try {
    const response = await fetch(
      'https://api.github.com/repos/lomiafrica/lomi.',
    );
    if (response.ok) {
      const data = await response.json();
      cachedStars = data.stargazers_count;
      return cachedStars;
    }
  } catch (error) {
    console.error('Failed to fetch GitHub star count:', error);
  } finally {
    isLoading = false;
  }
  return null;
};

export function GithubStarsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stars, setStars] = useState<number | null>(cachedStars);
  const [isLoading, setIsLoading] = useState(!hasFetched);

  useEffect(() => {
    // Only fetch once when the provider mounts
    if (!hasFetched) {
      fetchStarsOnce().then((result) => {
        setStars(result);
        setIsLoading(false);
      });
    }
  }, []);

  return (
    <GithubStarsContext.Provider value={{ stars, isLoading }}>
      {children}
    </GithubStarsContext.Provider>
  );
}
