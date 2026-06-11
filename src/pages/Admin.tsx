import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Palette, Image, FileText, MessageSquare,
  Settings, LogOut, Menu, X, Mail, Star, Plus, Pencil, Trash2,
  Upload, ExternalLink, Search, Calendar,
  Phone, CheckCircle, Clock, Sparkles
} from 'lucide-react'

// ─── Types ───
interface Service {
  id: string; name: string; category: string; starting_price: number;
  duration: string; description: string; popular?: boolean;
}

interface PortfolioItem {
  id: string; title: string; image_url: string; description: string;
  category: string; featured?: boolean; tags?: string[]; published_at?: string;
}

interface BlogPost {
  id: string; title: string; content: string; category: string; published_at?: string;
}

interface Testimonial {
  id: string; name: string; role: string; content: string;
}

interface Inquiry {
  id: string; name: string; email: string; phone?: string; event_date?: string;
  event_type?: string; budget_range?: string; message: string;
  status: string; score: number; ai_tags: string[]; created_at: string; notes?: string;
}

interface Stats {
  services: number; portfolio: number; blogs: number;
  testimonials: number; inquiries: number; newInquiries: number;
}

// ─── Sidebar Sections ───
const SECTIONS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'services', label: 'Services', icon: Palette },
  { id: 'portfolio', label: 'Portfolio', icon: Image },
  { id: 'blogs', label: 'Blog Posts', icon: FileText },
  { id: 'testimonials', label: 'Testimonials', icon: Star },
  { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
]

// ─── Helpers ───
const CATEGORY_OPTIONS = [
  { value: 'bridal', label: 'Bridal' },
  { value: 'film_production', label: 'Film & TV' },
  { value: 'editorial_shoot', label: 'Editorial' },
  { value: 'creative_glam', label: 'Creative' },
  { value: 'fashion_show', label: 'Fashion Show' },
]

const PORTFOLIO_CATEGORIES = [
  'Editorial Shoot', 'Bridal', 'Film Production', 'Creative Glam', 'Fashion Show'
]

const BLOG_CATEGORIES = ['pro_tips', 'skincare', 'bridal', 'industry_news']

async function api(url: string, options?: RequestInit) {
  const res = await fetch(url, options)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-green-400 bg-green-500/10 border-green-500/20'
  if (score >= 50) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
  return 'text-red-400 bg-red-500/10 border-red-500/20'
}

// ─── Modal Component ───
function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-[#141414] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl shadow-black/50"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-lg font-heading font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-all cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  )
}

// ─── Input Component ───
function Input({ label, ...props }: { label?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</label>}
      <input
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
        {...props}
      />
    </div>
  )
}

function TextArea({ label, ...props }: { label?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</label>}
      <textarea
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all resize-y min-h-[80px]"
        {...props}
      />
    </div>
  )
}

function Select({ label, options, ...props }: {
  label?: string; options: { value: string; label: string }[]
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</label>}
      <select
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all cursor-pointer"
        {...props}
      >
        {options.map(o => (
          <option key={o.value} value={o.value} className="bg-[#1a1a1a]">{o.label}</option>
        ))}
      </select>
    </div>
  )
}

// ─── Image Uploader ───
function ImageUploader({ value, onChange, label }: {
  value: string; onChange: (url: string) => void; label?: string
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      // Read file as base64 and send as JSON
      const reader = new FileReader()
      reader.onload = async () => {
        const base64data = reader.result as string
        const res = await api('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: base64data, name: file.name })
        })
        onChange(res.url)
        setUploading(false)
      }
      reader.onerror = () => {
        console.error('File read failed')
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error('Upload failed:', err)
      setUploading(false)
    }
  }

  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</label>}
      <div className="flex items-center gap-3 flex-wrap">
        {value && (
          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-white/5">
            <img src={value} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <div className="flex gap-2 flex-1">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs text-gray-300 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload from Device'}
          </button>
          {!value && (
            <input
              type="text"
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder="Or paste image URL..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground placeholder-gray-600 focus:outline-none focus:border-primary/50"
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Confirm Dialog ───
function ConfirmDialog({ open, onClose, onConfirm, title, message }: {
  open: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-[#141414] border border-white/10 rounded-xl p-6 w-full max-w-sm shadow-2xl"
      >
        <h3 className="text-base font-heading font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-gray-400 mb-5">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-xs text-gray-400 hover:text-white transition-all cursor-pointer">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer">Delete</button>
        </div>
      </motion.div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// MAIN ADMIN COMPONENT
// ═══════════════════════════════════════════════════════════

export default function Admin() {
  const [section, setSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [authUsername, setAuthUsername] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [stats, setStats] = useState<Stats | null>(null)

  // Data
  const [services, setServices] = useState<Service[]>([])
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [settings, setSettings] = useState<any>({})

  // Modal state
  const [modal, setModal] = useState<{ open: boolean; type: string; data?: any }>({ open: false, type: '' })
  const [confirm, setConfirm] = useState<{ open: boolean; title: string; message: string; onConfirm: () => void }>({ open: false, title: '', message: '', onConfirm: () => {} })

  // Search / filter
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const toggle = (type: string, data?: any) => setModal({ open: true, type, data })
  const closeModal = () => setModal({ open: false, type: '', data: undefined })

  // ─── Auth Check ───
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const saved = localStorage.getItem('admin_user')
    if (token === 'authenticated' && saved) {
      try {
        setCurrentUser(JSON.parse(saved))
        setAuthenticated(true)
      } catch {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
      }
    }
  }, [])

  const handleLogin = async () => {
    try {
      const s = await api('/api/settings')
      const users = s.adminUsers || []
      const matched = users.find(
        (u: any) => u.username === authUsername && u.password === authPassword
      )
      if (matched) {
        localStorage.setItem('admin_token', 'authenticated')
        localStorage.setItem('admin_user', JSON.stringify(matched))
        setCurrentUser(matched)
        setAuthenticated(true)
        setAuthError('')
      } else {
        setAuthError('Invalid username or password')
      }
    } catch {
      // Fallback: if settings can't be loaded, try the default master admin
      if (authUsername === 'admin' && authPassword === 'admin123') {
        const master = { id: 'master_1', username: 'admin', password: 'admin123', isMaster: true }
        localStorage.setItem('admin_token', 'authenticated')
        localStorage.setItem('admin_user', JSON.stringify(master))
        setCurrentUser(master)
        setAuthenticated(true)
        setAuthError('')
      } else {
        setAuthError('Invalid username or password')
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setAuthenticated(false)
    setCurrentUser(null)
  }

  // ─── Load Data ───
  const loadData = useCallback(async () => {
    try {
      const [s, p, b, t, i, st, set] = await Promise.all([
        api('/api/services'), api('/api/portfolio'), api('/api/blogs'),
        api('/api/testimonials'), api('/api/inquiries'), api('/api/admin/stats'),
        api('/api/settings'),
      ])
      setServices(s); setPortfolio(p); setBlogs(b); setTestimonials(t)
      setInquiries(i); setStats(st); setSettings(set)
    } catch (err) {
      console.error('Failed to load admin data:', err)
    }
  }, [])

  useEffect(() => {
    if (authenticated) loadData()
  }, [authenticated, loadData])

  // ─── CRUD Handlers ───
  const saveService = async (data: any) => {
    const isNew = !data.id
    const updated = isNew ? [...services, { ...data, id: 's_' + Date.now() }] : services.map(s => s.id === data.id ? data : s)
    await api('/api/services', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) })
    setServices(updated); closeModal(); loadData()
  }

  const deleteService = async (id: string) => {
    await api(`/api/services/${id}`, { method: 'DELETE' })
    setServices(services.filter(s => s.id !== id)); loadData()
  }

  const savePortfolio = async (data: any) => {
    await api('/api/portfolio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    closeModal(); loadData()
  }

  const deletePortfolio = async (id: string) => {
    await api(`/api/portfolio/${id}`, { method: 'DELETE' })
    setPortfolio(portfolio.filter(p => p.id !== id)); loadData()
  }

  const saveBlog = async (data: any) => {
    await api('/api/blogs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    closeModal(); loadData()
  }

  const deleteBlog = async (id: string) => {
    await api(`/api/blogs/${id}`, { method: 'DELETE' })
    setBlogs(blogs.filter(b => b.id !== id)); loadData()
  }

  const saveTestimonial = async (data: any) => {
    await api('/api/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    closeModal(); loadData()
  }

  const deleteTestimonial = async (id: string) => {
    await api(`/api/testimonials/${id}`, { method: 'DELETE' })
    setTestimonials(testimonials.filter(t => t.id !== id)); loadData()
  }

  const updateInquiryStatus = async (id: string, status: string, notes?: string) => {
    await api(`/api/inquiries/${id}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    })
    loadData()
  }

  const saveSettings = async (data: any) => {
    await api('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    setSettings(data); closeModal()
  }

  // ─── Login Screen ───
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="bg-[#111] border border-white/5 rounded-2xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center mx-auto">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h1 className="font-heading text-xl font-semibold text-foreground">Admin Panel</h1>
              <p className="text-xs text-gray-500">Beauty By Joann CMS</p>
            </div>
            <div className="space-y-3">
              <Input
                label="Username"
                type="text"
                value={authUsername}
                onChange={e => setAuthUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="Enter username..."
              />
              <Input
                label="Password"
                type="password"
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="Enter password..."
              />
              {authError && <p className="text-xs text-red-400">{authError}</p>}
              <button
                onClick={handleLogin}
                className="w-full py-3 bg-primary hover:bg-primary/90 text-black text-xs uppercase tracking-widest font-bold rounded-xl transition-all cursor-pointer"
              >
                Sign In
              </button>
            </div>
            <p className="text-[10px] text-gray-600 text-center">Default: admin / admin123</p>
          </div>
        </motion.div>
      </div>
    )
  }

  // ─── Main Admin Layout ───
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#0D0D0D] border-r border-white/5 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-translate-x-full'}`}>
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-sm font-semibold text-primary">Admin</h2>
            <p className="text-[10px] text-gray-500 flex items-center gap-1">
              {currentUser?.isMaster && <Sparkles size={10} className="text-primary" />}
              {currentUser?.username || 'Content Manager'}
            </p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 text-gray-500 hover:text-white cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {SECTIONS.map(sec => {
            const Icon = sec.icon
            return (
              <button
                key={sec.id}
                onClick={() => { setSection(sec.id); setSidebarOpen(false) }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                  section === sec.id
                    ? 'bg-primary/10 text-primary border border-primary/15'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {sec.label}
              </button>
            )
          })}
        </nav>

        <div className="p-3 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-gray-500 hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer"
          >
            <LogOut size={16} /> Sign Out
          </button>
          <a
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-gray-500 hover:text-primary hover:bg-white/5 transition-all mt-1"
          >
            <ExternalLink size={16} /> View Site
          </a>
        </div>
      </aside>

      {/* Mobile toggle */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-6 left-6 z-30 lg:hidden w-12 h-12 rounded-full bg-primary text-black shadow-lg flex items-center justify-center cursor-pointer"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">

          {/* ────── DASHBOARD ────── */}
          {section === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-heading text-2xl font-semibold text-foreground">Dashboard</h1>
                  <p className="text-xs text-gray-500 mt-1">Overview of your content and leads</p>
                </div>
                <button onClick={loadData} className="text-xs text-gray-500 hover:text-primary transition-all px-3 py-1.5 rounded-lg border border-white/5 hover:border-primary/20 cursor-pointer">
                  Refresh
                </button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {stats && [
                  { label: 'Services', value: stats.services, icon: Palette, color: 'text-purple-400 bg-purple-500/10' },
                  { label: 'Portfolio', value: stats.portfolio, icon: Image, color: 'text-blue-400 bg-blue-500/10' },
                  { label: 'Blog Posts', value: stats.blogs, icon: FileText, color: 'text-green-400 bg-green-500/10' },
                  { label: 'Testimonials', value: stats.testimonials, icon: Star, color: 'text-yellow-400 bg-yellow-500/10' },
                  { label: 'Total Inquiries', value: stats.inquiries, icon: MessageSquare, color: 'text-orange-400 bg-orange-500/10' },
                  { label: 'New Leads', value: stats.newInquiries, icon: Mail, color: 'text-red-400 bg-red-500/10' },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-[#111] border border-white/5 rounded-xl p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{item.label}</span>
                        <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
                          <Icon size={14} />
                        </div>
                      </div>
                      <p className="font-heading text-2xl font-bold text-foreground">{item.value}</p>
                    </motion.div>
                  )
                })}
              </div>

              {/* Recent Inquiries */}
              <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Recent Inquiries</h3>
                {inquiries.length === 0 ? (
                  <p className="text-xs text-gray-500">No inquiries yet.</p>
                ) : (
                  <div className="space-y-2">
                    {inquiries.slice(0, 5).map(inq => (
                      <div key={inq.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${inq.status === 'new' ? 'bg-red-400' : inq.status === 'contacted' ? 'bg-yellow-400' : 'bg-green-400'}`} />
                          <div className="min-w-0">
                            <p className="text-sm text-foreground truncate">{inq.name}</p>
                            <p className="text-[10px] text-gray-500">{inq.event_type || 'No event type'} • {formatDate(inq.created_at)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getScoreColor(inq.score)}`}>
                            {inq.score}
                          </span>
                          <button onClick={() => setSection('inquiries')} className="text-xs text-primary hover:underline cursor-pointer">View</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ────── SERVICES ────── */}
          {section === 'services' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-heading text-2xl font-semibold text-foreground">Services</h1>
                  <p className="text-xs text-gray-500 mt-1">{services.length} services</p>
                </div>
                <button onClick={() => toggle('service')} className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-black text-xs uppercase tracking-widest font-bold rounded-xl transition-all cursor-pointer">
                  <Plus size={14} /> Add Service
                </button>
              </div>

              <div className="space-y-3">
                {services.map((s, i) => (
                  <motion.div
                    key={s.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="bg-[#111] border border-white/5 rounded-xl p-5 flex items-start gap-4 group hover:border-white/10 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-foreground">{s.name}</h3>
                        {s.popular && <span className="text-[9px] uppercase tracking-widest bg-primary/15 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold">Popular</span>}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{s.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-500">
                        <span className="uppercase tracking-wider">{s.category.replace('_', ' ')}</span>
                        <span>{s.duration}</span>
                        <span className="text-primary font-semibold">${s.starting_price}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => toggle('service', s)} className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/5 transition-all cursor-pointer">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setConfirm({ open: true, title: 'Delete Service', message: `Delete "${s.name}"?`, onConfirm: () => deleteService(s.id) })} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
                {services.length === 0 && <p className="text-sm text-gray-500 text-center py-10">No services yet. Add one!</p>}
              </div>
            </motion.div>
          )}

          {/* ────── PORTFOLIO ────── */}
          {section === 'portfolio' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-heading text-2xl font-semibold text-foreground">Portfolio</h1>
                  <p className="text-xs text-gray-500 mt-1">{portfolio.length} items</p>
                </div>
                <button onClick={() => toggle('portfolio')} className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-black text-xs uppercase tracking-widest font-bold rounded-xl transition-all cursor-pointer">
                  <Plus size={14} /> Add Item
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolio.map((item, i) => (
                  <motion.div
                    key={item.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="bg-[#111] border border-white/5 rounded-xl overflow-hidden group hover:border-white/10 transition-all"
                  >
                    <div className="relative h-40 bg-zinc-900">
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 flex gap-1">
                        {item.featured && <span className="text-[8px] bg-primary/80 text-black px-2 py-0.5 rounded-full font-bold uppercase">Featured</span>}
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="text-sm font-semibold text-foreground truncate">{item.title}</h3>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">{item.category}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <button onClick={() => toggle('portfolio', item)} className="flex-1 py-1.5 text-xs bg-white/5 hover:bg-white/10 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 text-gray-400 hover:text-white">
                          <Pencil size={12} /> Edit
                        </button>
                        <button onClick={() => setConfirm({ open: true, title: 'Delete Item', message: `Delete "${item.title}"?`, onConfirm: () => deletePortfolio(item.id) })} className="py-1.5 px-3 text-xs bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all cursor-pointer text-red-400">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {portfolio.length === 0 && (
                  <div className="col-span-full text-center py-16 text-sm text-gray-500">
                    <Image size={40} className="mx-auto mb-3 opacity-30" />
                    No portfolio items yet.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ────── BLOGS ────── */}
          {section === 'blogs' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-heading text-2xl font-semibold text-foreground">Blog Posts</h1>
                  <p className="text-xs text-gray-500 mt-1">{blogs.length} posts</p>
                </div>
                <button onClick={() => toggle('blog')} className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-black text-xs uppercase tracking-widest font-bold rounded-xl transition-all cursor-pointer">
                  <Plus size={14} /> Add Post
                </button>
              </div>

              <div className="space-y-3">
                {blogs.map((b, i) => (
                  <motion.div
                    key={b.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="bg-[#111] border border-white/5 rounded-xl p-5 flex items-start gap-4 group hover:border-white/10 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground">{b.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{b.content}</p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500">
                        <span className="uppercase tracking-wider">{b.category?.replace('_', ' ') || 'General'}</span>
                        <span>{b.published_at || 'Draft'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => toggle('blog', b)} className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/5 transition-all cursor-pointer">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setConfirm({ open: true, title: 'Delete Post', message: `Delete "${b.title}"?`, onConfirm: () => deleteBlog(b.id) })} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
                {blogs.length === 0 && <p className="text-sm text-gray-500 text-center py-10">No blog posts yet.</p>}
              </div>
            </motion.div>
          )}

          {/* ────── TESTIMONIALS ────── */}
          {section === 'testimonials' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-heading text-2xl font-semibold text-foreground">Testimonials</h1>
                  <p className="text-xs text-gray-500 mt-1">{testimonials.length} reviews</p>
                </div>
                <button onClick={() => toggle('testimonial')} className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-black text-xs uppercase tracking-widest font-bold rounded-xl transition-all cursor-pointer">
                  <Plus size={14} /> Add Testimonial
                </button>
              </div>

              <div className="space-y-3">
                {testimonials.map((t, i) => (
                  <motion.div
                    key={t.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="bg-[#111] border border-white/5 rounded-xl p-5 flex items-start gap-4 group hover:border-white/10 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">{t.name}</h3>
                        <span className="text-[10px] text-gray-500">— {t.role}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 italic line-clamp-3">"{t.content}"</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => toggle('testimonial', t)} className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/5 transition-all cursor-pointer">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setConfirm({ open: true, title: 'Delete Testimonial', message: `Delete testimonial from ${t.name}?`, onConfirm: () => deleteTestimonial(t.id) })} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
                {testimonials.length === 0 && <p className="text-sm text-gray-500 text-center py-10">No testimonials yet.</p>}
              </div>
            </motion.div>
          )}

          {/* ────── INQUIRIES ────── */}
          {section === 'inquiries' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-heading text-2xl font-semibold text-foreground">Inquiries</h1>
                  <p className="text-xs text-gray-500 mt-1">{inquiries.length} total</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search..."
                      className="pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-foreground placeholder-gray-600 focus:outline-none focus:border-primary/50 w-40"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50 cursor-pointer"
                  >
                    <option value="all" className="bg-[#1a1a1a]">All Status</option>
                    <option value="new" className="bg-[#1a1a1a]">New</option>
                    <option value="contacted" className="bg-[#1a1a1a]">Contacted</option>
                    <option value="converted" className="bg-[#1a1a1a]">Converted</option>
                    <option value="closed" className="bg-[#1a1a1a]">Closed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {inquiries
                  .filter(inq => {
                    if (filterStatus !== 'all' && inq.status !== filterStatus) return false
                    if (search && !inq.name.toLowerCase().includes(search.toLowerCase()) && !inq.email.toLowerCase().includes(search.toLowerCase())) return false
                    return true
                  })
                  .map((inq, i) => (
                    <motion.div
                      key={inq.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                      className="bg-[#111] border border-white/5 rounded-xl p-5 space-y-3 group hover:border-white/10 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${inq.status === 'new' ? 'bg-red-400 animate-pulse' : inq.status === 'contacted' ? 'bg-yellow-400' : inq.status === 'converted' ? 'bg-green-400' : 'bg-gray-500'}`} />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground">{inq.name}</p>
                            <p className="text-[10px] text-gray-500">{inq.email} {inq.phone ? `• ${inq.phone}` : ''}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getScoreColor(inq.score)}`}>
                          Score: {inq.score}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[10px] text-gray-500">
                        {inq.event_type && <span className="flex items-center gap-1"><Calendar size={10} /> {inq.event_type}</span>}
                        {inq.event_date && <span className="flex items-center gap-1"><Clock size={10} /> {inq.event_date}</span>}
                        {inq.budget_range && <span className="flex items-center gap-1">Budget: {inq.budget_range}</span>}
                        {inq.created_at && <span className="flex items-center gap-1"><Calendar size={10} /> {formatDate(inq.created_at)}</span>}
                      </div>

                      <p className="text-xs text-gray-300 bg-white/5 rounded-lg p-3">"{inq.message}"</p>

                      {inq.ai_tags && inq.ai_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {inq.ai_tags.map(tag => (
                            <span key={tag} className="text-[9px] font-mono text-primary bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-full">#{tag}</span>
                          ))}
                        </div>
                      )}

                      {inq.notes && (
                        <div className="text-[10px] text-gray-400 bg-white/5 rounded-lg p-2 border border-white/5">
                          <span className="text-primary font-semibold">Notes:</span> {inq.notes}
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-1">
                        {inq.status !== 'contacted' && (
                          <button onClick={() => updateInquiryStatus(inq.id, 'contacted')} className="px-3 py-1.5 text-[10px] bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-all cursor-pointer flex items-center gap-1">
                            <Phone size={10} /> Mark Contacted
                          </button>
                        )}
                        {inq.status !== 'converted' && (
                          <button onClick={() => updateInquiryStatus(inq.id, 'converted')} className="px-3 py-1.5 text-[10px] bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg transition-all cursor-pointer flex items-center gap-1">
                            <CheckCircle size={10} /> Mark Converted
                          </button>
                        )}
                        {inq.status !== 'closed' && (
                          <button onClick={() => updateInquiryStatus(inq.id, 'closed')} className="px-3 py-1.5 text-[10px] bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 rounded-lg transition-all cursor-pointer flex items-center gap-1">
                            <X size={10} /> Close
                          </button>
                        )}
                        <button onClick={() => {
                          const notes = prompt('Add/edit notes:', inq.notes || '')
                          if (notes !== null) updateInquiryStatus(inq.id, inq.status, notes)
                        }} className="px-3 py-1.5 text-[10px] bg-white/5 text-gray-400 hover:bg-white/10 rounded-lg transition-all cursor-pointer flex items-center gap-1">
                          <FileText size={10} /> Notes
                        </button>
                      </div>
                    </motion.div>
                  ))}
                {inquiries.length === 0 && <p className="text-sm text-gray-500 text-center py-10">No inquiries yet.</p>}
              </div>
            </motion.div>
          )}

          {/* ────── SETTINGS ────── */}
          {section === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mb-8">
                <h1 className="font-heading text-2xl font-semibold text-foreground">Settings</h1>
                <p className="text-xs text-gray-500 mt-1">Manage site configuration</p>
              </div>

              <div className="space-y-4">
                {/* Show Pricing */}
                <div className="bg-[#111] border border-white/5 rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Show Pricing</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Display service prices publicly on the site</p>
                  </div>
                  <button
                    onClick={() => saveSettings({ ...settings, showPricing: !settings.showPricing })}
                    className={`relative w-12 h-6 rounded-full transition-all ${settings.showPricing ? 'bg-primary' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${settings.showPricing ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>

                {/* Admin Users Management */}
                <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Admin Users</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Manage who has access to this panel</p>
                    </div>
                    <button
                      onClick={() => toggle('adminUser')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-black text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all cursor-pointer"
                    >
                      <Plus size={12} /> Add Admin
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(settings.adminUsers || []).map((user: any) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3 border border-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary uppercase">
                            {user.username.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm text-foreground font-medium flex items-center gap-2">
                              {user.username}
                              {user.isMaster && (
                                <span className="text-[8px] uppercase tracking-widest bg-primary/15 text-primary border border-primary/20 px-1.5 py-0.5 rounded-full font-bold">
                                  Master
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-gray-500">••••••••</p>
                          </div>
                        </div>
                        {!user.isMaster && (
                          <button
                            onClick={() => setConfirm({
                              open: true,
                              title: 'Remove Admin',
                              message: `Remove admin "${user.username}"? They will lose access immediately.`,
                              onConfirm: () => {
                                const updated = (settings.adminUsers || []).filter((u: any) => u.id !== user.id)
                                saveSettings({ ...settings, adminUsers: updated })
                              }
                            })}
                            className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    {(!settings.adminUsers || settings.adminUsers.length === 0) && (
                      <p className="text-xs text-gray-500 text-center py-4">No admin users configured.</p>
                    )}
                  </div>
                </div>

                {/* Business Context note */}
                <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Business Context</h3>
                  <p className="text-xs text-gray-500 mb-3">Edit the BUSINESS_CONTEXT.md file to update your brand info used by the AI chat agent.</p>
                  <a href="/BUSINESS_CONTEXT.md" target="_blank" className="text-xs text-primary hover:underline flex items-center gap-1">
                    <ExternalLink size={12} /> View business context file
                  </a>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </main>

      {/* ─── MODALS ─── */}

      {/* Service Form Modal */}
      <Modal open={modal.type === 'service'} onClose={closeModal} title={modal.data ? 'Edit Service' : 'Add Service'}>
        <ServiceForm initial={modal.data} onSave={saveService} onCancel={closeModal} />
      </Modal>

      {/* Portfolio Form Modal */}
      <Modal open={modal.type === 'portfolio'} onClose={closeModal} title={modal.data ? 'Edit Portfolio Item' : 'Add Portfolio Item'}>
        <PortfolioForm initial={modal.data} onSave={savePortfolio} onCancel={closeModal} />
      </Modal>

      {/* Blog Form Modal */}
      <Modal open={modal.type === 'blog'} onClose={closeModal} title={modal.data ? 'Edit Blog Post' : 'Add Blog Post'}>
        <BlogForm initial={modal.data} onSave={saveBlog} onCancel={closeModal} />
      </Modal>

      {/* Testimonial Form Modal */}
      <Modal open={modal.type === 'testimonial'} onClose={closeModal} title={modal.data ? 'Edit Testimonial' : 'Add Testimonial'}>
        <TestimonialForm initial={modal.data} onSave={saveTestimonial} onCancel={closeModal} />
      </Modal>

      {/* Admin User Form Modal */}
      <Modal open={modal.type === 'adminUser'} onClose={closeModal} title="Add Admin User">
        <AdminUserForm onSave={(data) => {
          const updated = [...(settings.adminUsers || []), { ...data, id: 'admin_' + Date.now(), isMaster: false }]
          saveSettings({ ...settings, adminUsers: updated })
        }} onCancel={closeModal} />
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ ...confirm, open: false })}
        onConfirm={confirm.onConfirm}
        title={confirm.title}
        message={confirm.message}
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// FORM COMPONENTS
// ═══════════════════════════════════════════════════════════

function ServiceForm({ initial, onSave, onCancel }: {
  initial?: any; onSave: (data: any) => void; onCancel: () => void
}) {
  const [form, setForm] = useState(initial || {
    name: '', category: 'bridal', starting_price: 300, duration: '3 Hours',
    description: '', popular: false
  })

  const handleChange = (field: string, value: any) => setForm({ ...form, [field]: value })

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <Input label="Service Name" value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g. The Royalty Bridal Package" required />
      <div className="grid grid-cols-2 gap-4">
        <Select label="Category" options={CATEGORY_OPTIONS} value={form.category} onChange={e => handleChange('category', e.target.value)} />
        <Input label="Duration" value={form.duration} onChange={e => handleChange('duration', e.target.value)} placeholder="e.g. 4 Hours" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Starting Price ($)" type="number" value={form.starting_price} onChange={e => handleChange('starting_price', Number(e.target.value))} />
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.popular} onChange={e => handleChange('popular', e.target.checked)} className="accent-primary" />
            <span className="text-xs text-gray-300">Mark as Popular</span>
          </label>
        </div>
      </div>
      <TextArea label="Description" value={form.description} onChange={e => handleChange('description', e.target.value)} rows={3} placeholder="Describe the service..." required />
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 text-xs text-gray-400 hover:text-white transition-all cursor-pointer">Cancel</button>
        <button type="submit" className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-black text-xs uppercase tracking-widest font-bold rounded-xl transition-all cursor-pointer">
          {initial ? 'Update' : 'Create'} Service
        </button>
      </div>
    </form>
  )
}

function PortfolioForm({ initial, onSave, onCancel }: {
  initial?: any; onSave: (data: any) => void; onCancel: () => void
}) {
  const [form, setForm] = useState(initial || {
    title: '', image_url: '', description: '', category: 'Editorial Shoot',
    featured: true, tags: [] as string[], published_at: new Date().toLocaleDateString()
  })

  const handleChange = (field: string, value: any) => setForm({ ...form, [field]: value })

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <Input label="Title" value={form.title} onChange={e => handleChange('title', e.target.value)} placeholder="e.g. Lagos Sunset Editorial" required />
      <ImageUploader label="Image" value={form.image_url} onChange={url => handleChange('image_url', url)} />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Category"
          options={PORTFOLIO_CATEGORIES.map(c => ({ value: c, label: c }))}
          value={form.category}
          onChange={e => handleChange('category', e.target.value)}
        />
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e => handleChange('featured', e.target.checked)} className="accent-primary" />
            <span className="text-xs text-gray-300">Show on Homepage</span>
          </label>
        </div>
      </div>
      <TextArea label="Description" value={form.description} onChange={e => handleChange('description', e.target.value)} rows={3} placeholder="Describe the look..." required />
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 text-xs text-gray-400 hover:text-white transition-all cursor-pointer">Cancel</button>
        <button type="submit" className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-black text-xs uppercase tracking-widest font-bold rounded-xl transition-all cursor-pointer">
          {initial ? 'Update' : 'Create'} Item
        </button>
      </div>
    </form>
  )
}

function BlogForm({ initial, onSave, onCancel }: {
  initial?: any; onSave: (data: any) => void; onCancel: () => void
}) {
  const [form, setForm] = useState(initial || {
    title: '', content: '', category: 'pro_tips', published_at: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  })

  const handleChange = (field: string, value: any) => setForm({ ...form, [field]: value })

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <Input label="Title" value={form.title} onChange={e => handleChange('title', e.target.value)} placeholder="e.g. Bridal Prep Skincare Secrets" required />
      <Select
        label="Category"
        options={BLOG_CATEGORIES.map(c => ({ value: c, label: c.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) }))}
        value={form.category}
        onChange={e => handleChange('category', e.target.value)}
      />
      <TextArea label="Content" value={form.content} onChange={e => handleChange('content', e.target.value)} rows={8} placeholder="Write your blog content here..." required />
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 text-xs text-gray-400 hover:text-white transition-all cursor-pointer">Cancel</button>
        <button type="submit" className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-black text-xs uppercase tracking-widest font-bold rounded-xl transition-all cursor-pointer">
          {initial ? 'Update' : 'Create'} Post
        </button>
      </div>
    </form>
  )
}

function AdminUserForm({ onSave, onCancel }: {
  onSave: (data: any) => void; onCancel: () => void
}) {
  const [form, setForm] = useState({ username: '', password: '' })
  const handleChange = (field: string, value: any) => setForm({ ...form, [field]: value })

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <Input label="Username" value={form.username} onChange={e => handleChange('username', e.target.value)} placeholder="e.g. joann" required />
      <Input label="Password" type="password" value={form.password} onChange={e => handleChange('password', e.target.value)} placeholder="Set a secure password" required />
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 text-xs text-gray-400 hover:text-white transition-all cursor-pointer">Cancel</button>
        <button type="submit" className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-black text-xs uppercase tracking-widest font-bold rounded-xl transition-all cursor-pointer">
          Add Admin
        </button>
      </div>
    </form>
  )
}

function TestimonialForm({ initial, onSave, onCancel }: {
  initial?: any; onSave: (data: any) => void; onCancel: () => void
}) {
  const [form, setForm] = useState(initial || { name: '', role: '', content: '' })
  const handleChange = (field: string, value: any) => setForm({ ...form, [field]: value })

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Client Name" value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g. Sarah Adeleke" required />
        <Input label="Role / Title" value={form.role} onChange={e => handleChange('role', e.target.value)} placeholder="e.g. Bride (Sept 2025)" required />
      </div>
      <TextArea label="Testimonial" value={form.content} onChange={e => handleChange('content', e.target.value)} rows={4} placeholder="What did the client say?" required />
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 text-xs text-gray-400 hover:text-white transition-all cursor-pointer">Cancel</button>
        <button type="submit" className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-black text-xs uppercase tracking-widest font-bold rounded-xl transition-all cursor-pointer">
          {initial ? 'Update' : 'Add'} Testimonial
        </button>
      </div>
    </form>
  )
}
