import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { useBoard } from '../context/BoardContext'
import Column from './Column'
import { updateCard, updateColumn, moveCard } from '../api/client'
import styles from '../styles/KanbanBoard.module.css'

export default function KanbanBoard() {
  const { boards, loading, error, reorderColumns, reorderCardsInColumn, moveCardInContext, refreshBoard } = useBoard()

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
  const sortedColumns = [...board.columns].sort((a, b) => a.position - b.position)

  async function handleDragEnd(result: DropResult) {
    const { source, destination, type } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    if (type === 'column') {
      const reordered = [...sortedColumns]
      const [moved] = reordered.splice(source.index, 1)
      reordered.splice(destination.index, 0, moved)

      reorderColumns(reordered)

      try {
        const patches = reordered
          .map((col, index) => ({ col, newPos: index }))
          .filter(({ col, newPos }) => col.position !== newPos)
          .map(({ col, newPos }) => updateColumn(col.id, { position: newPos }))
        await Promise.all(patches)
      } catch {
        await refreshBoard()
      }
      return
    }

    // card type
    const fromColumn = sortedColumns.find((c) => c.id === source.droppableId)
    const toColumn = sortedColumns.find((c) => c.id === destination.droppableId)
    if (!fromColumn || !toColumn) return

    const fromCards = [...fromColumn.cards].sort((a, b) => a.position - b.position)
    const movedCard = fromCards[source.index]
    if (!movedCard) return

    if (source.droppableId === destination.droppableId) {
      // 同一列内の並び替え
      const reordered = [...fromCards]
      reordered.splice(source.index, 1)
      reordered.splice(destination.index, 0, movedCard)

      reorderCardsInColumn(fromColumn.id, reordered)

      try {
        const patches = reordered
          .map((card, index) => ({ card, newPos: index }))
          .filter(({ card, newPos }) => card.position !== newPos)
          .map(({ card, newPos }) => updateCard(card.id, {
            title: card.title,
            description: card.description,
            dueDate: card.dueDate,
            priority: card.priority,
            color: card.color,
            position: newPos,
          }))
        await Promise.all(patches)
      } catch {
        await refreshBoard()
      }
    } else {
      // 列間移動
      const newPosition = destination.index
      moveCardInContext(fromColumn.id, toColumn.id, movedCard)

      try {
        await moveCard(movedCard.id, toColumn.id)
        await updateCard(movedCard.id, {
          title: movedCard.title,
          description: movedCard.description,
          dueDate: movedCard.dueDate,
          priority: movedCard.priority,
          color: movedCard.color,
          position: newPosition,
        })
      } catch {
        await refreshBoard()
      }
    }
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>タスク<strong>ボード</strong></h1>
        <span className={styles.boardName}>{board.name}</span>
      </header>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="board" type="column" direction="horizontal">
          {(provided) => (
            <div
              className={styles.board}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {sortedColumns.map((col, index) => (
                <Column key={col.id} column={col} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
