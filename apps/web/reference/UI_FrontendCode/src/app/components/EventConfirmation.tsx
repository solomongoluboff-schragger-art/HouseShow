import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Clock, Users, Music, DollarSign, MapPin, Check, X } from 'lucide-react';

interface EventConfirmationProps {
  onApprove: () => void;
  onReject: () => void;
  onBack: () => void;
}

export function EventConfirmation({ onApprove, onReject, onBack }: EventConfirmationProps) {
  // Mock proposal data
  const proposal = {
    artistName: 'The Violet Echoes',
    eventTitle: 'The Violet Echoes - Indie Night',
    date: '2025-02-15',
    time: '8:00 PM',
    description: 'An intimate evening of ethereal indie rock with haunting vocals and shimmering guitars. Special guest opener TBA.',
    expectedAttendance: 45,
    setLength: 60,
    loadInTime: '6:00 PM',
    technicalRequirements: 'PA system with at least 4 microphone inputs, 2 monitors, basic stage lighting. We bring our own instruments and amps.',
    additionalNotes: 'We\'ll need space for a merch table and would love to bring a photographer. Can we do a guest list of 5 people?',
    visibility: 'public',
    ticketing: 'yes',
    ticketCost: 15,
    artistSplit: 11.25,
    hostSplit: 2.25,
    platformSplit: 1.50
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          ← back to messages
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-black text-foreground mb-2">
            Event Proposal Review
          </h1>
          <p className="text-muted-foreground">
            Review and approve or reject this event proposal
          </p>
        </div>

        {/* Proposal from Artist */}
        <Card className="p-8 mb-6 border-border shadow-xl">
          <div className="mb-6 pb-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">Event Agreement</h2>
                <p className="text-sm text-muted-foreground">Proposed by {proposal.artistName}</p>
              </div>
              <Badge className="bg-accent text-accent-foreground">
                Pending Review
              </Badge>
            </div>
          </div>

          <div className="space-y-6">
            {/* Event Title */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                <Music className="w-4 h-4 text-primary" />
                <span className="text-sm uppercase tracking-wide font-semibold">Event Title</span>
              </div>
              <p className="text-foreground font-semibold">{proposal.eventTitle}</p>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm uppercase tracking-wide font-semibold">Date</span>
                </div>
                <p className="text-foreground font-semibold">{formatDate(proposal.date)}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm uppercase tracking-wide font-semibold">Start Time</span>
                </div>
                <p className="text-foreground font-semibold">{proposal.time}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                <span className="text-sm uppercase tracking-wide font-semibold">Event Description</span>
              </div>
              <p className="text-foreground">{proposal.description}</p>
            </div>

            {/* Expected Attendance */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm uppercase tracking-wide font-semibold">Expected Attendance</span>
              </div>
              <p className="text-foreground font-semibold">{proposal.expectedAttendance} people</p>
            </div>

            {/* Performance Details */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                  <span className="text-sm uppercase tracking-wide font-semibold">Set Length</span>
                </div>
                <p className="text-foreground font-semibold">{proposal.setLength} minutes</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                  <span className="text-sm uppercase tracking-wide font-semibold">Load-in Time</span>
                </div>
                <p className="text-foreground font-semibold">{proposal.loadInTime}</p>
              </div>
            </div>

            {/* Technical Requirements */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                <span className="text-sm uppercase tracking-wide font-semibold">Technical Requirements</span>
              </div>
              <p className="text-foreground">{proposal.technicalRequirements}</p>
            </div>

            {/* Additional Notes */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                <span className="text-sm uppercase tracking-wide font-semibold">Additional Notes</span>
              </div>
              <p className="text-foreground">{proposal.additionalNotes}</p>
            </div>
          </div>
        </Card>

        {/* Financial Agreement */}
        <Card className="p-8 mb-6 border-border shadow-xl">
          <div className="mb-6 pb-4 border-b border-border">
            <h2 className="text-2xl font-bold text-foreground mb-1">Financial Agreement</h2>
            <p className="text-sm text-muted-foreground">Event monetization details</p>
          </div>

          <div className="space-y-6">
            {/* Visibility */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                <span className="text-sm uppercase tracking-wide font-semibold">Event Visibility</span>
              </div>
              <Badge variant="secondary" className="text-sm capitalize">
                {proposal.visibility === 'public' ? 'Public - Listed on houseshow' : 'Link Only - Private event'}
              </Badge>
            </div>

            {/* Ticketing */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                <span className="text-sm uppercase tracking-wide font-semibold">Ticketing</span>
              </div>
              <Badge variant="secondary" className="text-sm">
                {proposal.ticketing === 'yes' ? 'Through houseshow' : 'Independent'}
              </Badge>
            </div>

            {/* Revenue Split */}
            {proposal.ticketing === 'yes' && (
              <div className="bg-secondary/30 p-6 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="text-sm uppercase tracking-wide font-semibold">Revenue Split (per ticket)</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Ticket Price</span>
                    <span className="font-bold text-xl text-foreground">${proposal.ticketCost.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Artist (75%)</span>
                      <span className="font-bold text-foreground">${proposal.artistSplit.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Host (15%)</span>
                      <span className="font-bold text-primary">${proposal.hostSplit.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Platform (10%)</span>
                      <span className="font-bold text-foreground">${proposal.platformSplit.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Projected Revenue */}
                  <div className="bg-card p-4 rounded-lg border border-border mt-4">
                    <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-semibold">
                      Projected Revenue (if sold out)
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Your earnings ({proposal.expectedAttendance} tickets)</span>
                      <span className="font-bold text-xl text-primary">
                        ${(proposal.hostSplit * proposal.expectedAttendance).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={onReject}
            variant="outline"
            className="flex-1 py-6 text-destructive border-destructive hover:bg-destructive/10 font-bold flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Reject Proposal
          </Button>
          <Button
            onClick={onApprove}
            className="flex-1 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Approve & Create Event
          </Button>
        </div>
      </div>
    </div>
  );
}
