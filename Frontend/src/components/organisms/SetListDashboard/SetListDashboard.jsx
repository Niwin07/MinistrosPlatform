import { useState, useEffect } from "react";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useSetlist } from "../../../hooks/useSetlist";
import { useUIStore } from "../../../store/uiStore";
import SortableSongCard from "../../molecules/SortableSongCard";
import IconButton from "../../atoms/IconButton";
import Typography from "../../atoms/Typography";
import SongCardSkeleton from "../../molecules/SongCardSkeleton";
import SongStructureViewer from "../SongStructureViewer";
import SetlistHeader from "../SetlistHeader";
import SetlistActionBar from "../SetlistActionBar";
import Toast from "../../atoms/Toast";
import GlassDrawer from "../GlassDrawer";
import SongSearchForm from "../GlassDrawer/SongSearchForm";
import styles from "./SetListDashboard.module.css";

const TODAY = new Date().toLocaleDateString("es-AR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default function SetlistDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [viewingSong, setViewingSong] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const isDrawerOpen = useUIStore((s) => s.isSongSearchDrawerOpen);
  const openSearch = useUIStore((s) => s.openSongSearch);
  const closeSearch = useUIStore((s) => s.closeSongSearch);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const {
    songs,
    status,
    songCount,
    updateKey,
    reorderSongs,
    setPlaying,
    toggleFavorite,
    startRehearsal,
    endRehearsal,
    publishSetlist,
  } = useSetlist();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = songs.findIndex((s) => s.id === active.id);
    const newIndex = songs.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(songs, oldIndex, newIndex);
    reorderSongs(reordered.map((s) => s.id));
  }

  function handleSearch(data) {
    console.log("Search:", data);
    closeSearch();
  }

  function handlePublish() {
    publishSetlist();
    setToastMsg("Lista publicada. Notificando a los ministros…");
  }

  return (
    <div className={styles.root}>
      <header className={`glass-frosted ${styles.navbar}`}>
        <div className={styles.navBrand}>
          <span className={styles.navLogo} aria-hidden="true">🎵</span>
          <Typography variant="title" as="span" className={styles.navTitle}>
            Set<em>list</em>
          </Typography>
        </div>
        <nav className={styles.navActions}>
          <IconButton icon={<SearchIcon />} label="Buscar" size="sm" onClick={openSearch} />
          <IconButton icon={<PlusIcon />} label="Nuevo setlist" size="sm" />
          <IconButton icon={<UserIcon />} label="Perfil" size="sm" />
        </nav>
      </header>

      <SetlistHeader
        status={status}
        date={TODAY}
        songCount={songCount}
      />

      {isLoading ? (
        <div className={styles.songsGrid}>
          {Array.from({ length: 5 }).map((_, i) => (
            <SongCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext items={songs.map((s) => s.id)}>
            <div className={styles.songsGrid}>
              {songs.map((song) => (
                <SortableSongCard
                  key={song.id}
                  id={song.id}
                  {...song}
                  onClick={() => setViewingSong(song)}
                  onPlay={() => setPlaying(song.id)}
                  onFavorite={() => toggleFavorite(song.id)}
                  onKeyChange={(k) => updateKey(song.id, k)}
                  onMore={() => {}}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <SetlistActionBar
        status={status}
        onStartRehearsal={startRehearsal}
        onPublish={handlePublish}
        onEndRehearsal={endRehearsal}
        onNewSetlist={() => {}}
      />

      <GlassDrawer isOpen={isDrawerOpen} onClose={closeSearch} title="Buscar canciones">
        <SongSearchForm onSubmit={handleSearch} />
      </GlassDrawer>

      <SongStructureViewer song={viewingSong} onClose={() => setViewingSong(null)} />

      <Toast
        message={toastMsg}
        visible={!!toastMsg}
        onDone={() => setToastMsg(null)}
      />
    </div>
  );
}
