import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './Toast.module.css'

export default function Toast({ message, visible, onDone }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => onDone?.(), 2200)
    return () => clearTimeout(timer)
  }, [visible, onDone])

  if (!mounted || !visible) return null

  return createPortal(
    <div className={styles.wrapper} role="status" aria-live="polite">
      <div className={`glass-4 ${styles.toast}`}>
        <CheckIcon />
        <span className={styles.text}>{message}</span>
      </div>
    </div>,
    document.getElementById('drawer-root'),
  )
}

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
