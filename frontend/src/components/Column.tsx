import { useState } from 'react'
import { Droppable, Draggable } from '@hello-pangea/dnd'
import type { BoardColumn, Card, CardSortMode } from '../types'
import CardComponent from './Card'
import AddCardModal from './AddCardModal'
import EditCardModal from './EditCardModal'
import { useBoard } from '../context/BoardContext'
import { sortCards } from '../utils/sortCards'
import styles from '../styles/Column.module.css'

interface Props {
  column: BoardColumn
  index: number
  onDelete: () => Promise<void>
}

export default function Column({ column, index, onDelete }: Props) {
  const { addCard } = useBoard()
  const [deleting, setDeleting] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<Card | null>(null)
  const [sortMode, setSortMode] = useState<CardSortMode>('manual')

  const sorted = sortCards(column.cards, sortMode)

  function handleSuccess(card: Card) {
    addCard(column.id, card)
    setModalOpen(false)
  }

  async function handleDelete() {
    if (!window.confirm(`「${column.name}」を削除しますか？\nこの列のカードもすべて削除されます。`)) return
    setDeleting(true)
    try {
      await onDelete()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          className={styles.column}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <span className={styles.grip} {...provided.dragHandleProps}>⠿</span>
              <span className={styles.name}>{column.name}</span>
            </div>
            <div className={styles.headerRight}>
              <select
                className={styles.sortSelect}
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as CardSortMode)}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="manual">手動</option>
                <option value="priority">優先度順</option>
                <option value="dueDate">期限順</option>
              </select>
              <span className={styles.count}>{sorted.length}</span>
              <button
                className={styles.addBtn}
                onClick={() => setModalOpen(true)}
                aria-label={`${column.name}にカードを追加`}
              >
                +
              </button>
              <button
                className={styles.deleteBtn}
                onClick={handleDelete}
                disabled={deleting}
                aria-label={`${column.name}を削除`}
              >
                ×
              </button>
            </div>
          </div>
          <Droppable droppableId={column.id} type="card" ignoreContainerClipping>
            {(dropProvided, snapshot) => (
              <div
                className={`${styles.cards} ${snapshot.isDraggingOver ? styles.draggingOver : ''}`}
                ref={dropProvided.innerRef}
                {...dropProvided.droppableProps}
              >
                {sorted.map((card, cardIndex) => (
                  <Draggable key={card.id} draggableId={card.id} index={cardIndex}>
                    {(cardProvided, cardSnapshot) => (
                      <div
                        ref={cardProvided.innerRef}
                        {...cardProvided.draggableProps}
                        {...cardProvided.dragHandleProps}
                        style={{
                          ...cardProvided.draggableProps.style,
                          opacity: cardSnapshot.isDragging ? 0.7 : 1,
                        }}
                      >
                        <CardComponent card={card} onEdit={setEditingCard} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {dropProvided.placeholder}
              </div>
            )}
          </Droppable>
          {modalOpen && (
            <AddCardModal
              columnId={column.id}
              position={column.cards.length}
              onSuccess={handleSuccess}
              onClose={() => setModalOpen(false)}
            />
          )}
          {editingCard && (
            <EditCardModal
              card={editingCard}
              columnId={column.id}
              onClose={() => setEditingCard(null)}
            />
          )}
        </div>
      )}
    </Draggable>
  )
}
