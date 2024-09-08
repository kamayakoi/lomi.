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
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          user_id: string
        }
        Insert: {
          account_id?: string
          balance?: number
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          is_active?: boolean
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          user_id: string
        }
        Update: {
          account_id?: string
          balance?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          is_active?: boolean
          payment_method_code?: Database["public"]["Enums"]["payment_method_code"]
          user_id?: string
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
            foreignKeyName: "accounts_payment_method_code_fkey"
            columns: ["payment_method_code"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["payment_method_code"]
          },
          {
            foreignKeyName: "accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
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
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key: string
          created_at?: string
          expiration_date?: string | null
          is_active?: boolean
          key_id?: string
          last_used_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          api_key?: string
          created_at?: string
          expiration_date?: string | null
          is_active?: boolean
          key_id?: string
          last_used_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
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
      end_customer_payment_methods: {
        Row: {
          created_at: string
          ecpm_id: string
          end_customer_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
        }
        Insert: {
          created_at?: string
          ecpm_id?: string
          end_customer_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
        }
        Update: {
          created_at?: string
          ecpm_id?: string
          end_customer_id?: string
          payment_method_code?: Database["public"]["Enums"]["payment_method_code"]
        }
        Relationships: [
          {
            foreignKeyName: "end_customer_payment_methods_end_customer_id_fkey"
            columns: ["end_customer_id"]
            isOneToOne: false
            referencedRelation: "end_customers"
            referencedColumns: ["end_customer_id"]
          },
          {
            foreignKeyName: "end_customer_payment_methods_payment_method_code_fkey"
            columns: ["payment_method_code"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["payment_method_code"]
          },
        ]
      }
      end_customers: {
        Row: {
          country_code: Database["public"]["Enums"]["country_code"]
          created_at: string
          data: Json | null
          email: string | null
          end_customer_id: string
          name: string
          organization_id: string
          phone_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          country_code: Database["public"]["Enums"]["country_code"]
          created_at?: string
          data?: Json | null
          email?: string | null
          end_customer_id?: string
          name: string
          organization_id: string
          phone_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          country_code?: Database["public"]["Enums"]["country_code"]
          created_at?: string
          data?: Json | null
          email?: string | null
          end_customer_id?: string
          name?: string
          organization_id?: string
          phone_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "end_customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "end_customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
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
          transaction_id: string | null
        }
        Insert: {
          account_id: string
          amount: number
          created_at?: string
          entry_id?: string
          entry_type: Database["public"]["Enums"]["entry_type"]
          transaction_id?: string | null
        }
        Update: {
          account_id?: string
          amount?: number
          created_at?: string
          entry_id?: string
          entry_type?: Database["public"]["Enums"]["entry_type"]
          transaction_id?: string | null
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
            foreignKeyName: "entries_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      fees: {
        Row: {
          amount: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          fee_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          fee_id?: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          fee_id?: string
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
          organization_id: string
          status: Database["public"]["Enums"]["invoice_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          due_date: string
          invoice_id?: string
          organization_id: string
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          due_date?: string
          invoice_id?: string
          organization_id?: string
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
          user_id?: string
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
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          log_id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          log_id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          log_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      main_accounts: {
        Row: {
          balance: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          main_account_id: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          main_account_id?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          main_account_id?: string
          user_id?: string
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
            foreignKeyName: "main_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      organization_providers: {
        Row: {
          created_at: string
          is_connected: boolean
          org_provider_id: string
          organization_id: string
          provider_account_id: string | null
          provider_code: Database["public"]["Enums"]["provider_code"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          is_connected?: boolean
          org_provider_id?: string
          organization_id: string
          provider_account_id?: string | null
          provider_code: Database["public"]["Enums"]["provider_code"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          is_connected?: boolean
          org_provider_id?: string
          organization_id?: string
          provider_account_id?: string | null
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
          city: string
          country: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          email: string
          industry: string | null
          logo_url: string | null
          max_api_calls_per_minute: number | null
          max_monthly_volume: number | null
          max_providers: number | null
          max_transaction_amount: number | null
          max_transactions_per_day: number | null
          max_webhooks: number | null
          metadata: Json | null
          name: string
          organization_id: string
          phone_number: string
          postal_code: string
          status: Database["public"]["Enums"]["organization_status"]
          updated_at: string
          updated_by: string | null
          website_url: string | null
        }
        Insert: {
          address: string
          city: string
          country: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email: string
          industry?: string | null
          logo_url?: string | null
          max_api_calls_per_minute?: number | null
          max_monthly_volume?: number | null
          max_providers?: number | null
          max_transaction_amount?: number | null
          max_transactions_per_day?: number | null
          max_webhooks?: number | null
          metadata?: Json | null
          name: string
          organization_id?: string
          phone_number: string
          postal_code: string
          status?: Database["public"]["Enums"]["organization_status"]
          updated_at?: string
          updated_by?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string
          city?: string
          country?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email?: string
          industry?: string | null
          logo_url?: string | null
          max_api_calls_per_minute?: number | null
          max_monthly_volume?: number | null
          max_providers?: number | null
          max_transaction_amount?: number | null
          max_transactions_per_day?: number | null
          max_webhooks?: number | null
          metadata?: Json | null
          name?: string
          organization_id?: string
          phone_number?: string
          postal_code?: string
          status?: Database["public"]["Enums"]["organization_status"]
          updated_at?: string
          updated_by?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "organizations_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          card_number: string | null
          country_code: Database["public"]["Enums"]["country_code"]
          created_at: string
          description: string | null
          name: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          phone_number: string | null
          provider_code: Database["public"]["Enums"]["provider_code"] | null
          updated_at: string
        }
        Insert: {
          card_number?: string | null
          country_code: Database["public"]["Enums"]["country_code"]
          created_at?: string
          description?: string | null
          name: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          phone_number?: string | null
          provider_code?: Database["public"]["Enums"]["provider_code"] | null
          updated_at?: string
        }
        Update: {
          card_number?: string | null
          country_code?: Database["public"]["Enums"]["country_code"]
          created_at?: string
          description?: string | null
          name?: string
          payment_method_code?: Database["public"]["Enums"]["payment_method_code"]
          phone_number?: string | null
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
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          destination: string
          metadata: Json | null
          payout_id: string
          status: Database["public"]["Enums"]["payout_status"]
          transaction_id: string
          updated_at: string
        }
        Insert: {
          account_id: string
          amount: number
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          destination: string
          metadata?: Json | null
          payout_id?: string
          status?: Database["public"]["Enums"]["payout_status"]
          transaction_id: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          amount?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          destination?: string
          metadata?: Json | null
          payout_id?: string
          status?: Database["public"]["Enums"]["payout_status"]
          transaction_id?: string
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
            foreignKeyName: "payouts_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      providers: {
        Row: {
          created_at: string
          description: string | null
          is_active: boolean
          name: string
          provider_code: Database["public"]["Enums"]["provider_code"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          is_active?: boolean
          name: string
          provider_code: Database["public"]["Enums"]["provider_code"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          is_active?: boolean
          name?: string
          provider_code?: Database["public"]["Enums"]["provider_code"]
          updated_at?: string
        }
        Relationships: []
      }
      recurring_payments: {
        Row: {
          amount: number
          charge_immediately: boolean
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string | null
          email_notifications: Json | null
          end_date: string | null
          failed_payment_action: string | null
          frequency: string
          is_active: boolean
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          payment_type: Database["public"]["Enums"]["recurring_payment_type"]
          recurring_payment_id: string
          retry_payment_every: number | null
          start_date: string
          total_cycles: number | null
          total_retries: number | null
          updated_at: string
          user_id: string
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
          frequency: string
          is_active?: boolean
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          payment_type: Database["public"]["Enums"]["recurring_payment_type"]
          recurring_payment_id?: string
          retry_payment_every?: number | null
          start_date: string
          total_cycles?: number | null
          total_retries?: number | null
          updated_at?: string
          user_id: string
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
          frequency?: string
          is_active?: boolean
          organization_id?: string
          payment_method_code?: Database["public"]["Enums"]["payment_method_code"]
          payment_type?: Database["public"]["Enums"]["recurring_payment_type"]
          recurring_payment_id?: string
          retry_payment_every?: number | null
          start_date?: string
          total_cycles?: number | null
          total_retries?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recurring_payments_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "recurring_payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "recurring_payments_payment_method_code_fkey"
            columns: ["payment_method_code"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["payment_method_code"]
          },
          {
            foreignKeyName: "recurring_payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      refunds: {
        Row: {
          amount: number
          created_at: string
          reason: string | null
          refund_id: string
          status: Database["public"]["Enums"]["refund_status"]
          transaction_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          reason?: string | null
          refund_id?: string
          status?: Database["public"]["Enums"]["refund_status"]
          transaction_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          reason?: string | null
          refund_id?: string
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
          description: string | null
          end_customer_id: string | null
          metadata: Json | null
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          end_customer_id?: string | null
          metadata?: Json | null
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_id?: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          end_customer_id?: string | null
          metadata?: Json | null
          organization_id?: string
          payment_method_code?: Database["public"]["Enums"]["payment_method_code"]
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_id?: string
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id?: string
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
            foreignKeyName: "transactions_end_customer_id_fkey"
            columns: ["end_customer_id"]
            isOneToOne: false
            referencedRelation: "end_customers"
            referencedColumns: ["end_customer_id"]
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
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
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
      user_organization_links: {
        Row: {
          created_at: string
          organization_id: string
          role: string
          user_id: string
          user_org_id: string
        }
        Insert: {
          created_at?: string
          organization_id: string
          role: string
          user_id: string
          user_org_id?: string
        }
        Update: {
          created_at?: string
          organization_id?: string
          role?: string
          user_id?: string
          user_org_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_organization_links_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "user_organization_links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          email: string
          is_admin: boolean
          metadata: Json | null
          name: string | null
          onboarded: boolean
          phone_number: string | null
          updated_at: string
          updated_by: string | null
          user_id: string
          verified: boolean
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email: string
          is_admin?: boolean
          metadata?: Json | null
          name?: string | null
          onboarded?: boolean
          phone_number?: string | null
          updated_at?: string
          updated_by?: string | null
          user_id?: string
          verified?: boolean
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email?: string
          is_admin?: boolean
          metadata?: Json | null
          name?: string | null
          onboarded?: boolean
          phone_number?: string | null
          updated_at?: string
          updated_by?: string | null
          user_id?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "users_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "users_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      webhooks: {
        Row: {
          created_at: string
          events: string[]
          is_active: boolean
          last_triggered_at: string | null
          secret: string
          updated_at: string
          url: string
          user_id: string
          webhook_id: string
        }
        Insert: {
          created_at?: string
          events: string[]
          is_active?: boolean
          last_triggered_at?: string | null
          secret: string
          updated_at?: string
          url: string
          user_id: string
          webhook_id?: string
        }
        Update: {
          created_at?: string
          events?: string[]
          is_active?: boolean
          last_triggered_at?: string | null
          secret?: string
          updated_at?: string
          url?: string
          user_id?: string
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_organization: {
        Args: {
          p_name: string
          p_email: string
          p_phone_number: string
          p_country: string
          p_city: string
          p_address: string
          p_postal_code: string
          p_industry: string
          p_website_url: string
          p_created_by: string
        }
        Returns: {
          address: string
          city: string
          country: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          email: string
          industry: string | null
          logo_url: string | null
          max_api_calls_per_minute: number | null
          max_monthly_volume: number | null
          max_providers: number | null
          max_transaction_amount: number | null
          max_transactions_per_day: number | null
          max_webhooks: number | null
          metadata: Json | null
          name: string
          organization_id: string
          phone_number: string
          postal_code: string
          status: Database["public"]["Enums"]["organization_status"]
          updated_at: string
          updated_by: string | null
          website_url: string | null
        }
      }
      create_user_organization_link: {
        Args: {
          p_user_id: string
          p_organization_id: string
          p_role: string
        }
        Returns: {
          created_at: string
          organization_id: string
          role: string
          user_id: string
          user_org_id: string
        }
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
      update_user_profile: {
        Args: {
          p_user_id: string
          p_name: string
          p_phone_number: string
          p_country: string
          p_onboarded: boolean
        }
        Returns: undefined
      }
    }
    Enums: {
      country_code:
        | "+233"
        | "+234"
        | "+225"
        | "+254"
        | "+27"
        | "+20"
        | "+212"
        | "+251"
        | "+256"
        | "+221"
        | "+237"
        | "+255"
        | "+222"
        | "+216"
        | "+250"
        | "+260"
        | "+263"
        | "+213"
        | "+33"
        | "+44"
        | "+49"
        | "+39"
        | "+34"
        | "+31"
        | "+46"
        | "+48"
        | "+351"
        | "+30"
        | "+32"
        | "+43"
        | "+1"
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
      recurring_payment_type:
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
