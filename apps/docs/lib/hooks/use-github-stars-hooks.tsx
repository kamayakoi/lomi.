/* @proprietary license */

import { useContext } from 'react';
import { GithubStarsContext } from './use-github-stars';

export function useGithubStars() {
  const context = useContext(GithubStarsContext);
  if (context === undefined) {
    throw new Error('useGithubStars must be used within a GithubStarsProvider');
  }
  return context.stars;
}

export function useGithubStarsLoading() {
  const context = useContext(GithubStarsContext);
  if (context === undefined) {
    throw new Error(
      'useGithubStarsLoading must be used within a GithubStarsProvider',
    );
  }
  return context.isLoading;
}
