import { useEffect, useMemo, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { getConversation, Conversation, Proposal } from '../lib/api';
import { Calendar, Clock, Users, Music, DollarSign, Check, X, Eye, Ticket } from 'lucide-react';

interface EventConfirmationProps {
  conversationId: string;
  authToken: string;
  onApprove: (conversationId: string) => void;
  onReject: (conversationId: string) => void;
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

function toHoursMinutes(minutes: number | null | undefined) {
  if (!minutes || !Number.isFinite(minutes) || minutes <= 0) return null;
  const safe = Math.round(minutes);
  const hours = Math.floor(safe / 60);
  const mins = safe % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

function formatCurrency(value: number | undefined | null) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return '$0.00';
  }

  return `$${value.toFixed(2)}`;
}

function getReadableProposalStatus(status: Proposal['status']) {
  if (status === 'DRAFT') return 'Draft';
  if (status === 'SENT') return 'Sent';
  return 'Confirmed';
}

export function EventConfirmation({
  conversationId,
  authToken,
  onApprove,
  onReject,
  onBack,
}: EventConfirmationProps) {
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getConversation(conversationId, authToken);
        if (controller.signal.aborted) return;
        setConversation(data.conversation);
        setProposal(data.conversation.proposal ?? null);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Failed to load proposal details.');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      controller.abort();
    };
  }, [conversationId, authToken]);

  const eventTitle = useMemo(() => {
    if (!proposal) return 'Event Proposal';
    return proposal.title?.trim() || 'Untitled Event';
  }, [proposal]);

  const artistName = useMemo(() => {
    return conversation?.artistUser?.artistProfile?.displayName ?? 'Artist';
  }, [conversation]);

  const hostName = useMemo(() => {
    return conversation?.hostUser?.hostProfile?.displayName ?? 'Host';
  }, [conversation]);

  const loadInTime = toHoursMinutes(proposal?.loadInMinutes ?? null);
  const dateLabel = formatDate(proposal?.date);
  const startTime = proposal?.startTime?.trim() || 'Time TBA';
  const price = proposal?.ticketPriceCents ? proposal.ticketPriceCents / 100 : 0;
  const expectedAttendance = proposal?.expectedAttendance ?? 0;
  const artistShare = (expectedAttendance > 0 ? price * 0.75 : 0);
  const hostShare = (expectedAttendance > 0 ? price * 0.15 : 0);
  const platformShare = (expectedAttendance > 0 ? price * 0.1 : 0);
  const projectedArtist = (expectedAttendance > 0 ? artistShare * expectedAttendance : 0);
  const projectedHost = (expectedAttendance > 0 ? hostShare * expectedAttendance : 0);
  const hasTicketing = proposal?.ticketingEnabled ?? false;
  const status = proposal?.status;
  const canConfirmOrReject = status === 'SENT';
  const projectedRows = hasTicketing
    ? [
        { label: 'Artist (75%)', value: formatCurrency(artistShare) },
        { label: 'Host (15%)', value: formatCurrency(hostShare) },
        { label: 'Platform (10%)', value: formatCurrency(platformShare) },
      ]
    : [];

  const projectedTotal =
    hasTicketing && expectedAttendance > 0
      ? formatCurrency(projectedArtist + projectedHost + platformShare * expectedAttendance)
      : '$0.00';

  const handleApprove = async () => {
    setActionBusy(true);
    try {
      onApprove(conversationId);
    } finally {
      setActionBusy(false);
    }
  };

  const handleReject = async () => {
    setActionBusy(true);
    try {
      onReject(conversationId);
    } finally {
      setActionBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <p className="text-muted-foreground">Loading proposal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Button variant="ghost" onClick={onBack} className="mb-4 text-muted-foreground hover:text-foreground">
          ← back to messages
        </Button>
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Button variant="ghost" onClick={onBack} className="mb-4 text-muted-foreground hover:text-foreground">
          ← back to messages
        </Button>
        <p className="text-muted-foreground">No proposal attached to this conversation.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          ← back to messages
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-black text-foreground mb-2">Event Proposal Review</h1>
          <p className="text-muted-foreground">
            Review and approve or reject this event proposal from {artistName}
          </p>
        </div>

        <Card className="p-8 border-border shadow-xl">
          <div className="flex items-start justify-between mb-6 border-b border-border pb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">{eventTitle}</h2>
              <p className="text-sm text-muted-foreground">Proposed by {artistName} for {hostName}</p>
            </div>
            <Badge className="bg-accent text-accent-foreground">
              {getReadableProposalStatus(status)}
            </Badge>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Music className="w-4 h-4 text-primary" />
                  <p className="text-sm uppercase tracking-wide font-semibold">Event Title</p>
                </div>
                <p className="text-foreground font-semibold">{eventTitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <p className="text-sm uppercase tracking-wide font-semibold">Date</p>
                  </div>
                  <p className="text-foreground font-semibold">{dateLabel}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <p className="text-sm uppercase tracking-wide font-semibold">Start Time</p>
                  </div>
                  <p className="text-foreground font-semibold">{startTime}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <p className="text-sm uppercase tracking-wide font-semibold">Proposal Status</p>
                </div>
                <p className="text-foreground font-semibold">{getReadableProposalStatus(status)}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Users className="w-4 h-4 text-primary" />
                  <p className="text-sm uppercase tracking-wide font-semibold">Expected Attendance</p>
                </div>
                <p className="text-foreground font-semibold">
                  {expectedAttendance ? `${expectedAttendance} people` : 'Not specified'}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <p className="text-sm uppercase tracking-wide font-semibold">Performance + Load In</p>
                </div>
                <p className="text-foreground font-semibold">
                  Set length: {proposal.setLengthMinutes ? `${proposal.setLengthMinutes} minutes` : 'TBA'}
                  {loadInTime ? ` · Load in: ${loadInTime}` : null}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Eye className="w-4 h-4 text-primary" />
                  <p className="text-sm uppercase tracking-wide font-semibold">Visibility</p>
                </div>
                <p className="text-foreground">
                  {proposal.visibility === 'PUBLIC' ? 'Public listing' : 'Link only'}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Ticket className="w-4 h-4 text-primary" />
                  <p className="text-sm uppercase tracking-wide font-semibold">Ticketing</p>
                </div>
                <p className="text-foreground">
                  {hasTicketing ? `Enabled (${formatCurrency(price)} / ticket)` : 'Not enabled'}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <p className="text-sm uppercase tracking-wide font-semibold">Projected Revenue</p>
                </div>
                <div className="space-y-2">
                  {hasTicketing ? (
                    <>
                      {projectedRows.map((row) => (
                        <div key={row.label} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{row.label}</span>
                          <span className="font-semibold text-foreground">{row.value}</span>
                        </div>
                      ))}
                      <div className="border-t border-border pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Projected Total ({expectedAttendance} tickets)</span>
                          <span className="font-bold text-foreground">{projectedTotal}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not available until ticketing is enabled.</p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <p className="text-sm uppercase tracking-wide font-semibold">Description</p>
                </div>
                <p className="text-sm text-foreground">
                  {proposal.description || 'No event description provided.'}
                </p>
              </div>
            </div>
          </div>

          {proposal.technicalRequirements ? (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm uppercase tracking-wide font-semibold text-muted-foreground mb-2">
                Technical Requirements
              </p>
              <p className="text-sm text-foreground">{proposal.technicalRequirements}</p>
            </div>
          ) : null}

          {proposal.additionalNotes ? (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm uppercase tracking-wide font-semibold text-muted-foreground mb-2">
                Additional Notes
              </p>
              <p className="text-sm text-foreground">{proposal.additionalNotes}</p>
            </div>
          ) : null}
        </Card>

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleReject}
            variant="outline"
            disabled={!canConfirmOrReject || actionBusy}
            className="flex-1 py-6 text-destructive border-destructive hover:bg-destructive/10 font-bold flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            {actionBusy ? 'Submitting...' : 'Reject Proposal'}
          </Button>
          <Button
            onClick={handleApprove}
            disabled={!canConfirmOrReject || actionBusy}
            className="flex-1 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            {actionBusy ? 'Submitting...' : 'Approve & Create Event'}
          </Button>
        </div>
      </div>
    </div>
  );
}
