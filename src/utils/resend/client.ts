import { Resend } from 'resend';
import type { EmailOptions, EmailResponse } from './types';

export class ResendApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ResendApiError';
  }
}

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env['RESEND_API_KEY'];
    if (!apiKey) {
      throw new Error('Resend API key not configured');
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export async function sendEmail(options: EmailOptions): Promise<EmailResponse> {
  try {
    const client = getResendClient();
    const { data: response, error } = await client.emails.send({
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      cc: options.cc,
      bcc: options.bcc,
      reply_to: options.replyTo,
      attachments: options.attachments,
      tags: options.tags,
    });

    if (error) {
      throw new ResendApiError(error.message);
    }

    if (!response) {
      throw new ResendApiError('Failed to send email');
    }
    
    return {
      id: response.id,
    };
  } catch (error) {
    if (error instanceof ResendApiError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new ResendApiError(error.message);
    }
    throw new ResendApiError('Unknown error occurred');
  }
} 