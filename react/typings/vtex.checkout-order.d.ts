declare module 'vtex.checkout-resources/MutationInsertCoupon' {
  import type { DocumentNode } from 'graphql'

  const mutation: DocumentNode
  export default mutation
}

declare module 'vtex.order-manager/OrderForm' {
  import type { ReactNode } from 'react'

  export type OrderFormContext = {
    orderForm: OrderFormLike
    setOrderForm: (orderForm: OrderFormLike) => void
  }

  /** Minimal fields used by this app */
  export type OrderFormLike = {
    orderFormId?: string
    marketingData?: { coupon?: string | null } | null
    messages?: {
      couponMessages?: Array<{ code?: string; text?: string }>
    } | null
  }

  export function useOrderForm(): OrderFormContext
}
