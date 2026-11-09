import CollectionPage from './CollectionPage.jsx'
import { apiUrl } from '../api.js'

const endpoint = apiUrl(
  'workouts',
  (name) => `https://${name}-8000.app.github.dev/api/workouts/`,
)

export default function Workouts() {
  return (
    <CollectionPage
      title="Workouts"
      resource="workouts"
      endpoint={endpoint}
      emptyMessage="No workout suggestions are available yet."
      renderItem={(workout, index) => (
        <div className="col-12 col-lg-6" key={workout._id ?? index}>
          <article className="item-card h-100">
            <div className="d-flex justify-content-between align-items-start gap-3">
              <h2 className="h5 mb-0">{workout.title ?? 'Untitled workout'}</h2>
              <span className="badge rounded-pill text-bg-success text-capitalize">
                {workout.difficulty ?? 'any level'}
              </span>
            </div>
            <p className="text-secondary mt-3 mb-3">{workout.description ?? ''}</p>
            <div className="item-metrics">
              <span className="text-capitalize">{workout.activityType ?? 'Workout'}</span>
              <span>{workout.durationMinutes ?? '—'} min</span>
            </div>
          </article>
        </div>
      )}
    />
  )
}
