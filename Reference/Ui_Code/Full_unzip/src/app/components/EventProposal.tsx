import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Calendar, Clock, Users, Music, DollarSign, Eye, Ticket } from 'lucide-react';

interface EventProposalProps {
  onBack: () => void;
}

export function EventProposal({ onBack }: EventProposalProps) {
  const [visibility, setVisibility] = useState<'link-only' | 'public'>('public');
  const [ticketingEnabled, setTicketingEnabled] = useState<'yes' | 'no'>('yes');
  const [ticketCost, setTicketCost] = useState('');

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
        <h1 className="text-4xl font-black text-foreground mb-2">
          create event proposal
        </h1>
        <p className="text-muted-foreground">
          Pitch your show to Sarah M. at Williamsburg Loft
        </p>
      </div>

      {/* Event Agreement Section */}
      <Card className="p-8 mb-6 border-border shadow-xl">
        <div className="mb-6 pb-4 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground mb-1">Event Agreement</h2>
          <p className="text-sm text-muted-foreground">Basic details about your proposed show</p>
        </div>

        <div className="space-y-6">
          {/* Event Title */}
          <div>
            <Label htmlFor="event-title" className="text-foreground mb-2 flex items-center gap-2">
              <Music className="w-4 h-4 text-primary" />
              Event Title
            </Label>
            <Input
              id="event-title"
              placeholder="e.g., The Violet Echoes - Indie Night"
              className="bg-input-background border-border"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event-date" className="text-foreground mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Proposed Date
              </Label>
              <Input
                id="event-date"
                type="date"
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
                className="bg-input-background border-border"
              />
            </div>
          </div>

          {/* Event Description */}
          <div>
            <Label htmlFor="description" className="text-foreground mb-2">
              Event Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the vibe, what attendees can expect, any special guests or themes..."
              rows={4}
              className="bg-input-background border-border resize-none"
            />
          </div>

          {/* Expected Attendance */}
          <div>
            <Label htmlFor="expected-attendance" className="text-foreground mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Expected Attendance
            </Label>
            <Input
              id="expected-attendance"
              type="number"
              placeholder="e.g., 35"
              className="bg-input-background border-border"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Venue capacity: 50
            </p>
          </div>

          {/* Performance Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="set-length" className="text-foreground mb-2">
                Set Length (minutes)
              </Label>
              <Input
                id="set-length"
                type="number"
                placeholder="e.g., 60"
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
                className="bg-input-background border-border"
              />
            </div>
          </div>

          {/* Technical Requirements */}
          <div>
            <Label htmlFor="tech-requirements" className="text-foreground mb-2">
              Technical Requirements
            </Label>
            <Textarea
              id="tech-requirements"
              placeholder="PA system, microphones, monitors, lighting needs, etc."
              rows={3}
              className="bg-input-background border-border resize-none"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="additional-notes" className="text-foreground mb-2">
              Additional Notes
            </Label>
            <Textarea
              id="additional-notes"
              placeholder="Any other details the host should know (merch table, guest list, parking, etc.)"
              rows={3}
              className="bg-input-background border-border resize-none"
            />
          </div>
        </div>
      </Card>

      {/* Financial Agreement Section */}
      <Card className="p-8 mb-6 border-border shadow-xl">
        <div className="mb-6 pb-4 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground mb-1">Financial Agreement</h2>
          <p className="text-sm text-muted-foreground">How this event will be monetized and promoted</p>
        </div>

        <div className="space-y-6">
          {/* Visibility */}
          <div>
            <Label className="text-foreground mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              Visibility on houseshow?
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setVisibility('link-only')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  visibility === 'link-only'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className="font-semibold text-foreground mb-1">Link Only</div>
                <div className="text-xs text-muted-foreground">
                  Private event - only people with the link can see it
                </div>
              </button>
              <button
                onClick={() => setVisibility('public')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  visibility === 'public'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className="font-semibold text-foreground mb-1">Public</div>
                <div className="text-xs text-muted-foreground">
                  Listed publicly on houseshow for discovery
                </div>
              </button>
            </div>
          </div>

          {/* Ticketing */}
          <div>
            <Label className="text-foreground mb-3 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-primary" />
              Ticketing through houseshow?
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setTicketingEnabled('yes')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  ticketingEnabled === 'yes'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className="font-semibold text-foreground mb-1">Yes</div>
                <div className="text-xs text-muted-foreground">
                  Use houseshow's ticketing system
                </div>
              </button>
              <button
                onClick={() => setTicketingEnabled('no')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  ticketingEnabled === 'no'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className="font-semibold text-foreground mb-1">No</div>
                <div className="text-xs text-muted-foreground">
                  Handle payments independently (Venmo, cash, etc.)
                </div>
              </button>
            </div>
          </div>

          {/* Ticket Cost (conditional) */}
          {ticketingEnabled === 'yes' && (
            <div className="bg-secondary/30 p-6 rounded-lg border border-border">
              <Label htmlFor="ticket-cost" className="text-foreground mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                Ticket Cost
              </Label>
              <div className="relative mb-3">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="ticket-cost"
                  type="number"
                  step="0.01"
                  placeholder="15.00"
                  value={ticketCost}
                  onChange={(e) => setTicketCost(e.target.value)}
                  className="bg-input-background border-border pl-8"
                />
              </div>
              
              {/* Revenue Split Breakdown */}
              <div className="bg-card p-4 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide font-semibold">
                  Revenue Split Preview
                </p>
                {ticketCost && parseFloat(ticketCost) > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Artist (75%)</span>
                      <span className="font-bold text-foreground">
                        ${(parseFloat(ticketCost) * 0.75).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Host (15%)</span>
                      <span className="font-bold text-foreground">
                        ${(parseFloat(ticketCost) * 0.15).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Platform (10%)</span>
                      <span className="font-bold text-foreground">
                        ${(parseFloat(ticketCost) * 0.10).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    Enter a ticket price to see revenue split
                  </p>
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-3 flex items-start gap-2">
                <span className="text-primary font-bold">*</span>
                <span>
                  Houseshow ticketing is automatically distributed 75% to artist, 15% to host, 
                  and 10% to platform at noon the day after the show
                </span>
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-12">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Save as Draft
        </Button>
        <Button
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Send Proposal
        </Button>
      </div>
    </div>
  );
}
