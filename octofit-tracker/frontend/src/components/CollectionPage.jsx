import useCollection from './useCollection.js'

export default function CollectionPage({ title, resource, emptyMessage, renderItem }) {
  const { items, status, error } = useCollection(resource)

  return (
    <section className="collection-panel card border-0 shadow-sm">
      <div className="card-body p-4 p-md-5">
        <p className="eyebrow mb-2">OCTOFIT TRACKER</p>
        <h1 className="h2 mb-4">{title}</h1>

        {status === 'loading' && (
          <div className="d-flex align-items-center gap-2 text-secondary" role="status">
            <span className="spinner-border spinner-border-sm" aria-hidden="true" />
            Loading {title.toLowerCase()}...
          </div>
        )}
        {status === 'error' && (
          <div className="alert alert-danger mb-0" role="alert">
            Could not load {title.toLowerCase()}: {error}
          </div>
        )}
        {status === 'ready' && items.length === 0 && (
          <p className="empty-state mb-0">{emptyMessage}</p>
        )}
        {status === 'ready' && items.length > 0 && (
          <div className="row g-3">
            {items.map((item, index) => renderItem(item, index))}
          </div>
        )}
      </div>
    </section>
  )
}
