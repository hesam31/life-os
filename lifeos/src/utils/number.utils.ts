export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function formatPercent(value: number, decimals = 0): string {
  return `${Math.round(value * 10 ** decimals) / 10 ** decimals}%`
}

export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

export function safeDiv(numerator: number, denominator: number, fallback = 0): number {
  if (denominator === 0) return fallback
  return numerator / denominator
}
