import { neon } from "@neondatabase/serverless"

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.")
}

const sql = neon(databaseUrl)

await sql`
  ALTER TABLE artworks
  ADD COLUMN IF NOT EXISTS sort_order INTEGER
`

await sql`
  UPDATE artworks
  SET sort_order = archive_number
  WHERE sort_order IS NULL
`

await sql`
  ALTER TABLE artworks
  ALTER COLUMN sort_order SET NOT NULL
`

await sql`
  CREATE INDEX IF NOT EXISTS artworks_sort_order_index
  ON artworks (status, sort_order DESC)
`

await sql`
  CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`

await sql`
  INSERT INTO site_settings (key, value)
  VALUES
    ('instagram_url', 'https://www.instagram.com/scidust9/'),
    ('contact_email', 'contact@scidust.com')
  ON CONFLICT (key) DO NOTHING
`

await sql`
  CREATE TABLE IF NOT EXISTS admin_credentials (
    username TEXT PRIMARY KEY,
    password_hash TEXT NOT NULL,
    session_secret TEXT NOT NULL,
    session_version INTEGER NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`

await sql`
  CREATE TABLE IF NOT EXISTS admin_login_attempts (
    identifier TEXT PRIMARY KEY,
    failure_count INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`

console.log("Admin schema ready.")
