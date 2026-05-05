declare module 'vtex.css-handles' {
  type CssHandlesInput<T extends readonly string[]> = T | T[]

  export type CssHandlesBag<H extends string> = {
    handles: Record<H, string>
    withModifiers: (id: H, modifier: string | string[]) => string
  }

  export function useCssHandles<T extends readonly string[]>(
    handles: CssHandlesInput<T>,
    options?: Record<string, unknown>
  ): CssHandlesBag<T[number]>
}
