import { MapPin, Users, Music, Calendar, Star, ChevronLeft, MessageCircle, Check, ExternalLink, Instagram, Globe, Mail } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useState } from 'react';

interface PastShow {
  id: string;
  venueName: string;
  date: string;
  city: string;
  image: string;
}

interface ArtistProfileProps {
  onBack: () => void;
}

export function ArtistProfile({ onBack }: ArtistProfileProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock artist data
  const artist = {
    name: 'The Violet Echoes',
    tagline: 'ethereal indie rock from brooklyn',
    memberSince: 'June 2023',
    rating: 4.9,
    totalShows: 34,
    hometown: 'Brooklyn, NY',
    bio: 'The Violet Echoes craft atmospheric indie rock that blends haunting vocals with shimmering guitar work and dreamy synth textures. Formed in 2021, we\'ve been building a devoted following through intimate house shows and DIY venues across the East Coast. Our sound has been compared to Beach House meets The National, with a raw emotional core that connects deeply in small spaces.',
    members: 3,
    genres: ['Indie Rock', 'Dream Pop', 'Alternative'],
    typicalSetLength: '45-60 minutes',
    willingToTour: true,
    needsSleep: true,
    images: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMGJhbmQlMjBsaXZlfGVufDF8fHx8MTczNDU1MDQyNnww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZCUyMHBlcmZvcm1pbmd8ZW58MXx8fHwxNzM0NTUwNDI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncnVuZ2UlMjBiYW5kfGVufDF8fHx8MTczNDU1MDQyNnww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    technicalNeeds: [
      'Basic PA system (we can bring our own if needed)',
      '3-4 power outlets for amps and pedals',
      'Small performance area (10x10ft minimum)',
      'Load-in access within 1 hour of show'
    ],
    pastShows: [
      {
        id: '1',
        venueName: 'Sarah\'s Loft',
        date: 'Dec 2024',
        city: 'Brooklyn, NY',
        image: 'https://images.unsplash.com/photo-1591980848793-35f175a0e2d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZpbmclMjByb29tJTIwY29uY2VydHxlbnwxfHx8fDE3NjY1NTA0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: '2',
        venueName: 'The Basement Collective',
        date: 'Nov 2024',
        city: 'Philadelphia, PA',
        image: 'https://images.unsplash.com/photo-1757456459561-f65f4aa0cbff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNlbWVudCUyMG11c2ljJTIwdmVudWV8ZW58MXx8fHwxNzY2NTUwNDI2fDA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: '3',
        venueName: 'Garden Sessions',
        date: 'Oct 2024',
        city: 'Boston, MA',
        image: 'https://images.unsplash.com/photo-1757656822215-52e693970e16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWNreWFyZCUyMGNvbmNlcnQlMjB2ZW51ZXxlbnwxfHx8fDE3NjY1NTA0Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: '4',
        venueName: 'Echo Loft',
        date: 'Sep 2024',
        city: 'Providence, RI',
        image: 'https://images.unsplash.com/photo-1613833641279-8c4f218383a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2Z0JTIwcGVyZm9ybWFuY2UlMjBzcGFjZXxlbnwxfHx8fDE3NjY1NTA0Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080'
      }
    ],
    reviews: [
      {
        id: '1',
        hostName: 'Sarah M.',
        rating: 5,
        comment: 'The Violet Echoes were incredible! Professional, respectful of my space, and put on an amazing show. The crowd was completely mesmerized. They helped with setup and cleanup, and were just genuinely lovely people. Would absolutely host them again.',
        date: 'Dec 2024',
        venue: 'Williamsburg, Brooklyn'
      },
      {
        id: '2',
        hostName: 'David K.',
        rating: 5,
        comment: 'One of the best house shows I\'ve ever hosted. The band brought such positive energy and their performance was top-notch. They were also super communicative leading up to the show. 10/10 would recommend.',
        date: 'Nov 2024',
        venue: 'Philadelphia'
      },
      {
        id: '3',
        hostName: 'Emma R.',
        rating: 4,
        comment: 'Great performance and really cool people. Only small note is they ran about 15 minutes over the agreed time, but the show was so good nobody minded! Would definitely book again.',
        date: 'Oct 2024',
        venue: 'Boston'
      }
    ],
    socialLinks: {
      instagram: '@thevioletechoes',
      website: 'thevioletechoes.com',
      bandcamp: 'violetechoes.bandcamp.com',
      spotify: 'The Violet Echoes'
    },
    pressQuotes: [
      {
        quote: 'Hauntingly beautiful and deeply resonant',
        source: 'Brooklyn Vegan'
      },
      {
        quote: 'A must-see live experience',
        source: 'The FADER'
      }
    ],
    upcomingTour: [
      { city: 'Washington DC', date: 'Jan 18' },
      { city: 'Baltimore, MD', date: 'Jan 20' },
      { city: 'Richmond, VA', date: 'Jan 22' }
    ],
    responseTime: 'Usually responds within 3 hours',
    drawSize: '30-50 people typical',
    fanBase: 'Strong Brooklyn following, growing regional presence'
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % artist.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + artist.images.length) % artist.images.length);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button */}
      <Button
        onClick={onBack}
        variant="ghost"
        className="mb-6 -ml-2"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        back to venues
      </Button>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Carousel */}
          <div className="relative aspect-[16/10] bg-muted rounded-lg overflow-hidden group">
            <img
              src={artist.images[currentImageIndex]}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Arrows */}
            {artist.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-border"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-border"
                  aria-label="Next image"
                >
                  <ChevronLeft className="w-5 h-5 rotate-180" />
                </button>
              </>
            )}

            {/* Image Indicators */}
            {artist.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {artist.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'bg-primary w-6'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* About Section */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-bold mb-4 text-foreground">about the artist</h2>
            <p className="text-foreground/90 leading-relaxed mb-4">{artist.bio}</p>
            
            {/* Press Quotes */}
            <div className="mt-6 space-y-3">
              {artist.pressQuotes.map((quote, index) => (
                <div key={index} className="border-l-2 border-primary pl-4 py-2">
                  <p className="text-foreground italic">"{quote.quote}"</p>
                  <p className="text-xs text-muted-foreground mt-1">— {quote.source}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Performance Details */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-bold mb-4 text-foreground">performance details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">band size</p>
                  <p className="text-foreground font-semibold">{artist.members} members</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">set length</p>
                  <p className="text-foreground font-semibold">{artist.typicalSetLength}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">typical draw</p>
                  <p className="text-foreground font-semibold">{artist.drawSize}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">fan base</p>
                  <p className="text-foreground font-semibold">{artist.fanBase}</p>
                </div>
              </div>
            </div>

            {/* Technical Needs */}
            <div className="mt-6">
              <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">technical requirements</h3>
              <div className="space-y-2">
                {artist.technicalNeeds.map((need, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">{need}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">willing to tour</p>
                <p className="text-foreground font-semibold">{artist.willingToTour ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">needs sleeping space</p>
                <p className="text-foreground font-semibold">{artist.needsSleep ? 'Preferred' : 'Not required'}</p>
              </div>
            </div>
          </Card>

          {/* Upcoming Tour Dates */}
          {artist.upcomingTour.length > 0 && (
            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-bold mb-4 text-foreground">upcoming tour dates</h2>
              <div className="space-y-3">
                {artist.upcomingTour.map((show, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-foreground font-semibold">{show.city}</span>
                    </div>
                    <span className="text-muted-foreground">{show.date}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4 italic">Looking to fill these dates with house shows!</p>
            </Card>
          )}

          {/* Past Shows */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-bold mb-4 text-foreground">past shows ({artist.pastShows.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {artist.pastShows.map((show) => (
                <div key={show.id} className="group cursor-pointer">
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-2">
                    <img
                      src={show.image}
                      alt={show.venueName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="text-sm font-semibold text-foreground line-clamp-1">{show.venueName}</p>
                  <p className="text-xs text-muted-foreground">{show.city}</p>
                  <p className="text-xs text-muted-foreground">{show.date}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Reviews from Hosts */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-bold mb-4 text-foreground">host reviews</h2>
            <div className="space-y-4">
              {artist.reviews.map((review) => (
                <div key={review.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{review.hostName}</p>
                      <p className="text-xs text-muted-foreground">{review.venue} • {review.date}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-primary text-primary'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-foreground/90 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Artist Info & Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Artist Card */}
          <Card className="p-6 bg-card border-border sticky top-6">
            <div className="text-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Music className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-1">{artist.name}</h2>
              <p className="text-sm text-muted-foreground mb-1">{artist.tagline}</p>
              <p className="text-xs text-muted-foreground mb-3">from {artist.hometown}</p>
              <p className="text-xs text-muted-foreground">member since {artist.memberSince}</p>
              
              {/* Rating */}
              <div className="flex items-center justify-center gap-2 mt-4 mb-4">
                <Star className="w-5 h-5 fill-primary text-primary" />
                <span className="text-lg font-bold text-foreground">{artist.rating}</span>
                <span className="text-sm text-muted-foreground">({artist.totalShows} shows)</span>
              </div>

              {/* Response Time */}
              <div className="bg-secondary/50 rounded-lg p-3 mb-4">
                <p className="text-sm text-foreground">
                  <MessageCircle className="w-4 h-4 inline mr-1" />
                  {artist.responseTime}
                </p>
              </div>
            </div>

            {/* Genres */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">genres</p>
              <div className="flex flex-wrap gap-1.5">
                {artist.genres.map((genre) => (
                  <Badge key={genre} variant="secondary" className="text-xs">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="mb-6">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">connect</p>
              <div className="space-y-2">
                <a href="#" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors text-sm">
                  <Instagram className="w-4 h-4" />
                  <span>{artist.socialLinks.instagram}</span>
                </a>
                <a href="#" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors text-sm">
                  <Globe className="w-4 h-4" />
                  <span>{artist.socialLinks.website}</span>
                </a>
                <a href="#" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors text-sm">
                  <ExternalLink className="w-4 h-4" />
                  <span>Bandcamp</span>
                </a>
                <a href="#" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors text-sm">
                  <Music className="w-4 h-4" />
                  <span>Spotify</span>
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                book this artist
              </Button>
              <Button variant="outline" className="w-full">
                message artist
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
