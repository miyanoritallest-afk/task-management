import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import client from '../api/client'
import type { Board, Card } from '../types'

interface BoardContextValue {
  boards: Board[]
  loading: boolean
  error: string | null
  addCard: (columnId: string, card: Card) => void
}

const BoardContext = createContext<BoardContextValue | null>(null)

export function BoardProvider({ children }: { children: ReactNode }) {
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    client
      .get<Board[]>('/boards')
      .then((res) => setBoards(res.data))
      .catch(() =>
        setError('データを読み込めませんでした。ページを再読み込みしてください。')
      )
      .finally(() => setLoading(false))
  }, [])

  function addCard(columnId: string, card: Card) {
    setBoards((prev) =>
      prev.map((board) => ({
        ...board,
        columns: board.columns.map((col) =>
          col.id === columnId ? { ...col, cards: [...col.cards, card] } : col
        ),
      }))
    )
  }

  return (
    <BoardContext.Provider value={{ boards, loading, error, addCard }}>
      {children}
    </BoardContext.Provider>
  )
}

export function useBoard(): BoardContextValue {
  const ctx = useContext(BoardContext)
  if (!ctx) throw new Error('useBoard must be used within BoardProvider')
  return ctx
}
