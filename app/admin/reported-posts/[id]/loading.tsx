export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
          <div>
            <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2"></div>
            <div className="h-4 w-64 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-48 bg-muted animate-pulse rounded-lg"></div>
          <div className="h-64 bg-muted animate-pulse rounded-lg"></div>
        </div>
        <div className="space-y-6">
          <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
          <div className="h-48 bg-muted animate-pulse rounded-lg"></div>
          <div className="h-40 bg-muted animate-pulse rounded-lg"></div>
        </div>
      </div>
    </div>
  )
}
