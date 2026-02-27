import { MapPin, Users, Music, Home, Bed, Calendar, Star, ChevronLeft, MessageCircle, Check, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useState } from 'react';

interface PastShow {
  id: string;
  artistName: string;
  date: string;
  genre: string;
  image: string;
}

interface HostProfileProps {
  onBack: () => void;
}

export function HostProfile({ onBack }: HostProfileProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock host data
  const host = {
    name: 'Sarah M.',
    memberSince: 'March 2023',
    rating: 4.8,
    totalShows: 23,
    neighborhood: 'Williamsburg',
    city: 'Brooklyn, NY',
    bio: 'Lifelong music lover and DIY scene supporter. My loft has been hosting intimate shows for indie and folk artists for over a year. I believe in creating a welcoming space where artists can connect with fans in an authentic way. BYOB friendly, good vibes only.',
    capacity: 50,
    venueType: 'Spacious Loft',
    artistSleep: true,
    sleepDetails: 'Comfortable pull-out couch and air mattress available',
    topGenres: ['Indie Rock', 'Folk', 'Alternative', 'Dream Pop'],
    amenities: [
      'Built-in PA system',
      'Stage lighting',
      'Green room area',
      'Full kitchen access',
      'Street parking',
      'Subway accessible'
    ],
    images: [
      'https://images.unsplash.com/photo-1591980848793-35f175a0e2d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZpbmclMjByb29tJTIwY29uY2VydHxlbnwxfHx8fDE3NjY1NTA0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1613833641279-8c4f218383a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2Z0JTIwcGVyZm9ybWFuY2UlMjBzcGFjZXxlbnwxfHx8fDE3NjY1NTA0Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1642426028488-04f91c79d233?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwbXVzaWMlMjBzdHVkaW98ZW58MXx8fHwxNzY2NTUwNDI3fDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    availability: 'Weekends preferred, occasional weeknights',
    responseTime: 'Usually responds within 2 hours',
    pastShows: [
      {
        id: '1',
        artistName: 'The Violet Echoes',
        date: 'Dec 2024',
        genre: 'Indie Rock',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMGJhbmQlMjBsaXZlfGVufDF8fHx8MTczNDU1MDQyNnww&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: '2',
        artistName: 'Whisper Valley',
        date: 'Nov 2024',
        genre: 'Folk',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzaW5nZXIlMjBndWl0YXJ8ZW58MXx8fHwxNzM0NTUwNDI2fDA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: '3',
        artistName: 'Silver Threads',
        date: 'Oct 2024',
        genre: 'Dream Pop',
        image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWMlMjBsaXZlfGVufDF8fHx8MTczNDU1MDQyNnww&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: '4',
        artistName: 'The Morning After',
        date: 'Sep 2024',
        genre: 'Alternative',
        image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZCUyMHBlcmZvcm1pbmd8ZW58MXx8fHwxNzM0NTUwNDI2fDA&ixlib=rb-4.1.0&q=80&w=1080'
      }
    ],
    reviews: [
      {
        id: '1',
        artistName: 'The Violet Echoes',
        rating: 5,
        comment: 'Sarah was an incredible host! The space was perfect, great sound system, and the crowd was super engaged. Would love to come back.',
        date: 'Dec 2024'
      },
      {
        id: '2',
        artistName: 'Whisper Valley',
        rating: 5,
        comment: 'One of the best house shows we\'ve played. Sarah took care of everything and made us feel so welcome. The sleeping arrangements were a lifesaver!',
        date: 'Nov 2024'
      },
      {
        id: '3',
        artistName: 'Silver Threads',
        rating: 4,
        comment: 'Great vibes and awesome crowd. Only minor issue was parking but Sarah helped coordinate that. Definitely recommend!',
        date: 'Oct 2024'
      }
    ]
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % host.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + host.images.length) % host.images.length);
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
              src={host.images[currentImageIndex]}
              alt={`${host.name}'s venue`}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Arrows */}
            {host.images.length > 1 && (
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
            {host.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {host.images.map((_, index) => (
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
            <h2 className="text-xl font-bold mb-4 text-foreground">about the venue</h2>
            <p className="text-foreground/90 leading-relaxed mb-4">{host.bio}</p>
            
            {/* Key Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">venue type</p>
                  <p className="text-foreground font-semibold">{host.venueType}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">capacity</p>
                  <p className="text-foreground font-semibold">{host.capacity} people</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">location</p>
                  <p className="text-foreground font-semibold">{host.neighborhood}, {host.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">availability</p>
                  <p className="text-foreground font-semibold">{host.availability}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Amenities */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-bold mb-4 text-foreground">amenities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {host.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-foreground">{amenity}</span>
                </div>
              ))}
            </div>

            {/* Artist Sleep */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <Bed className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-foreground font-semibold mb-1">
                    {host.artistSleep ? 'Artist sleeping available' : 'No artist sleeping'}
                  </p>
                  {host.artistSleep && host.sleepDetails && (
                    <p className="text-sm text-muted-foreground">{host.sleepDetails}</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Past Shows */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-bold mb-4 text-foreground">past shows ({host.pastShows.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {host.pastShows.map((show) => (
                <div key={show.id} className="group cursor-pointer">
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-2">
                    <img
                      src={show.image}
                      alt={show.artistName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="text-sm font-semibold text-foreground line-clamp-1">{show.artistName}</p>
                  <p className="text-xs text-muted-foreground">{show.date}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Reviews */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-bold mb-4 text-foreground">reviews</h2>
            <div className="space-y-4">
              {host.reviews.map((review) => (
                <div key={review.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{review.artistName}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
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

        {/* Right Column - Host Info & Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Host Card */}
          <Card className="p-6 bg-card border-border sticky top-6">
            <div className="text-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {host.name.charAt(0)}
                </span>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-1">{host.name}</h2>
              <p className="text-sm text-muted-foreground mb-3">member since {host.memberSince}</p>
              
              {/* Rating */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="w-5 h-5 fill-primary text-primary" />
                <span className="text-lg font-bold text-foreground">{host.rating}</span>
                <span className="text-sm text-muted-foreground">({host.totalShows} shows)</span>
              </div>

              {/* Response Time */}
              <div className="bg-secondary/50 rounded-lg p-3 mb-4">
                <p className="text-sm text-foreground">
                  <MessageCircle className="w-4 h-4 inline mr-1" />
                  {host.responseTime}
                </p>
              </div>
            </div>

            {/* Preferred Genres */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">preferred genres</p>
              <div className="flex flex-wrap gap-1.5">
                {host.topGenres.map((genre) => (
                  <Badge key={genre} variant="secondary" className="text-xs">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                pitch your show
              </Button>
              <Button variant="outline" className="w-full">
                message host
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
