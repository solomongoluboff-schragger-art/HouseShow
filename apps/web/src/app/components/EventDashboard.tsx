import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  MessageSquare, 
  Edit, 
  XCircle,
  Send,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';

interface EventDashboardProps {
  userType: 'artist' | 'host';
  onBack: () => void;
}

interface TicketHolder {
  id: string;
  firstName: string;
  lastInitial: string;
  purchaseDate: string;
  ticketType: string;
}

export function EventDashboard({ userType, onBack }: EventDashboardProps) {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [messageText, setMessageText] = useState('');

  // Mock event data
  const event = {
    title: 'The Violet Echoes - Indie Night',
    artist: 'The Violet Echoes',
    host: 'Sarah M.',
    venue: 'Williamsburg Loft',
    date: '2025-02-15',
    time: '8:00 PM',
    location: 'Williamsburg, Brooklyn, NY',
    capacity: 50,
    ticketsSold: 32,
    ticketPrice: 15,
    artistEarnings: 360,
    hostEarnings: 72,
    status: 'live'
  };

  // Mock ticket holders
  const ticketHolders: TicketHolder[] = [
    { id: '1', firstName: 'Emily', lastInitial: 'S', purchaseDate: '2025-01-10', ticketType: 'General' },
    { id: '2', firstName: 'Michael', lastInitial: 'J', purchaseDate: '2025-01-11', ticketType: 'General' },
    { id: '3', firstName: 'Sarah', lastInitial: 'K', purchaseDate: '2025-01-12', ticketType: 'General' },
    { id: '4', firstName: 'David', lastInitial: 'L', purchaseDate: '2025-01-12', ticketType: 'General' },
    { id: '5', firstName: 'Jessica', lastInitial: 'M', purchaseDate: '2025-01-13', ticketType: 'General' },
    { id: '6', firstName: 'Chris', lastInitial: 'B', purchaseDate: '2025-01-13', ticketType: 'General' },
    { id: '7', firstName: 'Amanda', lastInitial: 'W', purchaseDate: '2025-01-14', ticketType: 'General' },
    { id: '8', firstName: 'Ryan', lastInitial: 'T', purchaseDate: '2025-01-14', ticketType: 'General' },
    { id: '9', firstName: 'Nicole', lastInitial: 'P', purchaseDate: '2025-01-15', ticketType: 'General' },
    { id: '10', firstName: 'Brandon', lastInitial: 'H', purchaseDate: '2025-01-15', ticketType: 'General' },
    { id: '11', firstName: 'Lauren', lastInitial: 'D', purchaseDate: '2025-01-16', ticketType: 'General' },
    { id: '12', firstName: 'Kevin', lastInitial: 'R', purchaseDate: '2025-01-16', ticketType: 'General' },
    { id: '13', firstName: 'Megan', lastInitial: 'F', purchaseDate: '2025-01-17', ticketType: 'General' },
    { id: '14', firstName: 'Alex', lastInitial: 'G', purchaseDate: '2025-01-17', ticketType: 'General' },
    { id: '15', firstName: 'Taylor', lastInitial: 'C', purchaseDate: '2025-01-18', ticketType: 'General' },
    { id: '16', firstName: 'Jordan', lastInitial: 'N', purchaseDate: '2025-01-18', ticketType: 'General' },
    { id: '17', firstName: 'Ashley', lastInitial: 'V', purchaseDate: '2025-01-19', ticketType: 'General' },
    { id: '18', firstName: 'Matt', lastInitial: 'Z', purchaseDate: '2025-01-19', ticketType: 'General' },
    { id: '19', firstName: 'Rachel', lastInitial: 'Y', purchaseDate: '2025-01-20', ticketType: 'General' },
    { id: '20', firstName: 'Tyler', lastInitial: 'X', purchaseDate: '2025-01-20', ticketType: 'General' },
    { id: '21', firstName: 'Olivia', lastInitial: 'Q', purchaseDate: '2025-01-21', ticketType: 'General' },
    { id: '22', firstName: 'Ethan', lastInitial: 'A', purchaseDate: '2025-01-21', ticketType: 'General' },
    { id: '23', firstName: 'Sophia', lastInitial: 'E', purchaseDate: '2025-01-22', ticketType: 'General' },
    { id: '24', firstName: 'Daniel', lastInitial: 'I', purchaseDate: '2025-01-22', ticketType: 'General' },
    { id: '25', firstName: 'Madison', lastInitial: 'O', purchaseDate: '2025-01-23', ticketType: 'General' },
    { id: '26', firstName: 'Jake', lastInitial: 'U', purchaseDate: '2025-01-23', ticketType: 'General' },
    { id: '27', firstName: 'Emma', lastInitial: 'W', purchaseDate: '2025-01-24', ticketType: 'General' },
    { id: '28', firstName: 'Noah', lastInitial: 'R', purchaseDate: '2025-01-24', ticketType: 'General' },
    { id: '29', firstName: 'Ava', lastInitial: 'T', purchaseDate: '2025-01-25', ticketType: 'General' },
    { id: '30', firstName: 'Liam', lastInitial: 'Y', purchaseDate: '2025-01-25', ticketType: 'General' },
    { id: '31', firstName: 'Isabella', lastInitial: 'U', purchaseDate: '2025-01-26', ticketType: 'General' },
    { id: '32', firstName: 'Mason', lastInitial: 'I', purchaseDate: '2025-01-26', ticketType: 'General' },
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      alert(`Message sent to all ${event.ticketsSold} ticket holders!`);
      setMessageText('');
      setShowMessageModal(false);
    }
  };

  const handleCancelEvent = () => {
    if (confirm('Are you sure you want to cancel this event? All ticket holders will be refunded.')) {
      alert('Event cancelled. All attendees have been notified and refunded.');
      onBack();
    }
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

  const soldPercentage = (event.ticketsSold / event.capacity) * 100;

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
              <h1 className="text-4xl font-black text-foreground mb-2">
                Event Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your upcoming show
              </p>
            </div>
            <Badge className="bg-accent text-accent-foreground text-sm">
              {event.status}
            </Badge>
          </div>
        </div>

        {/* Event Info Card */}
        <Card className="p-8 mb-6 border-border shadow-xl">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{event.title}</h2>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelEvent}
                className="flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Cancel Event
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Ticket Sales Card */}
          <Card className="p-6 border-border shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Tickets Sold</p>
                <p className="text-2xl font-black text-foreground">{event.ticketsSold} / {event.capacity}</p>
              </div>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${soldPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {soldPercentage.toFixed(0)}% capacity
            </p>
          </Card>

          {/* Revenue Card */}
          <Card className="p-6 border-border shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {userType === 'artist' ? 'Your Earnings' : 'Your Earnings'}
                </p>
                <p className="text-2xl font-black text-foreground">
                  ${userType === 'artist' ? event.artistEarnings : event.hostEarnings}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3" />
              <span>{userType === 'artist' ? '75%' : '15%'} of ticket sales</span>
            </div>
          </Card>

          {/* Message Card */}
          <Card className="p-6 border-border shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Communication</p>
                <p className="text-sm font-semibold text-foreground">Message Attendees</p>
              </div>
            </div>
            <Button
              onClick={() => setShowMessageModal(true)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Send Message
            </Button>
          </Card>
        </div>

        {/* Ticket Holders List */}
        <Card className="p-8 border-border shadow-xl">
          <h3 className="text-xl font-bold text-foreground mb-6">Ticket Holders</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                    #
                  </th>
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                    Purchase Date
                  </th>
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                    Ticket Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {ticketHolders.map((holder, index) => (
                  <tr key={holder.id} className="border-b border-border/50 hover:bg-secondary/20">
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-foreground">
                      {holder.firstName} {holder.lastInitial}.
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {new Date(holder.purchaseDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {holder.ticketType}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-card/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full p-8 border-border shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Message All Attendees</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMessageModal(false)}
              >
                <XCircle className="w-5 h-5" />
              </Button>
            </div>

            <div className="mb-4">
              <Label className="text-foreground mb-2">
                Message will be sent to {event.ticketsSold} ticket holders
              </Label>
              <Textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message here..."
                className="bg-input-background border-border resize-none h-40"
              />
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowMessageModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Message
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-card/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full p-8 border-border shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Edit Event</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditModal(false)}
              >
                <XCircle className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <Label className="text-foreground mb-2">Event Title</Label>
                <Input
                  defaultValue={event.title}
                  className="bg-input-background border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-foreground mb-2">Date</Label>
                  <Input
                    type="date"
                    defaultValue={event.date}
                    className="bg-input-background border-border"
                  />
                </div>
                <div>
                  <Label className="text-foreground mb-2">Time</Label>
                  <Input
                    type="time"
                    defaultValue="20:00"
                    className="bg-input-background border-border"
                  />
                </div>
              </div>

              <div>
                <Label className="text-foreground mb-2">Description</Label>
                <Textarea
                  className="bg-input-background border-border resize-none"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  alert('Event updated!');
                  setShowEditModal(false);
                }}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                Save Changes
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
