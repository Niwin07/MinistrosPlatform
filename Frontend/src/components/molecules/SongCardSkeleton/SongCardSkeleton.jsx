import styles from './SongCardSkeleton.module.css'

export default function SongCardSkeleton() {
  return (
    <article className={`glass-2 ${styles.card} ${styles.md}`} aria-hidden="true">
      <span className={`${styles.grip} ${styles.shimmer}`} />

      <span className={`${styles.albumArt} ${styles.shimmer}`} />

      <div className={styles.info}>
        <span className={`${styles.line} ${styles.lineTitle} ${styles.shimmer}`} />
        <span className={`${styles.line} ${styles.lineArtist} ${styles.shimmer}`} />
        <div className={styles.pills}>
          <span className={`${styles.pill} ${styles.shimmer}`} />
          <span className={`${styles.pill} ${styles.shimmer}`} />
        </div>
      </div>

      <div className={styles.actions}>
        <span className={`${styles.actionBtn} ${styles.shimmer}`} />
        <span className={`${styles.actionBtn} ${styles.shimmer}`} />
      </div>
    </article>
  )
}
