import { useState } from "react";
import IconButton from "../../atoms/IconButton";
import Typography from "../../atoms/Typography";
import styles from "./PlayBackBar.module.css";

// Íconos
const SkipBackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 20L9 12l10-8v16zM5 4h2v16H5z" />
  </svg>
);
const SkipFwdIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 4l10 8-10 8V4zm12 0h2v16h-2z" />
  </svg>
);
const PlayIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5.14v14l11-7-11-7z" />
  </svg>
);
const PauseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);
const VolumeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);
const ShuffleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <polyline points="16 3 21 3 21 8" />
    <line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" />
    <line x1="15" y1="15" x2="21" y2="21" />
    <line x1="4" y1="4" x2="9" y2="9" />
  </svg>
);

/**
 * PlaybackBar — Sub-organismo anclado al fondo de la pantalla
 * @param {{ song: object }} props
 */
export default function PlaybackBar({ song }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(38); // %

  if (!song) return null;

  return (
    <div
      className={styles.barOuter}
      role="region"
      aria-label="Control de reproducción"
    >
      <div className={`${styles.bar} glass-4`}>
        {/* Thumb + info */}
        <div className={styles.songInfo}>
          <div className={styles.thumb} aria-hidden="true">
            {song.title?.[0]?.toUpperCase() ?? "♪"}
          </div>
          <div className={styles.meta}>
            <Typography variant="meta" truncate className={styles.songTitle}>
              {song.title}
            </Typography>
            <Typography variant="caption" color="tertiary" truncate>
              {song.artist}
              {song.keyNote && ` · ${song.keyNote}`}
            </Typography>
          </div>
        </div>

        {/* Progress + controles centrales */}
        <div className={styles.center}>
          <div className={styles.controls}>
            <IconButton icon={<ShuffleIcon />} label="Aleatorio" size="sm" />
            <IconButton icon={<SkipBackIcon />} label="Anterior" size="sm" />
            <button
              className={styles.playBtn}
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? "Pausar" : "Reproducir"}
              type="button"
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <IconButton icon={<SkipFwdIcon />} label="Siguiente" size="sm" />
            <IconButton icon={<VolumeIcon />} label="Volumen" size="sm" />
          </div>

          {/* Barra de progreso interactiva */}
          <div className={styles.progressWrap}>
            <span className={styles.time}>
              {formatTime((progress / 100) * parseDuration(song.duration))}
            </span>
            <div
              className={styles.progressTrack}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progreso de la canción"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = Math.round(
                  ((e.clientX - rect.left) / rect.width) * 100,
                );
                setProgress(Math.min(100, Math.max(0, pct)));
              }}
            >
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
              <div
                className={styles.progressThumb}
                style={{ left: `${progress}%` }}
              />
            </div>
            <span className={styles.time}>{song.duration ?? "0:00"}</span>
          </div>
        </div>

        {/* Waveform animada (solo visual) */}
        <div className={styles.waveform} aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className={styles.waveBar}
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────
function parseDuration(str = "0:00") {
  const [m, s] = str.split(":").map(Number);
  return m * 60 + (s ?? 0);
}

function formatTime(totalSeconds) {
  const s = Math.floor(totalSeconds);
  const m = Math.floor(s / 60);
  const sec = String(s % 60).padStart(2, "0");
  return `${m}:${sec}`;
}
