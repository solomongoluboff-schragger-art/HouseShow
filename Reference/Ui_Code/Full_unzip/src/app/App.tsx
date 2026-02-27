import { useState } from 'react';
import { HomePage } from './components/HomePage';
import { PhoneAuth } from './components/PhoneAuth';
import { ProfileCompletion } from './components/ProfileCompletion';
import { MessagingSystem } from './components/MessagingSystem';
import { EventConfirmation } from './components/EventConfirmation';
import { EventDashboard } from './components/EventDashboard';
import { DeveloperToolbar } from './components/DeveloperToolbar';
import { HouseCard, House } from './components/HouseCard';
import { ArtistCard, Artist } from './components/ArtistCard';
import { ShowsPage } from './components/ShowsPage';
import { HostProfile } from './components/HostProfile';
import { ArtistProfile } from './components/ArtistProfile';
import { EventProposal } from './components/EventProposal';
import { Input } from './components/ui/input';
import { Search, MessageCircle, LogOut, User, AlertCircle, Calendar, Music } from 'lucide-react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Slider } from './components/ui/slider';
import { Switch } from './components/ui/switch';
import { Label } from './components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

type AuthPage = 'home' | 'login' | 'profileCompletion';
type UserType = 'artist' | 'host' | 'fan' | null;
type AppPage = 'venues' | 'artists' | 'shows' | 'hostProfile' | 'artistProfile' | 'eventProposal' | 'messages' | 'eventConfirmation' | 'eventDashboard';

// Mock data for house listings
const mockHouses: House[] = [
  {
    id: '1',
    neighborhood: 'Williamsburg',
    city: 'Brooklyn, NY',
    capacity: 50,
    images: [
      'https://images.unsplash.com/photo-1591980848793-35f175a0e2d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZpbmclMjByb29tJTIwY29uY2VydHxlbnwxfHx8fDE3NjY1NTA0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1613833641279-8c4f218383a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2Z0JTIwcGVyZm9ybWFuY2UlMjBzcGFjZXxlbnwxfHx8fDE3NjY1NTA0Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    topGenres: ['Indie Rock', 'Folk', 'Alternative'],
    artistSleep: true,
    hostName: 'Sarah M.',
    description: 'Spacious loft with great acoustics and a built-in PA system. Perfect for intimate indie shows.',
    venueType: 'indoor'
  },
  {
    id: '2',
    neighborhood: 'East Austin',
    city: 'Austin, TX',
    capacity: 35,
    images: [
      'https://images.unsplash.com/photo-1757656822215-52e693970e16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWNreWFyZCUyMGNvbmNlcnQlMjB2ZW51ZXxlbnwxfHx8fDE3NjY1NTA0Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1694885146901-b1d05cb1f549?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMHBhcnR5JTIwc3BhY2V8ZW58MXx8fHwxNzY2NTUwNDI3fDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    topGenres: ['Country', 'Americana', 'Blues'],
    artistSleep: false,
    hostName: 'Jake R.',
    description: 'Beautiful backyard venue with string lights and covered stage area. Rain or shine setup available.',
    venueType: 'outdoor'
  },
  {
    id: '3',
    neighborhood: 'Silver Lake',
    city: 'Los Angeles, CA',
    capacity: 40,
    images: [
      'https://images.unsplash.com/photo-1642426028488-04f91c79d233?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwbXVzaWMlMjBzdHVkaW98ZW58MXx8fHwxNzY2NTUwNDI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1591980848793-35f175a0e2d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZpbmclMjByb29tJTIwY29uY2VydHxlbnwxfHx8fDE3NjY1NTA0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    topGenres: ['Electronic', 'Experimental', 'Dream Pop'],
    artistSleep: true,
    hostName: 'Maya L.',
    description: 'Converted garage studio with professional sound equipment and lighting. Cozy atmosphere for up to 40 guests.',
    venueType: 'indoor'
  },
];

// Mock data for artist listings
const mockArtists: Artist[] = [
  {
    id: '1',
    name: 'The Violet Echoes',
    tagline: 'ethereal indie rock from brooklyn',
    hometown: 'Brooklyn, NY',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMGJhbmQlMjBsaXZlfGVufDF8fHx8MTczNDU1MDQyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    genres: ['Indie Rock', 'Dream Pop', 'Alternative'],
    memberCount: 3,
    rating: 4.9,
    totalShows: 34,
    typicalDraw: '30-50',
    availableForHire: false,
    needsSleep: true,
    upcomingTourDates: [
      { city: 'Washington DC', date: 'Jan 18' },
      { city: 'Baltimore, MD', date: 'Jan 20' }
    ]
  },
  {
    id: '2',
    name: 'Midnight Circuit',
    tagline: 'electronic beats meet indie sensibility',
    hometown: 'Austin, TX',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZCUyMHBlcmZvcm1pbmd8ZW58MXx8fHwxNzM0NTUwNDI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    genres: ['Electronic', 'Indie Pop', 'Synthwave'],
    memberCount: 2,
    rating: 4.7,
    totalShows: 28,
    typicalDraw: '40-60',
    availableForHire: true,
    needsSleep: false,
    upcomingTourDates: []
  },
  {
    id: '3',
    name: 'Rosewood & Steel',
    tagline: 'bluegrass with an edge',
    hometown: 'Nashville, TN',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY291c3RpYyUyMGJhbmQ8ZW58MXx8fHwxNzM0NTUwNDI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    genres: ['Bluegrass', 'Folk', 'Americana'],
    memberCount: 4,
    rating: 4.8,
    totalShows: 52,
    typicalDraw: '25-40',
    availableForHire: true,
    needsSleep: true,
    upcomingTourDates: [
      { city: 'Louisville, KY', date: 'Jan 15' },
      { city: 'Memphis, TN', date: 'Jan 17' },
      { city: 'Atlanta, GA', date: 'Jan 19' }
    ]
  },
];

export default function App() {
  // Authentication state
  const [authPage, setAuthPage] = useState<AuthPage>('home');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [signupUserType, setSignupUserType] = useState<UserType>(null);
  const [profileCompleted, setProfileCompleted] = useState<boolean>(false);

  // App navigation state
  const [currentPage, setCurrentPage] = useState<AppPage>('shows');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [artistSleepFilter, setArtistSleepFilter] = useState<boolean>(false);
  const [minCapacity, setMinCapacity] = useState<number[]>([0]);
  const [availableForHireFilter, setAvailableForHireFilter] = useState<boolean>(false);
  const [onTourFilter, setOnTourFilter] = useState<boolean>(false);

  // Handlers
  const handleGetStarted = (type: 'artist' | 'host' | 'fan') => {
    setSignupUserType(type);
    setAuthPage('login');
  };

  const handleSignIn = () => {
    setSignupUserType('fan'); // Default to fan if just signing in
    setAuthPage('login');
  };

  const handlePhoneAuthComplete = (phoneNumber: string, isNewUser: boolean) => {
    // Everyone is authenticated as a Fan by default
    setIsAuthenticated(true);
    
    // If they selected Artist or Host from the homepage, show profile completion
    if (signupUserType === 'artist' || signupUserType === 'host') {
      setUserType(signupUserType);
      setProfileCompleted(false);
      setAuthPage('profileCompletion');
    } else {
      // They're a Fan - no profile completion needed
      setUserType('fan');
      setProfileCompleted(true);
      setCurrentPage('shows');
    }
  };

  const handleProfileComplete = (userData: any) => {
    setProfileCompleted(true);
    // Save userData to backend in production
    
    // Navigate to appropriate page
    if (userType === 'artist') {
      setCurrentPage('venues');
    } else if (userType === 'host') {
      setCurrentPage('artists');
    } else {
      setCurrentPage('shows');
    }
  };

  const handleSkipProfileCompletion = () => {
    // Allow users to skip, but they can't message until complete
    if (userType === 'artist') {
      setCurrentPage('venues');
    } else if (userType === 'host') {
      setCurrentPage('artists');
    } else {
      setCurrentPage('shows');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    setProfileCompleted(false);
    setAuthPage('home');
  };

  const handleCreateProposal = (conversationId: string) => {
    setCurrentPage('eventProposal');
  };

  const handleApproveEvent = () => {
    // In production, this would save the event
    alert('Event approved! The show has been created and is now live on houseshow.');
    setCurrentPage('shows');
  };

  const handleRejectEvent = () => {
    // In production, this would notify the artist
    alert('Event proposal rejected. The artist will be notified.');
    setCurrentPage('messages');
  };

  // Developer navigation handler
  const handleDevNavigate = (page: string, devUserType?: 'artist' | 'host' | 'fan') => {
    if (page === 'home') {
      setIsAuthenticated(false);
      setUserType(null);
      setAuthPage('home');
    } else if (page === 'login') {
      setIsAuthenticated(false);
      setSignupUserType(devUserType || null);
      setAuthPage('login');
    } else {
      // Authenticated pages
      if (!isAuthenticated) {
        setIsAuthenticated(true);
        setUserType(devUserType || 'artist');
        setProfileCompleted(true); // Assume complete for dev toolbar navigation
      }
      setCurrentPage(page as AppPage);
    }
  };

  // Get all unique genres and cities
  const allGenres = Array.from(
    new Set(mockHouses.flatMap(house => house.topGenres))
  ).sort();

  const allCities = Array.from(
    new Set(mockHouses.map(house => house.city))
  ).sort();

  const allArtistGenres = Array.from(
    new Set(mockArtists.flatMap(artist => artist.genres))
  ).sort();

  const allArtistCities = Array.from(
    new Set(mockArtists.map(artist => artist.hometown))
  ).sort();

  const maxCapacity = Math.max(...mockHouses.map(h => h.capacity));

  // Filter houses and artists
  const filteredHouses = mockHouses.filter(house => {
    const matchesSearch = house.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         house.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         house.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || house.topGenres.includes(selectedGenre);
    const matchesCity = selectedCity === 'all' || house.city === selectedCity;
    const matchesArtistSleep = !artistSleepFilter || house.artistSleep === true;
    const matchesCapacity = house.capacity >= minCapacity[0];
    
    return matchesSearch && matchesGenre && matchesCity && matchesArtistSleep && matchesCapacity;
  });

  const filteredArtists = mockArtists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artist.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artist.hometown.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || artist.genres.includes(selectedGenre);
    const matchesCity = selectedCity === 'all' || artist.hometown === selectedCity;
    const matchesNeedsSleep = !artistSleepFilter || artist.needsSleep === true;
    const matchesForHire = !availableForHireFilter || artist.availableForHire === true;
    const matchesOnTour = !onTourFilter || artist.upcomingTourDates.length > 0;
    
    return matchesSearch && matchesGenre && matchesCity && matchesNeedsSleep && matchesForHire && matchesOnTour;
  });

  const clearAllFilters = () => {
    setSelectedGenre('all');
    setSelectedCity('all');
    setArtistSleepFilter(false);
    setMinCapacity([0]);
    setAvailableForHireFilter(false);
    setOnTourFilter(false);
  };

  const hasActiveFilters = selectedGenre !== 'all' || selectedCity !== 'all' ||
                          artistSleepFilter || minCapacity[0] > 0 || availableForHireFilter || onTourFilter;

  const hasActiveArtistFilters = selectedGenre !== 'all' || selectedCity !== 'all' ||
                                artistSleepFilter || availableForHireFilter || onTourFilter;

  // Not authenticated - show auth pages
  if (!isAuthenticated) {
    if (authPage === 'home') {
      return (
        <>
          <HomePage onGetStarted={handleGetStarted} onSignIn={handleSignIn} />
          <DeveloperToolbar onNavigate={handleDevNavigate} />
        </>
      );
    }
    
    if (authPage === 'login') {
      return (
        <>
          <PhoneAuth 
            onComplete={handlePhoneAuthComplete} 
            onBack={() => setAuthPage('home')} 
          />
          <DeveloperToolbar onNavigate={handleDevNavigate} />
        </>
      );
    }
    
    if (authPage === 'profileCompletion' && signupUserType) {
      return (
        <>
          <ProfileCompletion 
            userType={signupUserType as 'artist' | 'host' | 'fan'}
            onComplete={handleProfileComplete}
            onSkip={handleSkipProfileCompletion}
          />
          <DeveloperToolbar onNavigate={handleDevNavigate} />
        </>
      );
    }
  }

  // Authenticated users with incomplete profiles
  if (isAuthenticated && !profileCompleted && authPage === 'profileCompletion' && userType !== 'fan') {
    return (
      <>
        <ProfileCompletion 
          userType={userType as 'artist' | 'host'}
          onComplete={handleProfileComplete}
          onSkip={handleSkipProfileCompletion}
        />
        <DeveloperToolbar onNavigate={handleDevNavigate} />
      </>
    );
  }

  // Authenticated - show main app
  // Special pages that don't need main layout
  if (currentPage === 'messages') {
    return (
      <>
        <MessagingSystem 
          userType={userType as 'artist' | 'host'}
          onBack={() => setCurrentPage('shows')}
          onCreateProposal={userType === 'artist' ? handleCreateProposal : undefined}
        />
        <DeveloperToolbar onNavigate={handleDevNavigate} />
      </>
    );
  }

  if (currentPage === 'eventConfirmation') {
    return (
      <>
        <EventConfirmation
          onApprove={handleApproveEvent}
          onReject={handleRejectEvent}
          onBack={() => setCurrentPage('messages')}
        />
        <DeveloperToolbar onNavigate={handleDevNavigate} />
      </>
    );
  }

  if (currentPage === 'eventProposal') {
    return (
      <>
        <EventProposal onBack={() => setCurrentPage('messages')} />
        <DeveloperToolbar onNavigate={handleDevNavigate} />
      </>
    );
  }

  if (currentPage === 'hostProfile') {
    return (
      <>
        <HostProfile onBack={() => setCurrentPage(userType === 'artist' ? 'venues' : (userType === 'host' ? 'artists' : 'shows'))} />
        <DeveloperToolbar onNavigate={handleDevNavigate} />
      </>
    );
  }

  if (currentPage === 'artistProfile') {
    return (
      <>
        <ArtistProfile onBack={() => setCurrentPage(userType === 'host' ? 'artists' : (userType === 'artist' ? 'venues' : 'shows'))} />
        <DeveloperToolbar onNavigate={handleDevNavigate} />
      </>
    );
  }

  if (currentPage === 'eventDashboard') {
    return (
      <>
        <EventDashboard userType={userType as 'artist' | 'host'} onBack={() => setCurrentPage('shows')} />
        <DeveloperToolbar onNavigate={handleDevNavigate} />
      </>
    );
  }

  // Determine the page title based on user type and current page
  let pageTitle = 'upcoming shows';
  if (currentPage === 'venues' && userType === 'artist') {
    pageTitle = 'find venues';
  } else if (currentPage === 'artists' && userType === 'host') {
    pageTitle = 'find artists';
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-black text-foreground tracking-tight">
              house<span className="text-primary">show</span>
            </h1>
            <div className="flex items-center gap-3">
              {/* Browse button - for Artists/Hosts to see their matching page */}
              {userType !== 'fan' && (
                <Button
                  onClick={() => {
                    if (userType === 'artist') setCurrentPage('venues');
                    else if (userType === 'host') setCurrentPage('artists');
                  }}
                  variant={currentPage === 'venues' || currentPage === 'artists' ? 'default' : 'ghost'}
                  className={`font-['Teko',sans-serif] text-lg rounded-sm ${
                    currentPage === 'venues' || currentPage === 'artists'
                      ? 'bg-[#FF6B35] hover:bg-[#ff8555] text-[#0D0D0D]'
                      : 'text-[#E8E6E1] hover:bg-[#1a1a1a] border border-[#2a2a2a]'
                  }`}
                >
                  {userType === 'artist' ? (
                    <><Music className="w-4 h-4 mr-2" />Browse Venues</>
                  ) : (
                    <><Music className="w-4 h-4 mr-2" />Browse Artists</>
                  )}
                </Button>
              )}

              {/* My Events button */}
              <Button
                onClick={() => setCurrentPage('eventDashboard')}
                variant="ghost"
                className="font-['Teko',sans-serif] text-lg text-[#E8E6E1] hover:bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm"
              >
                <Calendar className="w-4 h-4 mr-2" />
                My Events
              </Button>

              {/* Messages button with notification dot */}
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPage('messages')}
                className="relative text-[#E8E6E1] hover:bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF6B35] rounded-full" />
              </Button>

              {/* Profile button with red dot if incomplete */}
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => {
                  // Navigate to profile page based on user type
                  if (userType === 'artist') setCurrentPage('artistProfile');
                  else if (userType === 'host') setCurrentPage('hostProfile');
                }}
                className="relative text-[#E8E6E1] hover:bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm"
              >
                <User className="w-5 h-5" />
                {!profileCompleted && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by neighborhood or university..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 w-full bg-input-background"
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">{/* Added pb-32 for developer toolbar space */}
        {/* Conditional Page Rendering */}
        {currentPage === 'venues' ? (
          <>
            {/* Filters */}
            <div className="mb-8 bg-card border border-border p-6 shadow-xl rounded-lg">
              <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Filters</p>
              
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">City</label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="bg-secondary border-border text-foreground">
                      <SelectValue placeholder="All Cities" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all" className="text-foreground">All Cities</SelectItem>
                      {allCities.map(city => (
                        <SelectItem key={city} value={city} className="text-foreground">{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-[180px]">
                  <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">Genre</label>
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger className="bg-secondary border-border text-foreground">
                      <SelectValue placeholder="All Genres" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all" className="text-foreground">All Genres</SelectItem>
                      {allGenres.map(genre => (
                        <SelectItem key={genre} value={genre} className="text-foreground">{genre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                    Min Capacity: {minCapacity[0]}
                  </label>
                  <Slider
                    value={minCapacity}
                    onValueChange={setMinCapacity}
                    max={maxCapacity}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center gap-2 pb-1">
                  <Label htmlFor="artist-sleep" className="text-xs text-muted-foreground uppercase tracking-wide cursor-pointer">
                    Artist Sleep
                  </Label>
                  <Switch 
                    id="artist-sleep"
                    checked={artistSleepFilter}
                    onCheckedChange={setArtistSleepFilter}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                {filteredHouses.length} {filteredHouses.length === 1 ? 'venue' : 'venues'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHouses.map((house) => (
                <HouseCard 
                  key={house.id} 
                  house={house}
                  onClick={() => setCurrentPage('hostProfile')}
                />
              ))}
            </div>

            {filteredHouses.length === 0 && (
              <div className="text-center py-16 bg-card border border-border rounded-lg">
                <p className="text-muted-foreground">no venues found. try different filters.</p>
              </div>
            )}
          </>
        ) : currentPage === 'artists' ? (
          <>
            <div className="mb-8 bg-card border border-border p-6 shadow-xl rounded-lg">
              <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Filters</p>
              
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">City</label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="bg-secondary border-border text-foreground">
                      <SelectValue placeholder="All Cities" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all" className="text-foreground">All Cities</SelectItem>
                      {allArtistCities.map(city => (
                        <SelectItem key={city} value={city} className="text-foreground">{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-[180px]">
                  <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">Genre</label>
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger className="bg-secondary border-border text-foreground">
                      <SelectValue placeholder="All Genres" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all" className="text-foreground">All Genres</SelectItem>
                      {allArtistGenres.map(genre => (
                        <SelectItem key={genre} value={genre} className="text-foreground">{genre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 pb-1">
                  <Label htmlFor="for-hire" className="text-xs text-muted-foreground uppercase tracking-wide cursor-pointer">
                    For Hire
                  </Label>
                  <Switch 
                    id="for-hire"
                    checked={availableForHireFilter}
                    onCheckedChange={setAvailableForHireFilter}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                <div className="flex items-center gap-2 pb-1">
                  <Label htmlFor="on-tour" className="text-xs text-muted-foreground uppercase tracking-wide cursor-pointer">
                    On Tour
                  </Label>
                  <Switch 
                    id="on-tour"
                    checked={onTourFilter}
                    onCheckedChange={setOnTourFilter}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                <div className="flex items-center gap-2 pb-1">
                  <Label htmlFor="needs-sleep" className="text-xs text-muted-foreground uppercase tracking-wide cursor-pointer">
                    Needs Sleep
                  </Label>
                  <Switch 
                    id="needs-sleep"
                    checked={artistSleepFilter}
                    onCheckedChange={setArtistSleepFilter}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                {hasActiveArtistFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                {filteredArtists.length} {filteredArtists.length === 1 ? 'artist' : 'artists'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtists.map((artist) => (
                <ArtistCard 
                  key={artist.id} 
                  artist={artist}
                  onClick={() => setCurrentPage('artistProfile')}
                />
              ))}
            </div>

            {filteredArtists.length === 0 && (
              <div className="text-center py-16 bg-card border border-border rounded-lg">
                <p className="text-muted-foreground">no artists found. try different filters.</p>
              </div>
            )}
          </>
        ) : (
          <ShowsPage />
        )}
      </div>
      
      <DeveloperToolbar onNavigate={handleDevNavigate} />
    </div>
  );
}