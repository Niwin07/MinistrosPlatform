import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Typography from '../../atoms/Typography'
import Input from '../../atoms/Input'
import styles from './MinistriesDirectory.module.css'

const MOCK_MINISTERS = [
  { id: '1', name: 'Carlos Méndez', role: 'Líder de Alabanza', lastSetlist: '18 May 2026' },
  { id: '2', name: 'María García', role: 'Voz Principal', lastSetlist: '16 May 2026' },
  { id: '3', name: 'José López', role: 'Guitarrista', lastSetlist: '14 May 2026' },
  { id: '4', name: 'Ana Martínez', role: 'Baterista', lastSetlist: '11 May 2026' },
  { id: '5', name: 'Pedro Hernández', role: 'Tecladista', lastSetlist: '9 May 2026' },
  { id: '6', name: 'Lucía Fernández', role: 'Voz Secundaria', lastSetlist: '7 May 2026' },
  { id: '7', name: 'Diego Ramírez', role: 'Líder de Alabanza', lastSetlist: '4 May 2026' },
  { id: '8', name: 'Sofía Torres', role: 'Violinista', lastSetlist: '2 May 2026' },
]

export default function MinistriesDirectory() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const filtered = MOCK_MINISTERS.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Typography variant="title">Directorio de Ministros</Typography>
      </header>

      <div className={`glass-1 ${styles.searchWrap}`}>
        <SearchIcon />
        <Input
          className={styles.searchInput}
          placeholder="Buscar por nombre..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className={styles.grid}>
        {filtered.map((minister) => (
          <button
            key={minister.id}
            className={`glass-2 ${styles.card}`}
            onClick={() => navigate(`/profile/${minister.id}`)}
            type="button"
          >
            <div className={styles.avatar}>
              <span className={styles.initial}>{minister.name[0]}</span>
            </div>
            <div className={styles.info}>
              <Typography variant="subtitle" truncate className={styles.name}>
                {minister.name}
              </Typography>
              <Typography variant="meta" color="tertiary" truncate>
                {minister.role}
              </Typography>
              <Typography variant="caption" color="tertiary" className={styles.lastDate}>
                Última lista: {minister.lastSetlist}
              </Typography>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <Typography variant="body" color="tertiary" className={styles.empty}>
            No se encontraron ministros
          </Typography>
        )}
      </div>
    </div>
  )
}

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)
