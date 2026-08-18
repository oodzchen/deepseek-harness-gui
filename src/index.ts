import { Command } from 'commander'
import type { Context } from '@deepseek-ai/cordis'
import { parseCmdline } from '@deepseek-ai/dsh-cmdline'
import { open } from 'glimpseui'

export const name = 'glimpse-gui'
export const inject = ['cmdlineArgs']

const WEB_STARTUP_SERVICE = 'webStartup'

interface Options {
  host?: string
  port?: string
  trustedHost?: string[]
  gui?: boolean
}

let windowOpen = false

function page(url: string): string {
  // Glimpse starts an about:blank document. Loading the Web UI in an iframe
  // makes Chromium classify its localhost requests as Private Network Access
  // from a public page and block them. Navigate the top-level WebView instead;
  // the final document then has the normal http://127.0.0.1:<port> origin.
  const escaped = url.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
  return `<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${escaped}"><script>location.replace(${JSON.stringify(url)})</script>`
}

function command(): Command {
  return new Command()
    .name('dsh --profile web')
    .description('Serve the DeepSeek Harness browser UI.')
    .helpOption('-h, --help', 'show this help')
    .option('--host <host>', 'bind host')
    .option('--port <port>', 'listen port; pass 0 to let the OS pick a free one')
    .option('--trusted-host <authority...>', 'extra authority accepted by the browser trust fence')
    .option('--gui', 'open the Web GUI in a native Glimpse window')
}

/**
 * Web startup provider plus the deliberately small native-window adapter.
 * The adapter does not duplicate or proxy the Web UI; Glimpse only hosts an
 * iframe pointing at the already-running dsh web server.
 */
export function apply(ctx: Context): void {
  const program = command()
  program.action(() => {
    const options = program.opts<Options>()
    if (options.host === '0.0.0.0') {
      program.error('error: --host 0.0.0.0 is not supported for the GUI adapter; use 127.0.0.1')
    }
    if (options.port !== undefined && !/^\d+$/.test(options.port)) {
      program.error(`error: --port must be a number, got ${JSON.stringify(options.port)}`)
    }
    const startup = {
      ...(options.host !== undefined && { host: options.host }),
      ...(options.port !== undefined && { port: Number(options.port) }),
      trustedHosts: options.trustedHost ?? [],
    }
    ctx.provide(WEB_STARTUP_SERVICE, startup)
    if (!options.gui) return

    ctx.inject(['webServer'], (webCtx) => {
      if (windowOpen) return
      const server = (webCtx as unknown as { webServer?: { port?: number } }).webServer
      if (server?.port === undefined) throw new Error('dsh-glimpse-gui: webServer did not expose a bound port')
      const url = `http://127.0.0.1:${server.port}`
      try {
        const win = open(page(url), { width: 1400, height: 900, title: 'DeepSeek Harness' })
        windowOpen = true
        win.on('closed', () => { windowOpen = false })
        win.on('error', () => { windowOpen = false })
      } catch (error) {
        console.error(`dsh-glimpse-gui: failed to open Glimpse: ${String(error)}`)
      }
    })
  })
  parseCmdline(ctx, program)
}
