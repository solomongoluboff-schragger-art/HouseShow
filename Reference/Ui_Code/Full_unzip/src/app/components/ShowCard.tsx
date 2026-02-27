import { Calendar, Clock, MapPin, Music, DollarSign, Users, Share2, AlertCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Button } from './ui/button';

export interface Show {
  id: string;
  artistName: string;
  date: string;
  time: string;
  neighborhood: string;
  city: string;
  genres: string[];
  price: number;
  capacity: number;
  ticketsSold: number;
  image: string;
  description: string;
  studentOnly: string | null;
  soldOut?: boolean;
}

interface ShowCardProps {
  show: Show;
}

export function ShowCard({ show }: ShowCardProps) {
  const ticketsRemaining = show.capacity - show.ticketsSold;
  const isLowTickets = ticketsRemaining <= 5 && ticketsRemaining > 0;
  const isSoldOut = show.soldOut || ticketsRemaining === 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleShare = () => {
    // Mock share functionality
    if (navigator.share) {
      navigator.share({
        title: `${show.artistName} Live at ${show.neighborhood}`,
        text: `Check out ${show.artistName} performing live!`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group bg-card border-border">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img 
          src={show.image}
          alt={show.artistName}
          className="w-full h-full object-cover"
        />
        
        {/* Student Only Badge */}
        {show.studentOnly && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-accent text-accent-foreground hover:bg-accent/90 border-accent font-semibold">
              {show.studentOnly} students only
            </Badge>
          </div>
        )}

        {/* Sold Out / Low Tickets Badge */}
        {isSoldOut ? (
          <div className="absolute top-3 right-3">
            <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive/90 border-destructive font-semibold">
              sold out
            </Badge>
          </div>
        ) : isLowTickets ? (
          <div className="absolute top-3 right-3">
            <Badge className="bg-orange-600 text-white hover:bg-orange-700 border-orange-600 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              only {ticketsRemaining} left
            </Badge>
          </div>
        ) : null}

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="absolute bottom-3 right-3 p-2 bg-card/90 hover:bg-card border border-border rounded-full transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Share show"
        >
          <Share2 className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 bg-card">
        {/* Artist Name */}
        <h3 className="font-bold text-foreground mb-2">{show.artistName}</h3>

        {/* Description */}
        <p className="text-sm text-foreground/80 mb-3 line-clamp-2">{show.description}</p>

        {/* Date and Time */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5 text-foreground">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{formatDate(show.date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{show.time}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 mb-3">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">
            {show.neighborhood}, {show.city}
          </span>
        </div>

        {/* Genres */}
        <div className="flex items-start gap-1.5 mb-3">
          <Music className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
          <div className="flex flex-wrap gap-1.5">
            {show.genres.map((genre) => (
              <Badge key={genre} variant="secondary" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>
        </div>

        {/* Price and Capacity */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-foreground">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm font-semibold">${show.price}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm">{show.capacity} cap</span>
          </div>
        </div>

        {/* Buy Tickets Button */}
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          disabled={isSoldOut}
        >
          {isSoldOut ? 'sold out' : 'buy tickets'}
        </Button>
      </div>
    </Card>
  );
}
