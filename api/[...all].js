import express from 'express'
import fs from 'fs/promises'
import { readDatabase, writeDatabase, readSettings } from '../api/_db.js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// ─── Google GenAI (lazy loaded) ───
let aiClient = null
let AiType = null
async function getAIClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Set it in Vercel Environment Variables.")
    }
    const { GoogleGenAI, Type } = await import('@google/genai')
    aiClient = new GoogleGenAI({ apiKey })
    AiType = Type
  }
  return { client: aiClient, Type: AiType }
}

// ═══════════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════════
app.get('/api/services', async (req, res) => {
  const db = await readDatabase()
  res.json(db.services)
})

app.put('/api/services', async (req, res) => {
  const db = await readDatabase()
  db.services = req.body
  await writeDatabase(db)
  res.json({ success: true, services: db.services })
})

app.delete('/api/services/:id', async (req, res) => {
  const db = await readDatabase()
  db.services = db.services.filter(s => s.id !== req.params.id)
  await writeDatabase(db)
  res.json({ success: true })
})

// ═══════════════════════════════════════════════════
// PORTFOLIO
// ═══════════════════════════════════════════════════
app.get('/api/portfolio', async (req, res) => {
  const db = await readDatabase()
  res.json(db.portfolioItems)
})

app.post('/api/portfolio', async (req, res) => {
  const db = await readDatabase()
  const newItem = req.body
  if (!newItem.id) newItem.id = 'p_' + Date.now()
  const idx = db.portfolioItems.findIndex(item => item.id === newItem.id)
  if (idx !== -1) db.portfolioItems[idx] = newItem
  else db.portfolioItems.push(newItem)
  await writeDatabase(db)
  res.json({ success: true, item: newItem })
})

app.delete('/api/portfolio/:id', async (req, res) => {
  const db = await readDatabase()
  db.portfolioItems = db.portfolioItems.filter(item => item.id !== req.params.id)
  await writeDatabase(db)
  res.json({ success: true })
})

// ═══════════════════════════════════════════════════
// BLOGS
// ═══════════════════════════════════════════════════
app.get('/api/blogs', async (req, res) => {
  const db = await readDatabase()
  res.json(db.blogPosts || [])
})

app.post('/api/blogs', async (req, res) => {
  const db = await readDatabase()
  const newPost = req.body
  if (!newPost.id) newPost.id = 'blog_' + Date.now()
  if (!db.blogPosts) db.blogPosts = []
  const idx = db.blogPosts.findIndex(post => post.id === newPost.id)
  if (idx !== -1) db.blogPosts[idx] = newPost
  else db.blogPosts.push(newPost)
  await writeDatabase(db)
  res.json({ success: true, post: newPost })
})

app.delete('/api/blogs/:id', async (req, res) => {
  const db = await readDatabase()
  db.blogPosts = (db.blogPosts || []).filter(b => b.id !== req.params.id)
  await writeDatabase(db)
  res.json({ success: true })
})

// ═══════════════════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════════════════
app.get('/api/testimonials', async (req, res) => {
  const db = await readDatabase()
  res.json(db.testimonials || [])
})

app.post('/api/testimonials', async (req, res) => {
  const db = await readDatabase()
  const newItem = req.body
  if (!newItem.id) newItem.id = 't_' + Date.now()
  if (!db.testimonials) db.testimonials = []
  const idx = db.testimonials.findIndex(t => t.id === newItem.id)
  if (idx !== -1) db.testimonials[idx] = newItem
  else db.testimonials.push(newItem)
  await writeDatabase(db)
  res.json({ success: true, item: newItem })
})

app.delete('/api/testimonials/:id', async (req, res) => {
  const db = await readDatabase()
  db.testimonials = db.testimonials.filter(t => t.id !== req.params.id)
  await writeDatabase(db)
  res.json({ success: true })
})

// ═══════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════
app.get('/api/settings', async (req, res) => {
  const settings = await readSettings()
  res.json(settings)
})

app.put('/api/settings', async (req, res) => {
  const db = await readDatabase()
  db.settings = { ...db.settings, ...req.body }
  await writeDatabase(db)
  res.json({ success: true, settings: db.settings })
})

// ═══════════════════════════════════════════════════
// INQUIRIES
// ═══════════════════════════════════════════════════
app.get('/api/inquiries', async (req, res) => {
  const db = await readDatabase()
  const sorted = [...(db.inquiries || [])].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
  res.json(sorted)
})

app.post('/api/inquiries', async (req, res) => {
  const db = await readDatabase()
  const inquiryData = req.body
  inquiryData.id = 'inq_' + Date.now()
  inquiryData.created_at = new Date().toISOString()
  inquiryData.status = inquiryData.status || 'new'
  inquiryData.score = 50
  inquiryData.ai_tags = inquiryData.ai_tags || []

  try {
    const ai = await getAIClient()
    const evaluationPrompt = `
      Analyze this premium makeup booking inquiry:
      - Event Date: ${inquiryData.event_date || 'N/A'}
      - Event Type: ${inquiryData.event_type || 'N/A'}
      - Budget Choice: ${inquiryData.budget_range || 'N/A'}
      - Client Message: "${inquiryData.message || ''}"

      Task: Generate a numeric priority lead score from 1 to 100 representing how qualified, high-value, or urgent this lead is.
      Also, generate 2 to 4 classification tags that highlight important signals (e.g., "high_budget", "bridal", "urgent", "influencer", "multiple_clients").
    `
    const resJson = await ai.client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: evaluationPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: ai.Type.OBJECT,
          properties: {
            score: { type: ai.Type.INTEGER, description: "Lead score from 1 to 100" },
            ai_tags: { type: ai.Type.ARRAY, items: { type: ai.Type.STRING }, description: "List of custom tags" }
          },
          required: ["score", "ai_tags"]
        }
      }
    })
    const parsed = JSON.parse(resJson.text || '{}')
    if (typeof parsed.score === 'number') inquiryData.score = parsed.score
    if (Array.isArray(parsed.ai_tags)) inquiryData.ai_tags = parsed.ai_tags
  } catch (error) {
    console.warn("AI triage failed:", error.message)
    inquiryData.ai_tags.push("lead_received")
  }

  db.inquiries.push(inquiryData)
  await writeDatabase(db)
  res.json({ success: true, inquiry: inquiryData })
})

app.post('/api/inquiries/:id', async (req, res) => {
  const db = await readDatabase()
  const idx = db.inquiries.findIndex(inq => inq.id === req.params.id)
  if (idx !== -1) {
    const { status, notes } = req.body
    if (status) db.inquiries[idx].status = status
    if (notes !== undefined) db.inquiries[idx].notes = notes
    await writeDatabase(db)
    res.json({ success: true, inquiry: db.inquiries[idx] })
  } else {
    res.status(404).json({ error: "Inquiry not found" })
  }
})

// ═══════════════════════════════════════════════════
// ADMIN STATS
// ═══════════════════════════════════════════════════
app.get('/api/admin/stats', async (req, res) => {
  const db = await readDatabase()
  res.json({
    services: db.services?.length || 0,
    portfolio: db.portfolioItems?.length || 0,
    blogs: db.blogPosts?.length || 0,
    testimonials: db.testimonials?.length || 0,
    inquiries: db.inquiries?.length || 0,
    newInquiries: db.inquiries?.filter(i => i.status === 'new').length || 0,
  })
})

// ═══════════════════════════════════════════════════
// FILE UPLOAD (base64 / Vercel Blob)
// ═══════════════════════════════════════════════════
app.post('/api/upload', async (req, res) => {
  try {
    const { data, name } = req.body
    if (!data) {
      return res.status(400).json({ error: 'No file data provided' })
    }

    // Try Vercel Blob first (if configured)
    if (process.env.VERCEL_BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import('@vercel/blob')
        const buffer = Buffer.from(data.split(',')[1] || data, 'base64')
        const blob = await put(name || 'upload.jpg', buffer, { access: 'public' })
        return res.json({ success: true, url: blob.url })
      } catch (blobErr) {
        console.warn('Blob upload failed, falling back to data URL:', blobErr.message)
      }
    }

    // Fallback: return as data URL (stored in KV as part of the database)
    const mimeMatch = data.match(/^data:([^;]+);/)
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg'
    res.json({ success: true, url: data, mimeType })
  } catch (err) {
    console.error('Upload error:', err.message)
    res.status(500).json({ error: 'Upload failed: ' + err.message })
  }
})

// ═══════════════════════════════════════════════════
// FLICKR
// ═══════════════════════════════════════════════════
app.get('/api/flickr', async (req, res) => {
  try {
    const fRes = await fetch('https://www.flickr.com/photos/beautybyjoann/')
    if (!fRes.ok) throw new Error("Flickr page failed")
    const html = await fRes.text()

    const staticImageRegex = /https:\/\/live\.staticflickr\.com\/[0-9]+\/[0-9]+_[a-f0-9]+_[a-z]\.jpg/gi
    const imagesMatched = html.match(staticImageRegex) || []
    if (imagesMatched.length > 0) {
      const uniqueImgs = Array.from(new Set(imagesMatched))
      const customItems = uniqueImgs.map((img, i) => ({
        id: `f_${i}`,
        title: `Artistry Portrait #${i + 1}`,
        image_url: img.replace(/_[a-z]\.jpg/i, '_b.jpg'),
        description: "Live photos from Beauty By Joann's photography lookbook.",
        category: "flickr_stream",
        tags: ["makeup", "editorial", "bridal", "flickr"],
        published_at: new Date().toLocaleDateString()
      }))
      return res.json(customItems)
    }

    const nsidRegexes = [
      /"ownerNsid"\s*:\s*"([^"]+)"/i,
      /"nsid"\s*:\s*"([^"]+)"/i,
    ]
    let nsid = null
    for (const r of nsidRegexes) {
      const m = html.match(r)
      if (m && m[1]) { nsid = m[1]; break }
    }

    if (nsid) {
      const feedUrl = `https://www.flickr.com/services/feeds/photos_public.gne?id=${nsid}&format=json&nojsoncallback=1`
      const feedRes = await fetch(feedUrl)
      if (feedRes.ok) {
        const feedJson = await feedRes.json()
        if (feedJson && Array.isArray(feedJson.items)) {
          const items = feedJson.items.map((item, idx) => {
            const largeImg = item.media?.m ? item.media.m.replace('_m.', '_b.') : ''
            return {
              id: item.link || `flickr_${idx}`,
              title: item.title?.trim() || `Elite Artistry Accent`,
              image_url: largeImg || item.media?.m,
              description: item.description ? item.description.replace(/<[^>]*>/g, '').trim() : "Live capture session.",
              category: "flickr_stream",
              tags: item.tags ? item.tags.split(' ').filter(Boolean) : ["flickr", "glam"],
              published_at: item.published ? new Date(item.published).toLocaleDateString() : new Date().toLocaleDateString()
            }
          })
          return res.json(items)
        }
      }
    }
    throw new Error("Could not extract Flickr data")
  } catch (error) {
    console.warn("Flickr sync failed:", error.message)
    res.json([])
  }
})

// ═══════════════════════════════════════════════════
// STYLE QUIZ
// ═══════════════════════════════════════════════════
app.post('/api/style-quiz', async (req, res) => {
  const { occasion, vibe, skin_tone, eye_focus } = req.body
  try {
    const ai = await getAIClient()
    const prompt = `Occasion: ${occasion} Stylistic Vibe: ${vibe} Skin Tone / Profile: ${skin_tone} Focal Area: ${eye_focus}
      You are Joan's Elite Luxury Beauty Consult team.
      Recommend a highly specific makeup style signature tailored to these selections.
      - The style name must be evocative, sophisticated, and premium.
      - Provide a vivid, luxurious description of the look.
      - List 3 or 4 professional product application tips.
      - Return exactly 4 cohesive CSS HEX color swatches representing the palette of this look.
    `
    const resJson = await ai.client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: ai.Type.OBJECT,
          properties: {
            style_name: { type: ai.Type.STRING },
            description: { type: ai.Type.STRING },
            product_tips: { type: ai.Type.ARRAY, items: { type: ai.Type.STRING } },
            color_palette: { type: ai.Type.ARRAY, items: { type: ai.Type.STRING } }
          },
          required: ["style_name", "description", "product_tips", "color_palette"]
        }
      }
    })
    const recommendation = JSON.parse(resJson.text || '{}')
    res.json(recommendation)
  } catch (error) {
    console.error("Style quiz failed:", error.message)
    res.json({
      style_name: "Signature Golden Hour Glow",
      description: "A gorgeous, luminous look with flawless radiant skin, warm bronze sculpt contours, and a polished chocolate-rose lip combo.",
      product_tips: [
        "Prep skin with a hydrating primer and body glow on collarbones.",
        "Use metallic champagne liner on the inner corners of the eyes.",
        "Lock in with an ultra-fine setting mist for longevity under photography."
      ],
      color_palette: ["#D4A373", "#FAF7F2", "#8B5A2B", "#C18A64"]
    })
  }
})

// ═══════════════════════════════════════════════════
// VIRTUAL TRY-ON
// ═══════════════════════════════════════════════════
app.post('/api/virtual-try-on', async (req, res) => {
  const { image, styleLabel, styleDescription } = req.body
  if (!image) return res.status(400).json({ error: "Selfie image is required." })

  try {
    const ai = await getAIClient()
    const matches = image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)
    let mimeType = "image/jpeg"
    let base64Data = image
    if (matches && matches.length === 3) {
      mimeType = matches[1]
      base64Data = matches[2]
    }

    const promptText = `Professional makeup artist studio high-end photo editing. Apply a stunning and cohesive ${styleLabel} makeup style to this person's face. Style specifics: ${styleDescription}. Maintain exact facial contours, nose structure, facial hair, eye color. Use high-end beauty portrait lighting. Do not alter hair, background, or shirt. Only apply makeup.`

    const response = await ai.client.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: promptText }
        ]
      },
      config: { imageConfig: { aspectRatio: "1:1" } }
    })

    let resultImageUrl = null
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          resultImageUrl = `data:image/png;base64,${part.inlineData.data}`
          break
        }
      }
    }
    if (resultImageUrl) res.json({ success: true, imageUrl: resultImageUrl })
    else res.status(500).json({ error: "Could not apply makeup to this image. Make sure your face is clearly visible." })
  } catch (error) {
    console.error("Virtual Try-On error:", error.message)
    res.status(500).json({ error: error.message || "An error occurred." })
  }
})

// ═══════════════════════════════════════════════════
// CHAT
// ═══════════════════════════════════════════════════
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body
  try {
    const ai = await getAIClient()
    const db = await readDatabase()
    const servicesText = db.services.map(s =>
      `- ${s.name} (${s.category}): Starts at $${s.starting_price}. Takes ${s.duration}. Details: ${s.description}`
    ).join('\n')

    let businessContext = ""
    try {
      const contextPath = path.join(__dirname, '..', 'BUSINESS_CONTEXT.md')
      businessContext = await fs.readFile(contextPath, 'utf-8')
    } catch {}

    const systemInstruction = `
      You are Joann's Senior Beauty Advisor, representing "Beauty by Joann", a luxury bridal, event, and editorial makeup artist studio.
      You are warm, professional, sophisticated, and highly structured in color theory, skincare, and bridal logistics.

      Below is our verified Brand Guidelines and Business Context:
      ${businessContext}

      Here is our real, up-to-date Services and Pricing database:
      ${servicesText}

      Guide rules:
      1. Always tell the truth about prices based on our actual database.
      2. If asked about booking, suggest clicking '/book' or the booking link.
      3. Suggest they try our 'Style Quiz' or 'Virtual Try-On' tool.
      4. Avoid listing complex JSON. Format responses in luxurious, flowing paragraphs.
      5. Sound human, premium, and friendly. Avoid corporate jargon.
    `

    const formattedContents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    const response = await ai.client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: { systemInstruction, temperature: 0.7 }
    })

    res.json({ text: response.text })
  } catch (error) {
    console.error("Chat error:", error.message)
    res.status(500).json({ error: error.message || "Something went wrong." })
  }
})

// ═══════════════════════════════════════════════════
// EXPORT for Vercel
// ═══════════════════════════════════════════════════
export default app
