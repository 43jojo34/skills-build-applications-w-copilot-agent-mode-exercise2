import CollectionPage from './CollectionPage.jsx'
import { apiUrl } from '../api.js'

const endpoint = apiUrl(
  'activities',
  (name) => `https://${name}-8000.app.github.dev/api/activities/`,
)

function formatDate(value) {
  if (!value) return 'Date unavailable'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleDateString()
}

export default function Activities() {
  return (
    <CollectionPage
      title="Activities"
      resource="activities"
      endpoint={endpoint}
      emptyMessage="No activities have been recorded yet."
      renderItem={(activity, index) => (
        <div className="col-12 col-lg-6" key={activity._id ?? index}>
          <article className="item-card h-100">
            <div className="d-flex justify-content-between align-items-start gap-3">
              <div>
                <h2 className="h5 mb-1 text-capitalize">{activity.activityType ?? 'Activity'}</h2>
                <p className="text-secondary mb-0">
                  {activity.user?.fullName ?? activity.user?.username ?? 'Unknown athlete'}
                </p>
              </div>
              <span className="badge rounded-pill text-bg-success">{formatDate(activity.date)}</span>
            </div>
            <div className="item-metrics mt-3">
              <span>{activity.durationMinutes ?? '—'} min</span>
              <span>{activity.distanceKm ?? 0} km</span>
            </div>
          </article>
        </div>
      )}
    />
  )
}
