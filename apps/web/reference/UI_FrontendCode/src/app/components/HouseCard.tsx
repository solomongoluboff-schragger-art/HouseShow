import { MapPin, Users, Music, Bed, Heart } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';

export interface House {
  id: string;
  neighborhood: string;
  city: string;
  capacity: number;
  images: string[];
  topGenres: string[];
  artistSleep: boolean;
  hostName: string;
  description: string;
  venueType: 'indoor' | 'outdoor' | 'both';
}

interface HouseCardProps {
  house: House;
  onClick?: () => void;
}

export function HouseCard({ house, onClick }: HouseCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? house.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === house.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-2xl transition-all duration-300 group bg-card border-border cursor-pointer"
      onClick={onClick}
    >
      {/* Image Gallery */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img 
          src={house.images[currentImageIndex]}
          alt={`${house.neighborhood} venue`}
          className="w-full h-full object-cover"
        />
        
        {/* Image Navigation */}
        {house.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card border border-border rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card border border-border rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Image Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {house.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex ? 'bg-primary w-4' : 'bg-muted-foreground/60 w-1.5'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-3 right-3 p-2 bg-card/90 hover:bg-card border border-border rounded-full transition-colors"
          aria-label="Add to favorites"
        >
          <Heart 
            className={`w-5 h-5 ${isFavorited ? 'fill-destructive stroke-destructive' : 'stroke-foreground'}`}
          />
        </button>

        {/* Artist Sleep Badge */}
        {house.artistSleep && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-accent text-accent-foreground hover:bg-accent/90 border-accent">
              <Bed className="w-3 h-3 mr-1" />
              sleep available
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 bg-card">
        {/* Location and Host */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-foreground">{house.neighborhood}</h3>
            <p className="text-sm text-muted-foreground">{house.city}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground/80 mb-3 line-clamp-2">{house.description}</p>

        {/* Capacity & Venue Type */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5 text-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm">{house.capacity}</span>
          </div>
          <Badge variant="outline" className="text-xs border-border text-muted-foreground">
            {house.venueType === 'indoor' ? 'indoor' : house.venueType === 'outdoor' ? 'outdoor' : 'indoor/outdoor'}
          </Badge>
        </div>

        {/* Music Genres */}
        <div className="flex items-start gap-1.5 mb-4">
          <Music className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
          <div className="flex flex-wrap gap-1.5">
            {house.topGenres.map((genre) => (
              <Badge key={genre} variant="secondary" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
          pitch yourself
        </Button>
      </div>
    </Card>
  );
}