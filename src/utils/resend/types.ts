import type { Resend } from 'resend';

export interface EmailOptions {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType?: string;
  }>;
  tags?: Array<{
    name: string;
    value: string;
  }>;
}

export interface EmailResponse {
  id: string;
}

export interface ResendError {
  statusCode: number;
  name: string;
  message: string;
} 