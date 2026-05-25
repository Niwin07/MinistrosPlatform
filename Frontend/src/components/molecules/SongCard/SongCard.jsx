import { memo } from "react";
import IconButton from "../../atoms/IconButton";
import Typography from "../../atoms/Typography/Typography";
import styles from "./SongCard.module.css";
// Íconos inline SVG mínimos (sin dependencia externa)
const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5.14v14l11-7-11-7z" />
  </svg>
);

const GripIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden="true"
  >
    <circle cx="5" cy="3" r="1.5" />
    <circle cx="11" cy="3" r="1.5" />
    <circle cx="5" cy="8" r="1.5" />
    <circle cx="11" cy="8" r="1.5" />
    <circle cx="5" cy="13" r="1.5" />
    <circle cx="11" cy="13" r="1.5" />
  </svg>
);

const MoreIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="19" cy="12" r="1.5" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

/**
 * SongCard — Molécula
 *
 * @param {string}          title        - Título de la canción
 * @param {string}          artist       - Nombre del artista
 * @param {string}          keyNote      - Tono musical (ej. 'Sol - G')
 * @param {string}          albumArt     - URL de imagen de álbum (opcional)
 * @param {string}          duration     - Duración formateada (ej. '3:45')
 * @param {number}          bpm          - Beats por minuto (opcional)
 * @param {boolean}         isFavorite   - Estado de favorito
 * @param {boolean}         isPlaying    - Estado de reproducción activa
 * @param {function}        onPlay       - Handler del botón Play
 * @param {function}        onFavorite   - Handler del botón Favorito
 * @param {function}        onMore       - Handler del botón de opciones
 * @param {'sm'|'md'}       size         - Tamaño compacto o estándar
 * @param {string}          className    - Clases adicionales
 */
function SongCard({
  title = "Sin título",
  artist = "Artista desconocido",
  keyNote,
  albumArt,
  duration,
  bpm,
  isFavorite = false,
  isPlaying = false,
  isDragging = false,
  onPlay,
  onFavorite,
  onMore,
  onClick,
  size = "md",
  className = "",
  setNodeRef,
  dragHandleProps,
}) {
  return (
    <article
      ref={setNodeRef}
      className={`
        glass-2
        ${styles.card}
        ${styles[size]}
        ${isPlaying ? styles.playing : ""}
        ${isDragging ? styles.dragging : ""}
        ${styles.clickable}
        ${className}
      `}
      onClick={onClick}
      aria-label={`Canción: ${title} de ${artist}`}
    >
      {/* — Drag handle — */}
      <button
        className={`${styles.grip} ${isDragging ? styles.gripActive : ""}`}
        {...dragHandleProps}
        aria-label="Reordenar canción"
        type="button"
      >
        <GripIcon />
      </button>

      {/* — Indicator de reproducción activa — */}
      {isPlaying && <span className={styles.playingBar} aria-hidden="true" />}

      {/* — Album Art — */}
      <div className={styles.albumArtWrap}>
        {albumArt ? (
          <img
            src={albumArt}
            alt={`Álbum de ${title}`}
            className={styles.albumArtImg}
            loading="lazy"
          />
        ) : (
          <AlbumArtPlaceholder title={title} />
        )}

        {/* Overlay de play sobre la imagen */}
        <button
          className={styles.playOverlay}
          onClick={onPlay}
          aria-label={isPlaying ? `Pausar ${title}` : `Reproducir ${title}`}
          type="button"
        >
          <PlayIcon />
        </button>
      </div>

      {/* — Info — */}
      <div className={styles.info}>
        <Typography
          variant="subtitle"
          as="h3"
          truncate
          className={styles.titleText}
        >
          {title}
        </Typography>

        <Typography variant="meta" color="secondary" truncate>
          {artist}
        </Typography>

        {/* — Pills de metadata — */}
        <div className={styles.pills}>
          {keyNote && (
            <span className={`${styles.pill} ${styles.pillAccent}`}>
              {keyNote}
            </span>
          )}
          {bpm && (
            <span className={`${styles.pill} ${styles.pillNeutral}`}>
              {bpm} BPM
            </span>
          )}
          {duration && (
            <span className={`${styles.pill} ${styles.pillNeutral}`}>
              {duration}
            </span>
          )}
        </div>
      </div>

      {/* — Acciones — */}
      <div className={styles.actions}>
        <IconButton
          icon={<HeartIcon filled={isFavorite} />}
          onClick={onFavorite}
          label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          variant={isFavorite ? "accent" : "default"}
          size="sm"
        />
        <IconButton
          icon={<MoreIcon />}
          onClick={onMore}
          label="Más opciones"
          size="sm"
        />
      </div>
    </article>
  );
}

/* — Subcomponente interno: Placeholder de álbum con inicial — */
function AlbumArtPlaceholder({ title }) {
  // Genera un color de fondo determinístico a partir del título
  const colors = [
    ["#2d1b69", "#6c63ff"],
    ["#1a2a4a", "#4299e1"],
    ["#1a3a2a", "#48bb78"],
    ["#3a1a2a", "#fc8181"],
    ["#2a2a1a", "#f6ad55"],
  ];
  const index = (title?.charCodeAt(0) ?? 0) % colors.length;
  const [bg, accent] = colors[index];
  const initial = title?.[0]?.toUpperCase() ?? "♪";

  return (
    <div
      className={styles.placeholder}
      style={{
        background: `linear-gradient(135deg, ${bg} 0%, ${accent}55 100%)`,
      }}
      aria-hidden="true"
    >
      <span className={styles.placeholderInitial} style={{ color: accent }}>
        {initial}
      </span>
      <span className={styles.placeholderNote}>♪</span>
    </div>
  );
}

export default memo(SongCard);