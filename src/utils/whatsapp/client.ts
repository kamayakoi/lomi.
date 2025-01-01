import { WhatsAppMessage, WhatsAppResponse, WhatsAppError } from './types';

const WHATSAPP_API_VERSION = 'v17.0';
const WHATSAPP_API_URL = `https://graph.facebook.com/${WHATSAPP_API_VERSION}`;

export class WhatsAppApiError extends Error {
  constructor(public readonly error: WhatsAppError['error']) {
    super(error.message);
    this.name = 'WhatsAppApiError';
  }
}

export async function sendWhatsAppMessage(message: WhatsAppMessage): Promise<WhatsAppResponse> {
  const phoneNumberId = process.env['WHATSAPP_PHONE_NUMBER_ID'];
  const accessToken = process.env['WHATSAPP_ACCESS_TOKEN'];

  if (!phoneNumberId || !accessToken) {
    throw new Error('WhatsApp credentials not configured');
  }

  const response = await fetch(
    `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new WhatsAppApiError(data as WhatsAppError['error']);
  }

  return data as WhatsAppResponse;
}

export function createTextMessage(to: string, text: string): WhatsAppMessage {
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'text',
    text: {
      body: text,
    },
  };
}

export function createTemplateMessage(
  to: string,
  templateName: string,
  languageCode: string,
  components?: NonNullable<WhatsAppMessage['template']>['components']
): WhatsAppMessage {
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: {
        code: languageCode,
      },
      components,
    },
  };
} 