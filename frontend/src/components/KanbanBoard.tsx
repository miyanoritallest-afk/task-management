import { useBoard } from '../context/BoardContext'
import Column from './Column'
import styles from '../styles/KanbanBoard.module.css'

export default function KanbanBoard() {
  const { boards, loading, error } = useBoard()

  if (loading) {
    return (
      <div className={styles.center}>
        <div className={styles.spinner} />
        <p>読み込み中...</p>
      </div>
    )
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  if (boards.length === 0) {
    return <div className={styles.center}>ボードがありません。</div>
  }

  const board = boards[0]
  const columns = [...board.columns].sort((a, b) => a.position - b.position)

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>タスク<strong>ボード</strong></h1>
        <span className={styles.boardName}>{board.name}</span>
      </header>
      <div className={styles.board}>
        {columns.map((col) => (
          <Column key={col.id} column={col} />
        ))}
      </div>
    </div>
  )
}
