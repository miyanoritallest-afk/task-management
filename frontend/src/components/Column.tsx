import type { BoardColumn } from '../types'
import Card from './Card'
import styles from '../styles/Column.module.css'

export default function Column({ column }: { column: BoardColumn }) {
  const sorted = [...column.cards].sort((a, b) => a.position - b.position)

  return (
    <div className={styles.column}>
      <div className={styles.header}>
        <span className={styles.name}>{column.name}</span>
        <span className={styles.count}>{sorted.length}</span>
      </div>
      <div className={styles.cards}>
        {sorted.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}
