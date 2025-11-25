/* @proprietary license */

// Sound utilities to globally enable/disable UI sounds with minimal code changes.
// This installs a single runtime gate on HTMLMediaElement.play so existing
// `new Audio(...).play()` calls are respected without per-call changes.

import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@/lib/utils/localStorage';
import { Cookies } from '@/lib/utils/constants';

declare global {
  interface Window {
    __lomiSoundEnabled?: boolean;
    __lomiSoundGateInitialized?: boolean;
    __lomiOriginalMediaPlay?: HTMLMediaElement['play'];
    __lomiSharedClickSound?: HTMLAudioElement;
    __lomiSharedCompletionSound?: HTMLAudioElement;
  }
}

/**
 * Get or create a shared click sound instance to prevent duplicate audio preloading
 */
export const getClickSound = (): HTMLAudioElement | null => {
  if (typeof window === 'undefined') return null;

  if (!window.__lomiSharedClickSound) {
    window.__lomiSharedClickSound = new Audio('/sounds/light.mp3');
    window.__lomiSharedClickSound.volume = 0.2;
  }

  return window.__lomiSharedClickSound;
};

/**
 * Play click sound using the shared audio instance
 */
export const playClickSound = (): void => {
  const audio = getClickSound();
  if (audio && getSoundEnabled()) {
    const originalPlay = window.__lomiOriginalMediaPlay;
    if (typeof originalPlay === 'function') {
      originalPlay.call(audio).catch(() => {});
    } else {
      audio.play().catch(() => {});
    }
  }
};

/**
 * Get or create a shared completion sound instance to prevent duplicate audio preloading
 */
export const getCompletionSound = (): HTMLAudioElement | null => {
  if (typeof window === 'undefined') return null;

  if (!window.__lomiSharedCompletionSound) {
    window.__lomiSharedCompletionSound = new Audio('/sounds/completion.mp3');
    window.__lomiSharedCompletionSound.volume = 0.2;
  }

  return window.__lomiSharedCompletionSound;
};

/**
 * Play completion sound using the shared audio instance
 */
export const playCompletionSound = (): void => {
  const audio = getCompletionSound();
  if (audio && getSoundEnabled()) {
    const originalPlay = window.__lomiOriginalMediaPlay;
    if (typeof originalPlay === 'function') {
      originalPlay.call(audio).catch(() => {});
    } else {
      audio.play().catch(() => {});
    }
  }
};

/**
 * Returns whether sound is currently enabled (defaults to true when unset, but false on mobile).
 */
export const getSoundEnabled = (): boolean => {
  if (typeof window === 'undefined') return true;

  // Disable sound on mobile devices
  if (
    window.innerWidth < 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
  ) {
    return false;
  }

  const raw = getLocalStorageItem(Cookies.SoundEnabled);
  if (raw === null) return true; // Default to true if not set
  return raw === 'true';
};

/**
 * Persists and broadcasts the sound enabled flag.
 */
export const setSoundEnabled = (enabled: boolean): void => {
  if (typeof window === 'undefined') return;

  setLocalStorageItem(Cookies.SoundEnabled, String(enabled));

  window.__lomiSoundEnabled = enabled;
  try {
    window.dispatchEvent(
      new CustomEvent('lomi:sound-changed', { detail: { enabled } }),
    );
  } catch {
    // ignore
  }
};

/**
 * Installs a single, idempotent gate on HTMLMediaElement.play to honor the global mute.
 */
export const initSoundGate = (): void => {
  if (typeof window === 'undefined') return;
  const w = window;
  if (w.__lomiSoundGateInitialized) return;
  w.__lomiSoundGateInitialized = true;

  // Initialize flag from storage once
  w.__lomiSoundEnabled = getSoundEnabled();

  const originalPlay: HTMLMediaElement['play'] =
    HTMLMediaElement.prototype.play;
  w.__lomiOriginalMediaPlay = originalPlay;

  // Patch play to no-op when muted
  HTMLMediaElement.prototype.play = function patchedPlay(
    this: HTMLMediaElement,
    ...args: Parameters<HTMLMediaElement['play']>
  ): ReturnType<HTMLMediaElement['play']> {
    const enabled = w.__lomiSoundEnabled ?? true;
    if (!enabled) {
      // Return a resolved promise to satisfy callers awaiting play()
      return Promise.resolve() as ReturnType<HTMLMediaElement['play']>;
    }
    try {
      return originalPlay.apply(this, args);
    } catch {
      return Promise.resolve() as ReturnType<HTMLMediaElement['play']>;
    }
  };

  // Keep runtime flag in sync across tabs and local changes
  window.addEventListener('storage', (e: StorageEvent) => {
    if (e.key === Cookies.SoundEnabled) {
      w.__lomiSoundEnabled = e.newValue !== 'false';
    }
  });

  window.addEventListener('lomi:sound-changed', (e: Event) => {
    try {
      const detail = (e as CustomEvent).detail;
      w.__lomiSoundEnabled = !!detail?.enabled;
    } catch {
      // ignore
    }
  });
};
