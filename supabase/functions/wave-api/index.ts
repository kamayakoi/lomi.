import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// CORS headers for preflight requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

interface WaveRequestBody {
  path: string;
  method: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: Record<string, any>;
}

console.log('Wave API Edge Function initialized')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the request body
    const { path, method, body } = (await req.json()) as WaveRequestBody;

    // Validate required parameters
    if (!path) {
      throw new Error('Path is required');
    }

    // Get Wave API key from environment variable
    const apiKey = Deno.env.get('WAVE_API_KEY');
    if (!apiKey) {
      throw new Error('Wave API key not configured');
    }

    // Construct the Wave API URL
    const url = `https://api.wave.com${path}`;

    // Prepare headers for the Wave API request
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Make the request to Wave API
    const response = await fetch(url, {
      method: method || 'GET',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Get the response data
    const data = await response.json();

    // If the response was not successful, throw an error
    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    // Return the response with CORS headers
    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Return error response with CORS headers
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
}); 