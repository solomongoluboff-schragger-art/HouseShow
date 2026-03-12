import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Calendar, Clock, Users, Music, DollarSign, Eye, Ticket } from 'lucide-react';
import { getConversation, upsertProposal, sendProposal } from '../lib/api';

interface EventProposalProps {
  conversationId: string;
  authToken: string;
  onBack: () => void;
  onSent: () => void;
}

interface FormState {
  title: string;
  date: string;
  startTime: string;
  description: string;
  expectedAttendance: string;
  setLengthMinutes: string;
  loadInMinutes: string;
  technicalRequirements: string;
  additionalNotes: string;
  visibility: 'link-only' | 'public';
  ticketingEnabled: 'yes' | 'no';
  ticketPrice: string;
}

export function EventProposal({ conversationId, authToken, onBack, onSent }: EventProposalProps) {
  const [state, setState] = useState<FormState>({
    title: '',
    date: '',
    startTime: '',
    description: '',
    expectedAttendance: '',
    setLengthMinutes: '',
    loadInMinutes: '',
    technicalRequirements: '',
    additionalNotes: '',
    visibility: 'public',
    ticketingEnabled: 'yes',
    ticketPrice: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otherParty, setOtherParty] = useState('your connection');

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const data = await getConversation(conversationId, authToken);
        const hostName = data.conversation.hostUser?.hostProfile?.displayName;
        const artistName = data.conversation.artistUser?.artistProfile?.displayName;
        if (active) setOtherParty(hostName || artistName || 'your connection');

        const proposal = data.conversation.proposal;
        if (!proposal || !active) return;

        setState((current) => ({
          ...current,
          title: proposal.title ?? current.title,
          date: proposal.date ? new Date(proposal.date).toISOString().slice(0, 10) : current.date,
          startTime: proposal.startTime ?? current.startTime,
          description: proposal.description ?? current.description,
          expectedAttendance: proposal.expectedAttendance
            ? String(proposal.expectedAttendance)
            : current.expectedAttendance,
          setLengthMinutes: proposal.setLengthMinutes
            ? String(proposal.setLengthMinutes)
            : current.setLengthMinutes,
          loadInMinutes: proposal.loadInMinutes ? toTimeValue(proposal.loadInMinutes) : current.loadInMinutes,
          technicalRequirements: proposal.technicalRequirements ?? current.technicalRequirements,
          additionalNotes: proposal.additionalNotes ?? current.additionalNotes,
          visibility:
            proposal.visibility === 'LINK_ONLY'
              ? 'link-only'
              : 'public',
          ticketingEnabled: proposal.ticketingEnabled ? 'yes' : 'no',
          ticketPrice: proposal.ticketPriceCents
            ? (proposal.ticketPriceCents / 100).toFixed(2)
            : current.ticketPrice,
        }));
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Failed to load proposal draft');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [conversationId, authToken]);

  const update = (key: keyof FormState, value: string) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const toMinutes = (value: string) => {
    if (!value.includes(':')) return undefined;
    const [h, m] = value.split(':');
    const hours = Number.parseInt(h || '0', 10);
    const minutes = Number.parseInt(m || '0', 10);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return undefined;
    return hours * 60 + minutes;
  };

  const buildPayload = () => {
    const parseDate = state.date ? new Date(`${state.date}T00:00:00.000Z`).toISOString() : undefined;
    const payload = {
      title: state.title || undefined,
      date: parseDate,
      startTime: state.startTime || undefined,
      description: state.description || undefined,
      expectedAttendance: state.expectedAttendance ? Number(state.expectedAttendance) : undefined,
      setLengthMinutes: state.setLengthMinutes ? Number(state.setLengthMinutes) : undefined,
      loadInMinutes: toMinutes(state.loadInMinutes),
      technicalRequirements: state.technicalRequirements || undefined,
      additionalNotes: state.additionalNotes || undefined,
      visibility: state.visibility === 'public' ? 'PUBLIC' : 'LINK_ONLY',
      ticketingEnabled: state.ticketingEnabled === 'yes',
      ticketPriceCents: state.ticketPrice ? Math.round(Number(state.ticketPrice) * 100) : undefined,
    };

    if (payload.expectedAttendance !== undefined && Number.isNaN(payload.expectedAttendance)) {
      payload.expectedAttendance = undefined;
    }
    if (payload.setLengthMinutes !== undefined && Number.isNaN(payload.setLengthMinutes)) {
      payload.setLengthMinutes = undefined;
    }
    if (payload.ticketPriceCents !== undefined && Number.isNaN(payload.ticketPriceCents)) {
      payload.ticketPriceCents = undefined;
    }
    return payload;
  };

  const handleSaveDraft = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await upsertProposal(conversationId, buildPayload(), authToken);
      onSent();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save draft');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSend = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await upsertProposal(conversationId, buildPayload(), authToken);
      await sendProposal(conversationId, authToken);
      onSent();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send proposal');
    } finally {
      setSubmitting(false);
    }
  };

  const ticketPriceNum = state.ticketPrice ? Number(state.ticketPrice) : 0;
  const splitArtist = ticketPriceNum * 0.75;
  const splitHost = ticketPriceNum * 0.15;
  const splitPlatform = ticketPriceNum * 0.1;

  return (
    <div className="max-w-4xl mx-auto">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 text-muted-foreground hover:text-foreground"
      >
        ← back
      </Button>

      <div className="mb-8">
        <p className="text-sm text-muted-foreground uppercase tracking-wide">
          Proposal for {otherParty}
        </p>
        <h1 className="text-4xl font-black text-foreground mb-2">
          create event proposal
        </h1>
        <p className="text-muted-foreground">
          Fill in event details and send to host for review.
        </p>
      </div>

      {error ? <p className="text-sm text-destructive mb-4">{error}</p> : null}
      {loading ? <p className="text-muted-foreground mb-4">Loading existing draft...</p> : null}

      <Card className="p-8 mb-6 border-border shadow-xl">
        <h2 className="text-2xl font-bold text-foreground mb-1">Event Agreement</h2>
        <p className="text-sm text-muted-foreground mb-6">Basic details about your proposed show</p>

        <div className="space-y-6">
          <div>
            <Label htmlFor="event-title" className="text-foreground mb-2 flex items-center gap-2">
              <Music className="w-4 h-4 text-primary" />
              Event Title
            </Label>
            <Input
              id="event-title"
              value={state.title}
              onChange={(e) => update('title', e.target.value)}
              className="bg-input-background border-border"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event-date" className="text-foreground mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Proposed Date
              </Label>
              <Input
                id="event-date"
                type="date"
                value={state.date}
                onChange={(e) => update('date', e.target.value)}
                className="bg-input-background border-border"
              />
            </div>
            <div>
              <Label htmlFor="event-time" className="text-foreground mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Start Time
              </Label>
              <Input
                id="event-time"
                type="time"
                value={state.startTime}
                onChange={(e) => update('startTime', e.target.value)}
                className="bg-input-background border-border"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-foreground mb-2">
              Event Description
            </Label>
            <Textarea
              id="description"
              value={state.description}
              onChange={(e) => update('description', e.target.value)}
              className="bg-input-background border-border resize-none"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="expected-attendance" className="text-foreground mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Expected Attendance
            </Label>
            <Input
              id="expected-attendance"
              type="number"
              value={state.expectedAttendance}
              onChange={(e) => update('expectedAttendance', e.target.value)}
              className="bg-input-background border-border"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="set-length" className="text-foreground mb-2">
                Set Length (minutes)
              </Label>
              <Input
                id="set-length"
                type="number"
                value={state.setLengthMinutes}
                onChange={(e) => update('setLengthMinutes', e.target.value)}
                className="bg-input-background border-border"
              />
            </div>
            <div>
              <Label htmlFor="load-in" className="text-foreground mb-2">
                Load-in Time
              </Label>
              <Input
                id="load-in"
                type="time"
                value={state.loadInMinutes}
                onChange={(e) => update('loadInMinutes', e.target.value)}
                className="bg-input-background border-border"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="technical" className="text-foreground mb-2">
              Technical Requirements
            </Label>
            <Textarea
              id="technical"
              value={state.technicalRequirements}
              onChange={(e) => update('technicalRequirements', e.target.value)}
              className="bg-input-background border-border resize-none"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="notes" className="text-foreground mb-2">
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              value={state.additionalNotes}
              onChange={(e) => update('additionalNotes', e.target.value)}
              className="bg-input-background border-border resize-none"
              rows={3}
            />
          </div>
        </div>
      </Card>

      <Card className="p-8 mb-6 border-border shadow-xl">
        <h2 className="text-2xl font-bold text-foreground mb-1">Financial Agreement</h2>
        <p className="text-sm text-muted-foreground mb-6">How this event will be monetized and promoted</p>

        <div className="space-y-6">
          <div>
            <Label className="text-foreground mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              Visibility
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => update('visibility', 'link-only')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  state.visibility === 'link-only' ? 'border-primary bg-primary/10' : 'border-border'
                }`}
              >
                Link Only
              </button>
              <button
                onClick={() => update('visibility', 'public')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  state.visibility === 'public' ? 'border-primary bg-primary/10' : 'border-border'
                }`}
              >
                Public
              </button>
            </div>
          </div>

          <div>
            <Label className="text-foreground mb-3 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-primary" />
              Ticketing
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => update('ticketingEnabled', 'yes')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  state.ticketingEnabled === 'yes' ? 'border-primary bg-primary/10' : 'border-border'
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => update('ticketingEnabled', 'no')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  state.ticketingEnabled === 'no' ? 'border-primary bg-primary/10' : 'border-border'
                }`}
              >
                No
              </button>
            </div>
          </div>

          {state.ticketingEnabled === 'yes' ? (
            <div className="space-y-3">
              <div>
                <Label htmlFor="ticketPrice" className="text-foreground mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  Ticket Price
                </Label>
                <Input
                  id="ticketPrice"
                  type="number"
                  step="0.01"
                  value={state.ticketPrice}
                  onChange={(e) => update('ticketPrice', e.target.value)}
                  className="bg-input-background border-border"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Split preview at current rate: Artist ${(splitArtist).toFixed(2)} / Host ${(splitHost).toFixed(2)} / Platform ${(splitPlatform).toFixed(2)}
              </p>
            </div>
          ) : null}
        </div>
      </Card>

      <div className="flex gap-4 mb-12">
        <Button variant="outline" onClick={handleSaveDraft} disabled={submitting} className="flex-1">
          {submitting ? 'Saving...' : 'Save as Draft'}
        </Button>
        <Button onClick={handleSend} disabled={submitting} className="flex-1">
          {submitting ? 'Sending...' : 'Send Proposal'}
        </Button>
      </div>
    </div>
  );
}

function toTimeValue(minutes: number) {
  const safe = Number.isFinite(minutes) && minutes > 0 ? Math.round(minutes) : 0;
  const hour = Math.floor(safe / 60).toString().padStart(2, '0');
  const minute = (safe % 60).toString().padStart(2, '0');
  return `${hour}:${minute}`;
}
