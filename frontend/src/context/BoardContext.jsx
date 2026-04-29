import { createContext, useContext, useEffect, useState } from 'react'
import client from '../api/client'

const BoardContext = createContext(null)

export function BoardProvider({ children }) {
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    client
      .get('/boards')
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

export function useBoard() {
  return useContext(BoardContext)
}
