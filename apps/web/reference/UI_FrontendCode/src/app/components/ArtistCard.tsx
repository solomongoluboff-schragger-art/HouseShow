import { MapPin, Users, Star, Music, Calendar } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Button } from './ui/button';

export interface Artist {
  id: string;
  name: string;
  tagline: string;
  hometown: string;
  image: string;
  genres: string[];
  memberCount: number;
  rating: number;
  totalShows: number;
  typicalDraw: string;
  availableForHire: boolean;
  needsSleep: boolean;
  upcomingTourDates: { city: string; date: string }[];
}

interface ArtistCardProps {
  artist: Artist;
  onClick?: () => void;
}

export function ArtistCard({ artist, onClick }: ArtistCardProps) {
  return (
    <Card 
      className="group overflow-hidden bg-card border-border hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative cursor-pointer"
      onClick={onClick}
    >
      {/* Hire Me Label */}
      {artist.availableForHire && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-accent text-accent-foreground px-4 py-1.5 text-xs font-bold uppercase tracking-wide shadow-lg transform rotate-0 origin-top-right">
            hire me
          </div>
        </div>
      )}

      {/* Artist Image */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <img
          src={artist.image}
          alt={artist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
        
        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-card/95 px-3 py-1.5 rounded-full border border-border">
          <Star className="w-4 h-4 fill-primary text-primary" />
          <span className="font-bold text-foreground">{artist.rating}</span>
          <span className="text-xs text-muted-foreground">({artist.totalShows})</span>
        </div>
      </div>

      {/* Artist Info */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
            {artist.name}
          </h3>
          <p className="text-sm text-muted-foreground italic mb-2">{artist.tagline}</p>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{artist.hometown}</span>
          </div>
        </div>

        {/* Genres */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {artist.genres.slice(0, 3).map((genre) => (
            <Badge 
              key={genre} 
              variant="secondary"
              className="text-xs bg-secondary text-secondary-foreground"
            >
              {genre}
            </Badge>
          ))}
          {artist.genres.length > 3 && (
            <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
              +{artist.genres.length - 3}
            </Badge>
          )}
        </div>

        {/* Artist Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">band size</p>
              <p className="font-semibold text-foreground">{artist.memberCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">typical draw</p>
              <p className="font-semibold text-foreground">{artist.typicalDraw}</p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between mb-4 text-xs">
          <div className="flex items-center gap-4">
            {artist.needsSleep && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span>needs sleep</span>
              </div>
            )}
            {artist.upcomingTourDates.length > 0 && (
              <div className="flex items-center gap-1 text-accent">
                <Calendar className="w-3 h-3" />
                <span className="font-semibold">on tour</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            view profile
          </Button>
          <Button 
            variant="outline"
            className="flex-1"
          >
            pitch show
          </Button>
        </div>
      </div>
    </Card>
  );
}