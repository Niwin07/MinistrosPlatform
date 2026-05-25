import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Typography from '../../atoms/Typography'
import Badge from '../../atoms/Badge'
import Toast from '../../atoms/Toast'
import { useSetlist } from '../../../hooks/useSetlist'
import styles from './Profile.module.css'

const MOCK_PROFILE = {
  name: 'Carlos Méndez',
  role: 'Ministro de alabanza',
  avatar: null,
}

const MOCK_HISTORY = [
  {
    id: 's1',
    date: '18 May 2026',
    songCount: 6,
    songs: [
      { title: 'Oceans', artist: 'Hillsong United', default_key: 'G' },
      { title: 'What A Beautiful Name', artist: 'Hillsong Worship', default_key: 'D' },
      { title: 'Goodness of God', artist: 'Bethel Music', default_key: 'A' },
      { title: 'Reckless Love', artist: 'Cory Asbury', default_key: 'E' },
      { title: 'Holy Spirit', artist: 'Francesca Battistelli', default_key: 'F' },
      { title: 'Waymaker', artist: 'Sinach', default_key: 'Bb' },
    ],
  },
  {
    id: 's2',
    date: '11 May 2026',
    songCount: 4,
    songs: [
      { title: 'El Poder de Tu Amor', artist: 'Hillsong', default_key: 'C' },
      { title: 'Creeré', artist: 'Miel San Marcos', default_key: 'G' },
      { title: 'Sobre Roca', artist: 'Marcos Witt', default_key: 'A' },
      { title: 'Dios de Maravillas', artist: 'En Espíritu y Verdad', default_key: 'D' },
    ],
  },
  {
    id: 's3',
    date: '4 May 2026',
    songCount: 5,
    songs: [
      { title: 'Rey de Reyes', artist: 'Hillsong Worship', default_key: 'E' },
      { title: 'Santo Espíritu', artist: 'Marcos Witt', default_key: 'G' },
      { title: 'Me Rindo a Ti', artist: 'Hillsong', default_key: 'A' },
      { title: 'Tu Amor No Tiene Fin', artist: 'En Espíritu y Verdad', default_key: 'F' },
      { title: 'Gracia Sublime Es', artist: 'Hillsong', default_key: 'C' },
    ],
  },
]

export default function Profile() {
  const [history] = useState(MOCK_HISTORY)
  const [cloningId, setCloningId] = useState(null)
  const [toastVisible, setToastVisible] = useState(false)
  const { cloneSetlistToDraft } = useSetlist()
  const navigate = useNavigate()

  function handleClone(setlistId) {
    const setlist = history.find((s) => s.id === setlistId)
    if (!setlist) return

    setCloningId(setlistId)
    cloneSetlistToDraft(setlist.songs)
    setToastVisible(true)

    setTimeout(() => {
      setCloningId(null)
      navigate('/')
    }, 1200)
  }

  return (
    <div className={styles.root}>
      <header className={`glass-2 ${styles.profileCard}`}>
        <div className={styles.avatar}>
          {MOCK_PROFILE.avatar ? (
            <img src={MOCK_PROFILE.avatar} alt="" className={styles.avatarImg} />
          ) : (
            <span className={styles.avatarInitial}>{MOCK_PROFILE.name[0]}</span>
          )}
        </div>
        <div>
          <Typography variant="title" as="h1">{MOCK_PROFILE.name}</Typography>
          <Typography variant="meta" color="tertiary">{MOCK_PROFILE.role}</Typography>
        </div>
      </header>

      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <Typography variant="subtitle">Setlists archivados</Typography>
          <Typography variant="meta" color="tertiary">{history.length} listas</Typography>
        </header>

        <div className={styles.feed}>
          {history.map((setlist) => (
            <article key={setlist.id} className={`glass-2 ${styles.card}`}>
              <header className={styles.cardHeader}>
                <Badge className={styles.dateBadge}>{setlist.date}</Badge>
                <Badge>{setlist.songCount} canciones</Badge>
              </header>

              <div className={styles.songPreviews}>
                {setlist.songs.map((song, i) => (
                  <span key={i} className={styles.songChip}>
                    {song.title}
                    {i < setlist.songs.length - 1 && <span className={styles.sep}>·</span>}
                  </span>
                ))}
              </div>

              <div className={styles.cardActions}>
                <button
                  className={`${styles.cloneBtn} ${cloningId === setlist.id ? styles.cloneDone : ''}`}
                  onClick={() => handleClone(setlist.id)}
                  disabled={!!cloningId}
                  type="button"
                >
                  {cloningId === setlist.id ? '✓ Copiando…' : 'Copiar Setlist'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Toast
        message="¡Lista copiada con éxito!"
        visible={toastVisible}
        onDone={() => setToastVisible(false)}
      />
    </div>
  )
}
