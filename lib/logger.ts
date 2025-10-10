// biome-ignore-all lint/suspicious/noConsole: we use console.log and console.error

export const logger = {
  info: (...args: unknown[]) => {
    console.log(...args)
  },
  error: (...args: unknown[]) => {
    console.error(...args)
  },
  warn: (...args: unknown[]) => {
    console.warn(...args)
  },
  debug: (...args: unknown[]) => {
    console.debug(...args)
  },
  trace: (...args: unknown[]) => {
    console.trace(...args)
  },
  dir: (...args: unknown[]) => {
    console.dir(...args)
  },
}
