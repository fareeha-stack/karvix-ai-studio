'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, ArrowUpRight, Bell, Check, ChevronDown, Clock3, Compass, FolderHeart, Grid2X2, Layers3, LogOut, Menu, MoreHorizontal, Search, Settings2, ShieldCheck, Sparkles, WandSparkles, X } from 'lucide-react'
import { signOutAction } from '@/app/actions/auth'
import { ThemeToggle } from '@/components/theme-toggle'

const creations = [
  { name: 'Soft light editorial', style: 'Editorial · Warm', shape: 'avatar-art-1', time: 'Just now' },
  { name: 'The modern muse', style: 'Studio · Portrait', shape: 'avatar-art-2', time: 'Yesterday' },
  { name: 'Quiet confidence', style: 'Minimal · Natural', shape: 'avatar-art-3', time: 'Yesterday' },
  { name: 'After the golden hour', style: 'Cinematic · Warm', shape: 'avatar-art-4', time: 'Oct 28' },
]

const navigation = [
  { label: 'Overview', icon: Grid2X2 },
  { label: 'Avatar library', icon: FolderHeart, count: '24' },
  { label: 'Inspirations', icon: Compass },
]

function PortraitArtwork({ variant }: { variant: string }) {
  return <div className={`avatar-art ${variant}`} aria-hidden="true"><div className="art-neck" /><div className="art-face" /><div className="art-shoulders" /></div>
}

function BrandMark() {
  return <span className="brand-mark"><Sparkles size={18} strokeWidth={2.4} /></span>
}

function AvatarCard({ item, onOpen }: { item: (typeof creations)[number]; onOpen: () => void }) {
  return <button type="button" className="avatar-card" onClick={onOpen} aria-label={`View sample ${item.name}`}>
    <PortraitArtwork variant={item.shape} />
    <span className="avatar-card-info"><span><b>{item.name}</b><small>{item.style} · Sample</small></span><MoreHorizontal size={16} /></span>
  </button>
}

export function StudioDashboard({ email, displayName }: { email: string; displayName?: string }) {
  const [active, setActive] = useState('Overview')
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

  const title = active === 'Overview' ? 'Overview' : active
  return <div className="studio-app">
    <aside className={`studio-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-mobile-brand"><a className="brand-lockup" href="/" onClick={(event) => event.preventDefault()}><BrandMark /><span>karvix<span className="brand-dot">.</span></span></a><button type="button" aria-label="Close menu" onClick={() => setSidebarOpen(false)}><X size={17} /></button></div>
      <a className="brand-lockup sidebar-desktop-brand" href="/" onClick={(event) => event.preventDefault()}><BrandMark /><span>karvix<span className="brand-dot">.</span></span></a>
      <div className="sidebar-workspace"><span className="workspace-icon">K</span><span className="workspace-meta"><b>My creative space</b><small>Personal workspace</small></span><ChevronDown size={14} color="var(--muted-foreground)" /></div>
      <p className="sidebar-label">WORKSPACE</p>
      <nav className="side-nav" aria-label="Main navigation">
        {navigation.map(({ label, icon: Icon, count }) => <button type="button" key={label} className={active === label ? 'active' : ''} onClick={() => goTo(label)}><Icon size={16} /><span>{label}</span>{count && <small className="nav-count">{count}</small>}</button>)}
      </nav>
      <p className="sidebar-label sidebar-tools-label">PREFERENCES</p>
      <nav className="side-nav" aria-label="Preferences">
        <button type="button" className={active === 'Account settings' ? 'active' : ''} onClick={() => goTo('Account settings')}><Settings2 size={16} /><span>Account settings</span></button>
      </nav>
      <div className="sidebar-spacer" />
      <div className="sidebar-upgrade"><span className="upgrade-icon"><WandSparkles size={16} /></span><b>A little inspiration?</b><p>Find a fresh direction for your next portrait.</p><button type="button" onClick={() => goTo('Inspirations')}>Explore ideas <ArrowRight size={12} /></button></div>
      <div className="sidebar-user"><span className="user-avatar">{initial}</span><span className="sidebar-user-copy"><b>{firstName}</b><small>{email}</small></span><form action={signOutAction}><button type="submit" className="signout-button" aria-label="Sign out" title="Sign out"><LogOut size={15} /></button></form></div>
    </aside>

    <main className="studio-main">
      <header className="studio-topbar">
        <div className="topbar-left"><button type="button" className="mobile-menu" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}><Menu size={17} /></button><span className="breadcrumb-text">Studio <span aria-hidden="true">/</span> <b>{title}</b></span></div>
        <div className="topbar-actions"><label className="topbar-search"><Search size={15} /><input value={query} onChange={(event) => { setQuery(event.target.value); if (event.target.value) setActive('Avatar library') }} aria-label="Search your avatar library" placeholder="Search your studio..." /><kbd>⌘ K</kbd></label><button type="button" className="notification-button" aria-label="Notifications" onClick={() => notify('You’re all caught up.') }><Bell size={16} /><i /></button><ThemeToggle /></div>
      </header>

      <div className="studio-content">
        {active === 'Overview' && <>
          <section className="content-heading"><div><span className="eyebrow">YOUR CREATIVE SPACE</span><h1>Good to see you, {firstName} <span aria-hidden="true">✦</span></h1><p>Your creative corner is ready when you are.</p></div><div className="heading-actions"><span className="demo-badge"><span>•</span> Demo workspace</span></div></section>
          <section className="dashboard-hero"><div className="hero-copy"><span className="eyebrow"><Sparkles size={13} /> A NEW CREATIVE CHAPTER</span><h2>Your ideas, in full color.</h2><p>Shape your next look with a little imagination. Browse sample portraits and find the style that feels like you.</p><button type="button" className="primary-button" onClick={() => goTo('Inspirations')}>Explore creative ideas <ArrowRight size={15} /></button></div><div className="hero-sparkles"><div className="hero-ring" /><div className="hero-portrait"><PortraitArtwork variant="avatar-art-4" /></div><div className="hero-chip"><Sparkles size={12} /> Studio preview</div></div></section>
          <section className="stats-grid" aria-label="Workspace overview">
            <div className="stat-card"><div className="stat-top"><span>Saved portraits</span><span className="stat-icon"><FolderHeart size={15} /></span></div><strong>24</strong><small>Sample data</small></div>
            <div className="stat-card"><div className="stat-top"><span>Collections</span><span className="stat-icon"><Layers3 size={15} /></span></div><strong>06</strong><small>Sample data</small></div>
            <div className="stat-card"><div className="stat-top"><span>Recent activity</span><span className="stat-icon"><Clock3 size={15} /></span></div><strong>Today</strong><small>Workspace active</small></div>
            <div className="stat-card"><div className="stat-top"><span>Privacy</span><span className="stat-icon"><ShieldCheck size={15} /></span></div><strong>Private</strong><small>Always yours</small></div>
          </section>
          <section>
            <div className="dashboard-section-heading"><div><h3>Recently explored</h3><p>A few starting points from your sample library.</p></div><button type="button" onClick={() => goTo('Avatar library')}>View library <ArrowUpRight size={13} /></button></div>
            <div className="avatar-grid">{creations.map((item) => <AvatarCard item={item} onOpen={() => notify(`${item.name} is a sample portrait preview.`)} key={item.name} />)}</div>
          </section>
        </>}

        {active === 'Avatar library' && <>
          <section className="content-heading"><div><span className="eyebrow">YOUR PERSONAL COLLECTION</span><h1>Avatar library</h1><p>A considered home for the looks you love.</p></div><div className="heading-actions"><span className="demo-badge">Sample library</span></div></section>
          <div className="dashboard-section-heading"><div><h3>All portraits</h3><p>{filteredCreations.length} sample {filteredCreations.length === 1 ? 'portrait' : 'portraits'}</p></div><button type="button" onClick={() => { setQuery(''); notify('Showing all sample portraits.') }}>Clear search</button></div>
          {filteredCreations.length ? <div className="avatar-grid">{filteredCreations.map((item) => <AvatarCard item={item} onOpen={() => notify(`${item.name} is a sample portrait preview.`)} key={item.name} />)}</div> : <div className="empty-state"><span className="empty-state-icon"><Search size={19} /></span><h3>No portraits match that search</h3><p>Try another style or name to find a sample in your library.</p></div>}
        </>}

        {active === 'Inspirations' && <>
          <section className="content-heading"><div><span className="eyebrow">A SPARK FOR WHAT’S NEXT</span><h1>Find your next look</h1><p>Explore the mood, color, and character behind each sample.</p></div><span className="demo-badge">Creative preview</span></section>
          <section className="dashboard-hero inspiration-hero"><div className="hero-copy"><span className="eyebrow"><Sparkles size={13} /> THE STUDIO IS YOURS</span><h2>Start with a feeling.</h2><p>Warm editorial light, candid film, modern studio portraiture — follow a direction and make it your own.</p><button type="button" className="primary-button" onClick={() => notify('Live avatar creation is not connected in this demo workspace.')}>Preview generator <ArrowRight size={15} /></button></div><div className="hero-sparkles"><div className="hero-ring" /><div className="hero-portrait"><PortraitArtwork variant="avatar-art-2" /></div><div className="hero-chip"><Sparkles size={12} /> Sample direction</div></div></section>
          <div className="dashboard-section-heading"><div><h3>Portrait directions</h3><p>Sample looks to help shape an idea.</p></div></div>
          <div className="avatar-grid">{creations.map((item) => <AvatarCard item={item} onOpen={() => notify(`“${item.style}” is a sample direction.`)} key={item.name} />)}</div>
        </>}

        {active === 'Account settings' && <>
          <section className="content-heading"><div><span className="eyebrow">YOUR CREATIVE SPACE</span><h1>Account settings</h1><p>Manage how you experience Karvix Studio.</p></div></section>
          <section className="settings-card"><div className="settings-avatar"><span className="user-avatar">{initial}</span><div><h3>{firstName}</h3><p>{email}</p></div></div><div className="settings-row"><span><b>Appearance</b><small>Choose a theme that feels comfortable.</small></span><ThemeToggle /></div><div className="settings-row"><span><b>Account security</b><small>Your account is protected by InsForge authentication.</small></span><span className="settings-status"><ShieldCheck size={14} /> Active</span></div><div className="settings-row"><span><b>Workspace</b><small>Personal creative space · Demo content</small></span><span className="demo-badge">Preview</span></div><form action={signOutAction} className="settings-signout"><button type="submit" className="secondary-button"><LogOut size={14} /> Sign out</button></form></section>
        </>}
      </div>
    </main>
    {sidebarOpen && <button type="button" className="sidebar-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
    {toast && <div className="studio-toast" role="status"><Check size={15} />{toast}<button type="button" aria-label="Dismiss" onClick={() => setToast('')}><X size={14} /></button></div>}
  </div>
}

