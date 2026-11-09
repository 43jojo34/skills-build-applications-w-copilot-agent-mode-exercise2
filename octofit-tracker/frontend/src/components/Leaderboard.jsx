import CollectionPage from './CollectionPage.jsx'
import { apiUrl } from '../api.js'

const endpoint = apiUrl(
  'leaderboard',
  (name) => `https://${name}-8000.app.github.dev/api/leaderboard/`,
)

export default function Leaderboard() {
  return (
    <CollectionPage
      title="Leaderboard"
      resource="leaderboard"
      endpoint={endpoint}
      emptyMessage="The leaderboard is waiting for its first score."
      renderItem={(entry, index) => (
        <div className="col-12 col-lg-6" key={entry._id ?? index}>
          <article className="item-card h-100 d-flex align-items-center gap-3">
            <span className="rank-badge">{index + 1}</span>
            <div className="flex-grow-1">
              <h2 className="h5 mb-1">
                {entry.user?.fullName ?? entry.user?.username ?? 'Unknown athlete'}
              </h2>
              <p className="text-secondary mb-0">{entry.period ?? 'Current period'}</p>
            </div>
            <strong className="score-value">{entry.points ?? 0} pts</strong>
          </article>
        </div>
      )}
    />
  )
}
