import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useMutation } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import type { OrderFormLike } from 'vtex.order-manager/OrderForm'
import insertCouponMutation from 'vtex.checkout-resources/MutationInsertCoupon'

/** Declared handles → scoped classes like `sunhouse-coupon-button-1-x-{handle}` (+ `blockClass` / modifiers). */
const CSS_HANDLES = ['container', 'button', 'label'] as const

export type CouponButtonProps = {
  label?: string
  couponCode?: string
}

type Status = 'idle' | 'applying' | 'ok' | 'failCoupon' | 'failTech'

function couponApplied(orderForm: OrderFormLike, code: string) {
  const c = orderForm.marketingData?.coupon
  return !!c && c.toUpperCase() === code.toUpperCase()
}

function couponRejected(orderForm: OrderFormLike) {
  const msgs = orderForm.messages?.couponMessages
  return Array.isArray(msgs) && msgs.length > 0
}

function CouponButton({ label = 'Cupom', couponCode = '' }: CouponButtonProps) {
  const { handles, withModifiers } = useCssHandles(CSS_HANDLES)
  const { setOrderForm } = useOrderForm()
  const [runInsertCoupon] = useMutation(insertCouponMutation)
  const [status, setStatus] = useState<Status>('idle')

  // Ref para o guard de clique duplo — evita que `onClick` seja
  // recriado a cada mudança de status, mantendo as deps estáveis.
  const statusRef = useRef<Status>('idle')

  const revertTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cleanup do timer ao desmontar o componente
  useEffect(() => {
    return () => {
      if (revertTimer.current) clearTimeout(revertTimer.current)
    }
  }, [])

  // Sincroniza state e ref juntos para manter consistência
  const updateStatus = useCallback((next: Status) => {
    statusRef.current = next
    setStatus(next)
  }, [])

  const scheduleRevert = useCallback(() => {
    if (revertTimer.current) clearTimeout(revertTimer.current)
    revertTimer.current = setTimeout(() => {
      // Sincroniza ref e state no revert
      statusRef.current = 'idle'
      setStatus('idle')
      revertTimer.current = null
    }, 4000)
  }, [])

  // `status` removido das deps — o guard usa `statusRef` para leitura
  // síncrona, evitando recriações desnecessárias do handler.
  const onClick = useCallback(async () => {
    const code = couponCode.trim()
    const current = statusRef.current

    if (!code || current === 'applying' || current === 'ok') return

    updateStatus('applying')

    try {
      const { data, errors } = await runInsertCoupon({
        variables: { text: code },
      })

      if (errors?.length) {
        updateStatus('failTech')
        scheduleRevert()
        return
      }

      const newOrderForm = data?.insertCoupon as OrderFormLike | undefined

      if (!newOrderForm) {
        updateStatus('failTech')
        scheduleRevert()
        return
      }

      setOrderForm(newOrderForm)

      if (couponApplied(newOrderForm, code) && !couponRejected(newOrderForm)) {
        updateStatus('ok')
      } else {
        updateStatus('failCoupon')
        scheduleRevert()
      }
    } catch {
      updateStatus('failTech')
      scheduleRevert()
    }
  }, [couponCode, runInsertCoupon, scheduleRevert, setOrderForm, updateStatus])

  const codeMissing = !couponCode.trim()
  const disabled = codeMissing || status === 'applying' || status === 'ok'

  let text = label
  if (status === 'applying') text = 'Aplicando...'
  else if (status === 'ok') text = 'Cupom aplicado'
  else if (status === 'failCoupon') text = 'Cupom não aplicado'
  else if (status === 'failTech') text = 'Erro ao aplicar'

  // Classes memoizadas — remontadas apenas quando `status` ou `disabled` mudam
  const containerClass = useMemo(
    () => `${handles.container} w-100`,
    // `handles.container` é estável após a montagem
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handles.container]
  )

  const buttonClass = useMemo(
    () =>
      `${withModifiers('button', status)} bg-action-primary c-on-action-primary hover-bg-action-primary br2 fw5 f6 pv3 ph5 w-100 bn outline-0 t-body ${disabled ? 'o-50' : 'pointer dim'
      }`,
    [withModifiers, status, disabled]
  )

  const labelClass = useMemo(
    () => `${handles.label} db tc`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handles.label]
  )

  return (
    <div className={containerClass}>
      <button
        type="button"
        className={buttonClass}
        disabled={disabled}
        onClick={onClick}
        aria-live="polite"
        aria-busy={status === 'applying'}
      >
        <span className={labelClass}>{text}</span>
      </button>
    </div>
  )
}

export default CouponButton