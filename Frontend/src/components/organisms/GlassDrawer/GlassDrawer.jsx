import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Typography from '../../atoms/Typography'
import styles from './GlassDrawer.module.css'

export default function GlassDrawer({ isOpen, onClose, title, children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={`${styles.panel} glass-4`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.handle} aria-hidden="true" />

        <header className={styles.header}>
          <Typography variant="subtitle">{title}</Typography>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar" type="button">
            <CloseIcon />
          </button>
        </header>

        <div className={styles.body}>
          {children}
        </div>
      </div>
    </div>,
    document.getElementById('drawer-root'),
  )
}

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
