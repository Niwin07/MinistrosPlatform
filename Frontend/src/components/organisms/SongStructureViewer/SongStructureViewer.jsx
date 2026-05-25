import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Typography from '../../atoms/Typography'
import styles from './SongStructureViewer.module.css'

const SECTION_LABELS = {
  intro: 'Intro',
  verso: 'Verso',
  coro: 'Coro',
  puente: 'Puente',
  outro: 'Outro',
}

export default function SongStructureViewer({ song, onClose }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!song) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [song, onClose])

  if (!mounted || !song) return null

  const displayKey = song.override_key || song.default_key || song.keyNote || ''

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div className={styles.headerInfo}>
            <Typography variant="title" as="h1" className={styles.songTitle}>
              {song.title}
            </Typography>
            <Typography variant="meta" color="secondary">
              {song.artist}
            </Typography>
          </div>

          <div className={styles.headerRight}>
            {displayKey && (
              <span className={styles.keyBadge}>{displayKey}</span>
            )}
            <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar" type="button">
              <CloseIcon />
            </button>
          </div>
        </header>

        <div className={styles.body}>
          {song.structure && Object.keys(song.structure).length > 0 ? (
            Object.entries(song.structure).map(([key, section]) => {
              const sectionType = key.replace(/_\d+$/, '')
              const label = SECTION_LABELS[sectionType] || sectionType
              return (
                <section key={key} className={styles.section}>
                  <Typography variant="label" color="accent" className={styles.sectionLabel}>
                    {label}
                  </Typography>
                  <div className={styles.lyrics}>
                    {section.split('\n').map((line, i) => (
                      <p key={i} className={styles.lyricLine}>
                        {line || '\u00A0'}
                      </p>
                    ))}
                  </div>
                </section>
              )
            })
          ) : (
            <Typography variant="body" color="tertiary" className={styles.empty}>
              Sin letra disponible
            </Typography>
          )}

          {song.chords && (
            <section className={styles.chordsSection}>
              <Typography variant="label" color="secondary">Acordes</Typography>
              <pre className={styles.chords}>{song.chords}</pre>
            </section>
          )}
        </div>
      </div>
    </div>,
    document.getElementById('drawer-root'),
  )
}

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
