// @deno-types="https://raw.githubusercontent.com/denoland/deno/main/cli/dts/lib.deno.http.d.ts"
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { Anthropic } from "npm:@anthropic-ai/sdk@0.36.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  prompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt, model, temperature, max_tokens } = await req.json() as RequestBody
    
    // Don't process empty or very short prompts
    if (!prompt || prompt.trim().length < 3) {
      return new Response(
        JSON.stringify({ suggestions: [] }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const anthropicKey = req.headers.get('authorization')?.split(' ')[1]

    if (!anthropicKey) {
      return new Response(
        JSON.stringify({ error: 'Anthropic API key is required' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const anthropic = new Anthropic({
      apiKey: anthropicKey,
    })

    const response = await anthropic.messages.create({
      model: model || 'claude-3-sonnet-20240229',
      max_tokens: max_tokens || 150,
      temperature: temperature || 0.7,
      messages: [
        {
          role: 'user',
          content: `Generate 3 suggestions based on this input: "${prompt}". Return them in a JSON format like this: {"suggestions": ["suggestion1", "suggestion2", "suggestion3"]}. Make suggestions relevant, concise, and helpful.`,
        },
      ],
    })

    // Extract suggestions from the response
    const content = response.content[0]
    if (!content || typeof content !== 'object' || !('text' in content)) {
      throw new Error('Unexpected response format')
    }

    const suggestions = JSON.parse(content.text)

    return new Response(
      JSON.stringify(suggestions),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate suggestions', suggestions: [] }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
}) 