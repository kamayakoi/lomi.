import Anthropic from '@anthropic-ai/sdk';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';

export async function POST(req: ExpressRequest, res: ExpressResponse) {
  try {
    const { prompt, model, temperature, max_tokens } = req.body;
    const anthropicApiKey = req.headers.authorization?.split(' ')[1];

    if (!anthropicApiKey) {
      return res.status(401).json({ error: 'Anthropic API key is required' });
    }

    const anthropic = new Anthropic({
      apiKey: anthropicApiKey || process.env['ANTHROPIC_API_KEY'],
    });

    const response = await anthropic.messages.create({
      model: model || 'claude-3-5-sonnet-20240620',
      max_tokens: max_tokens || 150,
      temperature: temperature || 0.7,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Generate 3 suggestions based on this input: "${prompt}". Return them in a JSON format like this: {"suggestions": ["suggestion1", "suggestion2", "suggestion3"]}. Make suggestions relevant, concise, and helpful.`,
            },
          ],
        },
      ],
    });

    // Extract suggestions from the response
    const content = response.content[0];
    if (!content || content.type !== 'text') {
      throw new Error('Unexpected response format from Anthropic');
    }

    const suggestions = JSON.parse(content.text || '{}');
    return res.status(200).json(suggestions);
  } catch (error) {
    console.error('Error calling Anthropic:', error);
    return res.status(500).json({ error: 'Failed to generate suggestions' });
  }
} 