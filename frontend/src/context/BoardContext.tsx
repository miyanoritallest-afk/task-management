import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import client from '../api/client'
import type { Board, BoardColumn, Card } from '../types'

interface BoardContextValue {
  boards: Board[]
  loading: boolean
  error: string | null
  addCard: (columnId: string, card: Card) => void
  updateCardInContext: (columnId: string, updatedCard: Card) => void
  moveCardInContext: (fromColumnId: string, toColumnId: string, card: Card) => void
  reorderColumns: (newColumns: BoardColumn[]) => void
  reorderCardsInColumn: (columnId: string, newCards: Card[]) => void
  refreshBoard: () => Promise<void>
}

const BoardContext = createContext<BoardContextValue | null>(null)

export function BoardProvider({ children }: { children: ReactNode }) {
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBoards = useCallback(() => {
    return client
      .get<Board[]>('/boards')
      .then((res) => setBoards(res.data))
      .catch(() => setError('データを読み込めませんでした。ページを再読み込みしてください。'))
  }, [])

  useEffect(() => {
    fetchBoards().finally(() => setLoading(false))
  }, [fetchBoards])

  async function refreshBoard() {
    await fetchBoards()
  }

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

  function updateCardInContext(columnId: string, updatedCard: Card) {
    setBoards((prev) =>
      prev.map((board) => ({
        ...board,
        columns: board.columns.map((col) =>
          col.id === columnId
            ? { ...col, cards: col.cards.map((c) => (c.id === updatedCard.id ? updatedCard : c)) }
            : col
        ),
      }))
    )
  }

  function moveCardInContext(fromColumnId: string, toColumnId: string, card: Card) {
    setBoards((prev) =>
      prev.map((board) => ({
        ...board,
        columns: board.columns.map((col) => {
          if (col.id === fromColumnId) {
            return { ...col, cards: col.cards.filter((c) => c.id !== card.id) }
          }
          if (col.id === toColumnId) {
            return { ...col, cards: [...col.cards, card] }
          }
          return col
        }),
      }))
    )
  }

  function reorderColumns(newColumns: BoardColumn[]) {
    setBoards((prev) =>
      prev.map((board) => ({
        ...board,
        columns: newColumns,
      }))
    )
  }

  function reorderCardsInColumn(columnId: string, newCards: Card[]) {
    setBoards((prev) =>
      prev.map((board) => ({
        ...board,
        columns: board.columns.map((col) =>
          col.id === columnId ? { ...col, cards: newCards } : col
        ),
      }))
    )
  }

  return (
    <BoardContext.Provider
      value={{
        boards,
        loading,
        error,
        addCard,
        updateCardInContext,
        moveCardInContext,
        reorderColumns,
        reorderCardsInColumn,
        refreshBoard,
      }}
    >
      {children}
    </BoardContext.Provider>
  )
}

export function useBoard(): BoardContextValue {
  const ctx = useContext(BoardContext)
  if (!ctx) throw new Error('useBoard must be used within BoardProvider')
  return ctx
}
