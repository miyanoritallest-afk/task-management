import type { Card as CardType, Priority } from '../types'
import styles from '../styles/Card.module.css'

const PRIORITY_LABEL: Record<Priority, string> = {
  high: '高',
  medium: '中',
  low: '低',
  none: 'なし',
}

const PRIORITY_COLOR: Record<Priority, string> = {
  high: '#e53935',
  medium: '#f5a623',
  low: '#8bc34a',
  none: '#d0d5dd',
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${y}/${m}/${d}`
}

function isOverdue(iso: string): boolean {
  return new Date(iso) < new Date(new Date().toDateString())
}

interface Props {
  card: CardType
  onEdit: (card: CardType) => void
}

export default function Card({ card, onEdit }: Props) {
  const color = PRIORITY_COLOR[card.priority]
  const overdue = card.dueDate ? isOverdue(card.dueDate) : false

  return (
    <div className={styles.card} style={{ borderLeftColor: color }} onClick={() => onEdit(card)}>
      <div className={styles.header}>
        <span className={styles.title}>{card.title}</span>
        {card.priority !== 'none' && (
          <span className={styles.badge} style={{ backgroundColor: color }}>
            {PRIORITY_LABEL[card.priority]}
          </span>
        )}
      </div>
      {card.description && (
        <p className={styles.description}>{card.description}</p>
      )}
      {card.dueDate && (
        <span className={`${styles.dueDate} ${overdue ? styles.overdue : ''}`}>
          {overdue ? '⚠ ' : ''}{formatDate(card.dueDate)}
        </span>
      )}
    </div>
  )
}
