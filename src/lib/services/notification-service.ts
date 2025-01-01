import { Resend } from 'resend';
import axios from 'axios';

interface NotificationPayload {
  to: string;
  subject?: string;
  message: string;
  type: 'whatsapp' | 'email';
  templateId?: string;
  metadata?: Record<string, unknown>;
}

interface WhatsAppConfig {
  accessToken: string;
  phoneNumberId: string;
  version: string;
}

class NotificationService {
  private resendClient: Resend;
  private whatsappConfig: WhatsAppConfig;
  private static instance: NotificationService;

  private constructor() {
    // Initialize Resend client
    this.resendClient = new Resend(process.env['RESEND_API_KEY']);

    // Initialize WhatsApp Cloud API config
    this.whatsappConfig = {
      accessToken: process.env['WHATSAPP_ACCESS_TOKEN'] || '',
      phoneNumberId: process.env['WHATSAPP_PHONE_NUMBER_ID'] || '',
      version: 'v17.0'
    };
  }

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
      
      await axios({
        method: 'POST',
        url: `https://graph.facebook.com/${this.whatsappConfig.version}/${this.whatsappConfig.phoneNumberId}/messages`,
        headers: {
          'Authorization': `Bearer ${this.whatsappConfig.accessToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          messaging_product: 'whatsapp',
          to: formattedNumber,
          type: 'text',
          text: {
            body: payload.message
          }
        }
      });

      return true;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return false;
    }
  }

  private async sendEmail(payload: NotificationPayload): Promise<boolean> {
    try {
      const { error } = await this.resendClient.emails.send({
        from: 'notifications@lomi.africa',
        to: payload.to,
        subject: payload.subject || 'Notification from Lomi',
        html: payload.message,
      });

      if (error) {
        throw error;
      }

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
    const message = `Payment Confirmation
Amount: ${amount}
Reference: ${reference}
Status: Successful

Thank you for using Lomi!`;

    return this.sendNotification({
      to,
      message,
      type: 'whatsapp',
      templateId: 'payment_confirmation'
    });
  }

  public async sendPaymentFailure(to: string, amount: number, reference: string, reason: string): Promise<boolean> {
    const message = `Payment Failed
Amount: ${amount}
Reference: ${reference}
Reason: ${reason}

Need help? Contact our support team.`;

    return this.sendNotification({
      to,
      message,
      type: 'whatsapp',
      templateId: 'payment_failure'
    });
  }

  public async sendRefundNotification(to: string, amount: number, reference: string): Promise<boolean> {
    const message = `Refund Processed
Amount: ${amount}
Reference: ${reference}
Status: Completed

The refund has been initiated and will be processed within 3-5 business days.`;

    return this.sendNotification({
      to,
      message,
      type: 'whatsapp',
      templateId: 'refund_notification'
    });
  }
}

export const notificationService = NotificationService.getInstance(); 