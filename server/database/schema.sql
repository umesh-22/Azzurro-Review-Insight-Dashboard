CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  review_id TEXT NOT NULL UNIQUE,
  property_id INTEGER NOT NULL REFERENCES properties(id),
  score NUMERIC(3,1) NOT NULL CHECK (score BETWEEN 1 AND 10),
  title TEXT,
  liked_text TEXT,
  disliked_text TEXT,
  review_date DATE NOT NULL,
  stay_date TEXT,
  nights INTEGER,
  room_type TEXT,
  traveller_type TEXT,
  country TEXT,
  language TEXT,
  hotel_reply TEXT,
  classified BOOLEAN NOT NULL DEFAULT false,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS language TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS classified BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS translated_from TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS translated_title TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS translated_liked TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS translated_disliked TEXT;

CREATE TABLE IF NOT EXISTS review_topics (
  review_id INTEGER NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  polarity TEXT NOT NULL CHECK (polarity IN ('positive', 'negative')),
  PRIMARY KEY (review_id, topic, polarity)
);

CREATE TABLE IF NOT EXISTS daily_summaries (
  scope TEXT NOT NULL,
  created_on DATE NOT NULL,
  text TEXT NOT NULL,
  source TEXT NOT NULL,
  PRIMARY KEY (scope, created_on)
);

CREATE TABLE IF NOT EXISTS scrape_runs (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'running',
  found INTEGER NOT NULL DEFAULT 0,
  inserted INTEGER NOT NULL DEFAULT 0,
  error TEXT
);

CREATE INDEX IF NOT EXISTS idx_reviews_property_date ON reviews (property_id, review_date);
CREATE INDEX IF NOT EXISTS idx_reviews_classified ON reviews (classified);
CREATE INDEX IF NOT EXISTS idx_review_topics_topic ON review_topics (topic);
