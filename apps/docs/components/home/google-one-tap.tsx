/* @proprietary license */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

interface GooglePromptNotification {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
  isDismissedMoment: () => boolean;
  getNotDisplayedReason?: () => string;
  getSkippedReason?: () => string;
  getDismissedReason?: () => string;
}

interface DecodedJwtPayload {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  email: string;
  email_verified: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            context: string;
            ux_mode: string;
            auto_select: boolean;
            cancel_on_tap_outside: boolean;
          }) => void;
          prompt: (
            callback?: (notification: GooglePromptNotification) => void,
          ) => void;
        };
      };
    };
  }
}

export function GoogleOneTap() {
  const router = useRouter();
  const supabase = createClient();
  const hasInitialized = useRef(false);

  const handleCredentialResponse = useCallback(
    async (response: GoogleCredentialResponse) => {
      try {
        // Decode the JWT to get user info
        const decodedToken = decodeJwtResponse(response.credential);
        const userInfo = {
          email: decodedToken.email,
          fullName: decodedToken.name,
          firstName: decodedToken.given_name,
          lastName: decodedToken.family_name,
          picture: decodedToken.picture,
        };

        // Sign in with Supabase using the Google JWT
        // This will automatically create an account if one doesn't exist
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: response.credential,
        });

        if (error) {
          console.error('Error with Google One Tap authentication:', error);
          return;
        }

        if (data.user) {
          // Update user metadata with full name if this is a new user
          if (data.user.user_metadata?.full_name !== userInfo.fullName) {
            await supabase.auth.updateUser({
              data: {
                full_name: userInfo.fullName,
                first_name: userInfo.firstName,
                last_name: userInfo.lastName,
                avatar_url: userInfo.picture,
              },
            });
          }

          // Track One Tap usage (optional - separate from dashboard OAuth tracking)
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('last_auth_method', 'google_one_tap');
              localStorage.setItem(
                'last_auth_timestamp',
                Date.now().toString(),
              );
            } catch (storageError) {
              // Ignore localStorage errors
              console.warn('Could not track One Tap usage:', storageError);
            }
          }

          // Redirect to dashboard on successful authentication
          router.push('https://dashboard.lomi.africa/');
        }
      } catch (authError) {
        console.error('Error handling Google One Tap response:', authError);
      }
    },
    [router, supabase],
  );

  useEffect(() => {
    // Prevent multiple initializations
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Add global error handler for FedCM errors
    const handleFedCMError = (event: ErrorEvent) => {
      if (event.message && event.message.includes('FedCM')) {
        console.warn('FedCM error caught globally:', event.message);
        // Optionally disable One Tap for this session
        // You could set a flag to prevent future One Tap attempts
      }
    };

    window.addEventListener('error', handleFedCMError);

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onerror = () => {
      console.error('Failed to load Google Identity Services script');
    };

    script.onload = () => {
      // Initialize Google Identity Services
      if (window.google) {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

        if (!clientId) {
          console.error(
            'Google Client ID not found. Please check your environment variables.',
          );
          return;
        }

        // Add error handling for Google Identity Services
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            context: 'signin',
            ux_mode: 'popup',
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          // Display One Tap with moment callback for better UX
          window.google.accounts.id.prompt(
            (notification: GooglePromptNotification) => {
              if (
                notification.isNotDisplayed() ||
                notification.isSkippedMoment()
              ) {
                // One Tap not shown or skipped - user can still use regular OAuth buttons
                console.log('Google One Tap not displayed or skipped');
              }

              // Log more detailed information about why One Tap failed
              if (notification.isNotDisplayed()) {
                const reason =
                  notification.getNotDisplayedReason?.() || 'unknown';
                console.log('One Tap not displayed reason:', reason);
              }
              if (notification.isSkippedMoment()) {
                const reason = notification.getSkippedReason?.() || 'unknown';
                console.log('One Tap skipped reason:', reason);
              }
              if (notification.isDismissedMoment()) {
                const reason = notification.getDismissedReason?.() || 'unknown';
                console.log('One Tap dismissed reason:', reason);
              }
            },
          );
        } catch (initError) {
          console.error(
            'Error initializing Google Identity Services:',
            initError,
          );
        }
      }
    };

    return () => {
      // Cleanup
      const existingScript = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]',
      );
      if (existingScript) {
        existingScript.remove();
      }
      window.removeEventListener('error', handleFedCMError);
    };
  }, [handleCredentialResponse]);

  return null; // This component doesn't render anything visible
}

// Helper function to decode JWT (same as in Google's example)
function decodeJwtResponse(token: string): DecodedJwtPayload {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );
  return JSON.parse(jsonPayload) as DecodedJwtPayload;
}
