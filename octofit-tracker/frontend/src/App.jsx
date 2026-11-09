import { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import { apiUrl } from './api.js'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'

const navigation = [
  { to: '/', label: 'Overview', end: true },
  { to: '/activities', label: 'Activities' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/teams', label: 'Teams' },
  { to: '/users', label: 'Users' },
  { to: '/workouts', label: 'Workouts' },
]

function Dashboard({ databaseStatus }) {
  return (
    <section className="dashboard-panel card border-0 shadow-sm">
      <div className="card-body d-flex flex-column flex-md-row justify-content-between gap-4">
        <div>
          <p className="eyebrow mb-2">YOUR TRAINING SPACE</p>
          <h1 className="h2 mb-2">Make today count.</h1>
          <p className="text-secondary mb-0">Track activity, find your team, and keep moving forward.</p>
        </div>
        <div className="service-status align-self-md-center" aria-live="polite">
          <span className={`status-dot ${databaseStatus}`} />
          <span>API {databaseStatus === 'connected' || databaseStatus === 'disconnected' ? 'online' : databaseStatus}</span>
          <span className="status-divider" />
          <span>Database {databaseStatus}</span>
        </div>
      </div>
    </section>
  )
}

function NotFound() {
  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body py-5 text-center">
        <p className="eyebrow">OCTOFIT TRACKER</p>
        <h1 className="h3">Page not found</h1>
        <NavLink to="/" className="btn btn-success mt-3">Return to overview</NavLink>
      </div>
    </section>
  )
}

function App() {
  const [databaseStatus, setDatabaseStatus] = useState('checking')

  useEffect(() => {
    const controller = new AbortController()

    fetch(apiUrl('health'), { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Health check failed (${response.status})`)
        return response.json()
      })
      .then((health) => setDatabaseStatus(health.database ?? 'unknown'))
      .catch((error) => {
        if (error.name !== 'AbortError') setDatabaseStatus('unavailable')
      })

    return () => controller.abort()
  }, [])

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container d-flex align-items-center justify-content-between gap-3">
          <NavLink className="brand" to="/" aria-label="OctoFit Tracker home">
            <img src="/octofitapp-small.png" alt="" />
            <span>OctoFit <strong>Tracker</strong></span>
          </NavLink>
          <span className="header-label d-none d-sm-inline">TRAINING DASHBOARD</span>
        </div>
      </header>

      <main className="container app-main">
        <nav className="app-nav nav nav-pills mb-4" aria-label="Main navigation">
          {navigation.map(({ to, label, end }) => (
            <NavLink
              key={to}
              end={end}
              to={to}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard databaseStatus={databaseStatus} />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
