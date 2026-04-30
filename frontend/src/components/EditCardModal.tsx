import { useState, FormEvent } from 'react'
import { updateCard } from '../api/client'
import { useBoard } from '../context/BoardContext'
import type { Card, Priority } from '../types'
import styles from '../styles/EditCardModal.module.css'

interface Props {
  card: Card
  columnId: string
  onClose: () => void
}

export default function EditCardModal({ card, columnId, onClose }: Props) {
  const { updateCardInContext } = useBoard()
  const [title, setTitle] = useState(card.title)
  const [description, setDescription] = useState(card.description ?? '')
  const [dueDate, setDueDate] = useState(card.dueDate ?? '')
  const [priority, setPriority] = useState<Priority>(card.priority)
  const [titleError, setTitleError] = useState('')
  const [apiError, setApiError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setTitleError('')
    setApiError('')

    if (!title.trim()) {
      setTitleError('タイトルは必須です。')
      return
    }

    setSubmitting(true)
    try {
      const updated = await updateCard(card.id, {
        title: title.trim(),
        description: description.trim() || null,
        dueDate: dueDate || null,
        priority,
      })
      updateCardInContext(columnId, updated)
      onClose()
    } catch {
      setApiError('カードの更新に失敗しました。もう一度お試しください。')
    } finally {
      setSubmitting(false)
    }
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <p className={styles.title}>カードを編集</p>
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="edit-card-title">
                タイトル <span style={{ color: '#e03e3e' }}>*</span>
              </label>
              <input
                id="edit-card-title"
                className={styles.input}
                type="text"
                maxLength={100}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="タスクのタイトルを入力"
                autoFocus
              />
              {titleError && <span className={styles.fieldError}>{titleError}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="edit-card-description">
                説明
              </label>
              <textarea
                id="edit-card-description"
                className={styles.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="詳細を入力（任意）"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="edit-card-dueDate">
                期限日
              </label>
              <input
                id="edit-card-dueDate"
                className={styles.input}
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="edit-card-priority">
                優先度
              </label>
              <select
                id="edit-card-priority"
                className={styles.select}
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option value="none">なし</option>
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </select>
            </div>

            {apiError && <p className={styles.apiError}>{apiError}</p>}

            <div className={styles.actions}>
              <button type="button" className={styles.btnCancel} onClick={onClose}>
                キャンセル
              </button>
              <button type="submit" className={styles.btnSubmit} disabled={submitting}>
                {submitting ? '保存中...' : '保存する'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
