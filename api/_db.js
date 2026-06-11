import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATABASE_FILE = path.join(__dirname, '..', 'data', 'database.json')
const KV_KEY = 'bbj_database'

let kv = null
try {
  const mod = await import('@vercel/kv')
  kv = mod.kv
} catch {
  // @vercel/kv not available (e.g., local dev without it)
}

function getDefaultDb() {
  return { services: [], portfolioItems: [], inquiries: [], blogPosts: [], testimonials: [], settings: { showPricing: false, adminUsers: [{ id: 'master_1', username: 'admin', password: 'admin123', isMaster: true }] } }
}

let memoryCache = null

export async function readDatabase() {
  if (process.env.VERCEL && kv) {
    if (memoryCache) return memoryCache
    try {
      const data = await kv.get(KV_KEY)
      if (data) {
        memoryCache = data
        return data
      }
    } catch (e) {
      console.warn('KV read failed, using fallback:', e)
    }
    // Seed default data on first run
    const defaults = getDefaultDb()
    memoryCache = defaults
    return defaults
  } else {
    try {
      const data = await fs.readFile(DATABASE_FILE, 'utf-8')
      return JSON.parse(data)
    } catch {
      return getDefaultDb()
    }
  }
}

export async function writeDatabase(data) {
  memoryCache = data
  if (process.env.VERCEL && kv) {
    try {
      await kv.set(KV_KEY, data)
    } catch (e) {
      console.warn('KV write failed:', e)
    }
  } else {
    try {
      await fs.mkdir(path.dirname(DATABASE_FILE), { recursive: true })
      await fs.writeFile(DATABASE_FILE, JSON.stringify(data, null, 2), 'utf-8')
    } catch (e) {
      console.warn('File write failed:', e)
    }
  }
}

export async function readSettings() {
  const db = await readDatabase()
  const defaults = { showPricing: false, adminUsers: [{ id: 'master_1', username: 'admin', password: 'admin123', isMaster: true }] }
  return { ...defaults, ...(db.settings || {}) }
}
