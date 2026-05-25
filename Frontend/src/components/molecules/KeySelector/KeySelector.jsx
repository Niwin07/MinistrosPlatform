import styles from './KeySelector.module.css'

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export default function KeySelector({ value = '', onChange }) {
  const match = value.match(/^([A-G]#?)(.*)$/)
  const selectedNote = match?.[1] || ''
  const suffix = match?.[2] || ''

  function handleNote(note) {
    onChange(note + suffix === value && suffix ? note : note + suffix)
  }

  function toggleMinor() {
    if (suffix === 'm') {
      onChange(selectedNote)
    } else {
      onChange(selectedNote + 'm')
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {NOTES.map((note) => {
          const isBlack = note.includes('#')
          const isSelected = note === selectedNote
          return (
            <button
              key={note}
              className={`${styles.key} ${isBlack ? styles.black : styles.white} ${isSelected ? styles.selected : ''}`}
              onClick={() => handleNote(note)}
              type="button"
              aria-pressed={isSelected}
            >
              {note}
            </button>
          )
        })}
      </div>

      <button
        className={`${styles.minorToggle} ${suffix === 'm' ? styles.minorActive : ''}`}
        onClick={toggleMinor}
        type="button"
        aria-pressed={suffix === 'm'}
      >
        m — menor
      </button>
    </div>
  )
}
