import { supabase, getSession } from '@/utils/supabase/client'
import { SidebarData } from '@/lib/types/sidebar'

const FUNCTION_URL = import.meta.env.VITE_SUPABASE_URL + '/functions/v1/sidebar-cache'
const DEBOUNCE_DELAY = 100 // ms

// Keep track of pending requests
const pendingRequests = new Map<string, Promise< SidebarData | null>>();

export const sidebarCache = {
  async get(userId: string, organizationId?: string): Promise<SidebarData | null> {
    const requestKey = `${userId}:${organizationId || 'default'}`;
    
    // Check for pending request
    if (pendingRequests.has(requestKey)) {
      return pendingRequests.get(requestKey) || null;
    }

    const request = (async () => {
      try {
        const session = await getSession();
        if (!session) return null;

        const response = await fetch(FUNCTION_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            method: 'GET',
            userId,
            organizationId,
          }),
        });

        const { data } = await response.json();
        return data || null;
      } catch (error) {
        console.error('Error getting sidebar cache:', error);
        return null;
      } finally {
        // Remove from pending after a short delay
        setTimeout(() => {
          pendingRequests.delete(requestKey);
        }, DEBOUNCE_DELAY);
      }
    })();

    // Store the pending request
    pendingRequests.set(requestKey, request);
    return request;
  },

  async set(userId: string, data: SidebarData, organizationId?: string): Promise<boolean> {
    try {
      const session = await getSession();
      if (!session) return false

      const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'SET',
          userId,
          organizationId,
          data,
        }),
      })

      const { success } = await response.json()
      return success
    } catch (error) {
      console.error('Error setting sidebar cache:', error)
      return false
    }
  },

  async del(userId: string, organizationId?: string): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return false

      const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'DELETE',
          userId,
          organizationId,
        }),
      })

      const { success } = await response.json()
      return success
    } catch (error) {
      console.error('Error deleting sidebar cache:', error)
      return false
    }
  },
} 