-- ============================================================
--  SETLIST APP — Schema MySQL
--  Convención: snake_case en DB, camelCase en JSON responses
--  Motor: InnoDB (soporte transacciones + FK)
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS setlist_songs;
DROP TABLE IF EXISTS setlists;
DROP TABLE IF EXISTS songs;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- ─── USERS ───────────────────────────────────────────────────
CREATE TABLE users (
  id            CHAR(36)      NOT NULL DEFAULT (UUID()),
  name          VARCHAR(120)  NOT NULL,
  email         VARCHAR(255)  NOT NULL,
  password_hash VARCHAR(255)  NOT NULL,
  role          ENUM('LIDER', 'MUSICO') NOT NULL DEFAULT 'MUSICO',
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE INDEX uq_users_email (email)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ─── SONGS ───────────────────────────────────────────────────
-- `structure` guarda el desglose de secciones: { verso_1: "...", coro: "..." }
-- MariaDB no tiene tipo JSON nativo; se usa LONGTEXT y se parsea en JS.
CREATE TABLE songs (
  id          CHAR(36)     NOT NULL DEFAULT (UUID()),
  title       VARCHAR(255) NOT NULL,
  artist      VARCHAR(255) NOT NULL,
  default_key VARCHAR(10)  NULL     COMMENT 'Ej: G, Am, Bb, F#m',
  duration    VARCHAR(10)  NULL     COMMENT 'Formato mm:ss, ej: 4:32',
  bpm         SMALLINT UNSIGNED NULL,
  structure   LONGTEXT     NULL     COMMENT 'JSON string: { verso_1, coro, puente... }',
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                           ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_songs_artist (artist),
  INDEX idx_songs_title  (title)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ─── SETLISTS ────────────────────────────────────────────────
CREATE TABLE setlists (
  id             CHAR(36)    NOT NULL DEFAULT (UUID()),
  leader_id      CHAR(36)    NOT NULL,
  title          VARCHAR(255) NOT NULL,
  scheduled_date DATE        NULL,
  status         ENUM('DRAFT', 'REHEARSAL', 'FINAL') NOT NULL DEFAULT 'DRAFT',
  created_at     DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP
                             ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_setlists_leader   (leader_id),
  INDEX idx_setlists_date     (scheduled_date),
  INDEX idx_setlists_status   (status),

  CONSTRAINT fk_setlists_leader
    FOREIGN KEY (leader_id) REFERENCES users (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ─── SETLIST_SONGS (Pivote) ───────────────────────────────────
-- override_key: tono ajustado para esa lista concreta (nullable).
-- sort_order:   posicion dentro de la lista (0-based).
CREATE TABLE setlist_songs (
  id           CHAR(36)    NOT NULL DEFAULT (UUID()),
  setlist_id   CHAR(36)    NOT NULL,
  song_id      CHAR(36)    NOT NULL,
  override_key VARCHAR(10) NULL     COMMENT 'Tono sobreescrito para esta lista',
  sort_order   SMALLINT UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY (id),

  UNIQUE INDEX uq_setlist_song (setlist_id, song_id),
  INDEX idx_ss_song      (song_id),
  INDEX idx_ss_sort      (setlist_id, sort_order),

  CONSTRAINT fk_ss_setlist
    FOREIGN KEY (setlist_id) REFERENCES setlists (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_ss_song
    FOREIGN KEY (song_id) REFERENCES songs (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;
