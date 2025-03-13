export interface WhatsAppTemplateComponent {
  type: 'body' | 'header' | 'footer' | 'button';
  parameters: Array<{
    type: 'text' | 'currency' | 'date_time' | 'image' | 'document' | 'video';
    text?: string;
    currency?: {
      fallback_value: string;
      code: string;
      amount_1000: number;
    };
    date_time?: {
      fallback_value: string;
    };
    image?: {
      link: string;
    };
    document?: {
      link: string;
      filename?: string;
    };
    video?: {
      link: string;
    };
  }>;
  index?: number; // For button template components
  sub_type?: string; // For button template components
}

export interface WhatsAppTemplate {
  name: string;
  language: {
    code: string;
  };
  components?: WhatsAppTemplateComponent[];
}

export interface WhatsAppMessage {
  messaging_product: 'whatsapp';
  recipient_type: 'individual';
  to: string;
  type: 'text' | 'template' | 'image' | 'document' | 'audio' | 'video';
  text?: {
    body: string;
  };
  template?: WhatsAppTemplate;
  image?: {
    link: string;
    caption?: string;
  };
  document?: {
    link: string;
    filename?: string;
    caption?: string;
  };
  audio?: {
    link: string;
  };
  video?: {
    link: string;
    caption?: string;
  };
}

export interface WhatsAppResponse {
  messaging_product: 'whatsapp';
  contacts: Array<{
    input: string;
    wa_id: string;
  }>;
  messages: Array<{
    id: string;
  }>;
}

export interface WhatsAppError {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id: string;
  };
}

// Infobip specific types
export interface InfobipWhatsAppResponse {
  messages: Array<{
    messageId: string;
    status: {
      groupId: number;
      groupName: string;
      id: number;
      name: string;
      description: string;
    };
    to: string;
  }>;
}

export interface InfobipWhatsAppError {
  requestError: {
    serviceException: {
      messageId: string;
      text: string;
    };
  };
} 