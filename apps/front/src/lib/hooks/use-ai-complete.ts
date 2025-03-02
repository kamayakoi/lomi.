import { useState, useCallback } from 'react';

interface UseAICompleteOptions {
  endpoint?: string;
  anthropicApiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface AICompleteResponse {
  suggestions: string[];
  error?: string;
}

export function useAIComplete({
  endpoint = 'https://mdswvokxrnfggrujsfjd.functions.supabase.co/ai-complete',
  anthropicApiKey,
  model = 'claude-3-5-sonnet-20240620',
  temperature = 0.7,
  maxTokens = 150,
}: UseAICompleteOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const complete = useCallback(async (prompt: string) => {
    if (!prompt || prompt.trim().length < 3) {
      return { suggestions: [] };
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anthropicApiKey}`,
        },
        body: JSON.stringify({
          prompt,
          model,
          temperature,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json() as AICompleteResponse;
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate suggestions';
      setError(errorMessage);
      return { suggestions: [] };
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, anthropicApiKey, model, temperature, maxTokens]);

  return {
    complete,
    isLoading,
    error,
  };
} 