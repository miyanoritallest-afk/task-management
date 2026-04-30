import { useState, FormEvent, MouseEvent } from 'react'
import { createBoard } from '../api/client'
import type { Board } from '../types'
import styles from '../styles/AddCardModal.module.css'

interface Props {
  onSuccess: (board: Board) => void
  onClose: () => void
}

export default function AddBoardModal({ onSuccess, onClose }: Props) {
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [apiError, setApiError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setNameError('')
    setApiError('')

    if (!name.trim()) {
      setNameError('ボード名は必須です。')
      return
    }

    setSubmitting(true)
    try {
      const board = await createBoard({ name: name.trim() })
      onSuccess(board)
    } catch {
      setApiError('ボードの作成に失敗しました。もう一度お試しください。')
    } finally {
      setSubmitting(false)
    }
  }

  function handleBackdropClick(e: MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <p className={styles.title}>新しいボードを追加</p>
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.formFields}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="board-name">
                ボード名 <span className={styles.required}>*</span>
              </label>
              <input
                id="board-name"
                className={styles.input}
                type="text"
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ボードの名前を入力"
                autoFocus
              />
              {nameError && <span className={styles.fieldError}>{nameError}</span>}
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
