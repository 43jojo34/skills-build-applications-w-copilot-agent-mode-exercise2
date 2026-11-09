import CollectionPage from './CollectionPage.jsx'
import { apiUrl } from '../api.js'

const endpoint = apiUrl(
  'users',
  (name) => `https://${name}-8000.app.github.dev/api/users/`,
)

export default function Users() {
  return (
    <CollectionPage
      title="Users"
      resource="users"
      endpoint={endpoint}
      emptyMessage="No users have joined yet."
      renderItem={(user, index) => (
        <div className="col-12 col-lg-6" key={user._id ?? index}>
          <article className="item-card h-100">
            <h2 className="h5 mb-1">{user.fullName ?? user.username ?? 'Unnamed user'}</h2>
            <p className="text-secondary mb-3">{user.email ?? 'No email provided'}</p>
            <span className="badge rounded-pill text-bg-light">
              {user.team?.name ?? 'No team'}
            </span>
          </article>
        </div>
      )}
    />
  )
}
