export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_error_logs: {
        Row: {
          context: Json | null
          created_at: string
          error_id: string
          error_message: string
          error_type: string
          stack_trace: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string
          error_id?: string
          error_message: string
          error_type: string
          stack_trace?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string
          error_id?: string
          error_message?: string
          error_type?: string
          stack_trace?: string | null
        }
        Relationships: []
      }
      api_interactions: {
        Row: {
          api_key: string
          created_at: string
          endpoint: string
          interaction_id: string
          organization_id: string
          request_method: string
          request_payload: Json | null
          response_payload: Json | null
          response_status: number | null
          response_time: number | null
        }
        Insert: {
          api_key: string
          created_at?: string
          endpoint: string
          interaction_id?: string
          organization_id: string
          request_method: string
          request_payload?: Json | null
          response_payload?: Json | null
          response_status?: number | null
          response_time?: number | null
        }
        Update: {
          api_key?: string
          created_at?: string
          endpoint?: string
          interaction_id?: string
          organization_id?: string
          request_method?: string
          request_payload?: Json | null
          response_payload?: Json | null
          response_status?: number | null
          response_time?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "api_interactions_api_key_fkey"
            columns: ["api_key"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["api_key"]
          },
          {
            foreignKeyName: "api_interactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      api_keys: {
        Row: {
          api_key: string
          created_at: string
          environment: string
          expiration_date: string | null
          is_active: boolean
          merchant_id: string
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          api_key: string
          created_at?: string
          environment?: string
          expiration_date?: string | null
          is_active?: boolean
          merchant_id: string
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          api_key?: string
          created_at?: string
          environment?: string
          expiration_date?: string | null
          is_active?: boolean
          merchant_id?: string
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "api_keys_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      api_rate_limits: {
        Row: {
          api_key: string
          current_usage: number
          endpoint: string
          last_reset_at: string
          organization_id: string
          requests_limit: number
          time_window: unknown
        }
        Insert: {
          api_key: string
          current_usage?: number
          endpoint: string
          last_reset_at?: string
          organization_id: string
          requests_limit: number
          time_window: unknown
        }
        Update: {
          api_key?: string
          current_usage?: number
          endpoint?: string
          last_reset_at?: string
          organization_id?: string
          requests_limit?: number
          time_window?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "api_rate_limits_api_key_fkey"
            columns: ["api_key"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["api_key"]
          },
          {
            foreignKeyName: "api_rate_limits_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      api_usage: {
        Row: {
          api_key: string
          endpoint: string
          ip_address: string | null
          last_request_at: string
          organization_id: string
          request_count: number
          request_method: string | null
          response_status: number | null
          response_time: number | null
        }
        Insert: {
          api_key: string
          endpoint: string
          ip_address?: string | null
          last_request_at?: string
          organization_id: string
          request_count?: number
          request_method?: string | null
          response_status?: number | null
          response_time?: number | null
        }
        Update: {
          api_key?: string
          endpoint?: string
          ip_address?: string | null
          last_request_at?: string
          organization_id?: string
          request_count?: number
          request_method?: string | null
          response_status?: number | null
          response_time?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_api_key_fkey"
            columns: ["api_key"]
            isOneToOne: true
            referencedRelation: "api_keys"
            referencedColumns: ["api_key"]
          },
          {
            foreignKeyName: "api_usage_organization_id_api_key_fkey"
            columns: ["organization_id", "api_key"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["organization_id", "api_key"]
          },
          {
            foreignKeyName: "api_usage_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      checkout_sessions: {
        Row: {
          allowed_providers:
            | Database["public"]["Enums"]["provider_code"][]
            | null
          amount: number
          cancel_url: string | null
          checkout_session_id: string
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_email: string | null
          customer_id: string | null
          customer_name: string | null
          customer_phone: string | null
          expires_at: string
          merchant_id: string
          metadata: Json | null
          organization_id: string
          payment_link_id: string | null
          plan_id: string | null
          product_id: string | null
          status: Database["public"]["Enums"]["checkout_session_status"]
          subscription_id: string | null
          success_url: string | null
          updated_at: string
        }
        Insert: {
          allowed_providers?:
            | Database["public"]["Enums"]["provider_code"][]
            | null
          amount: number
          cancel_url?: string | null
          checkout_session_id?: string
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          expires_at: string
          merchant_id: string
          metadata?: Json | null
          organization_id: string
          payment_link_id?: string | null
          plan_id?: string | null
          product_id?: string | null
          status?: Database["public"]["Enums"]["checkout_session_status"]
          subscription_id?: string | null
          success_url?: string | null
          updated_at?: string
        }
        Update: {
          allowed_providers?:
            | Database["public"]["Enums"]["provider_code"][]
            | null
          amount?: number
          cancel_url?: string | null
          checkout_session_id?: string
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          expires_at?: string
          merchant_id?: string
          metadata?: Json | null
          organization_id?: string
          payment_link_id?: string | null
          plan_id?: string | null
          product_id?: string | null
          status?: Database["public"]["Enums"]["checkout_session_status"]
          subscription_id?: string | null
          success_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checkout_sessions_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "checkout_sessions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "checkout_sessions_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "checkout_sessions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "checkout_sessions_payment_link_id_fkey"
            columns: ["payment_link_id"]
            isOneToOne: false
            referencedRelation: "payment_links"
            referencedColumns: ["link_id"]
          },
          {
            foreignKeyName: "checkout_sessions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["plan_id"]
          },
          {
            foreignKeyName: "checkout_sessions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "merchant_products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "checkout_sessions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "merchant_subscriptions"
            referencedColumns: ["subscription_id"]
          },
        ]
      }
      currencies: {
        Row: {
          code: Database["public"]["Enums"]["currency_code"]
          name: string
        }
        Insert: {
          code: Database["public"]["Enums"]["currency_code"]
          name: string
        }
        Update: {
          code?: Database["public"]["Enums"]["currency_code"]
          name?: string
        }
        Relationships: []
      }
      currency_conversion_history: {
        Row: {
          conversion_rate: number
          conversion_type: Database["public"]["Enums"]["conversion_type"]
          converted_amount: number
          created_at: string
          from_currency: Database["public"]["Enums"]["currency_code"]
          id: string
          merchant_id: string
          organization_id: string
          original_amount: number
          payout_id: string | null
          refund_id: string | null
          to_currency: Database["public"]["Enums"]["currency_code"]
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          conversion_rate: number
          conversion_type: Database["public"]["Enums"]["conversion_type"]
          converted_amount: number
          created_at?: string
          from_currency: Database["public"]["Enums"]["currency_code"]
          id?: string
          merchant_id: string
          organization_id: string
          original_amount: number
          payout_id?: string | null
          refund_id?: string | null
          to_currency: Database["public"]["Enums"]["currency_code"]
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          conversion_rate?: number
          conversion_type?: Database["public"]["Enums"]["conversion_type"]
          converted_amount?: number
          created_at?: string
          from_currency?: Database["public"]["Enums"]["currency_code"]
          id?: string
          merchant_id?: string
          organization_id?: string
          original_amount?: number
          payout_id?: string | null
          refund_id?: string | null
          to_currency?: Database["public"]["Enums"]["currency_code"]
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "currency_conversion_history_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "currency_conversion_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "currency_conversion_history_payout_id_fkey"
            columns: ["payout_id"]
            isOneToOne: false
            referencedRelation: "payouts"
            referencedColumns: ["payout_id"]
          },
          {
            foreignKeyName: "currency_conversion_history_refund_id_fkey"
            columns: ["refund_id"]
            isOneToOne: false
            referencedRelation: "refunds"
            referencedColumns: ["refund_id"]
          },
          {
            foreignKeyName: "currency_conversion_history_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      currency_conversion_rates: {
        Row: {
          created_at: string
          from_currency: Database["public"]["Enums"]["currency_code"]
          id: string
          inverse_rate: number
          rate: number
          to_currency: Database["public"]["Enums"]["currency_code"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          from_currency: Database["public"]["Enums"]["currency_code"]
          id?: string
          inverse_rate: number
          rate: number
          to_currency: Database["public"]["Enums"]["currency_code"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          from_currency?: Database["public"]["Enums"]["currency_code"]
          id?: string
          inverse_rate?: number
          rate?: number
          to_currency?: Database["public"]["Enums"]["currency_code"]
          updated_at?: string
        }
        Relationships: []
      }
      customer_invoices: {
        Row: {
          amount: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id: string
          customer_invoice_id: string
          description: string | null
          due_date: string
          merchant_id: string
          metadata: Json | null
          organization_id: string
          status: Database["public"]["Enums"]["invoice_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id: string
          customer_invoice_id?: string
          description?: string | null
          due_date: string
          merchant_id: string
          metadata?: Json | null
          organization_id: string
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          customer_id?: string
          customer_invoice_id?: string
          description?: string | null
          due_date?: string
          merchant_id?: string
          metadata?: Json | null
          organization_id?: string
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_invoices_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "customer_invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_invoices_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "customer_invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          customer_id: string
          deleted_at: string | null
          email: string | null
          is_business: boolean
          is_deleted: boolean
          merchant_id: string
          metadata: Json | null
          name: string
          organization_id: string
          phone_number: string | null
          postal_code: string | null
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          customer_id?: string
          deleted_at?: string | null
          email?: string | null
          is_business?: boolean
          is_deleted?: boolean
          merchant_id: string
          metadata?: Json | null
          name: string
          organization_id: string
          phone_number?: string | null
          postal_code?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          customer_id?: string
          deleted_at?: string | null
          email?: string | null
          is_business?: boolean
          is_deleted?: boolean
          merchant_id?: string
          metadata?: Json | null
          name?: string
          organization_id?: string
          phone_number?: string | null
          postal_code?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      disputes: {
        Row: {
          amount: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id: string
          dispute_id: string
          fee_amount: number
          reason: string
          resolution_date: string | null
          resolution_details: string | null
          status: Database["public"]["Enums"]["dispute_status"]
          transaction_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          customer_id: string
          dispute_id?: string
          fee_amount?: number
          reason: string
          resolution_date?: string | null
          resolution_details?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          transaction_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          customer_id?: string
          dispute_id?: string
          fee_amount?: number
          reason?: string
          resolution_date?: string | null
          resolution_details?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          transaction_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "disputes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "disputes_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      fees: {
        Row: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          fee_id: string
          fee_type: Database["public"]["Enums"]["fee_type"]
          fixed_amount: number
          name: string
          payment_method_code:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          percentage: number
          provider_code: Database["public"]["Enums"]["provider_code"] | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          fee_id?: string
          fee_type: Database["public"]["Enums"]["fee_type"]
          fixed_amount?: number
          name: string
          payment_method_code?:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          percentage?: number
          provider_code?: Database["public"]["Enums"]["provider_code"] | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          fee_id?: string
          fee_type?: Database["public"]["Enums"]["fee_type"]
          fixed_amount?: number
          name?: string
          payment_method_code?:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          percentage?: number
          provider_code?: Database["public"]["Enums"]["provider_code"] | null
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fees_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "fees_payment_method_code_provider_code_fkey"
            columns: ["payment_method_code", "provider_code"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["payment_method_code", "provider_code"]
          },
        ]
      }
      installment_payments: {
        Row: {
          amount: number
          created_at: string
          due_date: string
          installment_id: string
          payment_link: string | null
          plan_id: string
          sequence_number: number
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date: string
          installment_id?: string
          payment_link?: string | null
          plan_id: string
          sequence_number: number
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string
          installment_id?: string
          payment_link?: string | null
          plan_id?: string
          sequence_number?: number
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "installment_payments_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "installment_plans"
            referencedColumns: ["plan_id"]
          },
          {
            foreignKeyName: "installment_payments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      installment_plans: {
        Row: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id: string
          installment_count: number
          merchant_id: string
          organization_id: string
          plan_id: string
          product_id: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          subscription_id: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id: string
          installment_count: number
          merchant_id: string
          organization_id: string
          plan_id?: string
          product_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          subscription_id?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          customer_id?: string
          installment_count?: number
          merchant_id?: string
          organization_id?: string
          plan_id?: string
          product_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          subscription_id?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "installment_plans_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "installment_plans_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "installment_plans_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "installment_plans_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "installment_plans_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "merchant_products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "installment_plans_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "merchant_subscriptions"
            referencedColumns: ["subscription_id"]
          },
        ]
      }
      logs: {
        Row: {
          browser: string | null
          created_at: string
          details: Json | null
          event: Database["public"]["Enums"]["event_type"]
          ip_address: string | null
          log_id: string
          merchant_id: string | null
          operating_system: string | null
          request_method: string | null
          request_url: string | null
          response_status: number | null
          severity: string
        }
        Insert: {
          browser?: string | null
          created_at?: string
          details?: Json | null
          event: Database["public"]["Enums"]["event_type"]
          ip_address?: string | null
          log_id?: string
          merchant_id?: string | null
          operating_system?: string | null
          request_method?: string | null
          request_url?: string | null
          response_status?: number | null
          severity: string
        }
        Update: {
          browser?: string | null
          created_at?: string
          details?: Json | null
          event?: Database["public"]["Enums"]["event_type"]
          ip_address?: string | null
          log_id?: string
          merchant_id?: string | null
          operating_system?: string | null
          request_method?: string | null
          request_url?: string | null
          response_status?: number | null
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "logs_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
        ]
      }
      merchant_accounts: {
        Row: {
          account_id: string
          balance: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          merchant_id: string | null
          organization_id: string
          updated_at: string
        }
        Insert: {
          account_id?: string
          balance?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          merchant_id?: string | null
          organization_id: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          balance?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          merchant_id?: string | null
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchant_accounts_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "merchant_accounts_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "merchant_accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      merchant_bank_accounts: {
        Row: {
          account_name: string
          account_number: string
          auto_withdrawal_day: number | null
          auto_withdrawal_enabled: boolean
          auto_withdrawal_last_run: string | null
          bank_account_id: string
          bank_code: string | null
          bank_name: string
          branch_code: string | null
          country: string | null
          created_at: string
          is_default: boolean
          is_valid: boolean
          merchant_id: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          account_name: string
          account_number: string
          auto_withdrawal_day?: number | null
          auto_withdrawal_enabled?: boolean
          auto_withdrawal_last_run?: string | null
          bank_account_id?: string
          bank_code?: string | null
          bank_name: string
          branch_code?: string | null
          country?: string | null
          created_at?: string
          is_default?: boolean
          is_valid?: boolean
          merchant_id: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          account_name?: string
          account_number?: string
          auto_withdrawal_day?: number | null
          auto_withdrawal_enabled?: boolean
          auto_withdrawal_last_run?: string | null
          bank_account_id?: string
          bank_code?: string | null
          bank_name?: string
          branch_code?: string | null
          country?: string | null
          created_at?: string
          is_default?: boolean
          is_valid?: boolean
          merchant_id?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchant_bank_accounts_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "merchant_bank_accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      merchant_feedback: {
        Row: {
          created_at: string
          id: string
          merchant_id: string
          message: string
          sentiment: string | null
          status: Database["public"]["Enums"]["feedback_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          merchant_id: string
          message: string
          sentiment?: string | null
          status?: Database["public"]["Enums"]["feedback_status"]
        }
        Update: {
          created_at?: string
          id?: string
          merchant_id?: string
          message?: string
          sentiment?: string | null
          status?: Database["public"]["Enums"]["feedback_status"]
        }
        Relationships: [
          {
            foreignKeyName: "merchant_feedback_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
        ]
      }
      merchant_organization_links: {
        Row: {
          action: Database["public"]["Enums"]["permission_action"] | null
          category: Database["public"]["Enums"]["permission_category"] | null
          created_at: string
          how_did_you_hear_about_us: string | null
          invitation_email: string | null
          invitation_token: string | null
          merchant_id: string | null
          merchant_org_id: string
          organization_id: string
          organization_position: string | null
          role: Database["public"]["Enums"]["member_role"]
          store_handle: string
          team_status: Database["public"]["Enums"]["team_status"]
          updated_at: string
        }
        Insert: {
          action?: Database["public"]["Enums"]["permission_action"] | null
          category?: Database["public"]["Enums"]["permission_category"] | null
          created_at?: string
          how_did_you_hear_about_us?: string | null
          invitation_email?: string | null
          invitation_token?: string | null
          merchant_id?: string | null
          merchant_org_id?: string
          organization_id: string
          organization_position?: string | null
          role: Database["public"]["Enums"]["member_role"]
          store_handle: string
          team_status?: Database["public"]["Enums"]["team_status"]
          updated_at?: string
        }
        Update: {
          action?: Database["public"]["Enums"]["permission_action"] | null
          category?: Database["public"]["Enums"]["permission_category"] | null
          created_at?: string
          how_did_you_hear_about_us?: string | null
          invitation_email?: string | null
          invitation_token?: string | null
          merchant_id?: string | null
          merchant_org_id?: string
          organization_id?: string
          organization_position?: string | null
          role?: Database["public"]["Enums"]["member_role"]
          store_handle?: string
          team_status?: Database["public"]["Enums"]["team_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchant_organization_links_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "merchant_organization_links_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      merchant_outstanding_balance: {
        Row: {
          amount: number
          balance_id: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          merchant_id: string
          metadata: Json | null
          organization_id: string
          updated_at: string
        }
        Insert: {
          amount?: number
          balance_id?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          merchant_id: string
          metadata?: Json | null
          organization_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          balance_id?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          merchant_id?: string
          metadata?: Json | null
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchant_outstanding_balance_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "merchant_outstanding_balance_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "merchant_outstanding_balance_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      merchant_products: {
        Row: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string | null
          display_on_storefront: boolean
          image_url: string | null
          is_active: boolean
          merchant_id: string
          name: string
          organization_id: string
          price: number
          product_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          display_on_storefront?: boolean
          image_url?: string | null
          is_active?: boolean
          merchant_id: string
          name: string
          organization_id: string
          price: number
          product_id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          display_on_storefront?: boolean
          image_url?: string | null
          is_active?: boolean
          merchant_id?: string
          name?: string
          organization_id?: string
          price?: number
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchant_products_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "merchant_products_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "merchant_products_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      merchant_subscriptions: {
        Row: {
          created_at: string
          customer_id: string
          end_date: string | null
          merchant_id: string
          metadata: Json | null
          next_billing_date: string | null
          organization_id: string
          plan_id: string
          start_date: string
          status: Database["public"]["Enums"]["subscription_status"]
          subscription_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          end_date?: string | null
          merchant_id: string
          metadata?: Json | null
          next_billing_date?: string | null
          organization_id: string
          plan_id: string
          start_date: string
          status?: Database["public"]["Enums"]["subscription_status"]
          subscription_id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          end_date?: string | null
          merchant_id?: string
          metadata?: Json | null
          next_billing_date?: string | null
          organization_id?: string
          plan_id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          subscription_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchant_subscriptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "merchant_subscriptions_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "merchant_subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "merchant_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["plan_id"]
          },
        ]
      }
      merchants: {
        Row: {
          arr: number
          avatar_url: string | null
          country: string | null
          created_at: string
          deleted_at: string | null
          email: string
          is_deleted: boolean
          merchant_id: string
          merchant_lifetime_value: number
          metadata: Json | null
          mrr: number
          name: string | null
          onboarded: boolean
          phone_number: string | null
          pin_code: string | null
          preferred_language: string
          referral_code: string | null
          retry_payment_every: number | null
          subscription_notifications: Json | null
          timezone: string
          total_retries: number | null
          updated_at: string
        }
        Insert: {
          arr?: number
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          is_deleted?: boolean
          merchant_id?: string
          merchant_lifetime_value?: number
          metadata?: Json | null
          mrr?: number
          name?: string | null
          onboarded?: boolean
          phone_number?: string | null
          pin_code?: string | null
          preferred_language?: string
          referral_code?: string | null
          retry_payment_every?: number | null
          subscription_notifications?: Json | null
          timezone?: string
          total_retries?: number | null
          updated_at?: string
        }
        Update: {
          arr?: number
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          is_deleted?: boolean
          merchant_id?: string
          merchant_lifetime_value?: number
          metadata?: Json | null
          mrr?: number
          name?: string | null
          onboarded?: boolean
          phone_number?: string | null
          pin_code?: string | null
          preferred_language?: string
          referral_code?: string | null
          retry_payment_every?: number | null
          subscription_notifications?: Json | null
          timezone?: string
          total_retries?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          is_read: boolean | null
          merchant_id: string | null
          message: string
          notification_id: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          created_at?: string | null
          is_read?: boolean | null
          merchant_id?: string | null
          message: string
          notification_id?: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          created_at?: string | null
          is_read?: boolean | null
          merchant_id?: string | null
          message?: string
          notification_id?: string
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: [
          {
            foreignKeyName: "notifications_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
        ]
      }
      organization_addresses: {
        Row: {
          city: string | null
          country: string
          created_at: string
          district: string | null
          organization_id: string
          postal_code: string | null
          region: string | null
          street: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          country: string
          created_at?: string
          district?: string | null
          organization_id: string
          postal_code?: string | null
          region?: string | null
          street?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          country?: string
          created_at?: string
          district?: string | null
          organization_id?: string
          postal_code?: string | null
          region?: string | null
          street?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_addresses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organization_checkout_settings: {
        Row: {
          created_at: string
          customer_notifications: Json
          default_language: string
          display_currency: Database["public"]["Enums"]["currency_code"]
          merchant_recipients: Json
          organization_id: string
          payment_link_duration: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_notifications?: Json
          default_language?: string
          display_currency?: Database["public"]["Enums"]["currency_code"]
          merchant_recipients?: Json
          organization_id: string
          payment_link_duration?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_notifications?: Json
          default_language?: string
          display_currency?: Database["public"]["Enums"]["currency_code"]
          merchant_recipients?: Json
          organization_id?: string
          payment_link_duration?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_checkout_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organization_fee_links: {
        Row: {
          created_at: string
          fee_link_id: string
          fee_type_id: string
          organization_id: string
          product_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          fee_link_id?: string
          fee_type_id: string
          organization_id: string
          product_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          fee_link_id?: string
          fee_type_id?: string
          organization_id?: string
          product_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_fee_links_fee_type_id_fkey"
            columns: ["fee_type_id"]
            isOneToOne: false
            referencedRelation: "organization_fees"
            referencedColumns: ["fee_type_id"]
          },
          {
            foreignKeyName: "organization_fee_links_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_fee_links_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "merchant_products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      organization_fees: {
        Row: {
          created_at: string
          fee_type_id: string
          is_enabled: boolean
          name: string
          organization_id: string
          percentage: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          fee_type_id?: string
          is_enabled?: boolean
          name: string
          organization_id: string
          percentage?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          fee_type_id?: string
          is_enabled?: boolean
          name?: string
          organization_id?: string
          percentage?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_fees_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organization_kyc: {
        Row: {
          address_proof_url: string | null
          authorized_signatory_email: string | null
          authorized_signatory_name: string | null
          authorized_signatory_phone_number: string | null
          business_description: string | null
          business_platform_url: string | null
          business_registration_url: string | null
          kyc_approved_at: string | null
          kyc_submitted_at: string | null
          legal_city: string | null
          legal_country: string | null
          legal_organization_name: string | null
          legal_postal_code: string | null
          legal_region: string | null
          legal_representative_id_url: string | null
          legal_street: string | null
          merchant_id: string
          organization_id: string
          proof_of_business: string | null
          status: Database["public"]["Enums"]["kyc_status"]
          tax_number: string | null
        }
        Insert: {
          address_proof_url?: string | null
          authorized_signatory_email?: string | null
          authorized_signatory_name?: string | null
          authorized_signatory_phone_number?: string | null
          business_description?: string | null
          business_platform_url?: string | null
          business_registration_url?: string | null
          kyc_approved_at?: string | null
          kyc_submitted_at?: string | null
          legal_city?: string | null
          legal_country?: string | null
          legal_organization_name?: string | null
          legal_postal_code?: string | null
          legal_region?: string | null
          legal_representative_id_url?: string | null
          legal_street?: string | null
          merchant_id: string
          organization_id: string
          proof_of_business?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          tax_number?: string | null
        }
        Update: {
          address_proof_url?: string | null
          authorized_signatory_email?: string | null
          authorized_signatory_name?: string | null
          authorized_signatory_phone_number?: string | null
          business_description?: string | null
          business_platform_url?: string | null
          business_registration_url?: string | null
          kyc_approved_at?: string | null
          kyc_submitted_at?: string | null
          legal_city?: string | null
          legal_country?: string | null
          legal_organization_name?: string | null
          legal_postal_code?: string | null
          legal_region?: string | null
          legal_representative_id_url?: string | null
          legal_street?: string | null
          merchant_id?: string
          organization_id?: string
          proof_of_business?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          tax_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_kyc_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "organization_kyc_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organization_providers_settings: {
        Row: {
          created_at: string
          email_sent: boolean
          is_connected: boolean
          is_phone_verified: boolean
          metadata: Json | null
          organization_id: string
          phone_number: string | null
          provider_business_type:
            | Database["public"]["Enums"]["provider_business_type"]
            | null
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_merchant_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email_sent?: boolean
          is_connected?: boolean
          is_phone_verified?: boolean
          metadata?: Json | null
          organization_id: string
          phone_number?: string | null
          provider_business_type?:
            | Database["public"]["Enums"]["provider_business_type"]
            | null
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_merchant_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email_sent?: boolean
          is_connected?: boolean
          is_phone_verified?: boolean
          metadata?: Json | null
          organization_id?: string
          phone_number?: string | null
          provider_business_type?:
            | Database["public"]["Enums"]["provider_business_type"]
            | null
          provider_code?: Database["public"]["Enums"]["provider_code"]
          provider_merchant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_providers_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_providers_settings_provider_code_fkey"
            columns: ["provider_code"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["code"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          default_currency: Database["public"]["Enums"]["currency_code"]
          deleted_at: string | null
          email: string
          employee_number: string | null
          industry: string | null
          is_deleted: boolean
          logo_url: string | null
          metadata: Json | null
          name: string
          organization_id: string
          phone_number: string
          status: Database["public"]["Enums"]["organization_status"]
          total_customers: number | null
          total_merchants: number | null
          total_revenue: number | null
          total_transactions: number | null
          updated_at: string
          verified: boolean
          website_url: string | null
        }
        Insert: {
          created_at?: string
          default_currency?: Database["public"]["Enums"]["currency_code"]
          deleted_at?: string | null
          email: string
          employee_number?: string | null
          industry?: string | null
          is_deleted?: boolean
          logo_url?: string | null
          metadata?: Json | null
          name: string
          organization_id?: string
          phone_number: string
          status?: Database["public"]["Enums"]["organization_status"]
          total_customers?: number | null
          total_merchants?: number | null
          total_revenue?: number | null
          total_transactions?: number | null
          updated_at?: string
          verified?: boolean
          website_url?: string | null
        }
        Update: {
          created_at?: string
          default_currency?: Database["public"]["Enums"]["currency_code"]
          deleted_at?: string | null
          email?: string
          employee_number?: string | null
          industry?: string | null
          is_deleted?: boolean
          logo_url?: string | null
          metadata?: Json | null
          name?: string
          organization_id?: string
          phone_number?: string
          status?: Database["public"]["Enums"]["organization_status"]
          total_customers?: number | null
          total_merchants?: number | null
          total_revenue?: number | null
          total_transactions?: number | null
          updated_at?: string
          verified?: boolean
          website_url?: string | null
        }
        Relationships: []
      }
      payment_group_config: {
        Row: {
          allow_different_providers: boolean
          config_id: string
          created_at: string
          is_active: boolean
          max_split_count: number
          min_payment_percentage: number
          organization_id: string
          split_expiry_hours: number
          updated_at: string
        }
        Insert: {
          allow_different_providers?: boolean
          config_id?: string
          created_at?: string
          is_active?: boolean
          max_split_count?: number
          min_payment_percentage?: number
          organization_id: string
          split_expiry_hours?: number
          updated_at?: string
        }
        Update: {
          allow_different_providers?: boolean
          config_id?: string
          created_at?: string
          is_active?: boolean
          max_split_count?: number
          min_payment_percentage?: number
          organization_id?: string
          split_expiry_hours?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_group_config_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      payment_group_items: {
        Row: {
          amount: number
          created_at: string
          group_id: string
          item_id: string
          payment_link: string | null
          payment_method_code:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          provider_code: Database["public"]["Enums"]["provider_code"] | null
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          group_id: string
          item_id?: string
          payment_link?: string | null
          payment_method_code?:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          provider_code?: Database["public"]["Enums"]["provider_code"] | null
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          group_id?: string
          item_id?: string
          payment_link?: string | null
          payment_method_code?:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          provider_code?: Database["public"]["Enums"]["provider_code"] | null
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_group_items_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "payment_groups"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "payment_group_items_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      payment_groups: {
        Row: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id: string | null
          expires_at: string
          group_id: string
          merchant_id: string
          organization_id: string
          product_id: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          subscription_id: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id?: string | null
          expires_at: string
          group_id?: string
          merchant_id: string
          organization_id: string
          product_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          subscription_id?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          customer_id?: string | null
          expires_at?: string
          group_id?: string
          merchant_id?: string
          organization_id?: string
          product_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          subscription_id?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_groups_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "payment_groups_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "payment_groups_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "payment_groups_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "payment_groups_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "merchant_products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "payment_groups_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "merchant_subscriptions"
            referencedColumns: ["subscription_id"]
          },
        ]
      }
      payment_links: {
        Row: {
          allow_coupon_code: boolean
          allowed_providers: Database["public"]["Enums"]["provider_code"][]
          cancel_url: string | null
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          expires_at: string | null
          is_active: boolean
          link_id: string
          link_type: Database["public"]["Enums"]["link_type"]
          merchant_id: string
          metadata: Json | null
          organization_id: string
          plan_id: string | null
          price: number | null
          private_description: string | null
          product_id: string | null
          public_description: string | null
          success_url: string | null
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          allow_coupon_code?: boolean
          allowed_providers?: Database["public"]["Enums"]["provider_code"][]
          cancel_url?: string | null
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          expires_at?: string | null
          is_active?: boolean
          link_id?: string
          link_type: Database["public"]["Enums"]["link_type"]
          merchant_id: string
          metadata?: Json | null
          organization_id: string
          plan_id?: string | null
          price?: number | null
          private_description?: string | null
          product_id?: string | null
          public_description?: string | null
          success_url?: string | null
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          allow_coupon_code?: boolean
          allowed_providers?: Database["public"]["Enums"]["provider_code"][]
          cancel_url?: string | null
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          expires_at?: string | null
          is_active?: boolean
          link_id?: string
          link_type?: Database["public"]["Enums"]["link_type"]
          merchant_id?: string
          metadata?: Json | null
          organization_id?: string
          plan_id?: string | null
          price?: number | null
          private_description?: string | null
          product_id?: string | null
          public_description?: string | null
          success_url?: string | null
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_links_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "payment_links_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "payment_links_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "payment_links_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["plan_id"]
          },
          {
            foreignKeyName: "payment_links_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "merchant_products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          provider_code: Database["public"]["Enums"]["provider_code"]
        }
        Insert: {
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          provider_code: Database["public"]["Enums"]["provider_code"]
        }
        Update: {
          payment_method_code?: Database["public"]["Enums"]["payment_method_code"]
          provider_code?: Database["public"]["Enums"]["provider_code"]
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_provider_code_fkey"
            columns: ["provider_code"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["code"]
          },
        ]
      }
      payment_requests: {
        Row: {
          amount: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id: string | null
          description: string | null
          expiry_date: string
          merchant_id: string
          organization_id: string
          payment_link: string | null
          payment_reference: string | null
          request_id: string
          status: Database["public"]["Enums"]["transaction_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id?: string | null
          description?: string | null
          expiry_date: string
          merchant_id: string
          organization_id: string
          payment_link?: string | null
          payment_reference?: string | null
          request_id?: string
          status?: Database["public"]["Enums"]["transaction_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          customer_id?: string | null
          description?: string | null
          expiry_date?: string
          merchant_id?: string
          organization_id?: string
          payment_link?: string | null
          payment_reference?: string | null
          request_id?: string
          status?: Database["public"]["Enums"]["transaction_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_requests_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "payment_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "payment_requests_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "payment_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      payouts: {
        Row: {
          account_id: string
          amount: number
          bank_account_id: string | null
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          merchant_id: string
          metadata: Json | null
          organization_id: string | null
          payment_method_code:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          payout_id: string
          provider_code: Database["public"]["Enums"]["provider_code"] | null
          status: Database["public"]["Enums"]["payout_status"]
          updated_at: string
        }
        Insert: {
          account_id: string
          amount: number
          bank_account_id?: string | null
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          merchant_id: string
          metadata?: Json | null
          organization_id?: string | null
          payment_method_code?:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          payout_id?: string
          provider_code?: Database["public"]["Enums"]["provider_code"] | null
          status?: Database["public"]["Enums"]["payout_status"]
          updated_at?: string
        }
        Update: {
          account_id?: string
          amount?: number
          bank_account_id?: string | null
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          merchant_id?: string
          metadata?: Json | null
          organization_id?: string | null
          payment_method_code?:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          payout_id?: string
          provider_code?: Database["public"]["Enums"]["provider_code"] | null
          status?: Database["public"]["Enums"]["payout_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payouts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "merchant_accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "payouts_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "merchant_bank_accounts"
            referencedColumns: ["bank_account_id"]
          },
          {
            foreignKeyName: "payouts_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "payouts_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "payouts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      platform_invoices: {
        Row: {
          amount: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string | null
          due_date: string
          merchant_id: string
          metadata: Json | null
          organization_id: string
          platform_invoice_id: string
          status: Database["public"]["Enums"]["invoice_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          due_date: string
          merchant_id: string
          metadata?: Json | null
          organization_id: string
          platform_invoice_id?: string
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          due_date?: string
          merchant_id?: string
          metadata?: Json | null
          organization_id?: string
          platform_invoice_id?: string
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_invoices_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "platform_invoices_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "platform_invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      platform_main_account: {
        Row: {
          available_balance: number
          balance_id: string
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          total_balance: number
          updated_at: string
        }
        Insert: {
          available_balance?: number
          balance_id?: string
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          total_balance?: number
          updated_at?: string
        }
        Update: {
          available_balance?: number
          balance_id?: string
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          total_balance?: number
          updated_at?: string
        }
        Relationships: []
      }
      platform_metrics: {
        Row: {
          created_at: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          metadata: Json | null
          metric_date: string
          metric_id: string
          metric_name: string
          metric_value: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          metadata?: Json | null
          metric_date: string
          metric_id?: string
          metric_name: string
          metric_value: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          entity_type?: Database["public"]["Enums"]["entity_type"]
          metadata?: Json | null
          metric_date?: string
          metric_id?: string
          metric_name?: string
          metric_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      platform_provider_balance: {
        Row: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          current_balance: number
          platform_revenue: number
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_fees: number
          quarter_start_date: string
          total_transactions_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          current_balance?: number
          platform_revenue?: number
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_fees?: number
          quarter_start_date: string
          total_transactions_amount?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          current_balance?: number
          platform_revenue?: number
          provider_code?: Database["public"]["Enums"]["provider_code"]
          provider_fees?: number
          quarter_start_date?: string
          total_transactions_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      platform_provider_balance_history: {
        Row: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          final_balance: number
          history_id: string
          platform_revenue: number
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_fees: number
          quarter_end_date: string
          quarter_start_date: string
          total_transactions_amount: number
        }
        Insert: {
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          final_balance: number
          history_id?: string
          platform_revenue: number
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_fees: number
          quarter_end_date: string
          quarter_start_date: string
          total_transactions_amount: number
        }
        Update: {
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          final_balance?: number
          history_id?: string
          platform_revenue?: number
          provider_code?: Database["public"]["Enums"]["provider_code"]
          provider_fees?: number
          quarter_end_date?: string
          quarter_start_date?: string
          total_transactions_amount?: number
        }
        Relationships: []
      }
      providers: {
        Row: {
          code: Database["public"]["Enums"]["provider_code"]
          description: string | null
          name: string
        }
        Insert: {
          code: Database["public"]["Enums"]["provider_code"]
          description?: string | null
          name: string
        }
        Update: {
          code?: Database["public"]["Enums"]["provider_code"]
          description?: string | null
          name?: string
        }
        Relationships: []
      }
      providers_transactions: {
        Row: {
          checkout_url: string | null
          created_at: string
          error_code: string | null
          error_message: string | null
          error_url: string | null
          merchant_id: string
          provider_checkout_id: string | null
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_payment_status: Database["public"]["Enums"]["provider_payment_status"]
          provider_transaction_id: string | null
          success_url: string | null
          transaction_id: string
          updated_at: string
        }
        Insert: {
          checkout_url?: string | null
          created_at?: string
          error_code?: string | null
          error_message?: string | null
          error_url?: string | null
          merchant_id: string
          provider_checkout_id?: string | null
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_payment_status?: Database["public"]["Enums"]["provider_payment_status"]
          provider_transaction_id?: string | null
          success_url?: string | null
          transaction_id: string
          updated_at?: string
        }
        Update: {
          checkout_url?: string | null
          created_at?: string
          error_code?: string | null
          error_message?: string | null
          error_url?: string | null
          merchant_id?: string
          provider_checkout_id?: string | null
          provider_code?: Database["public"]["Enums"]["provider_code"]
          provider_payment_status?: Database["public"]["Enums"]["provider_payment_status"]
          provider_transaction_id?: string | null
          success_url?: string | null
          transaction_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "providers_transactions_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "providers_transactions_provider_code_fkey"
            columns: ["provider_code"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "providers_transactions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: true
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      refunds: {
        Row: {
          amount: number
          created_at: string
          fee_amount: number
          metadata: Json | null
          reason: string | null
          refund_id: string
          refunded_amount: number
          status: Database["public"]["Enums"]["refund_status"]
          transaction_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          fee_amount?: number
          metadata?: Json | null
          reason?: string | null
          refund_id?: string
          refunded_amount: number
          status?: Database["public"]["Enums"]["refund_status"]
          transaction_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          fee_amount?: number
          metadata?: Json | null
          reason?: string | null
          refund_id?: string
          refunded_amount?: number
          status?: Database["public"]["Enums"]["refund_status"]
          transaction_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "refunds_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      storefronts: {
        Row: {
          created_at: string
          description: string | null
          is_active: boolean
          merchant_id: string
          name: string
          organization_id: string
          slug: string
          storefront_id: string
          theme_color: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          is_active?: boolean
          merchant_id: string
          name: string
          organization_id: string
          slug: string
          storefront_id?: string
          theme_color?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          is_active?: boolean
          merchant_id?: string
          name?: string
          organization_id?: string
          slug?: string
          storefront_id?: string
          theme_color?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "storefronts_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "storefronts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          amount: number
          billing_frequency: Database["public"]["Enums"]["frequency"]
          charge_day: number | null
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string | null
          display_on_storefront: boolean
          failed_payment_action:
            | Database["public"]["Enums"]["failed_payment_action"]
            | null
          first_payment_type: Database["public"]["Enums"]["first_payment_type"]
          image_url: string | null
          is_active: boolean
          merchant_id: string
          metadata: Json | null
          name: string
          organization_id: string
          plan_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          billing_frequency: Database["public"]["Enums"]["frequency"]
          charge_day?: number | null
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          display_on_storefront?: boolean
          failed_payment_action?:
            | Database["public"]["Enums"]["failed_payment_action"]
            | null
          first_payment_type?: Database["public"]["Enums"]["first_payment_type"]
          image_url?: string | null
          is_active?: boolean
          merchant_id: string
          metadata?: Json | null
          name: string
          organization_id: string
          plan_id?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          billing_frequency?: Database["public"]["Enums"]["frequency"]
          charge_day?: number | null
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          display_on_storefront?: boolean
          failed_payment_action?:
            | Database["public"]["Enums"]["failed_payment_action"]
            | null
          first_payment_type?: Database["public"]["Enums"]["first_payment_type"]
          image_url?: string | null
          is_active?: boolean
          merchant_id?: string
          metadata?: Json | null
          name?: string
          organization_id?: string
          plan_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_plans_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "subscription_plans_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "subscription_plans_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      support_requests: {
        Row: {
          category: Database["public"]["Enums"]["support_category"]
          created_at: string
          image_url: string | null
          merchant_id: string
          message: string
          organization_id: string
          priority: Database["public"]["Enums"]["support_priority"]
          status: Database["public"]["Enums"]["support_status"]
          support_requests_id: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["support_category"]
          created_at?: string
          image_url?: string | null
          merchant_id: string
          message: string
          organization_id: string
          priority?: Database["public"]["Enums"]["support_priority"]
          status?: Database["public"]["Enums"]["support_status"]
          support_requests_id?: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["support_category"]
          created_at?: string
          image_url?: string | null
          merchant_id?: string
          message?: string
          organization_id?: string
          priority?: Database["public"]["Enums"]["support_priority"]
          status?: Database["public"]["Enums"]["support_status"]
          support_requests_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_requests_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "support_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      team_balance_access_rules: {
        Row: {
          account_id: string | null
          approval_required: boolean
          can_view: boolean
          can_withdraw: boolean
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"] | null
          merchant_id: string | null
          organization_id: string
          role: Database["public"]["Enums"]["member_role"]
          rule_id: string
          updated_at: string
          withdraw_limit: number | null
        }
        Insert: {
          account_id?: string | null
          approval_required?: boolean
          can_view?: boolean
          can_withdraw?: boolean
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"] | null
          merchant_id?: string | null
          organization_id: string
          role: Database["public"]["Enums"]["member_role"]
          rule_id?: string
          updated_at?: string
          withdraw_limit?: number | null
        }
        Update: {
          account_id?: string | null
          approval_required?: boolean
          can_view?: boolean
          can_withdraw?: boolean
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"] | null
          merchant_id?: string | null
          organization_id?: string
          role?: Database["public"]["Enums"]["member_role"]
          rule_id?: string
          updated_at?: string
          withdraw_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "team_balance_access_rules_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "merchant_accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "team_balance_access_rules_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "team_balance_access_rules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      transactions: {
        Row: {
          additional_fees: Json | null
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id: string
          description: string | null
          fee_amount: number
          fee_reference: string
          gross_amount: number
          merchant_id: string
          metadata: Json | null
          net_amount: number
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          product_id: string | null
          provider_code: Database["public"]["Enums"]["provider_code"]
          status: Database["public"]["Enums"]["transaction_status"]
          subscription_id: string | null
          transaction_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
        }
        Insert: {
          additional_fees?: Json | null
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          customer_id: string
          description?: string | null
          fee_amount: number
          fee_reference: string
          gross_amount: number
          merchant_id: string
          metadata?: Json | null
          net_amount: number
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          product_id?: string | null
          provider_code: Database["public"]["Enums"]["provider_code"]
          status?: Database["public"]["Enums"]["transaction_status"]
          subscription_id?: string | null
          transaction_id?: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Update: {
          additional_fees?: Json | null
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          customer_id?: string
          description?: string | null
          fee_amount?: number
          fee_reference?: string
          gross_amount?: number
          merchant_id?: string
          metadata?: Json | null
          net_amount?: number
          organization_id?: string
          payment_method_code?: Database["public"]["Enums"]["payment_method_code"]
          product_id?: string | null
          provider_code?: Database["public"]["Enums"]["provider_code"]
          status?: Database["public"]["Enums"]["transaction_status"]
          subscription_id?: string | null
          transaction_id?: string
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "transactions_fee_reference_fkey"
            columns: ["fee_reference"]
            isOneToOne: false
            referencedRelation: "fees"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "transactions_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "transactions_payment_method_code_provider_code_fkey"
            columns: ["payment_method_code", "provider_code"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["payment_method_code", "provider_code"]
          },
          {
            foreignKeyName: "transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "merchant_products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "transactions_provider_code_fkey"
            columns: ["provider_code"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "transactions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "merchant_subscriptions"
            referencedColumns: ["subscription_id"]
          },
        ]
      }
      webhooks: {
        Row: {
          authorized_events: Database["public"]["Enums"]["webhook_event"][]
          created_at: string
          is_active: boolean
          last_payload: Json | null
          last_response_body: string | null
          last_response_status: number | null
          last_triggered_at: string | null
          merchant_id: string
          metadata: Json | null
          organization_id: string
          retry_count: number | null
          updated_at: string
          url: string
          verification_token: string
          webhook_id: string
        }
        Insert: {
          authorized_events?: Database["public"]["Enums"]["webhook_event"][]
          created_at?: string
          is_active?: boolean
          last_payload?: Json | null
          last_response_body?: string | null
          last_response_status?: number | null
          last_triggered_at?: string | null
          merchant_id: string
          metadata?: Json | null
          organization_id: string
          retry_count?: number | null
          updated_at?: string
          url: string
          verification_token?: string
          webhook_id?: string
        }
        Update: {
          authorized_events?: Database["public"]["Enums"]["webhook_event"][]
          created_at?: string
          is_active?: boolean
          last_payload?: Json | null
          last_response_body?: string | null
          last_response_status?: number | null
          last_triggered_at?: string | null
          merchant_id?: string
          metadata?: Json | null
          organization_id?: string
          retry_count?: number | null
          updated_at?: string
          url?: string
          verification_token?: string
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "webhooks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_created_at_column: {
        Args: {
          p_table_name: string
        }
        Returns: undefined
      }
      add_timestamp_columns: {
        Args: {
          p_table_name: string
        }
        Returns: undefined
      }
      add_updated_at_column: {
        Args: {
          p_table_name: string
        }
        Returns: undefined
      }
      calculate_merchant_mrr: {
        Args: {
          p_merchant_id: string
        }
        Returns: {
          mrr: number
          arr: number
        }[]
      }
      calculate_organization_metrics: {
        Args: {
          p_organization_id: string
        }
        Returns: {
          mrr: number
          arr: number
          total_transactions: number
          total_revenue: number
        }[]
      }
      check_activation_state: {
        Args: {
          p_merchant_id: string
        }
        Returns: Database["public"]["Enums"]["kyc_status"]
      }
      check_activation_status: {
        Args: {
          p_merchant_id: string
        }
        Returns: boolean
      }
      check_merchant_available_balance: {
        Args: {
          p_merchant_id: string
          p_currency_code: Database["public"]["Enums"]["currency_code"]
        }
        Returns: number
      }
      check_onboarding_status: {
        Args: {
          p_merchant_id: string
        }
        Returns: boolean
      }
      cleanup_expired_payment_links: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      column_exists: {
        Args: {
          p_table_name: string
          p_column_name: string
        }
        Returns: boolean
      }
      complete_activation: {
        Args: {
          p_merchant_id: string
          p_legal_organization_name: string
          p_tax_number: string
          p_business_description: string
          p_legal_country: string
          p_legal_region: string
          p_legal_city: string
          p_legal_postal_code: string
          p_legal_street: string
          p_proof_of_business: string
          p_business_platform_url: string
          p_authorized_signatory_name: string
          p_authorized_signatory_email: string
          p_authorized_signatory_phone_number: string
          p_legal_representative_id_url: string
          p_address_proof_url: string
          p_business_registration_url: string
        }
        Returns: undefined
      }
      complete_onboarding: {
        Args: {
          p_merchant_id: string
          p_phone_number: string
          p_country: string
          p_org_name: string
          p_org_email: string
          p_org_phone_number: string
          p_org_country: string
          p_org_region: string
          p_org_city: string
          p_org_street: string
          p_org_district: string
          p_org_postal_code: string
          p_org_industry: string
          p_org_website_url: string
          p_org_employee_number: string
          p_preferred_language: string
          p_store_handle: string
          p_how_did_you_hear_about_us: string
          p_avatar_url: string
          p_logo_url: string
          p_organization_position: string
        }
        Returns: undefined
      }
      convert_currency: {
        Args: {
          p_amount: number
          p_from_currency: Database["public"]["Enums"]["currency_code"]
          p_to_currency: Database["public"]["Enums"]["currency_code"]
          p_merchant_id?: string
          p_organization_id?: string
          p_conversion_type?: Database["public"]["Enums"]["conversion_type"]
          p_reference_id?: string
        }
        Returns: number
      }
      create_bank_account: {
        Args: {
          p_account_number: string
          p_account_name: string
          p_bank_name: string
          p_bank_code: string
          p_branch_code: string
          p_country: string
          p_is_default: boolean
        }
        Returns: string
      }
      create_checkout_session: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_amount: number
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_payment_link_id?: string
          p_customer_id?: string
          p_product_id?: string
          p_plan_id?: string
          p_success_url?: string
          p_cancel_url?: string
          p_customer_email?: string
          p_customer_name?: string
          p_customer_phone?: string
          p_allowed_providers?: Database["public"]["Enums"]["provider_code"][]
          p_metadata?: Json
          p_expiration_minutes?: number
        }
        Returns: Json
      }
      create_checkout_session_from_payment_link: {
        Args: {
          p_payment_link_id: string
          p_customer_id?: string
          p_customer_email?: string
          p_customer_name?: string
          p_customer_phone?: string
          p_expiration_minutes?: number
        }
        Returns: Json
      }
      create_customer: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_name: string
          p_email: string
          p_phone_number: string
          p_whatsapp_number: string
          p_country: string
          p_city: string
          p_address: string
          p_postal_code: string
          p_is_business: boolean
        }
        Returns: string
      }
      create_feedback: {
        Args: {
          p_merchant_id: string
          p_sentiment: string
          p_message: string
        }
        Returns: undefined
      }
      create_index_if_not_exists: {
        Args: {
          p_index_name: string
          p_table_name: string
          p_column_name: string
          p_index_type?: string
        }
        Returns: undefined
      }
      create_initial_organization: {
        Args: {
          new_merchant_id: string
        }
        Returns: undefined
      }
      create_or_update_customer:
        | {
            Args: {
              p_merchant_id: string
              p_organization_id: string
              p_name: string
              p_email?: string
              p_phone_number?: string
              p_whatsapp_number?: string
              p_country?: string
              p_city?: string
              p_address?: string
              p_postal_code?: string
            }
            Returns: string
          }
        | {
            Args: {
              p_organization_id: string
              p_merchant_id: string
              p_first_name: string
              p_last_name: string
              p_email: string
              p_phone: string
              p_address?: string
              p_city?: string
              p_state?: string
              p_postal_code?: string
              p_country?: string
              p_whatsapp_number?: string
            }
            Returns: Json
          }
      create_organization: {
        Args: {
          p_merchant_id: string
          p_name?: string
          p_role?: Database["public"]["Enums"]["member_role"]
        }
        Returns: {
          organization_id: string
          store_handle: string
        }[]
      }
      create_organization_webhook: {
        Args: {
          p_merchant_id: string
          p_url: string
          p_authorized_events: Database["public"]["Enums"]["webhook_event"][]
          p_is_active?: boolean
          p_metadata?: Json
        }
        Returns: {
          authorized_events: Database["public"]["Enums"]["webhook_event"][]
          created_at: string
          is_active: boolean
          last_payload: Json | null
          last_response_body: string | null
          last_response_status: number | null
          last_triggered_at: string | null
          merchant_id: string
          metadata: Json | null
          organization_id: string
          retry_count: number | null
          updated_at: string
          url: string
          verification_token: string
          webhook_id: string
        }
      }
      create_payment_link: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_link_type: Database["public"]["Enums"]["link_type"]
          p_title: string
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_public_description?: string
          p_private_description?: string
          p_price?: number
          p_allowed_providers?: Database["public"]["Enums"]["provider_code"][]
          p_allow_coupon_code?: boolean
          p_expires_at?: string
          p_success_url?: string
          p_cancel_url?: string
          p_plan_id?: string
          p_product_id?: string
        }
        Returns: string
      }
      create_product: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_name: string
          p_description: string
          p_price: number
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_image_url?: string
          p_is_active?: boolean
          p_display_on_storefront?: boolean
          p_fee_type_ids?: string[]
        }
        Returns: string
      }
      create_refund: {
        Args: {
          p_merchant_id: string
          p_transaction_id: string
          p_amount: number
          p_reason?: string
          p_metadata?: Json
        }
        Returns: string
      }
      create_subscription: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_customer_id: string
          p_name: string
          p_description: string
          p_start_date: string
          p_billing_frequency: Database["public"]["Enums"]["frequency"]
          p_amount: number
          p_failed_payment_action: string
          p_email_notifications: Json
          p_metadata: Json
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_retry_payment_every?: number
          p_total_retries?: number
        }
        Returns: string
      }
      create_subscription_plan: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_name: string
          p_description: string
          p_billing_frequency: Database["public"]["Enums"]["frequency"]
          p_amount: number
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_failed_payment_action?: Database["public"]["Enums"]["failed_payment_action"]
          p_charge_day?: number
          p_metadata?: Json
          p_first_payment_type?: Database["public"]["Enums"]["first_payment_type"]
          p_display_on_storefront?: boolean
          p_image_url?: string
        }
        Returns: string
      }
      create_support_request: {
        Args: {
          p_merchant_id: string
          p_category: Database["public"]["Enums"]["support_category"]
          p_message: string
          p_image_url?: string
          p_priority?: Database["public"]["Enums"]["support_priority"]
        }
        Returns: string
      }
      create_transaction: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_customer_id: string
          p_amount: number
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_provider_code: Database["public"]["Enums"]["provider_code"]
          p_payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          p_description?: string
          p_product_id?: string
          p_subscription_id?: string
          p_metadata?: Json
        }
        Returns: string
      }
      create_updated_at_trigger: {
        Args: {
          p_table_name: string
        }
        Returns: undefined
      }
      create_wave_checkout_transaction: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_customer_id: string
          p_amount: number
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_provider_checkout_id: string
          p_checkout_url: string
          p_error_url: string
          p_success_url: string
          p_product_id?: string
          p_subscription_id?: string
          p_description?: string
          p_metadata?: Json
        }
        Returns: string
      }
      delete_api_key: {
        Args: {
          p_api_key: string
        }
        Returns: undefined
      }
      delete_bank_account: {
        Args: {
          p_bank_account_id: string
        }
        Returns: undefined
      }
      delete_customer: {
        Args: {
          p_customer_id: string
        }
        Returns: undefined
      }
      delete_organization_fee_type: {
        Args: {
          p_organization_id: string
          p_fee_type_id: string
        }
        Returns: boolean
      }
      delete_organization_webhook: {
        Args: {
          p_webhook_id: string
          p_merchant_id: string
        }
        Returns: undefined
      }
      delete_payment_link: {
        Args: {
          p_link_id: string
        }
        Returns: undefined
      }
      delete_product: {
        Args: {
          p_product_id: string
        }
        Returns: undefined
      }
      delete_storage_object: {
        Args: {
          bucket: string
          object: string
        }
        Returns: Record<string, unknown>
      }
      delete_storage_object_from_bucket: {
        Args: {
          bucket_name: string
          object_path: string
        }
        Returns: Record<string, unknown>
      }
      delete_subscription_plan: {
        Args: {
          p_plan_id: string
        }
        Returns: undefined
      }
      disable_2fa: {
        Args: {
          p_merchant_id: string
        }
        Returns: boolean
      }
      enable_2fa: {
        Args: {
          p_merchant_id: string
          p_totp_secret: string
          p_verification_code: string
        }
        Returns: boolean
      }
      fetch_api_keys: {
        Args: {
          p_organization_id: string
        }
        Returns: {
          name: string
          api_key: string
          is_active: boolean
          created_at: string
        }[]
      }
      fetch_average_customer_lifetime_value: {
        Args: {
          p_merchant_id: string
          p_start_date?: string
          p_end_date?: string
        }
        Returns: number
      }
      fetch_average_retention_rate: {
        Args: {
          p_merchant_id: string
          p_start_date?: string
          p_end_date?: string
        }
        Returns: number
      }
      fetch_average_transaction_value: {
        Args: {
          p_merchant_id: string
          p_start_date?: string
          p_end_date?: string
        }
        Returns: number
      }
      fetch_balance_breakdown: {
        Args: {
          p_merchant_id: string
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          currency_code: Database["public"]["Enums"]["currency_code"]
          available_balance: number
          pending_balance: number
          total_balance: number
          converted_available_balance: number
          converted_pending_balance: number
          converted_total_balance: number
          target_currency: Database["public"]["Enums"]["currency_code"]
        }[]
      }
      fetch_bank_accounts: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          account_number: string
          account_name: string
          bank_name: string
          bank_code: string
          branch_code: string
          country: string
          is_default: boolean
          is_valid: boolean
          created_at: string
          updated_at: string
        }[]
      }
      fetch_billing_statements: {
        Args: {
          p_merchant_id: string
        }
        Returns: {
          platform_invoice_id: string
          merchant_id: string
          organization_id: string
          monthly_fees: number
          outstanding_balance: number
          total_amount: number
          description: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          invoice_date: string
          status: Database["public"]["Enums"]["invoice_status"]
          created_at: string
          metadata: Json
        }[]
      }
      fetch_completion_rate: {
        Args: {
          p_merchant_id: string
          p_start_date?: string
          p_end_date?: string
        }
        Returns: {
          completed: number
          refunded: number
          failed: number
        }[]
      }
      fetch_customer: {
        Args: {
          p_customer_id: string
        }
        Returns: {
          customer_id: string
          name: string
          email: string
          phone_number: string
          whatsapp_number: string
          country: string
          city: string
          address: string
          postal_code: string
          is_business: boolean
        }[]
      }
      fetch_customer_transactions: {
        Args: {
          p_customer_id: string
        }
        Returns: {
          transaction_id: string
          description: string
          gross_amount: number
          currency_code: Database["public"]["Enums"]["currency_code"]
          created_at: string
        }[]
      }
      fetch_customers: {
        Args: {
          p_merchant_id: string
          p_search_term?: string
          p_customer_type?: string
          p_page?: number
          p_page_size?: number
        }
        Returns: {
          customer_id: string
          name: string
          email: string
          phone_number: string
          whatsapp_number: string
          country: string
          city: string
          address: string
          postal_code: string
          is_business: boolean
          created_at: string
          updated_at: string
        }[]
      }
      fetch_data_for_checkout: {
        Args: {
          p_link_id: string
        }
        Returns: {
          link_id: string
          url: string
          title: string
          public_description: string
          private_description: string
          price: number
          currency_code: Database["public"]["Enums"]["currency_code"]
          allowed_providers: Database["public"]["Enums"]["provider_code"][]
          allow_coupon_code: boolean
          success_url: string
          cancel_url: string
          metadata: Json
          product_id: string
          product_name: string
          product_description: string
          product_price: number
          product_image_url: string
          plan_id: string
          plan_name: string
          plan_description: string
          plan_amount: number
          plan_billing_frequency: Database["public"]["Enums"]["frequency"]
          plan_image_url: string
          organization_logo_url: string
          organization_name: string
        }[]
      }
      fetch_fee_amount: {
        Args: {
          p_merchant_id: string
          p_start_date?: string
          p_end_date?: string
        }
        Returns: number
      }
      fetch_feedback: {
        Args: {
          p_merchant_id: string
          p_page?: number
          p_page_size?: number
        }
        Returns: {
          id: string
          sentiment: string
          message: string
          status: Database["public"]["Enums"]["feedback_status"]
          created_at: string
        }[]
      }
      fetch_gross_amount: {
        Args: {
          p_merchant_id: string
          p_start_date?: string
          p_end_date?: string
        }
        Returns: number
      }
      fetch_latest_conversion_rates: {
        Args: {
          p_from_currency?: Database["public"]["Enums"]["currency_code"]
          p_to_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          from_currency: Database["public"]["Enums"]["currency_code"]
          to_currency: Database["public"]["Enums"]["currency_code"]
          rate: number
          inverse_rate: number
          created_at: string
        }[]
      }
      fetch_logs: {
        Args: {
          p_merchant_id: string
          p_event?: Database["public"]["Enums"]["event_type"]
          p_severity?: string
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          log_id: string
          event: Database["public"]["Enums"]["event_type"]
          ip_address: string
          operating_system: string
          browser: string
          details: Json
          severity: string
          request_url: string
          request_method: string
          response_status: number
          created_at: string
          total_count: number
        }[]
      }
      fetch_merchant_bank_accounts: {
        Args: {
          p_merchant_id: string
        }
        Returns: {
          bank_account_id: string
          account_number: string
          account_name: string
          bank_name: string
          bank_code: string
          branch_code: string
          country: string
          is_default: boolean
          is_valid: boolean
          created_at: string
          updated_at: string
        }[]
      }
      fetch_merchant_details: {
        Args: {
          p_user_id: string
        }
        Returns: {
          merchant_id: string
          name: string
          email: string
          avatar_url: string
          phone_number: string
          pin_code: string
          onboarded: boolean
          preferred_language: string
        }[]
      }
      fetch_merchant_organizations: {
        Args: {
          p_merchant_id: string
        }
        Returns: {
          organization_id: string
          organization_name: string
          organization_logo_url: string
          merchant_role: string
          is_current: boolean
        }[]
      }
      fetch_mrr_metrics_custom_range: {
        Args: {
          p_merchant_id: string
          p_start_date: string
          p_end_date: string
        }
        Returns: {
          date: string
          mrr: number
        }[]
      }
      fetch_notifications: {
        Args: {
          p_merchant_id: string
        }
        Returns: {
          notification_id: string
          type: Database["public"]["Enums"]["notification_type"]
          message: string
          is_read: boolean
          created_at: string
        }[]
      }
      fetch_organization_checkout_settings: {
        Args: {
          p_organization_id: string
        }
        Returns: {
          organization_id: string
          default_language: string
          display_currency: Database["public"]["Enums"]["currency_code"]
          payment_link_duration: number
          customer_notifications: Json
          merchant_recipients: Json
          fee_types: Json
        }[]
      }
      fetch_organization_details: {
        Args: {
          p_merchant_id: string
          p_organization_id?: string
        }
        Returns: {
          organization_id: string
          name: string
          email: string
          logo_url: string
          website_url: string
          verified: boolean
          default_currency: Database["public"]["Enums"]["currency_code"]
          country: string
          region: string
          city: string
          district: string
          street: string
          postal_code: string
        }[]
      }
      fetch_organization_fees: {
        Args: {
          p_merchant_id: string
        }
        Returns: {
          fee_type_id: string
          name: string
          percentage: number
          is_enabled: boolean
        }[]
      }
      fetch_organization_id: {
        Args: {
          p_merchant_id: string
        }
        Returns: {
          organization_id: string
        }[]
      }
      fetch_organization_providers_settings: {
        Args: {
          p_organization_id: string
        }
        Returns: {
          provider_code: Database["public"]["Enums"]["provider_code"]
          is_connected: boolean
          phone_number: string
          is_phone_verified: boolean
        }[]
      }
      fetch_organization_webhooks: {
        Args: {
          p_merchant_id: string
          p_event?: Database["public"]["Enums"]["webhook_event"]
          p_is_active?: boolean
        }
        Returns: {
          authorized_events: Database["public"]["Enums"]["webhook_event"][]
          created_at: string
          is_active: boolean
          last_payload: Json | null
          last_response_body: string | null
          last_response_status: number | null
          last_triggered_at: string | null
          merchant_id: string
          metadata: Json | null
          organization_id: string
          retry_count: number | null
          updated_at: string
          url: string
          verification_token: string
          webhook_id: string
        }[]
      }
      fetch_payment_links:
        | {
            Args: {
              p_merchant_id: string
              p_link_type?: Database["public"]["Enums"]["link_type"]
              p_currency_code?: Database["public"]["Enums"]["currency_code"]
              p_is_active?: boolean
              p_page?: number
              p_page_size?: number
            }
            Returns: {
              link_id: string
              merchant_id: string
              organization_id: string
              link_type: Database["public"]["Enums"]["link_type"]
              url: string
              product_id: string
              product_name: string
              product_price: number
              plan_id: string
              plan_name: string
              plan_amount: number
              title: string
              public_description: string
              private_description: string
              price: number
              currency_code: Database["public"]["Enums"]["currency_code"]
              allowed_providers: Database["public"]["Enums"]["provider_code"][]
              allow_coupon_code: boolean
              is_active: boolean
              expires_at: string
              success_url: string
              metadata: Json
              created_at: string
              updated_at: string
            }[]
          }
        | {
            Args: {
              p_merchant_id: string
              p_link_type?: Database["public"]["Enums"]["link_type"]
              p_currency_code?: Database["public"]["Enums"]["currency_code"]
              p_is_active?: boolean
              p_page?: number
              p_page_size?: number
              p_include_expired?: boolean
            }
            Returns: {
              link_id: string
              merchant_id: string
              organization_id: string
              link_type: Database["public"]["Enums"]["link_type"]
              url: string
              product_id: string
              product_name: string
              product_price: number
              plan_id: string
              plan_name: string
              plan_amount: number
              title: string
              public_description: string
              private_description: string
              price: number
              currency_code: Database["public"]["Enums"]["currency_code"]
              allowed_providers: Database["public"]["Enums"]["provider_code"][]
              allow_coupon_code: boolean
              is_active: boolean
              expires_at: string
              success_url: string
              metadata: Json
              created_at: string
              updated_at: string
            }[]
          }
      fetch_payout_count: {
        Args: {
          p_account_id: string
          p_start_date?: string
          p_end_date?: string
        }
        Returns: number
      }
      fetch_payouts: {
        Args: {
          p_merchant_id: string
          p_statuses?: string[]
          p_page_number?: number
          p_page_size?: number
        }
        Returns: {
          payout_id: string
          account_id: string
          merchant_id: string
          organization_id: string
          bank_account_id: string
          amount: number
          currency_code: Database["public"]["Enums"]["currency_code"]
          status: Database["public"]["Enums"]["payout_status"]
          created_at: string
          updated_at: string
        }[]
      }
      fetch_product_fees: {
        Args: {
          p_product_id: string
        }
        Returns: {
          fee_type_id: string
          name: string
          percentage: number
          is_enabled: boolean
        }[]
      }
      fetch_product_transactions: {
        Args: {
          p_product_id: string
        }
        Returns: {
          transaction_id: string
          description: string
          gross_amount: number
          currency_code: Database["public"]["Enums"]["currency_code"]
          created_at: string
        }[]
      }
      fetch_products: {
        Args: {
          p_merchant_id: string
          p_is_active?: boolean
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          product_id: string
          merchant_id: string
          organization_id: string
          name: string
          description: string
          price: number
          currency_code: Database["public"]["Enums"]["currency_code"]
          image_url: string
          is_active: boolean
          display_on_storefront: boolean
          created_at: string
          updated_at: string
          total_count: number
        }[]
      }
      fetch_provider_distribution_custom_range: {
        Args: {
          p_merchant_id: string
          p_start_date: string
          p_end_date: string
        }
        Returns: {
          date: string
          provider_code: Database["public"]["Enums"]["provider_code"]
          transaction_count: number
        }[]
      }
      fetch_revenue_custom_range: {
        Args: {
          p_merchant_id: string
          p_start_date: string
          p_end_date: string
        }
        Returns: {
          date: string
          revenue: number
        }[]
      }
      fetch_sidebar_data: {
        Args: {
          p_merchant_id: string
          p_organization_id?: string
        }
        Returns: {
          organization_id: string
          organization_name: string
          organization_logo_url: string
          merchant_name: string
          merchant_role: string
        }[]
      }
      fetch_subscription_plans: {
        Args: {
          p_merchant_id: string
          p_page?: number
          p_page_size?: number
        }
        Returns: {
          plan_id: string
          name: string
          description: string
          billing_frequency: Database["public"]["Enums"]["frequency"]
          amount: number
          currency_code: Database["public"]["Enums"]["currency_code"]
          failed_payment_action: Database["public"]["Enums"]["failed_payment_action"]
          charge_day: number
          metadata: Json
          created_at: string
          updated_at: string
          display_on_storefront: boolean
          image_url: string
        }[]
      }
      fetch_subscription_transactions: {
        Args: {
          p_subscription_id: string
        }
        Returns: {
          transaction_id: string
          description: string
          gross_amount: number
          currency_code: Database["public"]["Enums"]["currency_code"]
          created_at: string
        }[]
      }
      fetch_subscriptions: {
        Args: {
          p_merchant_id: string
          p_status?: Database["public"]["Enums"]["subscription_status"]
          p_page?: number
          p_page_size?: number
        }
        Returns: {
          subscription_id: string
          plan_id: string
          plan_name: string
          customer_id: string
          customer_name: string
          status: Database["public"]["Enums"]["subscription_status"]
          start_date: string
          end_date: string
          next_billing_date: string
          metadata: Json
          created_at: string
          updated_at: string
          amount: number
          currency_code: Database["public"]["Enums"]["currency_code"]
        }[]
      }
      fetch_support_requests: {
        Args: {
          p_merchant_id: string
          p_status?: Database["public"]["Enums"]["support_status"]
          p_page?: number
          p_page_size?: number
        }
        Returns: {
          support_requests_id: string
          category: Database["public"]["Enums"]["support_category"]
          message: string
          image_url: string
          status: Database["public"]["Enums"]["support_status"]
          priority: Database["public"]["Enums"]["support_priority"]
          created_at: string
          updated_at: string
        }[]
      }
      fetch_team_members: {
        Args: {
          p_organization_id: string
        }
        Returns: {
          merchant_id: string
          merchant_name: string
          merchant_email: string
          role: Database["public"]["Enums"]["member_role"]
          team_status: Database["public"]["Enums"]["team_status"]
          organization_position: string
          invitation_email: string
          created_at: string
        }[]
      }
      fetch_top_performing_subscription_plans: {
        Args: {
          p_merchant_id: string
          p_start_date?: string
          p_end_date?: string
          p_limit?: number
        }
        Returns: {
          plan_name: string
          sales_count: number
          total_revenue: number
        }[]
      }
      fetch_total_incoming_amount: {
        Args: {
          p_merchant_id: string
          p_start_date?: string
          p_end_date?: string
        }
        Returns: number
      }
      fetch_transaction_count: {
        Args: {
          p_merchant_id: string
          p_start_date?: string
          p_end_date?: string
        }
        Returns: number
      }
      fetch_transactions:
        | {
            Args: {
              p_merchant_id: string
              p_provider_code?: Database["public"]["Enums"]["provider_code"]
              p_status?: Database["public"]["Enums"]["transaction_status"][]
              p_type?: Database["public"]["Enums"]["transaction_type"][]
              p_currency?: Database["public"]["Enums"]["currency_code"][]
              p_payment_method?: Database["public"]["Enums"]["payment_method_code"][]
              p_page?: number
              p_page_size?: number
            }
            Returns: {
              transaction_id: string
              customer_name: string
              customer_email: string
              customer_phone: string
              customer_country: string
              customer_city: string
              customer_address: string
              customer_postal_code: string
              gross_amount: number
              net_amount: number
              currency_code: Database["public"]["Enums"]["currency_code"]
              payment_method_code: Database["public"]["Enums"]["payment_method_code"]
              status: Database["public"]["Enums"]["transaction_status"]
              transaction_type: Database["public"]["Enums"]["transaction_type"]
              created_at: string
              provider_code: Database["public"]["Enums"]["provider_code"]
              product_id: string
              product_name: string
              product_description: string
              product_price: number
            }[]
          }
        | {
            Args: {
              p_merchant_id: string
              p_provider_code?: Database["public"]["Enums"]["provider_code"]
              p_status?: Database["public"]["Enums"]["transaction_status"][]
              p_type?: Database["public"]["Enums"]["transaction_type"][]
              p_currency?: Database["public"]["Enums"]["currency_code"][]
              p_payment_method?: Database["public"]["Enums"]["payment_method_code"][]
              p_page?: number
              p_page_size?: number
              p_start_date?: string
              p_end_date?: string
            }
            Returns: {
              transaction_id: string
              customer_name: string
              customer_email: string
              customer_phone: string
              customer_country: string
              customer_city: string
              customer_address: string
              customer_postal_code: string
              gross_amount: number
              net_amount: number
              currency_code: Database["public"]["Enums"]["currency_code"]
              payment_method_code: Database["public"]["Enums"]["payment_method_code"]
              status: Database["public"]["Enums"]["transaction_status"]
              transaction_type: Database["public"]["Enums"]["transaction_type"]
              created_at: string
              provider_code: Database["public"]["Enums"]["provider_code"]
              product_id: string
              product_name: string
              product_description: string
              product_price: number
            }[]
          }
      fetch_user_avatar: {
        Args: {
          p_user_id: string
        }
        Returns: string
      }
      generate_api_key: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_name: string
          p_expiration_date?: string
          p_environment?: string
        }
        Returns: {
          api_key: string
        }[]
      }
      generate_monthly_platform_invoice: {
        Args: {
          p_merchant_id: string
        }
        Returns: string
      }
      get_api_usage_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_active_users: number
          last_24h_users: number
          last_7d_users: number
          last_30d_users: number
        }[]
      }
      get_base_url: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_checkout_session: {
        Args: {
          p_checkout_session_id: string
        }
        Returns: Json
      }
      get_client_info: {
        Args: Record<PropertyKey, never>
        Returns: {
          ip_address: string
          operating_system: string
          browser: string
        }[]
      }
      get_customer_demographics: {
        Args: Record<PropertyKey, never>
        Returns: {
          is_business: boolean
          country: string
          count: number
        }[]
      }
      get_global_banking_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_bank_accounts: number
          total_payouts: number
          total_payout_amount: number
          currency_code: Database["public"]["Enums"]["currency_code"]
          payout_status: Database["public"]["Enums"]["payout_status"]
        }[]
      }
      get_global_product_plan_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_products: number
          total_plans: number
          active_subscriptions: number
          avg_products_per_merchant: number
        }[]
      }
      get_global_refund_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_refunds: number
          total_refunded_amount: number
          status: Database["public"]["Enums"]["refund_status"]
          currency_code: Database["public"]["Enums"]["currency_code"]
        }[]
      }
      get_global_transaction_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_transactions: number
          total_gross_amount: number
          total_fee_amount: number
          total_net_amount: number
          currency_code: Database["public"]["Enums"]["currency_code"]
        }[]
      }
      get_invoices_by_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          status: string
          count: number
          amount: number
          due_amount: number
        }[]
      }
      get_merchant_balance_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          currency_code: string
          average_balance: number
          total_balance: number
          merchant_count: number
        }[]
      }
      get_merchant_customer_stats: {
        Args: {
          p_merchant_id: string
        }
        Returns: {
          total_customers: number
          business_customers: number
          individual_customers: number
          customers_with_transactions: number
        }[]
      }
      get_merchant_details_for_wave: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
        }
        Returns: {
          merchant_id: string
          merchant_name: string
          organization_id: string
          organization_name: string
          business_description: string
          website_url: string
          industry: string
          registration_number: string
          country: string
          email: string
          phone_number: string
        }[]
      }
      get_merchant_growth_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_merchants: number
          onboarded_merchants: number
          total_mrr: number
          total_arr: number
        }[]
      }
      get_merchant_organization_id: {
        Args: {
          p_merchant_id: string
        }
        Returns: string
      }
      get_merchant_platform_fees: {
        Args: {
          p_merchant_id: string
        }
        Returns: {
          last_30_days_fees: number
          last_month_fees: number
          outstanding_balance: number
          organization_id: string
        }[]
      }
      get_merchant_product_stats: {
        Args: {
          p_merchant_id: string
        }
        Returns: {
          total_products: number
          active_products: number
          total_plans: number
          active_plans: number
        }[]
      }
      get_merchant_refund_stats: {
        Args: {
          p_merchant_id: string
        }
        Returns: {
          total_refunds: number
          refunded_amount: number
          status: Database["public"]["Enums"]["refund_status"]
          currency_code: Database["public"]["Enums"]["currency_code"]
        }[]
      }
      get_merchant_transaction_stats: {
        Args: {
          p_merchant_id: string
        }
        Returns: {
          total_transactions: number
          total_amount: number
          total_fees: number
          net_amount: number
          currency_code: Database["public"]["Enums"]["currency_code"]
          status: Database["public"]["Enums"]["transaction_status"]
        }[]
      }
      get_organization_demographics: {
        Args: Record<PropertyKey, never>
        Returns: {
          industry: string
          status: string
          count: number
          country: string
          kyc_status: string
        }[]
      }
      get_organization_kyc_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          status: Database["public"]["Enums"]["kyc_status"]
          count: number
        }[]
      }
      get_organization_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_organizations: number
          verified_organizations: number
          total_customers: number
          total_merchants: number
        }[]
      }
      get_organizations_by_country: {
        Args: Record<PropertyKey, never>
        Returns: {
          country: string
          count: number
        }[]
      }
      get_organizations_by_industry: {
        Args: Record<PropertyKey, never>
        Returns: {
          industry: string
          status: Database["public"]["Enums"]["organization_status"]
          count: number
        }[]
      }
      get_payment_link_available_providers: {
        Args: {
          p_merchant_id: string
        }
        Returns: {
          code: Database["public"]["Enums"]["provider_code"]
          name: string
        }[]
      }
      get_plan_by_id: {
        Args: {
          plan_id: string
        }
        Returns: {
          id: string
          merchant_id: string
          organization_id: string
          name: string
          description: string
          billing_frequency: Database["public"]["Enums"]["frequency"]
          amount: number
          currency_code: Database["public"]["Enums"]["currency_code"]
          failed_payment_action: Database["public"]["Enums"]["failed_payment_action"]
          charge_day: number
          metadata: Json
          created_at: string
          updated_at: string
          first_payment_type: Database["public"]["Enums"]["first_payment_type"]
        }[]
      }
      get_product_by_id: {
        Args: {
          prod_id: string
        }
        Returns: {
          id: string
          name: string
          description: string
          price: number
          currency_code: Database["public"]["Enums"]["currency_code"]
          merchant_id: string
          organization_id: string
        }[]
      }
      get_subscription_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_subscriptions: number
          active_subscriptions: number
          total_revenue: number
          recurring_revenue: number
        }[]
      }
      get_subscriptions_by_plan: {
        Args: Record<PropertyKey, never>
        Returns: {
          plan_id: string
          plan_name: string
          total_count: number
          active_count: number
          total_revenue: number
          recurring_revenue: number
        }[]
      }
      get_team_members_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_members: number
          active_members: number
          pending_invites: number
          average_members_per_merchant: number
        }[]
      }
      get_top_performing_products: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          gross_revenue: number
          net_revenue: number
          transactions: number
        }[]
      }
      get_transaction_fee: {
        Args: {
          p_transaction_type: Database["public"]["Enums"]["transaction_type"]
          p_provider_code: Database["public"]["Enums"]["provider_code"]
          p_payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          p_currency_code: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          name: string
          percentage: number
          fixed_amount: number
        }[]
      }
      get_transaction_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_count: number
          total_gross_amount: number
          total_net_amount: number
          total_fee_amount: number
        }[]
      }
      get_transaction_stats_by_merchant: {
        Args: Record<PropertyKey, never>
        Returns: {
          merchant_id: string
          total_transactions: number
          total_amount: number
          average_amount: number
        }[]
      }
      get_transaction_stats_by_provider: {
        Args: Record<PropertyKey, never>
        Returns: {
          provider_code: string
          total_transactions: number
          total_amount: number
          successful_transactions: number
          failed_transactions: number
          success_rate: number
        }[]
      }
      get_transactions_by_date: {
        Args: Record<PropertyKey, never>
        Returns: {
          date: string
          count: number
          gross_amount: number
          net_amount: number
          fee_amount: number
        }[]
      }
      get_transactions_by_provider: {
        Args: Record<PropertyKey, never>
        Returns: {
          provider_code: string
          count: number
          gross_amount: number
          net_amount: number
          fee_amount: number
        }[]
      }
      get_transactions_by_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          status: string
          count: number
          gross_amount: number
        }[]
      }
      get_wave_payment_status: {
        Args: {
          p_provider_checkout_id: string
        }
        Returns: {
          status: Database["public"]["Enums"]["transaction_status"]
          payment_status: Database["public"]["Enums"]["provider_payment_status"]
          error_code: string
          error_message: string
        }[]
      }
      initiate_withdrawal: {
        Args: {
          p_merchant_id: string
          p_amount: number
          p_bank_account_id: string
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          success: boolean
          message: string
        }[]
      }
      invite_team_member: {
        Args: {
          p_organization_id: string
          p_email: string
          p_role: Database["public"]["Enums"]["member_role"]
          p_position: string
        }
        Returns: undefined
      }
      is_organization_admin: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
        }
        Returns: boolean
      }
      log_event: {
        Args: {
          p_merchant_id: string
          p_event: Database["public"]["Enums"]["event_type"]
          p_details?: Json
          p_severity?: string
          p_request_url?: string
          p_request_method?: string
          p_response_status?: number
        }
        Returns: string
      }
      manage_organization_fee_type: {
        Args: {
          p_organization_id: string
          p_fee_type_id?: string
          p_name?: string
          p_percentage?: number
          p_is_enabled?: boolean
        }
        Returns: string
      }
      mark_all_notifications_read: {
        Args: {
          p_merchant_id: string
        }
        Returns: undefined
      }
      mark_notification_read: {
        Args: {
          p_notification_id: string
        }
        Returns: undefined
      }
      process_checkout_transaction: {
        Args: {
          p_checkout_session_id: string
          p_payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          p_provider_code: Database["public"]["Enums"]["provider_code"]
          p_provider_transaction_id?: string
          p_provider_payment_details?: Json
        }
        Returns: Json
      }
      process_payment: {
        Args: {
          p_merchant_id: string
          p_amount: number
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_provider_code: Database["public"]["Enums"]["provider_code"]
          p_metadata?: Json
        }
        Returns: string
      }
      reactivate_merchant: {
        Args: {
          p_merchant_id: string
        }
        Returns: undefined
      }
      reactivate_valid_payment_links: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      recalculate_all_merchants_mrr: {
        Args: Record<PropertyKey, never>
        Returns: {
          merchant_id: string
          mrr: number
          arr: number
        }[]
      }
      remove_team_member: {
        Args: {
          p_organization_id: string
          p_merchant_id: string
        }
        Returns: undefined
      }
      rollover_provider_balance_quarterly: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      safe_delete_payment_link: {
        Args: {
          p_link_id: string
        }
        Returns: boolean
      }
      save_conversion_rates: {
        Args: {
          p_from_currency: Database["public"]["Enums"]["currency_code"]
          p_to_currency: Database["public"]["Enums"]["currency_code"]
          p_rate: number
        }
        Returns: {
          success: boolean
          message: string
        }[]
      }
      send_activation_request_notification: {
        Args: {
          merchant_id: string
          legal_name: string
          signatory_name: string
          signatory_email: string
          business_description: string
          country: string
          request_date: string
        }
        Returns: undefined
      }
      send_activation_submitted_email: {
        Args: {
          merchant_email: string
          signatory_name: string
        }
        Returns: undefined
      }
      send_merchant_support_confirmation: {
        Args: {
          p_merchant_email: string
          p_support_request_id: string
        }
        Returns: undefined
      }
      send_onboarding_welcome_email: {
        Args: {
          user_email: string
          user_name: string
        }
        Returns: undefined
      }
      send_provider_connected_notification: {
        Args: {
          p_organization_id: string
          p_provider_code: Database["public"]["Enums"]["provider_code"]
        }
        Returns: undefined
      }
      send_signup_notification: {
        Args: {
          merchant_name: string
          merchant_email: string
          signup_date: string
        }
        Returns: undefined
      }
      send_support_request_notification: {
        Args: {
          p_merchant_name: string
          p_merchant_email: string
          p_category: Database["public"]["Enums"]["support_category"]
          p_message: string
          p_image_url: string
          p_created_at: string
        }
        Returns: undefined
      }
      set_default_bank_account: {
        Args: {
          p_bank_account_id: string
        }
        Returns: undefined
      }
      soft_delete_merchant: {
        Args: {
          p_merchant_id: string
        }
        Returns: undefined
      }
      test_organization_webhook: {
        Args: {
          p_webhook_id: string
          p_merchant_id: string
        }
        Returns: boolean
      }
      trigger_exists: {
        Args: {
          p_table_name: string
          p_trigger_name: string
        }
        Returns: boolean
      }
      update_api_key_status: {
        Args: {
          p_api_key: string
          p_is_active: boolean
          p_merchant_id: string
        }
        Returns: undefined
      }
      update_auto_withdrawal_settings: {
        Args: {
          p_bank_account_id: string
          p_enabled: boolean
          p_day: number
        }
        Returns: undefined
      }
      update_checkout_session_customer: {
        Args: {
          p_checkout_session_id: string
          p_customer_id: string
          p_customer_email?: string
          p_customer_name?: string
          p_customer_phone?: string
        }
        Returns: boolean
      }
      update_checkout_session_status: {
        Args: {
          p_checkout_session_id: string
          p_status: Database["public"]["Enums"]["checkout_session_status"]
        }
        Returns: boolean
      }
      update_customer: {
        Args: {
          p_customer_id: string
          p_name: string
          p_email: string
          p_phone_number: string
          p_whatsapp_number: string
          p_country: string
          p_city: string
          p_address: string
          p_postal_code: string
          p_is_business: boolean
        }
        Returns: undefined
      }
      update_customer_notifications: {
        Args: {
          p_organization_id: string
          p_notifications: Json
        }
        Returns: undefined
      }
      update_kyc_document_url: {
        Args: {
          p_organization_id: string
          p_document_type: string
          p_document_url: string
        }
        Returns: undefined
      }
      update_merchant_account_balance: {
        Args: {
          p_merchant_id: string
          p_amount: number
          p_currency_code: Database["public"]["Enums"]["currency_code"]
        }
        Returns: undefined
      }
      update_merchant_avatar: {
        Args: {
          p_merchant_id: string
          p_avatar_url: string
        }
        Returns: undefined
      }
      update_merchant_details: {
        Args: {
          p_merchant_id: string
          p_name: string
          p_email: string
          p_phone_number: string
          p_pin_code: string
          p_preferred_language: string
        }
        Returns: undefined
      }
      update_merchant_recipients: {
        Args: {
          p_organization_id: string
          p_recipients: Json
        }
        Returns: undefined
      }
      update_organization_checkout_settings: {
        Args: {
          p_organization_id: string
          p_settings: Json
        }
        Returns: undefined
      }
      update_organization_details: {
        Args: {
          p_organization_id: string
          p_name: string
          p_email: string
          p_website_url: string
          p_verified: boolean
          p_default_currency: string
        }
        Returns: undefined
      }
      update_organization_logo: {
        Args: {
          p_organization_id: string
          p_logo_url: string
        }
        Returns: undefined
      }
      update_organization_provider_connection: {
        Args: {
          p_organization_id: string
          p_provider_code: Database["public"]["Enums"]["provider_code"]
          p_is_connected: boolean
          p_provider_merchant_id?: string
          p_metadata?: Json
        }
        Returns: undefined
      }
      update_organization_provider_phone: {
        Args: {
          p_organization_id: string
          p_provider_code: Database["public"]["Enums"]["provider_code"]
          p_phone_number: string
          p_is_phone_verified?: boolean
        }
        Returns: undefined
      }
      update_organization_webhook: {
        Args: {
          p_merchant_id: string
          p_webhook_id: string
          p_url: string
          p_authorized_events: Database["public"]["Enums"]["webhook_event"][]
          p_is_active?: boolean
          p_metadata?: Json
        }
        Returns: {
          authorized_events: Database["public"]["Enums"]["webhook_event"][]
          created_at: string
          is_active: boolean
          last_payload: Json | null
          last_response_body: string | null
          last_response_status: number | null
          last_triggered_at: string | null
          merchant_id: string
          metadata: Json | null
          organization_id: string
          retry_count: number | null
          updated_at: string
          url: string
          verification_token: string
          webhook_id: string
        }
      }
      update_payment_link: {
        Args: {
          p_link_id: string
          p_title?: string
          p_public_description?: string
          p_private_description?: string
          p_price?: number
          p_is_active?: boolean
          p_expires_at?: string
          p_success_url?: string
          p_cancel_url?: string
          p_allowed_providers?: Database["public"]["Enums"]["provider_code"][]
        }
        Returns: {
          allow_coupon_code: boolean
          allowed_providers: Database["public"]["Enums"]["provider_code"][]
          cancel_url: string | null
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          expires_at: string | null
          is_active: boolean
          link_id: string
          link_type: Database["public"]["Enums"]["link_type"]
          merchant_id: string
          metadata: Json | null
          organization_id: string
          plan_id: string | null
          price: number | null
          private_description: string | null
          product_id: string | null
          public_description: string | null
          success_url: string | null
          title: string
          updated_at: string
          url: string
        }
      }
      update_product: {
        Args: {
          p_product_id: string
          p_name: string
          p_description: string
          p_price: number
          p_image_url: string
          p_is_active: boolean
          p_display_on_storefront: boolean
          p_fee_type_ids?: string[]
        }
        Returns: undefined
      }
      update_provider_settings_metadata: {
        Args: {
          p_organization_id: string
          p_provider_code: Database["public"]["Enums"]["provider_code"]
          p_provider_merchant_id: string
          p_metadata: Json
        }
        Returns: undefined
      }
      update_subscription_plan: {
        Args: {
          p_plan_id: string
          p_name: string
          p_description: string
          p_billing_frequency: Database["public"]["Enums"]["frequency"]
          p_amount: number
          p_failed_payment_action: Database["public"]["Enums"]["failed_payment_action"]
          p_charge_day: number
          p_metadata: Json
          p_display_on_storefront?: boolean
          p_image_url?: string
        }
        Returns: undefined
      }
      update_team_member_role: {
        Args: {
          p_organization_id: string
          p_merchant_id: string
          p_new_role: Database["public"]["Enums"]["member_role"]
        }
        Returns: boolean
      }
      update_transaction_status: {
        Args: {
          p_transaction_id: string
          p_status: Database["public"]["Enums"]["transaction_status"]
          p_metadata?: Json
        }
        Returns: boolean
      }
      update_wave_checkout_status: {
        Args: {
          p_provider_checkout_id: string
          p_provider_transaction_id?: string
          p_payment_status?: Database["public"]["Enums"]["provider_payment_status"]
          p_error_code?: string
          p_error_message?: string
          p_metadata?: Json
        }
        Returns: undefined
      }
      update_webhook_delivery_status: {
        Args: {
          p_webhook_id: string
          p_last_response_status: number
          p_last_response_body: string
          p_last_payload: Json
        }
        Returns: undefined
      }
      validate_api_key: {
        Args: {
          p_api_key: string
        }
        Returns: {
          merchant_id: string
          organization_id: string
          is_active: boolean
          expiration_date: string
          environment: string
        }[]
      }
      verify_2fa_login: {
        Args: {
          p_merchant_id: string
          p_verification_code: string
        }
        Returns: boolean
      }
      verify_totp_code: {
        Args: {
          secret: string
          token: string
        }
        Returns: boolean
      }
    }
    Enums: {
      checkout_session_status: "open" | "completed" | "expired"
      conversion_type: "payment" | "withdrawal" | "refund" | "manual"
      currency_code: "XOF" | "USD" | "EUR" | "GHS" | "NGN" | "KES" | "MRO"
      dispute_status: "pending" | "resolved" | "closed"
      entity_type: "merchant" | "organization" | "platform"
      event_type:
        | "create_api_key"
        | "edit_api_key"
        | "remove_api_key"
        | "user_login"
        | "edit_user_password"
        | "create_pin"
        | "edit_pin"
        | "edit_user_details"
        | "authorize_user_2fa"
        | "create_user_2fa"
        | "remove_user_2fa"
        | "edit_user_phone"
        | "set_callback_url"
        | "update_webhook"
        | "add_bank_account"
        | "remove_bank_account"
        | "create_payout"
        | "payout_status_change"
        | "process_payment"
        | "payment_status_change"
        | "create_refund"
        | "refund_status_change"
        | "create_dispute"
        | "dispute_status_change"
        | "create_subscription"
        | "cancel_subscription"
        | "subscription_status_change"
        | "subscription_payment_failed"
        | "create_product"
        | "update_product"
        | "delete_product"
        | "provider_status_change"
        | "provider_connection_error"
        | "provider_integration_success"
        | "system_maintenance"
        | "system_update"
        | "compliance_update"
        | "api_status_change"
        | "customer_verification_required"
        | "customer_verification_success"
        | "customer_verification_failed"
      failed_payment_action: "cancel" | "pause" | "continue"
      fee_type: "platform" | "processing" | "conversion" | "payout" | "refund"
      feedback_status: "open" | "reviewed" | "implemented" | "closed"
      first_payment_type: "initial" | "non_initial"
      frequency:
        | "weekly"
        | "bi-weekly"
        | "monthly"
        | "bi-monthly"
        | "quarterly"
        | "semi-annual"
        | "yearly"
        | "one-time"
      invoice_status: "sent" | "paid" | "overdue" | "cancelled"
      kyc_status:
        | "not_submitted"
        | "pending"
        | "not_authorized"
        | "approved"
        | "rejected"
      link_type: "product" | "plan" | "instant"
      member_role: "Admin" | "Member"
      notification_type:
        | "onboarding"
        | "tip"
        | "transaction"
        | "payout"
        | "provider_status"
        | "alert"
        | "billing"
        | "compliance"
        | "update"
        | "security_alert"
        | "maintenance"
        | "dispute"
        | "refund"
        | "invoice"
        | "subscription"
        | "webhook"
        | "chargeback"
      organization_status: "active" | "inactive" | "suspended"
      payment_method_code:
        | "CARDS"
        | "MOBILE_MONEY"
        | "E_WALLET"
        | "APPLE_PAY"
        | "GOOGLE_PAY"
        | "USSD"
        | "QR_CODE"
        | "BANK_TRANSFER"
        | "CRYPTO"
        | "PAYPAL"
        | "OTHER"
      payout_status: "pending" | "processing" | "completed" | "failed"
      permission_action: "view" | "create" | "edit" | "delete" | "approve"
      permission_category:
        | "payments"
        | "accounts"
        | "products"
        | "subscriptions"
        | "customers"
      provider_business_type: "fintech" | "other"
      provider_code:
        | "ORANGE"
        | "WAVE"
        | "ECOBANK"
        | "MTN"
        | "NOWPAYMENTS"
        | "APPLE"
        | "GOOGLE"
        | "MOOV"
        | "AIRTEL"
        | "MPESA"
        | "WIZALL"
        | "OPAY"
        | "PAYPAL"
        | "OZOW"
        | "OTHER"
      provider_payment_status: "processing" | "cancelled" | "succeeded"
      reconciliation_status:
        | "pending"
        | "matched"
        | "partial_match"
        | "mismatch"
        | "resolved"
      refund_status: "pending" | "completed" | "failed"
      subscription_status:
        | "pending"
        | "active"
        | "paused"
        | "cancelled"
        | "expired"
        | "past_due"
        | "trial"
      support_category:
        | "account"
        | "billing"
        | "technical"
        | "feature"
        | "other"
      support_priority: "low" | "normal" | "high" | "urgent"
      support_status: "open" | "in_progress" | "resolved" | "closed"
      team_status: "active" | "invited" | "inactive"
      ticket_status: "open" | "resolved" | "closed"
      transaction_status: "pending" | "completed" | "failed" | "refunded"
      transaction_type: "payment" | "instalment"
      webhook_event:
        | "new_payment"
        | "new_subscription"
        | "payment_status_change"
        | "subscription_status_change"
        | "payout_status_change"
        | "payment_session_completed"
        | "payment_session_expired"
        | "invoice_paid"
        | "payment_succeeded"
        | "payment_pending"
        | "payment_failed"
        | "payment_token_status"
        | "recurring"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
