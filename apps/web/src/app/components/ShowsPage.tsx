interface ShowsPageProps {
  shows?: Show[];
  onBuyTickets?: (showId: string) => void;
}

export function ShowsPage({ onBuyTickets, shows = [] }: ShowsPageProps) {
  return (
    <div>
      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground uppercase tracking-wide">
          {shows.length} upcoming {shows.length === 1 ? 'show' : 'shows'}
        </p>
      </div>

      {/* Shows Grid */}
      {shows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
          No upcoming shows yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shows.map((show) => (
            <ShowCard
              key={show.id}
              show={show}
              onBuyTickets={() => onBuyTickets?.(show.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
