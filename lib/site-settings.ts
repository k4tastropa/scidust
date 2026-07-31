import "server-only"

import { cache } from "react"

import { sql } from "@/lib/database"

const defaultSettings = {
  instagramUrl: "https://www.instagram.com/scidust9/",
  behanceUrl: "https://www.behance.net/scidust9",
  contactEmail: "contact@scidust.com",
}

export const getContactSettings = cache(async () => {
  const rows = (await sql`
    SELECT key, value
    FROM site_settings
    WHERE key IN ('instagram_url', 'behance_url', 'contact_email')
  `) as Array<{ key: string; value: string }>
  const settings = new Map(rows.map((row) => [row.key, row.value]))

  return {
    instagramUrl: settings.get("instagram_url") ?? defaultSettings.instagramUrl,
    behanceUrl: settings.get("behance_url") ?? defaultSettings.behanceUrl,
    contactEmail: settings.get("contact_email") ?? defaultSettings.contactEmail,
  }
})
