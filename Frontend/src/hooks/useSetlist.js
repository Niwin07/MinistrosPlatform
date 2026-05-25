import { useReducer, useCallback, useMemo, useRef } from "react";

// ─── Estado inicial de desarrollo ─────────────────────────────────────────────
// Cuando conectes a la API, esto vendrá de un fetch/WebSocket inicial.
// La forma del objeto SongItem es el contrato que compartirá la API.
const INITIAL_SONGS = [
  {
    id: "1",
    title: "Oceans (Where Feet May Fail)",
    artist: "Hillsong United",
    default_key: "G",
    override_key: "A",
    duration: "8:56",
    bpm: 72,
    isFavorite: true,
    isPlaying: true,
    order: 0,
    structure: {
      verso_1: "You call me out upon the waters\n    The great unknown where feet may fail\n    And there I find You in the mystery\n    In oceans deep my faith will stand",
      coro: "Spirit lead me where my trust is without borders\n    Let me walk upon the waters\n    Wherever You would call me\n    Take me deeper than my feet could ever wander\n    And my faith will be made stronger\n    In the presence of my Saviour",
      verso_2: "Your grace abounds in deepest waters\n    Your sovereign hand will be my guide\n    Where feet may fail and fear surrounds me\n    You've never failed and You won't start now",
      puente: "I will call upon Your name\n    And keep my eyes above the waves\n    When oceans rise\n    My soul will rest in Your embrace\n    For I am Yours and You are mine",
    },
  },
  {
    id: "2",
    title: "What A Beautiful Name",
    artist: "Hillsong Worship",
    default_key: "D",
    duration: "5:07",
    bpm: 68,
    isFavorite: false,
    isPlaying: false,
    order: 1,
    structure: {
      intro: "You were the Word at the beginning\n    One with God the Lord Most High",
      verso_1: "You were the Word at the beginning\n    One with God the Lord Most High\n    Your hidden glory in creation\n    Now revealed in You our Christ",
      coro: "What a beautiful Name it is\n    What a beautiful Name it is\n    The Name of Jesus Christ my King\n    What a beautiful Name it is\n    Nothing compares to this\n    What a beautiful Name it is\n    The Name of Jesus",
      puente: "Death could not hold You\n    The veil tore before You\n    You silenced the boast of sin and grave\n    The heavens are roaring\n    The praise of Your glory\n    For You are raised to life again",
    },
  },
  {
    id: "3",
    title: "Goodness of God",
    artist: "Bethel Music",
    default_key: "A",
    duration: "4:44",
    bpm: 74,
    isFavorite: false,
    isPlaying: false,
    order: 2,
    structure: {
      verso_1: "I love You, Lord\n    For Your mercy never fails me\n    All my days, I've been held in Your hand\n    From the moment that I wake up\n    Until I lay my head\n    I will sing of the goodness of God",
      coro: "Your goodness is running after\n    Running after me\n    Your goodness is running after\n    Running after me\n    With my life laid down\n    I'm surrendered now\n    I give You everything",
      verso_2: "I love You, Lord\n    For Your goodness never fails me\n    All my days, I've been held in Your hand\n    From the moment that I wake up\n    Until I lay my head\n    I will sing of the goodness of God",
    },
  },
  {
    id: "4",
    title: "Reckless Love",
    artist: "Cory Asbury",
    default_key: "E",
    duration: "5:53",
    bpm: 76,
    isFavorite: true,
    isPlaying: false,
    order: 3,
    structure: {
      verso_1: "Before I spoke a word\n    You were singing over me\n    You have been so, so good to me\n    Before I took a breath\n    You breathed Your life in me\n    You have been so, so kind to me",
      coro: "Oh, the overwhelming, never-ending\n    Reckless love of God\n    Oh, it chases me down\n    Fights 'til I'm found\n    Leaves the ninety-nine\n    I couldn't earn it\n    And I don't deserve it\n    Still, You give Yourself away\n    Oh, the overwhelming, never-ending\n    Reckless love of God",
      verso_2: "When I was Your foe\n    Still Your love fought for me\n    You have been so, so good to me\n    When I felt no worth\n    You paid it all for me\n    You have been so, so kind to me",
    },
  },
  {
    id: "5",
    title: "Waymaker",
    artist: "Sinach",
    default_key: "Bb",
    duration: "5:18",
    bpm: 70,
    isFavorite: false,
    isPlaying: false,
    order: 4,
    structure: {
      verso_1: "You are here\n    Moving in our midst\n    I worship You\n    I worship You",
      coro: "Way maker, miracle worker\n    Promise keeper\n    Light in the darkness\n    My God, that is who You are",
      puente: "Even when I don't see it\n    You're working\n    Even when I don't feel it\n    You're working\n    You never stop\n    You never stop working",
    },
  },
];

// ─── Action types ──────────────────────────────────────────────────────────────
// Strings constantes evitan typos y facilitan el switch en el reducer.
// Cuando uses Redux Toolkit o Zustand, estos mismos strings pasan a ser
// los nombres de los actions/slices sin cambios.
const ACTION = {
  UPDATE_KEY: "UPDATE_KEY",
  REORDER: "REORDER",
  SET_PLAYING: "SET_PLAYING",
  TOGGLE_FAV: "TOGGLE_FAV",
  CLONE_TO_DRAFT: "CLONE_TO_DRAFT",
  SET_STATUS: "SET_STATUS",
  HYDRATE: "HYDRATE",
  WS_UPDATE_KEY: "WS_UPDATE_KEY",
  WS_REORDER: "WS_REORDER",
  OPTIMISTIC_REVERT: "OPTIMISTIC_REVERT",
};

// ─── Reducer puro ──────────────────────────────────────────────────────────────
// Toda la lógica de transformación de estado vive acá.
// Puro = sin efectos secundarios, fácil de testear unitariamente.
function setlistReducer(state, action) {
  switch (action.type) {
    // Actualiza el tono de una sola canción.
    // Usa map() y devuelve el mismo objeto para las canciones no afectadas
    // → React puede hacer una comparación referencial shallow y saltear
    //   el re-render de los SongCard no modificados (con React.memo).
    case ACTION.UPDATE_KEY:
    case ACTION.WS_UPDATE_KEY: {
      return {
        ...state,
        songs: state.songs.map(
          (song) =>
            song.id === action.payload.songId
              ? { ...song, keyNote: action.payload.newKey }
              : song, // ← misma referencia de objeto: no re-renderiza
        ),
      };
    }

    // Reemplaza el array completo con el nuevo orden.
    // `newOrder` es un array de songIds ordenado por el consumidor (ej. dnd-kit).
    // Asigna `order` numérico para mantener la posición persistible en la API.
    case ACTION.REORDER:
    case ACTION.WS_REORDER: {
      const songMap = new Map(state.songs.map((s) => [s.id, s]));
      const reordered = action.payload.newOrder
        .map((id, index) => {
          const song = songMap.get(id);
          if (!song) return null;
          // Solo crea nuevo objeto si el order cambió → preserva referencias
          return song.order === index ? song : { ...song, order: index };
        })
        .filter(Boolean);

      return { ...state, songs: reordered };
    }

    case ACTION.SET_PLAYING: {
      return {
        ...state,
        songs: state.songs.map((song) => ({
          ...song,
          isPlaying: song.id === action.payload.songId,
        })),
      };
    }

    case ACTION.TOGGLE_FAV: {
      return {
        ...state,
        songs: state.songs.map((song) =>
          song.id === action.payload.songId
            ? { ...song, isFavorite: !song.isFavorite }
            : song,
        ),
      };
    }

    case ACTION.SET_STATUS: {
      return { ...state, status: action.payload.status };
    }

    case ACTION.CLONE_TO_DRAFT: {
      const cloned = action.payload.songs.map((song, index) => ({
        ...song,
        id: `draft_${Date.now()}_${index}`,
        order: index,
        isPlaying: false,
        isFavorite: false,
      }));
      return { ...state, songs: cloned };
    }

    // Carga inicial desde API: reemplaza todo el estado.
    case ACTION.HYDRATE: {
      return {
        ...state,
        songs: action.payload.songs,
        isHydrated: true,
      };
    }

    // Rollback: restaura el snapshot guardado antes del update optimista.
    case ACTION.OPTIMISTIC_REVERT: {
      return {
        ...state,
        songs: action.payload.snapshot,
      };
    }

    default:
      return state;
  }
}

// ─── Estado inicial del reducer ────────────────────────────────────────────────
const INITIAL_STATE = {
  songs: INITIAL_SONGS,
  status: 'DRAFT',
  isHydrated: false,
};

// ─── Custom Hook ───────────────────────────────────────────────────────────────
/**
 * useSetlist
 *
 * Gestiona el estado local de un setlist. Diseñado para conectarse
 * en el futuro con WebSockets (actualizaciones entrantes) y con
 * una API REST (persistencia).
 *
 * @returns {{
 *   songs: SongItem[],
 *   songCount: number,
 *   nowPlaying: SongItem|undefined,
 *   isHydrated: boolean,
 *   updateKey: (songId: string, newKey: string) => void,
 *   reorderSongs: (newOrder: string[]) => void,
 *   setPlaying: (songId: string) => void,
 *   toggleFavorite: (songId: string) => void,
 *   hydrate: (songs: SongItem[]) => void,
 *   applyRemotePatch: (action: object) => void,
 * }}
 */
export function useSetlist() {
  const [state, dispatch] = useReducer(setlistReducer, INITIAL_STATE);

  // Ref para snapshots optimistas — no necesita causar re-renders
  const snapshotRef = useRef(null);

  // ── Acciones locales ────────────────────────────────────────
  //
  // useCallback con [] como dep array: la referencia de cada función
  // es estable entre renders. Esto es lo que permite que React.memo
  // en SongCard evite re-renders cuando pasa estas funciones como props.
  //
  // REGLA: useCallback solo cuando la función se pasa como prop a un
  // componente memoizado O es dependencia de otro useMemo/useEffect.
  // No usarlo en handlers que solo se llaman inline (over-optimization).

  /**
   * Cambia el tono de una canción.
   * Internamente solo re-renderiza el SongCard cuyo id coincide,
   * siempre que SongCard esté envuelto en React.memo.
   */
  const updateKey = useCallback((songId, newKey) => {
    dispatch({ type: ACTION.UPDATE_KEY, payload: { songId, newKey } });

    // TODO: cuando tengas API, aquí va el fetch con update optimista:
    // snapshotRef.current = state.songs;          // guarda snapshot
    // dispatch(ACTION.UPDATE_KEY ...)              // aplica optimista
    // try { await api.updateKey(songId, newKey) }
    // catch { dispatch(OPTIMISTIC_REVERT, snapshot) }
  }, []);

  /**
   * Reordena las canciones.
   * @param {string[]} newOrder - Array de IDs en el nuevo orden deseado.
   *   Ejemplo de dnd-kit después de un drop:
   *   const newOrder = arrayMove(songs, oldIndex, newIndex).map(s => s.id);
   *   reorderSongs(newOrder);
   */
  const reorderSongs = useCallback((newOrder) => {
    dispatch({ type: ACTION.REORDER, payload: { newOrder } });

    // TODO: api.reorder(newOrder) — same optimistic pattern
  }, []);

  const setPlaying = useCallback((songId) => {
    dispatch({ type: ACTION.SET_PLAYING, payload: { songId } });
  }, []);

  const toggleFavorite = useCallback((songId) => {
    dispatch({ type: ACTION.TOGGLE_FAV, payload: { songId } });
  }, []);

  const cloneSetlistToDraft = useCallback((songs) => {
    dispatch({ type: ACTION.CLONE_TO_DRAFT, payload: { songs } });
    dispatch({ type: ACTION.SET_STATUS, payload: { status: 'DRAFT' } });
  }, []);

  const setStatus = useCallback((status) => {
    dispatch({ type: ACTION.SET_STATUS, payload: { status } });
  }, []);

  const publishSetlist = useCallback(() => {
    dispatch({ type: ACTION.SET_STATUS, payload: { status: 'FINAL' } });
  }, []);

  const startRehearsal = useCallback(() => {
    dispatch({ type: ACTION.SET_STATUS, payload: { status: 'REHEARSAL' } });
  }, []);

  const endRehearsal = useCallback(() => {
    dispatch({ type: ACTION.SET_STATUS, payload: { status: 'DRAFT' } });
  }, []);

  // ── Para hidratación desde API ──────────────────────────────
  // Llamar una sola vez cuando el fetch inicial resuelva:
  // const { hydrate } = useSetlist();
  // useEffect(() => { fetchSetlist(id).then(hydrate) }, [id]);
  const hydrate = useCallback((songs) => {
    dispatch({ type: ACTION.HYDRATE, payload: { songs } });
  }, []);

  // ── Para WebSocket: recibir parches remotos ─────────────────
  // En tu futuro WS listener:
  // socket.on('setlist:patch', (action) => applyRemotePatch(action));
  // El servidor envía un objeto { type: 'WS_UPDATE_KEY', payload: {...} }
  // y el reducer ya tiene los cases WS_* listos para procesarlo.
  const applyRemotePatch = useCallback((wsAction) => {
    const allowedTypes = [ACTION.WS_UPDATE_KEY, ACTION.WS_REORDER];
    if (allowedTypes.includes(wsAction.type)) {
      dispatch(wsAction);
    }
  }, []);

  // ── Valores derivados memoizados ────────────────────────────
  //
  // useMemo acá porque estas derivaciones iteram el array:
  // sin memo, se recalcularían en cada render aunque songs no cambie.
  // Con memo, solo se recalculan cuando state.songs cambia de referencia
  // (lo cual ocurre únicamente tras un dispatch al reducer).

  const nowPlaying = useMemo(
    () => state.songs.find((s) => s.isPlaying),
    [state.songs],
  );

  const songCount = useMemo(() => state.songs.length, [state.songs]);

  // ── API pública del hook ────────────────────────────────────
  return {
    // Estado
    songs: state.songs,
    status: state.status,
    isHydrated: state.isHydrated,
    // Derivados (ya calculados, sin costo extra al consumir)
    nowPlaying,
    songCount,
    // Acciones locales
    updateKey,
    reorderSongs,
    setPlaying,
    toggleFavorite,
    cloneSetlistToDraft,
    setStatus,
    publishSetlist,
    startRehearsal,
    endRehearsal,
    // Integración futura
    hydrate,
    applyRemotePatch,
  };
}
