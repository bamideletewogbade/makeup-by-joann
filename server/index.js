import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3000;

// Increase limit to receive selfies as base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// File upload configuration
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = crypto.randomBytes(16).toString('hex');
    cb(null, `${name}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP, GIF, AVIF) are allowed'));
    }
  }
});

// Ensure uploads directory exists
async function ensureUploadsDir() {
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  } catch (e) {
    console.warn('Could not create uploads dir:', e);
  }
}
await ensureUploadsDir();

const DATABASE_FILE = path.join(process.cwd(), 'data', 'database.json');

// Helper to load database
async function readDatabase() {
  try {
    const data = await fs.readFile(DATABASE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Database read error, using fallback template:", error);
    return { services: [], portfolioItems: [], inquiries: [], blogPosts: [], testimonials: [] };
  }
}

// Helper to write database
async function writeDatabase(data) {
  try {
    await fs.mkdir(path.dirname(DATABASE_FILE), { recursive: true });
    await fs.writeFile(DATABASE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Database write error:", error);
  }
}

// Lazy load GoogleGenAI
let aiClient = null;
function getAIClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required but missing. Please configure it in your Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API Endpoints

// 1. Get Services
app.get('/api/services', async (req, res) => {
  const db = await readDatabase();
  res.json(db.services);
});

// Update Services
app.put('/api/services', async (req, res) => {
  const db = await readDatabase();
  db.services = req.body;
  await writeDatabase(db);
  res.json({ success: true, services: db.services });
});

// Get App Settings
app.get('/api/settings', async (req, res) => {
  const db = await readDatabase();
  res.json(db.settings || { showPricing: false });
});

// Update App Settings
app.put('/api/settings', async (req, res) => {
  const db = await readDatabase();
  db.settings = { ...db.settings, ...req.body };
  await writeDatabase(db);
  res.json({ success: true, settings: db.settings });
});

// 2. Get Portfolio Items
app.get('/api/portfolio', async (req, res) => {
  const db = await readDatabase();
  res.json(db.portfolioItems);
});

// Add / Edit Portfolio Item
app.post('/api/portfolio', async (req, res) => {
  const db = await readDatabase();
  const newItem = req.body;
  if (!newItem.id) {
    newItem.id = 'p_' + Date.now();
  }
  const index = db.portfolioItems.findIndex((item) => item.id === newItem.id);
  if (index !== -1) {
    db.portfolioItems[index] = newItem;
  } else {
    db.portfolioItems.push(newItem);
  }
  await writeDatabase(db);
  res.json({ success: true, item: newItem });
});

// Delete Portfolio Item
app.delete('/api/portfolio/:id', async (req, res) => {
  const db = await readDatabase();
  db.portfolioItems = db.portfolioItems.filter((item) => item.id !== req.params.id);
  await writeDatabase(db);
  res.json({ success: true });
});

// 3. Get Blogs
app.get('/api/blogs', async (req, res) => {
  const db = await readDatabase();
  res.json(db.blogPosts || []);
});

// Add / Edit Blog
app.post('/api/blogs', async (req, res) => {
  const db = await readDatabase();
  const newPost = req.body;
  if (!newPost.id) {
    newPost.id = 'blog_' + Date.now();
  }
  if (!db.blogPosts) db.blogPosts = [];
  const index = db.blogPosts.findIndex((post) => post.id === newPost.id);
  if (index !== -1) {
    db.blogPosts[index] = newPost;
  } else {
    db.blogPosts.push(newPost);
  }
  await writeDatabase(db);
  res.json({ success: true, post: newPost });
});

// 4. Testimonials
app.get('/api/testimonials', async (req, res) => {
  const db = await readDatabase();
  res.json(db.testimonials || []);
});

// Add / Edit Testimonial
app.post('/api/testimonials', async (req, res) => {
  const db = await readDatabase();
  const newItem = req.body;
  if (!newItem.id) {
    newItem.id = 't_' + Date.now();
  }
  if (!db.testimonials) db.testimonials = [];
  const index = db.testimonials.findIndex((t) => t.id === newItem.id);
  if (index !== -1) {
    db.testimonials[index] = newItem;
  } else {
    db.testimonials.push(newItem);
  }
  await writeDatabase(db);
  res.json({ success: true, item: newItem });
});

// Delete Testimonial
app.delete('/api/testimonials/:id', async (req, res) => {
  const db = await readDatabase();
  db.testimonials = db.testimonials.filter((t) => t.id !== req.params.id);
  await writeDatabase(db);
  res.json({ success: true });
});

// Delete Service
app.delete('/api/services/:id', async (req, res) => {
  const db = await readDatabase();
  db.services = db.services.filter((s) => s.id !== req.params.id);
  await writeDatabase(db);
  res.json({ success: true });
});

// Delete Blog
app.delete('/api/blogs/:id', async (req, res) => {
  const db = await readDatabase();
  db.blogPosts = (db.blogPosts || []).filter((b) => b.id !== req.params.id);
  await writeDatabase(db);
  res.json({ success: true });
});

// File Upload
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const url = `/uploads/${req.file.filename}`;
  res.json({ success: true, url });
});

// Upload error handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 20MB.' });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

// Dashboard Stats
app.get('/api/admin/stats', async (req, res) => {
  const db = await readDatabase();
  res.json({
    services: db.services?.length || 0,
    portfolio: db.portfolioItems?.length || 0,
    blogs: db.blogPosts?.length || 0,
    testimonials: db.testimonials?.length || 0,
    inquiries: db.inquiries?.length || 0,
    newInquiries: db.inquiries?.filter((i) => i.status === 'new').length || 0,
  });
});

// 5. Inquiries
app.get('/api/inquiries', async (req, res) => {
  const db = await readDatabase();
  // Sort by score descending first, and then date descending
  const sorted = [...(db.inquiries || [])].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  res.json(sorted);
});

// Create Inquiry (with Rich AI Lead Triage scoring and tagging)
app.post('/api/inquiries', async (req, res) => {
  const db = await readDatabase();
  const inquiryData = req.body;
  
  // Set identifier and date
  inquiryData.id = 'inq_' + Date.now();
  inquiryData.created_at = new Date().toISOString();
  inquiryData.status = inquiryData.status || 'new';
  inquiryData.score = 50; // Default fallback score
  inquiryData.ai_tags = inquiryData.ai_tags || [];

  // Triage scoring process using LLM
  try {
    const ai = getAIClient();
    const evaluationPrompt = `
      Analyze this premium makeup booking inquiry:
      - Event Date: ${inquiryData.event_date}
      - Event Type: ${inquiryData.event_type}
      - Budget Choice: ${inquiryData.budget_range}
      - Client Message: "${inquiryData.message}"

      Task: Generate a numeric priority lead score from 1 to 100 representing how qualified, high-value, or urgent this lead is (e.g., weddings with high budgets should score 85-100; unclear or tiny event requests with budget "under_200" should score lower). Also, generate 2 to 4 classification tags that highlight important signals (e.g., "high_budget", "bridal", "urgent", "influencer", "multiple_clients").
    `;

    const resJson = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: evaluationPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { 
              type: Type.INTEGER, 
              description: "Lead score from 1 to 100 based on value, date proximity, and style compatibility" 
            },
            ai_tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of custom tags highlighting key lead characteristics"
            }
          },
          required: ["score", "ai_tags"]
        }
      }
    });

    const parsed = JSON.parse(resJson.text || '{}');
    if (typeof parsed.score === 'number') {
      inquiryData.score = parsed.score;
    }
    if (Array.isArray(parsed.ai_tags)) {
      inquiryData.ai_tags = parsed.ai_tags;
    }
  } catch (error) {
    console.error("AI Lead Triage failed, saving with defaults:", error);
    inquiryData.ai_tags.push("lead_received");
    if (inquiryData.event_type === 'wedding') inquiryData.ai_tags.push("bridal");
  }

  db.inquiries.push(inquiryData);
  await writeDatabase(db);
  res.json({ success: true, inquiry: inquiryData });
});

// Update Inquiry Status & Notes (Admin Terminal)
app.post('/api/inquiries/:id', async (req, res) => {
  const db = await readDatabase();
  const index = db.inquiries.findIndex((inq) => inq.id === req.params.id);
  if (index !== -1) {
    const { status, notes } = req.body;
    if (status) db.inquiries[index].status = status;
    if (notes !== undefined) db.inquiries[index].notes = notes;
    await writeDatabase(db);
    res.json({ success: true, inquiry: db.inquiries[index] });
  } else {
    res.status(404).json({ error: "Inquiry not found" });
  }
});

// 5.5. Get Live Flickr Sync Lookbook Feed
app.get('/api/flickr', async (req, res) => {
  try {
    const fRes = await fetch('https://www.flickr.com/photos/beautybyjoann/');
    if (!fRes.ok) throw new Error("Failed to fetch Flickr page");
    const html = await fRes.text();
    
    const nsidRegexes = [
      /\"ownerNsid\"\s*:\s*\"([^\"]+)\"/i,
      /\"nsid\"\s*:\s*\"([^\"]+)\"/i,
      /\"userId\"\s*:\s*\"([^\"]+)\"/i,
      /\"nsid\"\s*:\s*\"([^\"]+)\"/
    ];
    
    let nsid = null;
    for (const r of nsidRegexes) {
      const m = html.match(r);
      if (m && m[1]) {
        nsid = m[1];
        break;
      }
    }
    
    if (!nsid) {
      // Try fallback parsing list of layout images from Flickr
      const staticImageRegex = /https:\/\/live\.staticflickr\.com\/[0-9]+\/[0-9]+_[a-f0-9]+_[a-z]\.jpg/gi;
      const imagesMatched = html.match(staticImageRegex) || [];
      if (imagesMatched.length > 0) {
        const uniqueImgs = Array.from(new Set(imagesMatched));
        const customItems = uniqueImgs.map((img, i) => ({
          id: `f_${i}`,
          title: `Artistry Portrait #${i + 1}`,
          image_url: img.replace(/_[a-z]\.jpg/i, '_b.jpg'),
          description: "Live photos captured from Joan's elite photography lookbook & sessions.",
          category: "flickr_stream",
          tags: ["makeup", "editorial", "bridal", "flickr"],
          published_at: new Date().toLocaleDateString()
        }));
        return res.json(customItems);
      }
      throw new Error("Could not find NSID or static image links on the page");
    }

    // Now call Flickr's JSON public feed using her real NSID
    const feedUrl = `https://www.flickr.com/services/feeds/photos_public.gne?id=${nsid}&format=json&nojsoncallback=1`;
    const feedRes = await fetch(feedUrl);
    if (!feedRes.ok) throw new Error("Flickr feed request failed");
    const feedJson = await feedRes.json();
    
    if (feedJson && Array.isArray(feedJson.items)) {
      const items = feedJson.items.map((item, idx) => {
        const largeImg = item.media?.m ? item.media.m.replace('_m.', '_b.') : '';
        return {
          id: item.link || `flickr_${idx}`,
          title: item.title && item.title.trim() ? item.title : `Elite Artistry Accent`,
          image_url: largeImg || item.media?.m,
          description: item.description ? item.description.replace(/<[^>]*>/g, '').trim() : "Live capture session from Joan's masterclass.",
          category: "flickr_stream",
          tags: item.tags ? item.tags.split(' ').filter(Boolean) : ["flickr", "glam"],
          published_at: item.published ? new Date(item.published).toLocaleDateString() : new Date().toLocaleDateString()
        };
      });
      return res.json(items);
    }
    
    throw new Error("Empty Flickr feed items");
  } catch (error) {
    console.warn("Flickr live sync failed, rendering backup portfolio images:", error);
    res.json([
      {
        id: "f_back_1",
        title: "Sunset Bronze Yoruba Crown",
        image_url: "https://images.unsplash.com/photo-1628191140356-91253457a8bf?q=80&w=1200&auto=format&fit=crop",
        description: "Regal bridal look with rich bronze sculpt, dual-tone metallic copper lids, and gold bead highlights.",
        category: "flickr_stream",
        tags: ["bridal", "traditional", "gold", "glowing"],
        published_at: "Recent"
      },
      {
        id: "f_back_2",
        title: "Dewy Bridal Radiance",
        image_url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1200&auto=format&fit=crop",
        description: "Luminous, glass-like skin with soft pastel rose highlights on cheeks and inner eye corners.",
        category: "flickr_stream",
        tags: ["bridal", "dewy", "rose"],
        published_at: "Recent"
      },
      {
        id: "f_back_3",
        title: "Editorial Runway Edge",
        image_url: "https://images.unsplash.com/photo-1628191140375-7f12e84c98f9?q=80&w=1200&auto=format&fit=crop",
        description: "Sharp velvet lip borders, matte almond eyes, and sculpted contours for high fashion runways.",
        category: "flickr_stream",
        tags: ["editorial", "runway", "sculpted"],
        published_at: "Recent"
      },
      {
        id: "f_back_4",
        title: "Metallic Gold & Emerald",
        image_url: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30129?q=80&w=1200&auto=format&fit=crop",
        description: "Luxury event look using gold pigments, emerald under-liners, and a warm gloss lip.",
        category: "flickr_stream",
        tags: ["event", "gold", "editorial"],
        published_at: "Recent"
      },
      {
        id: "f_back_5",
        title: "Golden Hour Portrait",
        image_url: "https://images.unsplash.com/photo-1506795847402-ddc1c731e0f3?q=80&w=1200&auto=format&fit=crop",
        description: "Soft focus beauty with feather-stroked brows, warm bronze sculpting, and a luminous satin lip.",
        category: "flickr_stream",
        tags: ["portrait", "natural", "golden"],
        published_at: "Recent"
      },
      {
        id: "f_back_6",
        title: "Bridal Elegance",
        image_url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1200&auto=format&fit=crop",
        description: "Soft glam bridal look with warm neutral tones, defined brows, and a glossy nude lip.",
        category: "flickr_stream",
        tags: ["bridal", "elegance", "neutral"],
        published_at: "Recent"
      },
      {
        id: "f_back_7",
        title: "Creative Editorial Glam",
        image_url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1200&auto=format&fit=crop",
        description: "Bold creative look with graphic elements and sculptural contouring for editorial impact.",
        category: "flickr_stream",
        tags: ["editorial", "creative", "bold"],
        published_at: "Recent"
      },
      {
        id: "f_back_8",
        title: "Red Carpet Glamour",
        image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
        description: "Dramatic evening look with smoky eyes, warm bronze contour, and a statement lip.",
        category: "flickr_stream",
        tags: ["glamour", "evening", "dramatic"],
        published_at: "Recent"
      }
    ]);
  }
});

// 6. Style Quiz AI Recommender
app.post('/api/style-quiz', async (req, res) => {
  const { occasion, vibe, skin_tone, eye_focus } = req.body;

  try {
    const ai = getAIClient();
    const prompt = `
      Occasion: ${occasion}
      Stylistic Vibe: ${vibe}
      Skin Tone / Profile: ${skin_tone}
      Focal Area: ${eye_focus}

      You are Joan's Elite Luxury Beauty Consult team. 
      Recommend a highly specific makeup style signature tailored to these selections. 
      - The style name must be evocative, sophisticated, and premium (e.g. "Royal Sahara Radiance", "Gilded Bronze Empress", "Abuja Gala Glamour", "Lagos Sunset Glow").
      - Provide a vivid, luxurious description of the look.
      - List 3 or 4 professional product application tips or prep techniques specifically tailored for this combination of skin tone, vibe, and focus area. We recommend luxury makeup artist tricks.
      - Return exactly 4 cohesive CSS HEX color swatches representing the palette of this look (shades for eyes, blush, highlighter, and lip combination). They must be returned in the 'color_palette' array.
    `;

    const resJson = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            style_name: { type: Type.STRING },
            description: { type: Type.STRING },
            product_tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            color_palette: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 4 HEX color codes representing the look's palette (e.g. ['#B87333','#800020','#FFD700','#D2B48C'])"
            }
          },
          required: ["style_name", "description", "product_tips", "color_palette"]
        }
      }
    });

    const recommendation = JSON.parse(resJson.text || '{}');
    res.json(recommendation);
  } catch (error) {
    console.error("AI quiz assessment failed:", error);
    res.json({
      style_name: "Signature Golden Hour Glow",
      description: "A gorgeous, luminous look featuring flawless radiant skin, warm bronze sculpt contours, and a polished chocolate-rose lip combo.",
      product_tips: [
        "Prep skin with a hydrating primer and body glow on collarbones.",
        "Use metallic champagne liner on the inner corners of the eyes.",
        "Lock in with an ultra-fine setting mist for absolute longevity under direct photography."
      ],
      color_palette: ["#D4A373", "#FAF7F2", "#8B5A2B", "#C18A64"]
    });
  }
});

// 7. Virtual Makeup Try-On Image-to-Image Synthesis
app.post('/api/virtual-try-on', async (req, res) => {
  const { image, styleLabel, styleDescription } = req.body;
  if (!image) {
    return res.status(400).json({ error: "Selfie image is required." });
  }

  try {
    const ai = getAIClient();

    // Clean up base64 payload
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let mimeType = "image/jpeg";
    let base64Data = image;

    if (matches && matches.length === 3) {
      mimeType = matches[1];
      base64Data = matches[2];
    }

    const promptText = `
      Professional makeup artist studio high-end photo editing. Apply a stunning and cohesive ${styleLabel} makeup style to this person's face. 
      Style specifics: ${styleDescription}.
      Maintain exact facial contours, nose structure, facial hair, eye color, and general features recognizable so it is a true realistic preview of the makeup look. Use high-end beauty portrait lighting (dewy complexion, beautiful blending, rich colors, soft airbrushed texture). Professional photography finish, eye-level, clean. Do not alter hair, background, or shirt. Only apply makeup.
    `;

    console.log(`Synthesizing makeup preview for look: ${styleLabel}`);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    let resultImageUrl = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          resultImageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (resultImageUrl) {
      res.json({ success: true, imageUrl: resultImageUrl });
    } else {
      console.warn("Gemini didn't return an image part. Fetching text instead:", response.text);
      res.status(500).json({ error: "Could not apply makeup to this image. Please make sure your face is clearly visible and try again." });
    }
  } catch (error) {
    console.error("Virtual Try-On error:", error);
    res.status(500).json({ error: error.message || "An error occurred during makeup simulation." });
  }
});

// 8. Conversational Beauty Chat Agent with Service Database Grounding
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  try {
    const ai = getAIClient();
    const db = await readDatabase();

    const servicesText = db.services.map((s) => 
      `- ${s.name} (${s.category}): Starts at $${s.starting_price}. Takes ${s.duration}. Details: ${s.description}`
    ).join('\n');

    let businessContext = "";
    try {
      const contextPath = path.join(process.cwd(), 'BUSINESS_CONTEXT.md');
      businessContext = await fs.readFile(contextPath, 'utf-8');
    } catch (e) {
      console.warn("Could not load BUSINESS_CONTEXT.md context file:", e);
    }

    const systemInstruction = `
      You are Joann's Senior Beauty Advisor, representing "Beauty by Joann", a luxury bridal, event, and editorial makeup artist studio. 
      You are warm, professional, sophisticated, and highly structured in color theory, skincare, and bridal logistics. 
      Your purpose is to answer user queries with immense elegance and guide them to find their perfect aesthetic.

      Below is our verified Brand Guidelines and Business Context. You must strictly align with this truth:
      ${businessContext}

      Here is our real, up-to-date Services and Pricing database:
      ${servicesText}

      Guide rules:
      1. Always tell the truth about prices based on our actual database. If asked for a service that isn't listed, offer event bookings or consultations.
      2. If asked about booking, suggest clicking '/book' or the booking link.
      3. Suggest they try our 'Style Quiz' (available in the navigation) to find their perfect colors, or the 'Virtual Try-On' tool to preview looks on their own face!
      4. Avoid listing complex JSON structures or raw details. Always format your responses in a luxurious, flowing paragraphs with elegant bullet points.
      5. Sound human, premium, and friendly. Avoid corporate jargon. Avoid hallucinating specific city databases unless specified inside the Business Context.
    `;

    const formattedContents = messages.map((m) => {
      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      };
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error("Agent chat error:", error);
    res.status(500).json({ error: error.message || "Something went wrong in the beauty consultation." });
  }
});


// Mounting Vite in development or serving static builds in production
async function startServer() {
  // Serve uploaded files
  app.use('/uploads', express.static(UPLOADS_DIR));

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server launched on http://localhost:${PORT}`);
  });
}

startServer();
