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
      accounts: {
        Row: {
          account_id: string
          balance: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          is_active: boolean
          merchant_id: string
          provider_code: Database["public"]["Enums"]["provider_code"]
        }
        Insert: {
          account_id?: string
          balance?: number
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          is_active?: boolean
          merchant_id: string
          provider_code: Database["public"]["Enums"]["provider_code"]
        }
        Update: {
          account_id?: string
          balance?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          is_active?: boolean
          merchant_id?: string
          provider_code?: Database["public"]["Enums"]["provider_code"]
        }
        Relationships: [
          {
            foreignKeyName: "accounts_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "accounts_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "accounts_provider_code_fkey"
            columns: ["provider_code"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["code"]
          },
        ]
      }
      api_keys: {
        Row: {
          api_key: string
          created_at: string
          expiration_date: string | null
          is_active: boolean
          key_id: string
          last_used_at: string | null
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          api_key: string
          created_at?: string
          expiration_date?: string | null
          is_active?: boolean
          key_id?: string
          last_used_at?: string | null
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          api_key?: string
          created_at?: string
          expiration_date?: string | null
          is_active?: boolean
          key_id?: string
          last_used_at?: string | null
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      api_usage: {
        Row: {
          api_key_id: string
          created_at: string
          endpoint: string
          last_request_at: string
          request_count: number
          updated_at: string
          usage_id: string
        }
        Insert: {
          api_key_id: string
          created_at?: string
          endpoint: string
          last_request_at?: string
          request_count?: number
          updated_at?: string
          usage_id?: string
        }
        Update: {
          api_key_id?: string
          created_at?: string
          endpoint?: string
          last_request_at?: string
          request_count?: number
          updated_at?: string
          usage_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["key_id"]
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
      customer_subscriptions: {
        Row: {
          amount: number
          billing_frequency: Database["public"]["Enums"]["frequency"]
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id: string
          end_date: string | null
          metadata: Json | null
          next_billing_date: string | null
          product_id: string
          start_date: string
          status: string
          subscription_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          billing_frequency: Database["public"]["Enums"]["frequency"]
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id: string
          end_date?: string | null
          metadata?: Json | null
          next_billing_date?: string | null
          product_id: string
          start_date: string
          status?: string
          subscription_id?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          billing_frequency?: Database["public"]["Enums"]["frequency"]
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          customer_id?: string
          end_date?: string | null
          metadata?: Json | null
          next_billing_date?: string | null
          product_id?: string
          start_date?: string
          status?: string
          subscription_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_subscriptions_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "customer_subscriptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_subscriptions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "merchant_products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          customer_id: string
          email: string | null
          merchant_id: string
          metadata: Json | null
          name: string
          organization_id: string
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string
          email?: string | null
          merchant_id: string
          metadata?: Json | null
          name: string
          organization_id: string
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          email?: string | null
          merchant_id?: string
          metadata?: Json | null
          name?: string
          organization_id?: string
          phone_number?: string | null
          updated_at?: string
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
          metadata: Json | null
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
          metadata?: Json | null
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
          metadata?: Json | null
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
      entries: {
        Row: {
          account_id: string
          amount: number
          created_at: string
          entry_id: string
          entry_type: Database["public"]["Enums"]["entry_type"]
          internal_transfer_id: string | null
          payout_id: string | null
          transaction_id: string | null
          transfer_id: string | null
        }
        Insert: {
          account_id: string
          amount: number
          created_at?: string
          entry_id?: string
          entry_type: Database["public"]["Enums"]["entry_type"]
          internal_transfer_id?: string | null
          payout_id?: string | null
          transaction_id?: string | null
          transfer_id?: string | null
        }
        Update: {
          account_id?: string
          amount?: number
          created_at?: string
          entry_id?: string
          entry_type?: Database["public"]["Enums"]["entry_type"]
          internal_transfer_id?: string | null
          payout_id?: string | null
          transaction_id?: string | null
          transfer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entries_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "entries_internal_transfer_id_fkey"
            columns: ["internal_transfer_id"]
            isOneToOne: false
            referencedRelation: "internal_transfers"
            referencedColumns: ["internal_transfer_id"]
          },
          {
            foreignKeyName: "entries_payout_id_fkey"
            columns: ["payout_id"]
            isOneToOne: false
            referencedRelation: "payouts"
            referencedColumns: ["payout_id"]
          },
          {
            foreignKeyName: "entries_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
          {
            foreignKeyName: "entries_transfer_id_fkey"
            columns: ["transfer_id"]
            isOneToOne: false
            referencedRelation: "transfers"
            referencedColumns: ["transfer_id"]
          },
        ]
      }
      fees: {
        Row: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          fee_id: string
          fee_type: string
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
          fee_type: string
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
          fee_type?: string
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
            foreignKeyName: "fees_payment_method_code_fkey"
            columns: ["payment_method_code"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["payment_method_code"]
          },
          {
            foreignKeyName: "fees_provider_code_fkey"
            columns: ["provider_code"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["code"]
          },
        ]
      }
      internal_transfers: {
        Row: {
          amount: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          from_account_id: string
          internal_transfer_id: string
          status: Database["public"]["Enums"]["transfer_status"]
          to_main_account_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          from_account_id: string
          internal_transfer_id?: string
          status?: Database["public"]["Enums"]["transfer_status"]
          to_main_account_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          from_account_id?: string
          internal_transfer_id?: string
          status?: Database["public"]["Enums"]["transfer_status"]
          to_main_account_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "internal_transfers_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "internal_transfers_from_account_id_fkey"
            columns: ["from_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "internal_transfers_to_main_account_id_fkey"
            columns: ["to_main_account_id"]
            isOneToOne: false
            referencedRelation: "main_accounts"
            referencedColumns: ["main_account_id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string | null
          due_date: string
          merchant_id: string
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
          organization_id?: string
          platform_invoice_id?: string
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "invoices_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          log_id: string
          merchant_id: string | null
          severity: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          log_id?: string
          merchant_id?: string | null
          severity: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          log_id?: string
          merchant_id?: string | null
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
      main_accounts: {
        Row: {
          balance: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          main_account_id: string
          merchant_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          main_account_id?: string
          merchant_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          main_account_id?: string
          merchant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "main_accounts_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "main_accounts_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
        ]
      }
      merchant_feedback: {
        Row: {
          created_at: string
          feedback_id: string
          feedback_type: string
          merchant_id: string
          message: string
          status: Database["public"]["Enums"]["feedback_status"]
        }
        Insert: {
          created_at?: string
          feedback_id?: string
          feedback_type: string
          merchant_id: string
          message: string
          status?: Database["public"]["Enums"]["feedback_status"]
        }
        Update: {
          created_at?: string
          feedback_id?: string
          feedback_type?: string
          merchant_id?: string
          message?: string
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
          created_at: string
          merchant_id: string
          merchant_org_id: string
          organization_id: string
          role: string
        }
        Insert: {
          created_at?: string
          merchant_id: string
          merchant_org_id?: string
          organization_id: string
          role: string
        }
        Update: {
          created_at?: string
          merchant_id?: string
          merchant_org_id?: string
          organization_id?: string
          role?: string
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
      merchant_preferences: {
        Row: {
          created_at: string
          language: string | null
          merchant_id: string
          notification_settings: Json | null
          theme: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          language?: string | null
          merchant_id: string
          notification_settings?: Json | null
          theme?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          language?: string | null
          merchant_id?: string
          notification_settings?: Json | null
          theme?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchant_preferences_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
        ]
      }
      merchant_products: {
        Row: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string | null
          frequency: Database["public"]["Enums"]["frequency"]
          image_url: string | null
          is_active: boolean
          merchant_id: string
          name: string
          price: number
          product_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          frequency: Database["public"]["Enums"]["frequency"]
          image_url?: string | null
          is_active?: boolean
          merchant_id: string
          name: string
          price: number
          product_id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          frequency?: Database["public"]["Enums"]["frequency"]
          image_url?: string | null
          is_active?: boolean
          merchant_id?: string
          name?: string
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
        ]
      }
      merchant_sessions: {
        Row: {
          created_at: string
          expires_at: string
          merchant_id: string
          session_data: Json | null
          session_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          merchant_id: string
          session_data?: Json | null
          session_id?: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          merchant_id?: string
          session_data?: Json | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchant_sessions_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
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
          is_admin: boolean
          is_deleted: boolean
          merchant_id: string
          merchant_lifetime_value: number
          metadata: Json | null
          mrr: number
          name: string | null
          onboarded: boolean
          phone_number: string | null
          preferred_language: string | null
          referral_code: string | null
          updated_at: string
          verified: boolean
        }
        Insert: {
          arr?: number
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          is_admin?: boolean
          is_deleted?: boolean
          merchant_id?: string
          merchant_lifetime_value?: number
          metadata?: Json | null
          mrr?: number
          name?: string | null
          onboarded?: boolean
          phone_number?: string | null
          preferred_language?: string | null
          referral_code?: string | null
          updated_at?: string
          verified?: boolean
        }
        Update: {
          arr?: number
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          is_admin?: boolean
          is_deleted?: boolean
          merchant_id?: string
          merchant_lifetime_value?: number
          metadata?: Json | null
          mrr?: number
          name?: string | null
          onboarded?: boolean
          phone_number?: string | null
          preferred_language?: string | null
          referral_code?: string | null
          updated_at?: string
          verified?: boolean
        }
        Relationships: []
      }
      metrics: {
        Row: {
          created_at: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          metric_date: string
          metric_id: string
          metric_name: string
          metric_value: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          metric_date: string
          metric_id?: string
          metric_name: string
          metric_value: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          entity_type?: Database["public"]["Enums"]["entity_type"]
          metric_date?: string
          metric_id?: string
          metric_name?: string
          metric_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          is_read: boolean
          merchant_id: string
          message: string
          notification_id: string
          organization_id: string | null
          type: string
        }
        Insert: {
          created_at?: string
          is_read?: boolean
          merchant_id: string
          message: string
          notification_id?: string
          organization_id?: string | null
          type: string
        }
        Update: {
          created_at?: string
          is_read?: boolean
          merchant_id?: string
          message?: string
          notification_id?: string
          organization_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organization_addresses: {
        Row: {
          address: string
          city: string
          country: string
          created_at: string
          default_language: string
          organization_id: string
          postal_code: string
          region: string
          timezone: string
          updated_at: string
        }
        Insert: {
          address: string
          city: string
          country: string
          created_at?: string
          default_language: string
          organization_id: string
          postal_code: string
          region: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          country?: string
          created_at?: string
          default_language?: string
          organization_id?: string
          postal_code?: string
          region?: string
          timezone?: string
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
      organization_kyc: {
        Row: {
          authorized_signatory: Json | null
          document_type: string
          document_url: string
          kyc_approved_at: string | null
          kyc_submitted_at: string | null
          organization_id: string
          reviewed_at: string | null
          status: string
          uploaded_at: string
        }
        Insert: {
          authorized_signatory?: Json | null
          document_type: string
          document_url: string
          kyc_approved_at?: string | null
          kyc_submitted_at?: string | null
          organization_id: string
          reviewed_at?: string | null
          status?: string
          uploaded_at?: string
        }
        Update: {
          authorized_signatory?: Json | null
          document_type?: string
          document_url?: string
          kyc_approved_at?: string | null
          kyc_submitted_at?: string | null
          organization_id?: string
          reviewed_at?: string | null
          status?: string
          uploaded_at?: string
        }
        Relationships: [
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
          bank_account_name: string | null
          bank_account_number: string | null
          bank_code: string | null
          bank_name: string | null
          card_number: string | null
          complementary_information: Json | null
          created_at: string
          is_connected: boolean
          organization_id: string
          phone_number: string | null
          provider_code: Database["public"]["Enums"]["provider_code"]
          updated_at: string
        }
        Insert: {
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_code?: string | null
          bank_name?: string | null
          card_number?: string | null
          complementary_information?: Json | null
          created_at?: string
          is_connected?: boolean
          organization_id: string
          phone_number?: string | null
          provider_code: Database["public"]["Enums"]["provider_code"]
          updated_at?: string
        }
        Update: {
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_code?: string | null
          bank_name?: string | null
          card_number?: string | null
          complementary_information?: Json | null
          created_at?: string
          is_connected?: boolean
          organization_id?: string
          phone_number?: string | null
          provider_code?: Database["public"]["Enums"]["provider_code"]
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
          business_platform_url: string | null
          created_at: string
          default_currency: Database["public"]["Enums"]["currency_code"]
          deleted_at: string | null
          email: string
          is_deleted: boolean
          metadata: Json | null
          name: string
          notification_preferences: Json | null
          organization_id: string
          phone_number: string
          status: Database["public"]["Enums"]["organization_status"]
          tax_number: string | null
          total_customers: number | null
          total_merchants: number | null
          total_revenue: number | null
          total_transactions: number | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          business_platform_url?: string | null
          created_at?: string
          default_currency?: Database["public"]["Enums"]["currency_code"]
          deleted_at?: string | null
          email: string
          is_deleted?: boolean
          metadata?: Json | null
          name: string
          notification_preferences?: Json | null
          organization_id?: string
          phone_number: string
          status?: Database["public"]["Enums"]["organization_status"]
          tax_number?: string | null
          total_customers?: number | null
          total_merchants?: number | null
          total_revenue?: number | null
          total_transactions?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          business_platform_url?: string | null
          created_at?: string
          default_currency?: Database["public"]["Enums"]["currency_code"]
          deleted_at?: string | null
          email?: string
          is_deleted?: boolean
          metadata?: Json | null
          name?: string
          notification_preferences?: Json | null
          organization_id?: string
          phone_number?: string
          status?: Database["public"]["Enums"]["organization_status"]
          tax_number?: string | null
          total_customers?: number | null
          total_merchants?: number | null
          total_revenue?: number | null
          total_transactions?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          created_at: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          provider_code: Database["public"]["Enums"]["provider_code"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          provider_code?: Database["public"]["Enums"]["provider_code"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          payment_method_code?: Database["public"]["Enums"]["payment_method_code"]
          provider_code?: Database["public"]["Enums"]["provider_code"] | null
          updated_at?: string
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
      payouts: {
        Row: {
          account_id: string
          amount: number
          bank_account_number: string | null
          bank_code: string | null
          bank_name: string | null
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          metadata: Json | null
          organization_id: string | null
          payout_id: string
          payout_method: string
          phone_number: string | null
          status: Database["public"]["Enums"]["payout_status"]
          updated_at: string
        }
        Insert: {
          account_id: string
          amount: number
          bank_account_number?: string | null
          bank_code?: string | null
          bank_name?: string | null
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          metadata?: Json | null
          organization_id?: string | null
          payout_id?: string
          payout_method: string
          phone_number?: string | null
          status?: Database["public"]["Enums"]["payout_status"]
          updated_at?: string
        }
        Update: {
          account_id?: string
          amount?: number
          bank_account_number?: string | null
          bank_code?: string | null
          bank_name?: string | null
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          metadata?: Json | null
          organization_id?: string | null
          payout_id?: string
          payout_method?: string
          phone_number?: string | null
          status?: Database["public"]["Enums"]["payout_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payouts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "payouts_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
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
      platform_balance: {
        Row: {
          balance: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          total_fees: number
          total_revenue: number
          total_transactions: number
          updated_at: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          total_fees?: number
          total_revenue?: number
          total_transactions?: number
          updated_at?: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          total_fees?: number
          total_revenue?: number
          total_transactions?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_balance_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: true
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
        ]
      }
      platform_payouts: {
        Row: {
          amount: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          from_account_id: string
          from_main_account_id: string
          organization_id: string
          payout_details: Json | null
          payout_id: string
          payout_method: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          from_account_id: string
          from_main_account_id: string
          organization_id: string
          payout_details?: Json | null
          payout_id?: string
          payout_method: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          from_account_id?: string
          from_main_account_id?: string
          organization_id?: string
          payout_details?: Json | null
          payout_id?: string
          payout_method?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_payouts_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "platform_payouts_from_account_id_fkey"
            columns: ["from_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "platform_payouts_from_main_account_id_fkey"
            columns: ["from_main_account_id"]
            isOneToOne: false
            referencedRelation: "main_accounts"
            referencedColumns: ["main_account_id"]
          },
          {
            foreignKeyName: "platform_payouts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      platform_provider_balances: {
        Row: {
          balance: number
          balance_id: string
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          last_transaction_at: string | null
          provider_code: Database["public"]["Enums"]["provider_code"]
          total_fees: number
          total_revenue: number
          total_transactions: number
          updated_at: string
        }
        Insert: {
          balance?: number
          balance_id?: string
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          last_transaction_at?: string | null
          provider_code: Database["public"]["Enums"]["provider_code"]
          total_fees?: number
          total_revenue?: number
          total_transactions?: number
          updated_at?: string
        }
        Update: {
          balance?: number
          balance_id?: string
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          last_transaction_at?: string | null
          provider_code?: Database["public"]["Enums"]["provider_code"]
          total_fees?: number
          total_revenue?: number
          total_transactions?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_provider_balances_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "platform_provider_balances_provider_code_fkey"
            columns: ["provider_code"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["code"]
          },
        ]
      }
      providers: {
        Row: {
          api_base_url: string | null
          api_key: string | null
          api_secret: string | null
          code: Database["public"]["Enums"]["provider_code"]
          created_at: string
          description: string | null
          logo_url: string | null
          name: string
          provider_id: string
          updated_at: string
          webhook_url: string | null
          website_url: string | null
        }
        Insert: {
          api_base_url?: string | null
          api_key?: string | null
          api_secret?: string | null
          code: Database["public"]["Enums"]["provider_code"]
          created_at?: string
          description?: string | null
          logo_url?: string | null
          name: string
          provider_id?: string
          updated_at?: string
          webhook_url?: string | null
          website_url?: string | null
        }
        Update: {
          api_base_url?: string | null
          api_key?: string | null
          api_secret?: string | null
          code?: Database["public"]["Enums"]["provider_code"]
          created_at?: string
          description?: string | null
          logo_url?: string | null
          name?: string
          provider_id?: string
          updated_at?: string
          webhook_url?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      recurring_transactions: {
        Row: {
          amount: number
          charge_immediately: boolean
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string | null
          email_notifications: Json | null
          end_date: string | null
          failed_payment_action: string | null
          follow_up_subscriber: boolean
          frequency: Database["public"]["Enums"]["frequency"]
          is_active: boolean
          merchant_id: string
          next_payment_date: string
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          payment_type: Database["public"]["Enums"]["recurring_transaction_type"]
          recurring_transaction_id: string
          retry_payment_every: number | null
          start_date: string
          status: Database["public"]["Enums"]["recurring_transaction_status"]
          total_cycles: number | null
          total_retries: number | null
          updated_at: string
        }
        Insert: {
          amount: number
          charge_immediately?: boolean
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          email_notifications?: Json | null
          end_date?: string | null
          failed_payment_action?: string | null
          follow_up_subscriber?: boolean
          frequency: Database["public"]["Enums"]["frequency"]
          is_active?: boolean
          merchant_id: string
          next_payment_date: string
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          payment_type: Database["public"]["Enums"]["recurring_transaction_type"]
          recurring_transaction_id?: string
          retry_payment_every?: number | null
          start_date: string
          status?: Database["public"]["Enums"]["recurring_transaction_status"]
          total_cycles?: number | null
          total_retries?: number | null
          updated_at?: string
        }
        Update: {
          amount?: number
          charge_immediately?: boolean
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          email_notifications?: Json | null
          end_date?: string | null
          failed_payment_action?: string | null
          follow_up_subscriber?: boolean
          frequency?: Database["public"]["Enums"]["frequency"]
          is_active?: boolean
          merchant_id?: string
          next_payment_date?: string
          organization_id?: string
          payment_method_code?: Database["public"]["Enums"]["payment_method_code"]
          payment_type?: Database["public"]["Enums"]["recurring_transaction_type"]
          recurring_transaction_id?: string
          retry_payment_every?: number | null
          start_date?: string
          status?: Database["public"]["Enums"]["recurring_transaction_status"]
          total_cycles?: number | null
          total_retries?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recurring_transactions_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "recurring_transactions_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "recurring_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "recurring_transactions_payment_method_code_fkey"
            columns: ["payment_method_code"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["payment_method_code"]
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
      support_tickets: {
        Row: {
          created_at: string
          customer_id: string | null
          merchant_id: string
          message: string
          resolution_date: string | null
          resolution_details: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          ticket_id: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          merchant_id: string
          message: string
          resolution_date?: string | null
          resolution_details?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          ticket_id?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          merchant_id?: string
          message?: string
          resolution_date?: string | null
          resolution_details?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "support_tickets_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
        ]
      }
      transactions: {
        Row: {
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
          provider_code: Database["public"]["Enums"]["provider_code"]
          reference_id: string
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
        }
        Insert: {
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
          provider_code: Database["public"]["Enums"]["provider_code"]
          reference_id: string
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_id?: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Update: {
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
          provider_code?: Database["public"]["Enums"]["provider_code"]
          reference_id?: string
          status?: Database["public"]["Enums"]["transaction_status"]
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
            foreignKeyName: "transactions_payment_method_code_fkey"
            columns: ["payment_method_code"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["payment_method_code"]
          },
          {
            foreignKeyName: "transactions_provider_code_fkey"
            columns: ["provider_code"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["code"]
          },
        ]
      }
      transfers: {
        Row: {
          amount: number
          created_at: string
          from_account_id: string
          status: Database["public"]["Enums"]["transfer_status"]
          to_account_id: string
          transaction_id: string
          transfer_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          from_account_id: string
          status?: Database["public"]["Enums"]["transfer_status"]
          to_account_id: string
          transaction_id: string
          transfer_id?: string
        }
        Update: {
          amount?: number
          created_at?: string
          from_account_id?: string
          status?: Database["public"]["Enums"]["transfer_status"]
          to_account_id?: string
          transaction_id?: string
          transfer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transfers_from_account_id_fkey"
            columns: ["from_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "transfers_to_account_id_fkey"
            columns: ["to_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "transfers_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      ui_configuration: {
        Row: {
          config_name: string
          config_value: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          config_name: string
          config_value?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          config_name?: string
          config_value?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      webhooks: {
        Row: {
          created_at: string
          events: string[]
          is_active: boolean
          last_triggered_at: string | null
          merchant_id: string
          metadata: Json | null
          secret: string | null
          updated_at: string
          url: string
          webhook_id: string
        }
        Insert: {
          created_at?: string
          events: string[]
          is_active?: boolean
          last_triggered_at?: string | null
          merchant_id: string
          metadata?: Json | null
          secret?: string | null
          updated_at?: string
          url: string
          webhook_id?: string
        }
        Update: {
          created_at?: string
          events?: string[]
          is_active?: boolean
          last_triggered_at?: string | null
          merchant_id?: string
          metadata?: Json | null
          secret?: string | null
          updated_at?: string
          url?: string
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
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      complete_onboarding: {
        Args: {
          p_merchant_id: string
          p_phone_number: string
          p_country: string
          p_org_name: string
          p_org_country: string
          p_org_city: string
          p_org_address: string
          p_org_postal_code: string
          p_org_industry: string
          p_org_website_url: string
        }
        Returns: undefined
      }
      create_initial_organization: {
        Args: {
          new_merchant_id: string
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
      fetch_organization_name: {
        Args: {
          user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      currency_code:
        | "XOF"
        | "XAF"
        | "NGN"
        | "GHS"
        | "KES"
        | "ZAR"
        | "EGP"
        | "MAD"
        | "RWF"
        | "ETB"
        | "ZMW"
        | "NAD"
        | "USD"
        | "EUR"
        | "MRO"
      dispute_status: "open" | "under_review" | "resolved" | "closed"
      entity_type: "merchant" | "organization" | "platform"
      entry_type: "debit" | "credit"
      feedback_status: "open" | "in_progress" | "resolved" | "closed"
      frequency:
        | "daily"
        | "weekly"
        | "bi-weekly"
        | "monthly"
        | "yearly"
        | "one-time"
      invoice_status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
      kyc_status: "pending" | "approved" | "rejected"
      organization_status: "active" | "inactive" | "suspended"
      payment_method_code:
        | "CREDIT_CARD"
        | "DEBIT_CARD"
        | "MOBILE_MONEY"
        | "BANK_TRANSFER"
        | "SEPA"
        | "PAYPAL"
        | "APPLE_PAY"
        | "GOOGLE_PAY"
        | "CASH"
        | "CRYPTOCURRENCY"
        | "IDEAL"
        | "COUNTER"
        | "WAVE"
        | "AIRTEL_MONEY"
        | "MPESA"
        | "AIRTIME"
        | "POS"
        | "BANK_USSD"
        | "E_WALLET"
        | "QR_CODE"
        | "USSD"
      payout_status: "pending" | "processing" | "completed" | "failed"
      provider_code:
        | "ORANGE"
        | "WAVE"
        | "ECOBANK"
        | "MTN"
        | "STRIPE"
        | "PAYPAL"
        | "LOMI"
      recurring_transaction_status:
        | "active"
        | "paused"
        | "cancelled"
        | "expired"
      recurring_transaction_type:
        | "subscription"
        | "installment"
        | "debt"
        | "utility"
        | "other"
      refund_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "cancelled"
      ticket_status: "open" | "in_progress" | "resolved" | "closed"
      transaction_status: "pending" | "completed" | "failed" | "refunded"
      transaction_type: "payment" | "refund" | "transfer" | "payout"
      transfer_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "cancelled"
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
