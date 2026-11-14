'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, AudioLines, Bot, Check, ChevronRight, Coins, CreditCard, FolderHeart, Home, LibraryBig, LogOut, Menu, MoreHorizontal, Search, Sparkles, UserRound, Video, WandSparkles, X } from 'lucide-react'
import { signOutAction } from '@/app/actions/auth'
import { ThemeToggle } from '@/components/theme-toggle'

const creations = [
  { name: 'Soft light editorial', style: 'Editorial · Warm', shape: 'avatar-art-1' },
  { name: 'The modern muse', style: 'Studio · Portrait', shape: 'avatar-art-2' },
  { name: 'Quiet confidence', style: 'Minimal · Natural', shape: 'avatar-art-3' },
  { name: 'After the golden hour', style: 'Cinematic · Warm', shape: 'avatar-art-4' },
]

type Feature = {
  label: string
  description: string
  icon: typeof Bot
  art: string
  video?: string
  className: string
  tag: string
}

const features: Feature[] = [
  { label: 'AI Video Agent', description: 'Turn a simple prompt into a polished video, scene by scene.', icon: Bot, art: '/dashboard/video-agent.svg', video: '/dashboard/ai-video-agent.mp4', className: 'bento-agent', tag: 'YOUR IDEAS, IN MOTION' },
  { label: 'AI Video Avatar', description: 'Bring your message to life with a digital presenter.', icon: Video, art: '/dashboard/video-avatar.svg', video: '/dashboard/ai-video-avatar.mp4', className: 'bento-video-avatar', tag: 'A FACE FOR EVERY STORY' },
  { label: 'Avatar', description: 'Create a portrait that feels unmistakably you.', icon: UserRound, art: '/dashboard/avatar.svg', video: '/dashboard/avatar.mp4', className: 'bento-avatar', tag: 'MAKE IT YOURS' },
  { label: 'AI Voice Cloning', description: 'Give every story a voice with your own signature sound.', icon: AudioLines, art: '/dashboard/voice.svg', video: '/dashboard/voice-clone.mp4', className: 'bento-voice', tag: 'SOUND LIKE YOU' },
  { label: 'My Library', description: 'Keep your creations and favorites close at hand.', icon: LibraryBig, art: '/dashboard/library.svg', video: '/dashboard/library.mp4', className: 'bento-library', tag: 'ALL YOUR FAVORITES' },
]

const navigation = [
  { label: 'Home', icon: Home },
  { label: 'AI Video Agent', icon: Bot },
  { label: 'AI Video Avatar', icon: Video },
  { label: 'Avatar', icon: UserRound },
  { label: 'AI Voice Cloning', icon: AudioLines },
  { label: 'My Library', icon: FolderHeart },
]

function BrandMark() {
  return <span className="brand-mark"><Sparkles size={18} strokeWidth={2.4} /></span>
}

function PortraitArtwork({ variant }: { variant: string }) {
  return <div className={`avatar-art ${variant}`} aria-hidden="true"><div className="art-neck" /><div className="art-face" /><div className="art-shoulders" /></div>
}

function AvatarCard({ item, onOpen }: { item: (typeof creations)[number]; onOpen: () => void }) {
  return <button type="button" className="avatar-card" onClick={onOpen} aria-label={`View sample ${item.name}`}>
    <PortraitArtwork variant={item.shape} />
    <span className="avatar-card-info"><span><b>{item.name}</b><small>{item.style} · Sample</small></span><MoreHorizontal size={16} /></span>
  </button>
}

export function StudioDashboard({ email, displayName }: { email: string; displayName?: string }) {
  const [active, setActive] = useState('Home')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState('')
  const name = displayName?.trim() || (email.split('@')[0]?.replace(/[._-]/g, ' ') || 'Creator').replace(/\b\w/g, (letter) => letter.toUpperCase())
  const firstName = name.split(' ')[0]
  const initial = firstName.slice(0, 1).toUpperCase()
  const filteredCreations = useMemo(() => creations.filter((item) => `${item.name} ${item.style}`.toLowerCase().includes(query.toLowerCase())), [query])

  function notify(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 3200)
  }

  function goTo(section: string) {
    setActive(section)
    setSidebarOpen(false)
  }

  const isFeature = features.some((feature) => feature.label === active)
  const heading = active === 'Home' ? `Welcome back, ${firstName}` : active

  return <div className="studio-app dashboard-app">
    <aside className={`studio-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-mobile-brand"><Link className="brand-lockup" href="/" aria-label="Karvix home"><BrandMark /><span>karvix<span className="brand-dot">.</span></span></Link><button type="button" aria-label="Close menu" onClick={() => setSidebarOpen(false)}><X size={17} /></button></div>
      <Link className="brand-lockup sidebar-desktop-brand" href="/" aria-label="Karvix home"><BrandMark /><span>karvix<span className="brand-dot">.</span></span></Link>
      <div className="sidebar-workspace"><span className="workspace-icon">K</span><span className="workspace-meta"><b>My creative space</b><small>Personal workspace</small></span></div>
      <p className="sidebar-label">WORKSPACE</p>
      <nav className="side-nav dashboard-nav" aria-label="Main navigation">
        {navigation.map(({ label, icon: Icon }) => <button type="button" key={label} className={active === label ? 'active' : ''} aria-current={active === label ? 'page' : undefined} onClick={() => goTo(label)}><Icon size={17} /><span>{label}</span>{active === label && <ChevronRight size={14} className="nav-current" />}</button>)}
      </nav>
      <div className="sidebar-spacer" />
      <div className="sidebar-account-tools">
        <button type="button" className={`billing-link ${active === 'Billing settings' ? 'active' : ''}`} onClick={() => goTo('Billing settings')}><span className="footer-tool-icon"><CreditCard size={15} /></span><span>Billing settings</span><ChevronRight size={14} /></button>
        <div className="credit-balance"><span className="footer-tool-icon credit-icon"><Coins size={15} /></span><span><small>Available credits</small><b>120 <em>sample</em></b></span></div>
      </div>
      <div className="sidebar-user"><span className="user-avatar">{initial}</span><span className="sidebar-user-copy"><b>{firstName}</b><small>{email}</small></span><form action={signOutAction}><button type="submit" className="signout-button" aria-label="Sign out" title="Sign out"><LogOut size={15} /></button></form></div>
    </aside>

    <main className="studio-main">
      <header className="studio-topbar">
        <div className="topbar-left"><button type="button" className="mobile-menu" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}><Menu size={17} /></button><span className="breadcrumb-text">Studio <span aria-hidden="true">/</span> <b>{active}</b></span></div>
        <div className="topbar-actions"><ThemeToggle /></div>
      </header>

      <div className="studio-content dashboard-content">
        {active === 'Home' && <>
          <section className="content-heading dashboard-heading"><div><span className="eyebrow"><Sparkles size={13} /> YOUR CREATIVE SPACE</span><h1>{heading}<span className="heading-sparkle" aria-hidden="true">✦</span></h1><p>What would you like to create today?</p></div><span className="dashboard-status"><i /> Your studio is ready</span></section>
          <section className="feature-bento" aria-label="Creative tools">
            {features.map(({ label, description, icon: Icon, art, video, className, tag }) => (
              <button
                type="button"
                className={`feature-tile ${className}`}
                style={{ backgroundImage: `url("${art}")` }}
                key={label}
                onClick={() => goTo(label)}
                aria-label={`Open ${label}: ${description}`}
              >
                {video && (
                  <video
                    className="feature-video"
                    src={video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                    tabIndex={-1}
                  />
                )}
                <span className="feature-shade" aria-hidden="true" />
                <span className="feature-topline"><span className="feature-tag">{tag}</span><span className="feature-arrow"><ArrowUpRightIcon /></span></span>
                <span className="feature-copy"><span className="feature-icon"><Icon size={18} strokeWidth={1.8} /></span><strong>{label}</strong><span className="feature-description">{description}</span></span>
              </button>
            ))}
          </section>
          <div className="dashboard-bottomline"><span><WandSparkles size={15} /> Made for the ideas you can’t wait to share.</span><button type="button" onClick={() => goTo('My Library')}>Your creations <ArrowRight size={14} /></button></div>
        </>}

        {active === 'My Library' && <>
          <section className="content-heading dashboard-heading"><div><span className="eyebrow"><FolderHeart size={13} /> YOUR PERSONAL COLLECTION</span><h1>My Library</h1><p>A considered home for the looks you love.</p></div><span className="demo-badge">Sample library</span></section>
          <label className="library-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search your library" placeholder="Search your creations..." /><span>{filteredCreations.length} samples</span></label>
          {filteredCreations.length ? <div className="avatar-grid library-grid">{filteredCreations.map((item) => <AvatarCard item={item} onOpen={() => notify(`${item.name} is a sample portrait preview.`)} key={item.name} />)}</div> : <div className="empty-state"><span className="empty-state-icon"><Search size={19} /></span><h3>No creations match that search</h3><p>Try another name or style to find something in your sample library.</p></div>}
        </>}

        {isFeature && <>
          <button type="button" className="back-home" onClick={() => goTo('Home')}><ArrowLeft size={15} /> All creative tools</button>
          <section className="feature-preview" style={{ backgroundImage: `linear-gradient(90deg, rgba(17, 14, 27, .90) 0%, rgba(17, 14, 27, .65) 56%, rgba(17, 14, 27, .24) 100%), url("${features.find((feature) => feature.label === active)?.art}")` }}>
            <span className="eyebrow preview-eyebrow"><Sparkles size={13} /> YOUR NEXT CREATIVE TOOL</span><h1>{active}</h1><p>{features.find((feature) => feature.label === active)?.description}</p><span className="coming-soon-pill"><span /> Coming soon</span>
          </section>
          <div className="preview-note"><span className="preview-note-icon"><WandSparkles size={17} /></span><div><b>We’re getting this ready for you.</b><p>This creative tool is on its way. In the meantime, explore the other ideas in your studio.</p></div><button type="button" onClick={() => goTo('Home')}>Explore tools <ArrowRight size={14} /></button></div>
        </>}

        {active === 'Billing settings' && <>
          <button type="button" className="back-home" onClick={() => goTo('Home')}><ArrowLeft size={15} /> Back to home</button>
          <section className="content-heading dashboard-heading"><div><span className="eyebrow"><CreditCard size={13} /> YOUR ACCOUNT</span><h1>Billing settings</h1><p>Manage your plan and keep track of your creative credits.</p></div></section>
          <section className="billing-preview"><div className="billing-preview-top"><span className="billing-large-icon"><Coins size={20} /></span><span className="demo-badge">Demo workspace</span></div><p>Available credits</p><strong>120</strong><span className="billing-sample-note">Sample balance · Billing integration coming soon</span></section>
        </>}
      </div>
    </main>
    {sidebarOpen && <button type="button" className="sidebar-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
    {toast && <div className="studio-toast" role="status"><Check size={15} />{toast}<button type="button" aria-label="Dismiss" onClick={() => setToast('')}><X size={14} /></button></div>}
  </div>
}

function ArrowUpRightIcon() {
  return <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden="true"><path d="M4.2 11.8 11.8 4.2M5 4.2h6.8V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}