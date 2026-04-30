import { useState } from 'react'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { useBoard } from '../context/BoardContext'
import Column from './Column'
import AddColumnModal from './AddColumnModal'
import AddBoardModal from './AddBoardModal'
import { updateCard, updateColumn, moveCard } from '../api/client'
import type { BoardColumn, Board } from '../types'
import styles from '../styles/KanbanBoard.module.css'

export default function KanbanBoard() {
  const { boards, currentBoardIndex, setCurrentBoardIndex, loading, error, reorderColumns, reorderCardsInColumn, moveCardInContext, refreshBoard, addColumn, addBoard, deleteColumn } = useBoard()
  const [addColumnModalOpen, setAddColumnModalOpen] = useState(false)
  const [addBoardModalOpen, setAddBoardModalOpen] = useState(false)

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

  const board = boards[currentBoardIndex] ?? boards[0]
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

    const movedCard = fromColumn.cards.find((c) => c.id === result.draggableId)
    if (!movedCard) return

    const fromCards = [...fromColumn.cards].sort((a, b) => a.position - b.position)

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

  function handleColumnAdded(column: BoardColumn) {
    addColumn(board.id, column)
    setAddColumnModalOpen(false)
  }

  function handleBoardAdded(newBoard: Board) {
    addBoard(newBoard)
    setAddBoardModalOpen(false)
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>タスク<strong>ボード</strong></h1>
        <select
          className={styles.boardSelect}
          value={currentBoardIndex}
          onChange={(e) => setCurrentBoardIndex(Number(e.target.value))}
        >
          {boards.map((b, i) => (
            <option key={b.id} value={i}>{b.name}</option>
          ))}
        </select>
        <button
          className={styles.addBoardBtn}
          onClick={() => setAddBoardModalOpen(true)}
        >
          + ボードを追加
        </button>
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
                <Column
                  key={col.id}
                  column={col}
                  index={index}
                  onDelete={() => deleteColumn(board.id, col.id)}
                />
              ))}
              {provided.placeholder}
              <button
                className={styles.addColumnBtn}
                onClick={() => setAddColumnModalOpen(true)}
              >
                + 列を追加
              </button>
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {addColumnModalOpen && (
        <AddColumnModal
          boardId={board.id}
          position={sortedColumns.length}
          onSuccess={handleColumnAdded}
          onClose={() => setAddColumnModalOpen(false)}
        />
      )}
      {addBoardModalOpen && (
        <AddBoardModal
          onSuccess={handleBoardAdded}
          onClose={() => setAddBoardModalOpen(false)}
        />
      )}
    </div>
  )
}
