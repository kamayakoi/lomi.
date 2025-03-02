import { useQuery } from '@tanstack/react-query'
import {
  fetchCustomers,
  fetchCustomer,
  fetchCustomerTransactions
} from './queries/customers'
import {
  fetchTransactions,
  fetchTransaction,
  fetchTransactionStats,
  type FetchTransactionsParams
} from './queries/transactions'
import {
  fetchOrganizationDetails,
  fetchTeamMembers,
  fetchProviderSettings,
  fetchCheckoutSettings
} from './queries/organizations'

// Customer Queries
export function useCustomers(merchantId: string) {
  return useQuery({
    queryKey: ['customers', merchantId],
    queryFn: () => fetchCustomers({ merchantId })
  })
}

export function useCustomer(customerId: string) {
  return useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => fetchCustomer(customerId)
  })
}

export function useCustomerTransactions(customerId: string) {
  return useQuery({
    queryKey: ['customer-transactions', customerId],
    queryFn: () => fetchCustomerTransactions(customerId)
  })
}

// Transaction Queries
export function useTransactions(params: FetchTransactionsParams) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => fetchTransactions(params)
  })
}

export function useTransaction(transactionId: string) {
  return useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: () => fetchTransaction(transactionId)
  })
}

export function useTransactionStats(merchantId: string, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['transaction-stats', merchantId, startDate, endDate],
    queryFn: () => fetchTransactionStats(merchantId, startDate, endDate)
  })
}

// Organization Queries
export function useOrganizationDetails(organizationId: string) {
  return useQuery({
    queryKey: ['organization-details', organizationId],
    queryFn: () => fetchOrganizationDetails(organizationId)
  })
}

export function useTeamMembers(organizationId: string) {
  return useQuery({
    queryKey: ['team-members', organizationId],
    queryFn: () => fetchTeamMembers(organizationId)
  })
}

// Provider Settings Queries
export function useProviderSettings(organizationId: string) {
  return useQuery({
    queryKey: ['provider-settings', organizationId],
    queryFn: () => fetchProviderSettings(organizationId)
  })
}

// Checkout Settings Queries
export function useCheckoutSettings(organizationId: string) {
  return useQuery({
    queryKey: ['checkout-settings', organizationId],
    queryFn: () => fetchCheckoutSettings(organizationId)
  })
}
