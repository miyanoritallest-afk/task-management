import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import client from '../api/client'
import type { Board } from '../types'

interface BoardContextValue {
  boards: Board[]
  loading: boolean
  error: string | null
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

  return (
    <BoardContext.Provider value={{ boards, loading, error }}>
      {children}
    </BoardContext.Provider>
  )
}

export function useBoard(): BoardContextValue {
  const ctx = useContext(BoardContext)
  if (!ctx) throw new Error('useBoard must be used within BoardProvider')
  return ctx
}
