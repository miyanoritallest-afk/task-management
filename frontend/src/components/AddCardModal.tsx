import { useState, FormEvent } from 'react'
import { createCard } from '../api/client'
import type { Card, Priority } from '../types'
import styles from '../styles/AddCardModal.module.css'

interface Props {
  columnId: string
  position: number
  onSuccess: (card: Card) => void
  onClose: () => void
}

export default function AddCardModal({ columnId, position, onSuccess, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<Priority>('none')
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
      const card = await createCard(columnId, {
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
        priority,
        position,
      })
      onSuccess(card)
    } catch {
      setApiError('カードの作成に失敗しました。もう一度お試しください。')
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
        <p className={styles.title}>新しいカードを追加</p>
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="card-title">
                タイトル <span style={{ color: '#e03e3e' }}>*</span>
              </label>
              <input
                id="card-title"
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
              <label className={styles.label} htmlFor="card-description">
                説明
              </label>
              <textarea
                id="card-description"
                className={styles.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="詳細を入力（任意）"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="card-dueDate">
                期限日
              </label>
              <input
                id="card-dueDate"
                className={styles.input}
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="card-priority">
                優先度
              </label>
              <select
                id="card-priority"
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
                {submitting ? '追加中...' : '追加する'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
