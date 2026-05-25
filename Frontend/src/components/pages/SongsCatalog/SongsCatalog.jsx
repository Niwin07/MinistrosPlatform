import { useState, useEffect } from 'react'
import Typography from '../../atoms/Typography'
import Badge from '../../atoms/Badge'
import GlassDrawer from '../../organisms/GlassDrawer'
import AddSongForm from '../../organisms/AddSongDrawer/AddSongForm'
import SongEditor from '../../organisms/SongEditor'
import styles from './SongsCatalog.module.css'

const MOCK_SONGS = [
  { id: '1', title: 'Oceans', artist: 'Hillsong United', keyNote: 'G' },
  { id: '2', title: 'What A Beautiful Name', artist: 'Hillsong Worship', keyNote: 'D' },
  { id: '3', title: 'Goodness of God', artist: 'Bethel Music', keyNote: 'A' },
  { id: '4', title: 'Reckless Love', artist: 'Cory Asbury', keyNote: 'E' },
  { id: '5', title: 'Holy Spirit', artist: 'Francesca Battistelli', keyNote: 'F' },
  { id: '6', title: 'Waymaker', artist: 'Sinach', keyNote: 'Bb' },
]

export default function SongsCatalog() {
  const [songs, setSongs] = useState([])
  const [addOpen, setAddOpen] = useState(false)
  const [editSong, setEditSong] = useState(null)

  useEffect(() => {
    setSongs(MOCK_SONGS)
  }, [])

  function handleAddSong(data) {
    const newSong = {
      id: String(Date.now()),
      title: data.title,
      artist: data.artist,
      keyNote: data.keyNote || '',
    }
    setSongs((prev) => [newSong, ...prev])
    setAddOpen(false)
  }

  function handleSaveEdit(data) {
    setSongs((prev) =>
      prev.map((s) =>
        s.id === editSong.id ? { ...s, ...data } : s,
      ),
    )
    setEditSong(null)
  }

  function handleQuickKey(songId, newKey) {
    setSongs((prev) =>
      prev.map((s) => (s.id === songId ? { ...s, keyNote: newKey } : s)),
    )
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Typography variant="title">Canciones</Typography>
        <Typography variant="meta" color="tertiary">{songs.length} temas</Typography>
      </header>

      <div className={styles.list}>
        {songs.map((song) => (
          <article
            key={song.id}
            className={`glass-2 ${styles.item}`}
            onClick={() => setEditSong(song)}
          >
            <div className={styles.itemInfo}>
              <Typography variant="subtitle" truncate className={styles.itemTitle}>
                {song.title}
              </Typography>
              <Typography variant="meta" color="secondary" truncate>
                {song.artist}
              </Typography>
            </div>
            <Badge
              className={styles.badge}
              onClick={(e) => {
                e.stopPropagation()
                const next = prompt('Nuevo tono (ej: G, Am, Bb):', song.keyNote || '')
                if (next) handleQuickKey(song.id, next.trim())
              }}
            >
              {song.keyNote || '—'}
            </Badge>
          </article>
        ))}
      </div>

      <button
        className={styles.fab}
        onClick={() => setAddOpen(true)}
        aria-label="Agregar canción"
        type="button"
      >
        <PlusIcon />
      </button>

      <GlassDrawer isOpen={addOpen} onClose={() => setAddOpen(false)} title="Nueva canción">
        <AddSongForm onSubmit={handleAddSong} />
      </GlassDrawer>

      <GlassDrawer
        isOpen={!!editSong}
        onClose={() => setEditSong(null)}
        title={editSong ? `Editar: ${editSong.title}` : ''}
      >
        {editSong && (
          <SongEditor
            initialData={editSong}
            onSave={handleSaveEdit}
            onCancel={() => setEditSong(null)}
          />
        )}
      </GlassDrawer>
    </div>
  )
}

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
