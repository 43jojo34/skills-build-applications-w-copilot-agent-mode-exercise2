import { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'

function EmptyState({ title }) {
  return (
    <section className="content-section">
      <p className="eyebrow">OCTOFIT TRACKER</p>
      <h2>{title}</h2>
      <p className="empty-state">Nothing here yet.</p>
    </section>
  )
}

function Dashboard({ databaseStatus }) {
  return (
    <section className="content-section dashboard-section">
      <div>
        <p className="eyebrow">YOUR TRAINING SPACE</p>
        <h2>Make today count.</h2>
        <p className="empty-state">Your activity will show up here.</p>
      </div>
      <div className="service-status" aria-live="polite">
        <span className={`status-dot ${databaseStatus}`} />
        <span>API {databaseStatus === 'connected' ? 'online' : databaseStatus}</span>
        <span className="status-divider" />
        <span>Database {databaseStatus}</span>
      </div>
    </section>
  )
}

function App() {
  const [databaseStatus, setDatabaseStatus] = useState('checking')

  useEffect(() => {
    let active = true

    fetch('/api/health')
      .then((response) => {
        if (!response.ok) throw new Error('API unavailable')
        return response.json()
      })
      .then((health) => {
        if (active) setDatabaseStatus(health.database)
      })
      .catch(() => {
        if (active) setDatabaseStatus('unavailable')
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="brand" href="/" aria-label="OctoFit Tracker home">
          <img src="/octofitapp-small.png" alt="" />
          <span>OctoFit <strong>Tracker</strong></span>
        </a>
        <span className="header-label">TRAINING DASHBOARD</span>
      </header>

      <main className="container app-main">
        <nav className="app-nav" aria-label="Main navigation">
          <NavLink end to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Overview
          </NavLink>
          <NavLink to="/activities" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Activities
          </NavLink>
          <NavLink to="/teams" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Teams
          </NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard databaseStatus={databaseStatus} />} />
          <Route path="/activities" element={<EmptyState title="Activities" />} />
          <Route path="/teams" element={<EmptyState title="Teams" />} />
          <Route path="*" element={<EmptyState title="Page not found" />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
