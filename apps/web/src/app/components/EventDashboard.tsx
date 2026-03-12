import { useEffect, useMemo, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { EventWithDetails } from '../lib/api';
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  Music,
} from 'lucide-react';

interface EventDashboardProps {
  userType: 'artist' | 'host';
  events: EventWithDetails[];
  onBack: () => void;
}

function formatDate(dateValue: string | null | undefined) {
  if (!dateValue) return 'Date TBA';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(value: string | null | undefined) {
  if (!value) return 'Time TBA';
  return value;
}

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
}

export function EventDashboard({ userType, events, onBack }: EventDashboardProps) {
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const aDate = new Date(a.proposal?.date ?? a.publishedAt).getTime();
      const bDate = new Date(b.proposal?.date ?? b.publishedAt).getTime();
      return aDate - bDate;
    });
  }, [events]);

  const [selectedEventId, setSelectedEventId] = useState<string | null>(
    sortedEvents[0]?.id ?? null,
  );

  useEffect(() => {
    if (sortedEvents.length === 0) {
      setSelectedEventId(null);
      return;
    }

    if (!selectedEventId || !sortedEvents.some((event) => event.id === selectedEventId)) {
      setSelectedEventId(sortedEvents[0].id);
    }
  }, [sortedEvents, selectedEventId]);

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null;
    return sortedEvents.find((event) => event.id === selectedEventId) ?? null;
  }, [selectedEventId, sortedEvents]);

  if (sortedEvents.length === 0) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            ← back
          </Button>
          <Card className="p-8 border-border shadow-xl text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">No events yet</h1>
            <p className="text-muted-foreground">
              Once a proposal is confirmed, your events will show up here.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  if (!selectedEvent) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            ← back
          </Button>
          <Card className="p-8 border-border shadow-xl text-center">
            <p className="text-muted-foreground">Select an event to view details.</p>
          </Card>
        </div>
      </div>
    );
  }

  const artistName = selectedEvent.artistProfile?.displayName ?? 'Artist';
  const hostName = selectedEvent.hostProfile?.displayName ?? 'Host';
  const eventTitle =
    selectedEvent.proposal?.title?.trim() ||
    `${artistName} at ${hostName}`;
  const location = [selectedEvent.hostProfile?.neighborhood, selectedEvent.hostProfile?.city]
    .filter(Boolean)
    .join(', ');
  const eventDate = formatDate(selectedEvent.proposal?.date ?? selectedEvent.publishedAt);
  const eventTime = formatTime(selectedEvent.proposal?.startTime ?? null);
  const capacity = selectedEvent.capacity ?? selectedEvent.proposal?.expectedAttendance ?? 0;
  const ticketsSold = selectedEvent.ticketsSold ?? 0;
  const ticketPrice = selectedEvent.ticketPriceCents ? selectedEvent.ticketPriceCents / 100 : 0;
  const revenue = ticketPrice * ticketsSold;
  const earnings = userType === 'artist' ? revenue * 0.75 : revenue * 0.15;
  const soldPercentage = capacity > 0 ? (ticketsSold / capacity) * 100 : 0;
  const ticketingEnabled = selectedEvent.ticketingEnabled;

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          ← back
        </Button>

        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-black text-foreground mb-2">Event Dashboard</h1>
              <p className="text-muted-foreground">Track your upcoming show</p>
            </div>
            <Badge className="bg-accent text-accent-foreground text-sm">
              {ticketingEnabled ? 'live' : 'scheduled'}
            </Badge>
          </div>
        </div>

        {sortedEvents.length > 1 && (
          <Card className="p-6 border-border shadow-xl mb-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Music className="w-4 h-4 text-primary" />
              <p className="text-sm uppercase tracking-wide font-semibold">Your Events</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {sortedEvents.map((event) => {
                const title =
                  event.proposal?.title?.trim() ||
                  `${event.artistProfile?.displayName ?? 'Artist'} at ${event.hostProfile?.displayName ?? 'Host'}`;
                const dateLabel = formatDate(event.proposal?.date ?? event.publishedAt);
                const isSelected = event.id === selectedEventId;
                return (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEventId(event.id)}
                    className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:bg-secondary/30'
                    }`}
                  >
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{dateLabel}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {[event.hostProfile?.neighborhood, event.hostProfile?.city]
                        .filter(Boolean)
                        .join(', ') || 'Location TBA'}
                    </p>
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        <Card className="p-8 mb-6 border-border shadow-xl">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{eventTitle}</h2>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{eventDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{eventTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{location || 'Location TBA'}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="p-6 border-border shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Tickets Sold</p>
                <p className="text-2xl font-black text-foreground">
                  {ticketsSold} {capacity > 0 ? `/ ${capacity}` : ''}
                </p>
              </div>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(soldPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {capacity > 0 ? `${soldPercentage.toFixed(0)}% capacity` : 'Capacity not set'}
            </p>
          </Card>

          <Card className="p-6 border-border shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Your Earnings</p>
                <p className="text-2xl font-black text-foreground">
                  {ticketingEnabled ? formatMoney(earnings) : '$0.00'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3" />
              <span>
                {ticketingEnabled
                  ? userType === 'artist'
                    ? '75% of ticket sales'
                    : '15% of ticket sales'
                  : 'Ticketing disabled'}
              </span>
            </div>
          </Card>

          <Card className="p-6 border-border shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Attendees</p>
                <p className="text-sm font-semibold text-foreground">
                  Ticket holder list coming soon
                </p>
              </div>
            </div>
            <Button
              disabled
              className="w-full bg-primary/60 text-primary-foreground font-semibold cursor-not-allowed"
            >
              message attendees (coming soon)
            </Button>
          </Card>
        </div>

        <Card className="p-8 border-border shadow-xl">
          <h3 className="text-xl font-bold text-foreground mb-3">Ticket Holders</h3>
          <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
            Ticket holder details are not available yet. Once ticketing communications are enabled,
            this list will populate automatically.
          </div>
        </Card>
      </div>
    </div>
  );
}
