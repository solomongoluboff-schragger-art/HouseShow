import { MapPin, Users, Home, Bed } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { HostProfile as HostProfileData } from '../lib/api';
import { useState } from 'react';

interface HostProfileProps {
  profile: HostProfileData;
  onBack: () => void;
  onEdit?: () => void;
}

export function HostProfile({ profile, onBack, onEdit }: HostProfileProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = profile.images && profile.images.length > 0
    ? profile.images
    : ['/photos/7bca2e83-a717-4819-8ffa-1fb44e15ad32_rw_1920.jpg'];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-foreground hover:text-primary transition-colors font-['Teko',sans-serif] text-xl"
          >
            ← Back
          </button>
          {onEdit && (
            <Button onClick={onEdit} variant="outline">
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
          <Card className="overflow-hidden border-border">
            <div className="relative aspect-[4/3] bg-muted">
              <img
                src={images[currentImageIndex]}
                alt={`${profile.displayName} venue`}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentImageIndex ? 'bg-primary w-4' : 'bg-muted-foreground/60 w-1.5'
                      }`}
                      aria-label={`Show photo ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="p-6">
              <h1 className="text-3xl font-bold text-foreground">{profile.displayName}</h1>
              <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{[profile.neighborhood, profile.city].filter(Boolean).join(', ')}</span>
              </div>
              {profile.bio && (
                <p className="mt-4 text-foreground/90 leading-relaxed">{profile.bio}</p>
              )}
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6 border-border">
              <h2 className="text-lg font-bold text-foreground mb-4">Venue Details</h2>
              <div className="grid gap-3 text-sm text-foreground">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>{profile.capacity ? `${profile.capacity} people` : 'Capacity not set'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-primary" />
                  <span>{profile.venueType ?? 'Venue type not set'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="w-4 h-4 text-primary" />
                  <span>{profile.artistSleep ? 'Artist sleep available' : 'No artist sleep'}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border">
              <h2 className="text-lg font-bold text-foreground mb-4">Top Genres</h2>
              <div className="flex flex-wrap gap-2">
                {(profile.topGenres ?? []).length === 0 && (
                  <span className="text-sm text-muted-foreground">No genres added yet.</span>
                )}
                {(profile.topGenres ?? []).map((genre) => (
                  <Badge key={genre} variant="secondary">{genre}</Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6 border-border">
              <h2 className="text-lg font-bold text-foreground mb-4">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {(profile.amenities ?? []).length === 0 && (
                  <span className="text-sm text-muted-foreground">No amenities listed yet.</span>
                )}
                {(profile.amenities ?? []).map((amenity) => (
                  <Badge key={amenity} variant="outline">{amenity}</Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
