CREATE TABLE IF NOT EXISTS profile_views (
  username TEXT PRIMARY KEY,
  views INTEGER NOT NULL DEFAULT 0 CHECK (views >= 0)
);

INSERT OR IGNORE INTO profile_views (username, views)
VALUES ('sakilahmed-git', 0);
