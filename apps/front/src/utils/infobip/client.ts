import { WhatsAppMessage, WhatsAppResponse, WhatsAppError, WhatsAppTemplate } from './types';

// Infobip API constants
const INFOBIP_API_BASE_URL = process.env['INFOBIP_API_BASE_URL'] || 'https://api.infobip.com';
const INFOBIP_API_KEY = process.env['INFOBIP_API_KEY'];
const INFOBIP_WHATSAPP_SENDER = process.env['INFOBIP_WHATSAPP_SENDER']; // Infobip WhatsApp number

export class WhatsAppApiError extends Error {
  constructor(public readonly error: WhatsAppError['error']) {
    super(error.message);
    this.name = 'WhatsAppApiError';
  }
}

/**
 * Send a WhatsApp message using Infobip as the centralized provider
 * This maintains the same interface as before but uses Infobip underneath
 */
export async function sendWhatsAppMessage(message: WhatsAppMessage): Promise<WhatsAppResponse> {
  // Validate environment variables
  if (!INFOBIP_API_KEY || !INFOBIP_WHATSAPP_SENDER) {
    throw new Error('WhatsApp credentials not configured - missing Infobip API key or sender');
  }

  // Prepare Infobip-specific request payload
  let infobipPayload;

  if (message.type === 'text') {
    infobipPayload = {
      messages: [
        {
          from: INFOBIP_WHATSAPP_SENDER,
          to: message.to,
          content: {
            text: message.text?.body
          }
        }
      ]
    };
  } else if (message.type === 'template') {
    // Map WhatsApp template to Infobip format
    const templateParams = mapTemplateParameters(message.template);
    
    infobipPayload = {
      messages: [
        {
          from: INFOBIP_WHATSAPP_SENDER,
          to: message.to,
          content: {
            templateName: message.template?.name,
            templateData: {
              body: {
                placeholders: templateParams
              },
              language: message.template?.language.code
            }
          }
        }
      ]
    };
  } else {
    throw new Error(`Unsupported message type: ${message.type}`);
  }

  // Make request to Infobip API
  try {
    const response = await fetch(
      `${INFOBIP_API_BASE_URL}/whatsapp/1/message`,
      {
        method: 'POST',
        headers: {
          'Authorization': `App ${INFOBIP_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(infobipPayload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new WhatsAppApiError({
        message: errorData.requestError?.serviceException?.text || 'Unknown WhatsApp API error',
        type: 'infobip_error',
        code: response.status,
        fbtrace_id: errorData.requestError?.serviceException?.messageId || '',
      });
    }

    const data = await response.json();
    
    // Transform Infobip response to match our expected WhatsAppResponse format
    return {
      messaging_product: 'whatsapp',
      contacts: [
        {
          input: message.to,
          wa_id: message.to,
        }
      ],
      messages: data.messages.map((msg: any) => ({
        id: msg.messageId
      }))
    };
  } catch (error: unknown) {
    if (error instanceof WhatsAppApiError) {
      throw error;
    }
    
    throw new WhatsAppApiError({
      message: error instanceof Error ? error.message : 'Failed to send WhatsApp message',
      type: 'network_error',
      code: 500,
      fbtrace_id: '',
    });
  }
}

/**
 * Helper function to extract template parameters from WhatsApp template format
 */
function mapTemplateParameters(template?: WhatsAppTemplate): string[] {
  if (!template || !template.components) {
    return [];
  }

  const params: string[] = [];
  
  template.components.forEach(component => {
    if (component.parameters) {
      component.parameters.forEach(param => {
        if (param.type === 'text' && param.text) {
          params.push(param.text);
        } else if (param.type === 'currency' && param.currency) {
          params.push(param.currency.fallback_value);
        } else if (param.type === 'date_time' && param.date_time) {
          params.push(param.date_time.fallback_value);
        }
      });
    }
  });
  
  return params;
}

/**
 * Create a text message
 */
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

/**
 * Create a template message
 */
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

/**
 * Send a subscription renewal reminder via WhatsApp
 */
export async function sendSubscriptionRenewalReminder(
  to: string,
  customerName: string,
  merchantName: string,
  amount: string,
  currency: string,
  dueDate: string,
  renewalLink: string
): Promise<WhatsAppResponse> {
  // Create template message for subscription renewal
  const message = createTemplateMessage(
    to,
    'subscription_renewal',
    'en', // Default to English
    [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: customerName },
          { type: 'text', text: merchantName },
          { type: 'text', text: `${amount} ${currency}` },
          { type: 'text', text: dueDate },
          { type: 'text', text: renewalLink }
        ]
      }
    ]
  );

  return sendWhatsAppMessage(message);
} 