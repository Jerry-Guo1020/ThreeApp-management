export function formatNumber(value: number) {
  return new Intl.NumberFormat('zh-CN').format(value)
}

export function toPercent(value: number, total: number) {
  if (total === 0) return '0%'
  return `${Math.round((value / total) * 100)}%`
}
