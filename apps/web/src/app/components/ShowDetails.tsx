import { useEffect, useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, MapPin, Ticket, Users, DollarSign, Clock } from 'lucide-react';
import { EventWithDetails, getEvent } from '../lib/api';

interface ShowDetailsProps {
  eventId: string;
  token?: string;
  onBack: () => void;
  onBuyTickets?: (eventId: string) => void;
}

function formatDate(value: string | null | undefined) {
  if (!value) return 'Date TBA';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ShowDetails({ eventId, token, onBack, onBuyTickets }: ShowDetailsProps) {
  const [event, setEvent] = useState<EventWithDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const data = await getEvent(eventId, token);
        if (!active) return;
        setEvent(data.event);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Unable to load show details.');
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [eventId, token]);

  const meta = useMemo(() => {
    if (!event) return null;
    const artistName = event.artistProfile?.displayName ?? 'Artist';
    const hostName = event.hostProfile?.displayName ?? 'Host';
    const title = event.proposal?.title?.trim() || `${artistName} at ${hostName}`;
    const date = formatDate(event.proposal?.date ?? event.publishedAt);
    const time = event.proposal?.startTime ?? 'Time TBA';
    const location = [event.hostProfile?.neighborhood, event.hostProfile?.city]
      .filter(Boolean)
      .join(', ');
    const description = event.proposal?.description ?? 'Details coming soon.';
    const ticketPrice = event.ticketPriceCents ? event.ticketPriceCents / 100 : 0;
    const priceLabel = event.ticketingEnabled
      ? ticketPrice > 0
        ? `$${ticketPrice.toFixed(2)}`
        : 'Price TBA'
      : 'Free';
    const capacity = event.capacity ?? event.proposal?.expectedAttendance ?? 0;
    const ticketsSold = event.ticketsSold ?? 0;
    const soldOut = capacity > 0 && ticketsSold >= capacity;
    return {
      artistName,
      hostName,
      title,
      date,
      time,
      location: location || 'Location TBA',
      description,
      priceLabel,
      capacity,
      ticketsSold,
      soldOut,
      address: event.address,
      ticketingEnabled: event.ticketingEnabled,
    };
  }, [event]);

  if (loading) {
    return <p className="text-muted-foreground">Loading show details...</p>;
  }

  if (error) {
    return (
      <div className="text-muted-foreground">
        <Button variant="ghost" onClick={onBack} className="mb-4 text-muted-foreground hover:text-foreground">
          ← back to shows
        </Button>
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!meta) {
    return <p className="text-muted-foreground">Show details are unavailable.</p>;
  }

  const canBuyTickets = Boolean(onBuyTickets && meta.ticketingEnabled && !meta.soldOut);

  return (
    <div className="max-w-5xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-6 text-muted-foreground hover:text-foreground">
        ← back to shows
      </Button>

      <Card className="p-8 border-border shadow-xl">
        <div className="flex items-start justify-between mb-6 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-black text-foreground mb-2">{meta.title}</h1>
            <p className="text-sm text-muted-foreground">
              {meta.artistName} · hosted by {meta.hostName}
            </p>
          </div>
          <Badge className="bg-accent text-accent-foreground">
            {meta.ticketingEnabled ? (meta.soldOut ? 'sold out' : 'tickets available') : 'no ticketing'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm">{meta.date}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm">{meta.time}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm">{meta.location}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Ticket className="w-4 h-4 text-primary" />
              <span className="text-sm">{meta.priceLabel}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm">
                {meta.capacity > 0 ? `${meta.ticketsSold} / ${meta.capacity} tickets` : `${meta.ticketsSold} tickets`}
              </span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-sm">
                {meta.ticketingEnabled ? 'Ticketing enabled' : 'Tickets not required'}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">About this show</p>
          <p className="text-foreground leading-relaxed">{meta.description}</p>
        </div>

        <div className="mb-8">
          <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Address</p>
          <p className="text-foreground leading-relaxed">
            {meta.address || 'Address shared after confirmation.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={onBack} variant="outline" className="border-border">
            back to shows
          </Button>
          {onBuyTickets && (
            <Button
              onClick={() => onBuyTickets(eventId)}
              className="bg-primary text-primary-foreground"
              disabled={!canBuyTickets}
            >
              {meta.soldOut ? 'sold out' : meta.ticketingEnabled ? 'buy ticket' : 'ticketing disabled'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
