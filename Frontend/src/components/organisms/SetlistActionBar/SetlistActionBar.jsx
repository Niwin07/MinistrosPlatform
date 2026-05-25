import Button from '../../atoms/Button'
import styles from './SetlistActionBar.module.css'

export default function SetlistActionBar({ status, onStartRehearsal, onPublish, onEndRehearsal, onNewSetlist }) {
  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        {status === 'DRAFT' && (
          <>
            <Button className={styles.secondary} onClick={onStartRehearsal}>
              Iniciar Ensayo
            </Button>
            <Button className={styles.primary} onClick={onPublish}>
              Publicar Lista
            </Button>
          </>
        )}

        {status === 'REHEARSAL' && (
          <Button className={styles.rehearsalBtn} onClick={onEndRehearsal}>
            <span className={styles.pulse} />
            Finalizar Ensayo
          </Button>
        )}

        {status === 'FINAL' && (
          <Button className={styles.primary} onClick={onNewSetlist}>
            Crear nueva lista
          </Button>
        )}
      </div>
    </div>
  )
}
