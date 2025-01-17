import { sendEmail } from '@/utils/resend/client';
import { sendWhatsAppMessage, createTextMessage, createTemplateMessage } from '@/utils/whatsapp/client';
import type { EmailOptions } from '@/utils/resend/types';
import type { WhatsAppMessage } from '@/utils/whatsapp/types';

interface NotificationPayload {
  to: string;
  subject?: string;
  message: string;
  type: 'whatsapp' | 'email';
  templateId?: string;
  metadata?: {
    components?: NonNullable<WhatsAppMessage['template']>['components'];
  };
}

class NotificationService {
  private static instance: NotificationService;

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async sendNotification(payload: NotificationPayload): Promise<boolean> {
    try {
      switch (payload.type) {
        case 'whatsapp':
          return await this.sendWhatsAppMessage(payload);
        case 'email':
          return await this.sendEmail(payload);
        default:
          throw new Error('Unsupported notification type');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }

  private async sendWhatsAppMessage(payload: NotificationPayload): Promise<boolean> {
    try {
      const formattedNumber = this.formatPhoneNumber(payload.to);
      
      let message: WhatsAppMessage;
      if (payload.templateId) {
        message = createTemplateMessage(
          formattedNumber,
          payload.templateId,
          'en', // Default to English
          payload.metadata?.components
        );
      } else {
        message = createTextMessage(formattedNumber, payload.message);
      }

      await sendWhatsAppMessage(message);
      return true;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return false;
    }
  }

  private async sendEmail(payload: NotificationPayload): Promise<boolean> {
    try {
      const emailOptions: EmailOptions = {
        from: 'notifications@lomi.africa',
        to: payload.to,
        subject: payload.subject || 'Notification from lomi.',
        text: payload.message,
        html: payload.message,
      };

      await sendEmail(emailOptions);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  private formatPhoneNumber(phoneNumber: string): string {
    // Remove any non-numeric characters
    return phoneNumber.replace(/\D/g, '');
  }

  // Template-based notification methods
  public async sendPaymentConfirmation(to: string, amount: number, reference: string): Promise<boolean> {
    return this.sendNotification({
      to,
      type: 'whatsapp',
      templateId: 'payment_confirmation',
      message: '', // Not used when template is provided
      metadata: {
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'currency',
                currency: {
                  fallback_value: `${amount}`,
                  code: 'USD',
                  amount_1000: amount * 1000
                }
              },
              {
                type: 'text',
                text: reference
              }
            ]
          }
        ]
      }
    });
  }

  public async sendPaymentFailure(to: string, amount: number, reference: string, reason: string): Promise<boolean> {
    return this.sendNotification({
      to,
      type: 'whatsapp',
      templateId: 'payment_failure',
      message: '', // Not used when template is provided
      metadata: {
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'currency',
                currency: {
                  fallback_value: `${amount}`,
                  code: 'USD',
                  amount_1000: amount * 1000
                }
              },
              {
                type: 'text',
                text: reference
              },
              {
                type: 'text',
                text: reason
              }
            ]
          }
        ]
      }
    });
  }

  public async sendRefundNotification(to: string, amount: number, reference: string): Promise<boolean> {
    return this.sendNotification({
      to,
      type: 'whatsapp',
      templateId: 'refund_notification',
      message: '', // Not used when template is provided
      metadata: {
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'currency',
                currency: {
                  fallback_value: `${amount}`,
                  code: 'USD',
                  amount_1000: amount * 1000
                }
              },
              {
                type: 'text',
                text: reference
              }
            ]
          }
        ]
      }
    });
  }
}

export const notificationService = NotificationService.getInstance(); 