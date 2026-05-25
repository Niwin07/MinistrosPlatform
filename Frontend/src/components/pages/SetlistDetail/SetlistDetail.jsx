import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSetlist } from "../../../hooks/useSetlist";
import { useAuthStore } from "../../../store/authStore";
import Typography from "../../atoms/Typography";
import KeySelector from "../../molecules/KeySelector";
import SongStructureViewer from "../../organisms/SongStructureViewer";
import styles from "./SetlistDetail.module.css";

const STATUS_META = {
  DRAFT: { label: "BORRADOR", className: "statusDraft" },
  REHEARSAL: { label: "ENSAYO", className: "statusRehearsal" },
  FINAL: { label: "PUBLICADO", className: "statusFinal" },
};

const MOCK_SETLIST = {
  title: "Culto Dominical",
  date: new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
};

export default function SetlistDetail() {
  const { id } = useParams();
  const { songs, status, updateKey } = useSetlist();
  const user = useAuthStore((s) => s.user);
  const isLeader = user?.role === "LÍDER";

  const [viewingSong, setViewingSong] = useState(null);
  const [editingKeySongId, setEditingKeySongId] = useState(null);

  const statusMeta = STATUS_META[status] || STATUS_META.DRAFT;

  function handleKeyChange(songId, newKey) {
    updateKey(songId, newKey);
  }

  function toggleKeyEditor(songId) {
    setEditingKeySongId((prev) => (prev === songId ? null : songId));
  }

  function totalDuration() {
    return songs.reduce((acc, s) => {
      if (!s.duration) return acc;
      const [m, sec] = s.duration.split(":").map(Number);
      return acc + (m || 0) * 60 + (sec || 0);
    }, 0);
  }

  function formatTotal(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  return (
    <div className={styles.root}>
      {status === "REHEARSAL" && (
        <div className={styles.liveBanner}>
          <span className={styles.liveDot} />
          <Typography variant="meta" className={styles.liveText}>
            En vivo: Sincronización activada
          </Typography>
        </div>
      )}

      <header className={`glass-2 ${styles.header}`}>
        <div className={styles.headerLeft}>
          <Typography variant="label" color="tertiary" className={styles.dateLabel}>
            {MOCK_SETLIST.date}
          </Typography>
          <Typography variant="title" as="h1" className={styles.eventTitle}>
            {MOCK_SETLIST.title}
          </Typography>
          <Typography variant="meta" color="tertiary">
            ID: #{id}
          </Typography>
        </div>
        <div className={styles.headerRight}>
          <span className={`${styles.statusBadge} ${styles[statusMeta.className]}`}>
            {statusMeta.label}
          </span>
          <div className={styles.stats}>
            <span className={styles.stat}>
              {songs.length} canciones
            </span>
            <span className={styles.statDot}>·</span>
            <span className={styles.stat}>
              {formatTotal(totalDuration())}
            </span>
          </div>
        </div>
      </header>

      <div className={styles.songList}>
        {songs.length === 0 && (
          <div className={styles.empty}>
            <Typography variant="body" color="tertiary">
              No hay canciones en esta lista.
            </Typography>
          </div>
        )}

        {songs
          .slice()
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((song, index) => {
            const displayKey = song.override_key || song.default_key || song.keyNote || "";
            const isEditingKey = isLeader && editingKeySongId === song.id;

            return (
              <div key={song.id} className={styles.songWrapper}>
                <article
                  className={`glass-2 ${styles.songCard} ${isEditingKey ? styles.songCardEditing : ""}`}
                  onClick={() => setViewingSong(song)}
                >
                  <span className={styles.orderBadge}>{index + 1}</span>

                  <div className={styles.songInfo}>
                    <Typography variant="subtitle" as="h2" className={styles.songTitle}>
                      {song.title}
                    </Typography>
                    <Typography variant="meta" color="secondary" className={styles.songArtist}>
                      {song.artist}
                    </Typography>
                  </div>

                  <div className={styles.songMeta}>
                    {displayKey && (
                      <span
                        className={`${styles.keyBadge} ${isLeader ? styles.keyBadgeClickable : ""}`}
                        onClick={(e) => {
                          if (!isLeader) return;
                          e.stopPropagation();
                          toggleKeyEditor(song.id);
                        }}
                        title={isLeader ? "Cambiar tono" : undefined}
                      >
                        {displayKey}
                        {isLeader && <span className={styles.keyEditIcon}>✎</span>}
                      </span>
                    )}
                    {song.bpm && (
                      <span className={styles.chip}>{song.bpm} BPM</span>
                    )}
                    {song.duration && (
                      <span className={styles.chip}>{song.duration}</span>
                    )}
                  </div>
                </article>

                {isEditingKey && (
                  <div className={`glass-3 ${styles.keyEditor}`} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.keyEditorHeader}>
                      <Typography variant="label" color="secondary">
                        Tono: {song.title}
                      </Typography>
                      <button
                        className={styles.keyEditorClose}
                        onClick={() => setEditingKeySongId(null)}
                        type="button"
                        aria-label="Cerrar"
                      >
                        ✕
                      </button>
                    </div>
                    <KeySelector
                      value={displayKey}
                      onChange={(newKey) => handleKeyChange(song.id, newKey)}
                    />
                  </div>
                )}
              </div>
            );
          })}
      </div>

      <SongStructureViewer
        song={viewingSong}
        onClose={() => setViewingSong(null)}
      />
    </div>
  );
}
