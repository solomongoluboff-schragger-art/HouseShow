import { useEffect, useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, MapPin, Ticket, ExternalLink, Copy } from 'lucide-react';
import { getEvent, EventWithDetails } from '../lib/api';

interface TicketConfirmationProps {
  eventId?: string;
  token?: string;
  onBack: () => void;
}

const mockTicketEvent = {
  artistName: 'The Violet Echoes',
  date: 'Friday, January 10',
  time: '8:00 PM',
  location: 'Williamsburg, Brooklyn, NY',
  address: '123 Berry St, Brooklyn, NY 11211',
  price: '$15.00',
};

export function TicketConfirmation({ eventId, token, onBack }: TicketConfirmationProps) {
  const [event, setEvent] = useState<EventWithDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId || !token) {
      return;
    }

    const load = async () => {
      try {
        const data = await getEvent(eventId, token);
        setEvent(data.event);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load ticket details.');
      }
    };
    void load();
  }, [eventId, token]);

  const eventMeta = useMemo(() => {
    if (!event) return null;
    const dateValue = event.proposal?.date ?? event.publishedAt;
    const date = new Date(dateValue).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
    const time = event.proposal?.startTime ?? 'Time TBA';
    const artistName = event.artistProfile?.displayName ?? 'Artist to be announced';
    const location = [event.hostProfile?.neighborhood, event.hostProfile?.city].filter(Boolean).join(', ');
    const price = event.ticketPriceCents
      ? `$${(event.ticketPriceCents / 100).toFixed(2)}`
      : event.ticketingEnabled
        ? 'Price TBA'
        : 'Free';
    return { date, time, artistName, location, price };
  }, [event]);

  const handleCopyAddress = async () => {
    const address = event?.address ?? mockTicketEvent.address;
    if (!address) return;
    await navigator.clipboard.writeText(address);
  };

  if (eventId && token && !event && !error) {
    return <p className="text-muted-foreground">Loading ticket confirmation...</p>;
  }

  const showMock = !eventMeta;
  const meta = showMock
    ? {
        date: mockTicketEvent.date,
        time: mockTicketEvent.time,
        artistName: mockTicketEvent.artistName,
        location: mockTicketEvent.location,
        price: mockTicketEvent.price,
      }
    : eventMeta;

  if (!meta) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-6 text-muted-foreground hover:text-foreground">
        ← back to shows
      </Button>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      <Card className="p-8 border-border shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <Badge className="mb-3 bg-accent text-accent-foreground">ticket confirmed</Badge>
            <h1 className="text-3xl font-black text-foreground mb-2">
              {meta.artistName}
            </h1>
            <p className="text-sm text-muted-foreground">{meta.location || 'Location TBA'}</p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>{meta.date}</p>
            <p>{meta.time}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Date</p>
              <p className="text-foreground font-semibold">{meta.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Ticket className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Ticket</p>
              <p className="text-foreground font-semibold">1 ticket · {meta.price}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Address</p>
              <p className="text-foreground font-semibold">
                {event?.address ?? mockTicketEvent.address}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={onBack} className="bg-primary text-primary-foreground">
            browse more shows
          </Button>
          <Button variant="outline" onClick={handleCopyAddress}>
            <Copy className="w-4 h-4 mr-2" />
            copy address
          </Button>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(event?.address ?? mockTicketEvent.address)}`}
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              open in maps
            </Button>
          </a>
        </div>
      </Card>
    </div>
  );
}
