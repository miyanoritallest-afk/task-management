import styles from '../styles/Card.module.css'

const PRIORITY_LABEL = { high: '高', medium: '中', low: '低', none: 'なし' }
const PRIORITY_COLOR = {
  high: '#e53935',
  medium: '#f5a623',
  low: '#8bc34a',
  none: '#d0d5dd',
}

function formatDate(iso) {
  if (!iso) return null
  const [y, m, d] = iso.split('-')
  return `${y}/${m}/${d}`
}

function isOverdue(iso) {
  if (!iso) return false
  return new Date(iso) < new Date(new Date().toDateString())
}

export default function Card({ card }) {
  const color = PRIORITY_COLOR[card.priority] ?? PRIORITY_COLOR.none
  const overdue = isOverdue(card.dueDate)

  return (
    <div className={styles.card} style={{ borderLeftColor: color }}>
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
