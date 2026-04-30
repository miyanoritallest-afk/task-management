import type { Card, CardSortMode } from '../types'

const PRIORITY_WEIGHT: Record<string, number> = { high: 0, medium: 1, low: 2, none: 3 }

export function sortCards(cards: Card[], mode: CardSortMode): Card[] {
  const copy = [...cards]
  if (mode === 'manual') {
    return copy.sort((a, b) => a.position - b.position)
  }
  if (mode === 'priority') {
    return copy.sort((a, b) => {
      const diff = (PRIORITY_WEIGHT[a.priority] ?? 3) - (PRIORITY_WEIGHT[b.priority] ?? 3)
      return diff !== 0 ? diff : a.position - b.position
    })
  }
  // dueDate: nullは末尾、同値はpositionで tie-break
  return copy.sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return a.position - b.position
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    const diff = a.dueDate.localeCompare(b.dueDate)
    return diff !== 0 ? diff : a.position - b.position
  })
}
