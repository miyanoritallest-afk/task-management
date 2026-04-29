import { useState } from 'react'
import type { BoardColumn, Card } from '../types'
import CardComponent from './Card'
import AddCardModal from './AddCardModal'
import { useBoard } from '../context/BoardContext'
import styles from '../styles/Column.module.css'

export default function Column({ column }: { column: BoardColumn }) {
  const { addCard } = useBoard()
  const [modalOpen, setModalOpen] = useState(false)
  const sorted = [...column.cards].sort((a, b) => a.position - b.position)

  function handleSuccess(card: Card) {
    addCard(column.id, card)
    setModalOpen(false)
  }

  return (
    <div className={styles.column}>
      <div className={styles.header}>
        <span className={styles.name}>{column.name}</span>
        <div className={styles.headerRight}>
          <span className={styles.count}>{sorted.length}</span>
          <button
            className={styles.addBtn}
            onClick={() => setModalOpen(true)}
            aria-label={`${column.name}にカードを追加`}
          >
            +
          </button>
        </div>
      </div>
      <div className={styles.cards}>
        {sorted.map((card) => (
          <CardComponent key={card.id} card={card} />
        ))}
      </div>
      {modalOpen && (
        <AddCardModal
          columnId={column.id}
          position={column.cards.length}
          onSuccess={handleSuccess}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
