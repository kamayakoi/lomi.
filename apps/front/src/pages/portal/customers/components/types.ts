import { Database } from 'database.types'

type Customer = Database['public']['Tables']['customers']['Row']
type Transaction = Database['public']['Tables']['transactions']['Row']

export type { Customer, Transaction }