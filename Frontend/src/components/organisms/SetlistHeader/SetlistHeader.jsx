import Typography from '../../atoms/Typography'
import styles from './SetlistHeader.module.css'

const STATUS_META = {
  DRAFT: { label: 'BORRADOR', className: 'draft' },
  REHEARSAL: { label: 'EN ENSAYO', className: 'rehearsal' },
  FINAL: { label: 'PUBLICADO', className: 'final' },
}

export default function SetlistHeader({ status, date, songCount }) {
  const meta = STATUS_META[status] || STATUS_META.DRAFT

  return (
    <div className={`glass-2 ${styles.header}`}>
      <div className={styles.left}>
        <Typography variant="label" color="tertiary">
          {date}
        </Typography>
        <Typography variant="subtitle" className={styles.title}>
          Setlist activo
        </Typography>
      </div>

      <div className={styles.right}>
        <span className={`${styles.badge} ${styles[meta.className]}`}>
          {meta.label}
        </span>
        <Typography variant="meta" color="tertiary">
          {songCount} canciones
        </Typography>
      </div>
    </div>
  )
}
