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
            referencedColumns: ["provider_code"]
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
          dispute_id: string
          fee_amount: number
          reason: string
          status: Database["public"]["Enums"]["dispute_status"]
          transaction_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          dispute_id?: string
          fee_amount?: number
          reason: string
          status?: Database["public"]["Enums"]["dispute_status"]
          transaction_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          dispute_id?: string
          fee_amount?: number
          reason?: string
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
          fee_type: string
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
          fee_type: string
          name: string
          payment_method_code?:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          percentage: number
          provider_code?: Database["public"]["Enums"]["provider_code"] | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          fee_type?: string
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
            referencedColumns: ["provider_code"]
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
          invoice_id: string
          merchant_id: string
          organization_id: string
          status: Database["public"]["Enums"]["invoice_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          due_date: string
          invoice_id?: string
          merchant_id: string
          organization_id: string
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          due_date?: string
          invoice_id?: string
          merchant_id?: string
          organization_id?: string
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
      lomi_balance: {
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
            foreignKeyName: "lomi_balance_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: true
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
        ]
      }
      lomi_payouts: {
        Row: {
          amount: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
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
          organization_id?: string
          payout_details?: Json | null
          payout_id?: string
          payout_method?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lomi_payouts_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "lomi_payouts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      lomi_provider_balances: {
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
            foreignKeyName: "lomi_provider_balances_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "lomi_provider_balances_provider_code_fkey"
            columns: ["provider_code"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["provider_code"]
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
      merchants: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string
          deleted_at: string | null
          email: string
          is_admin: boolean
          is_deleted: boolean
          merchant_id: string
          metadata: Json | null
          name: string | null
          onboarded: boolean
          phone_number: string | null
          preferred_language: string | null
          referral_code: string | null
          updated_at: string
          verified: boolean
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          is_admin?: boolean
          is_deleted?: boolean
          merchant_id?: string
          metadata?: Json | null
          name?: string | null
          onboarded?: boolean
          phone_number?: string | null
          preferred_language?: string | null
          referral_code?: string | null
          updated_at?: string
          verified?: boolean
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          is_admin?: boolean
          is_deleted?: boolean
          merchant_id?: string
          metadata?: Json | null
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
          labels: Json | null
          metric_id: string
          name: string
          organization_id: string | null
          timestamp: string
          value: number
        }
        Insert: {
          labels?: Json | null
          metric_id?: string
          name: string
          organization_id?: string | null
          timestamp?: string
          value: number
        }
        Update: {
          labels?: Json | null
          metric_id?: string
          name?: string
          organization_id?: string | null
          timestamp?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "metrics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          is_read: boolean
          merchant_id: string
          message: string
          notification_id: string
          organization_id: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          is_read?: boolean
          merchant_id: string
          message: string
          notification_id?: string
          organization_id: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          is_read?: boolean
          merchant_id?: string
          message?: string
          notification_id?: string
          organization_id?: string
          type?: string
          updated_at?: string
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
      organization_kyc: {
        Row: {
          authorized_signatory: Json | null
          document_type: string
          document_url: string
          kyc_id: string
          organization_id: string
          reviewed_at: string | null
          status: string
          uploaded_at: string
        }
        Insert: {
          authorized_signatory?: Json | null
          document_type: string
          document_url: string
          kyc_id?: string
          organization_id: string
          reviewed_at?: string | null
          status?: string
          uploaded_at?: string
        }
        Update: {
          authorized_signatory?: Json | null
          document_type?: string
          document_url?: string
          kyc_id?: string
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
      organization_providers: {
        Row: {
          bank_account_name: string | null
          bank_account_number: string | null
          bank_code: string | null
          bank_name: string | null
          card_number: string | null
          complementary_information: Json | null
          created_at: string
          is_connected: boolean
          org_provider_id: string
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
          org_provider_id?: string
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
          org_provider_id?: string
          organization_id?: string
          phone_number?: string | null
          provider_code?: Database["public"]["Enums"]["provider_code"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_providers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_providers_provider_code_fkey"
            columns: ["provider_code"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["provider_code"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string
          business_description: string | null
          commune: string
          country: string
          created_at: string
          deleted_at: string | null
          email: string
          industry: string | null
          is_deleted: boolean
          kyc_approved_at: string | null
          kyc_status: string
          kyc_submitted_at: string | null
          logo_url: string | null
          mailing_address: string | null
          max_api_calls_per_hour: number | null
          max_monthly_volume: number | null
          max_providers: number | null
          max_transaction_amount: number | null
          max_transactions_per_day: number | null
          max_webhooks: number | null
          metadata: Json | null
          name: string
          organization_id: string
          other_platform_url: string | null
          phone_number: string
          postal_code: string
          region: string
          status: Database["public"]["Enums"]["organization_status"]
          tax_number: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          address: string
          business_description?: string | null
          commune: string
          country: string
          created_at?: string
          deleted_at?: string | null
          email: string
          industry?: string | null
          is_deleted?: boolean
          kyc_approved_at?: string | null
          kyc_status?: string
          kyc_submitted_at?: string | null
          logo_url?: string | null
          mailing_address?: string | null
          max_api_calls_per_hour?: number | null
          max_monthly_volume?: number | null
          max_providers?: number | null
          max_transaction_amount?: number | null
          max_transactions_per_day?: number | null
          max_webhooks?: number | null
          metadata?: Json | null
          name: string
          organization_id?: string
          other_platform_url?: string | null
          phone_number: string
          postal_code: string
          region: string
          status?: Database["public"]["Enums"]["organization_status"]
          tax_number?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          address?: string
          business_description?: string | null
          commune?: string
          country?: string
          created_at?: string
          deleted_at?: string | null
          email?: string
          industry?: string | null
          is_deleted?: boolean
          kyc_approved_at?: string | null
          kyc_status?: string
          kyc_submitted_at?: string | null
          logo_url?: string | null
          mailing_address?: string | null
          max_api_calls_per_hour?: number | null
          max_monthly_volume?: number | null
          max_providers?: number | null
          max_transaction_amount?: number | null
          max_transactions_per_day?: number | null
          max_webhooks?: number | null
          metadata?: Json | null
          name?: string
          organization_id?: string
          other_platform_url?: string | null
          phone_number?: string
          postal_code?: string
          region?: string
          status?: Database["public"]["Enums"]["organization_status"]
          tax_number?: string | null
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
            referencedColumns: ["provider_code"]
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
      providers: {
        Row: {
          created_at: string
          is_active: boolean
          provider_code: Database["public"]["Enums"]["provider_code"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          is_active?: boolean
          provider_code: Database["public"]["Enums"]["provider_code"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          is_active?: boolean
          provider_code?: Database["public"]["Enums"]["provider_code"]
          updated_at?: string
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
          frequency: string
          is_active: boolean
          merchant_id: string
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          payment_type: Database["public"]["Enums"]["recurring_transaction_type"]
          recurring_transaction_id: string
          retry_payment_every: number | null
          start_date: string
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
          frequency: string
          is_active?: boolean
          merchant_id: string
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          payment_type: Database["public"]["Enums"]["recurring_transaction_type"]
          recurring_transaction_id?: string
          retry_payment_every?: number | null
          start_date: string
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
          frequency?: string
          is_active?: boolean
          merchant_id?: string
          organization_id?: string
          payment_method_code?: Database["public"]["Enums"]["payment_method_code"]
          payment_type?: Database["public"]["Enums"]["recurring_transaction_type"]
          recurring_transaction_id?: string
          retry_payment_every?: number | null
          start_date?: string
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
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id: string
          description: string | null
          merchant_id: string
          metadata: Json | null
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          provider_code: Database["public"]["Enums"]["provider_code"]
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id: string
          description?: string | null
          merchant_id: string
          metadata?: Json | null
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          provider_code: Database["public"]["Enums"]["provider_code"]
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_id?: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          customer_id?: string
          description?: string | null
          merchant_id?: string
          metadata?: Json | null
          organization_id?: string
          payment_method_code?: Database["public"]["Enums"]["payment_method_code"]
          provider_code?: Database["public"]["Enums"]["provider_code"]
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
            referencedColumns: ["provider_code"]
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
      webhooks: {
        Row: {
          created_at: string
          events: string[]
          is_active: boolean
          last_triggered_at: string | null
          merchant_id: string
          secret: string
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
          secret: string
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
          secret?: string
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
      entry_type: "debit" | "credit"
      frequency:
        | "daily"
        | "weekly"
        | "bi-weekly"
        | "monthly"
        | "yearly"
        | "one-time"
      invoice_status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
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
