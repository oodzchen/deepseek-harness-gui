declare module 'glimpseui' {
  import { EventEmitter } from 'node:events'
  export interface GlimpseOptions {
    width?: number
    height?: number
    title?: string
  }
  export interface GlimpseWindow extends EventEmitter {
    close(): void
  }
  export function open(html: string, options?: GlimpseOptions): GlimpseWindow
}
