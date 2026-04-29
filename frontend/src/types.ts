export type Priority = 'high' | 'medium' | 'low' | 'none'

export interface Card {
  id: string
  title: string
  description: string | null
  dueDate: string | null
  priority: Priority
  position: number
  color: string | null
}

export interface BoardColumn {
  id: string
  name: string
  position: number
  cards: Card[]
}

export interface Board {
  id: string
  name: string
  columns: BoardColumn[]
}
