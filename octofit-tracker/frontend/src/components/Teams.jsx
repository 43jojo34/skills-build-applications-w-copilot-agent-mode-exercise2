import CollectionPage from './CollectionPage.jsx'

export default function Teams() {
  return (
    <CollectionPage
      title="Teams"
      resource="teams"
      emptyMessage="No teams have been created yet."
      renderItem={(team, index) => (
        <div className="col-12 col-lg-6" key={team._id ?? index}>
          <article className="item-card h-100">
            <div className="d-flex justify-content-between align-items-start gap-3">
              <h2 className="h5 mb-0">{team.name ?? 'Unnamed team'}</h2>
              <span className="badge rounded-pill text-bg-light">
                {team.members?.length ?? 0} members
              </span>
            </div>
            {team.members?.length > 0 && (
              <p className="text-secondary mt-3 mb-0">
                {team.members
                  .map((member) => member.fullName ?? member.username ?? 'Team member')
                  .join(', ')}
              </p>
            )}
          </article>
        </div>
      )}
    />
  )
}
