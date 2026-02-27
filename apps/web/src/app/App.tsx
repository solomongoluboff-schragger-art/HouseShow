import { useEffect, useMemo, useState } from 'react';
import { HomePage } from './components/HomePage';
import { AccountCreation } from './components/AccountCreation';
import { PhoneAuth } from './components/PhoneAuth';
import { ProfileCompletion } from './components/ProfileCompletion';
import { MessagingSystem } from './components/MessagingSystem';
import { EventConfirmation } from './components/EventConfirmation';
import { EventDashboard } from './components/EventDashboard';
import { HouseCard, House } from './components/HouseCard';
import { ArtistCard, Artist } from './components/ArtistCard';
import { ShowsPage } from './components/ShowsPage';
import { HostProfile } from './components/HostProfile';
import { ArtistProfile } from './components/ArtistProfile';
import { TicketConfirmation } from './components/TicketConfirmation';
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
import {
  ArtistProfile as ArtistProfileData,
  HostProfile as HostProfileData,
  createArtistProfile,
  createHostProfile,
  getMyArtistProfile,
  getMyHostProfile,
  listArtists,
  listHosts,
  loginWithFirebase,
  updateArtistProfile,
  updateHostProfile,
  updateMe,
} from "./lib/api";

type AuthPage = 'home' | 'login' | 'signup' | 'profileCompletion';
type UserType = 'artist' | 'host' | 'fan' | null;
type AppPage = 'venues' | 'artists' | 'shows' | 'hostProfile' | 'artistProfile' | 'editProfile' | 'eventProposal' | 'messages' | 'eventConfirmation' | 'eventDashboard' | 'ticketConfirmation';

export default function App() {
  // Authentication state
  const [authPage, setAuthPage] = useState<AuthPage>('home');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [signupUserType, setSignupUserType] = useState<UserType>(null);
  const [profileCompleted, setProfileCompleted] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [artistProfile, setArtistProfile] = useState<ArtistProfileData | null>(null);
  const [hostProfile, setHostProfile] = useState<HostProfileData | null>(null);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState<boolean>(false);
  const [editingProfileType, setEditingProfileType] = useState<UserType>(null);

  // App navigation state
  const [currentPage, setCurrentPage] = useState<AppPage>('shows');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [artistSleepFilter, setArtistSleepFilter] = useState<boolean>(false);
  const [minCapacity, setMinCapacity] = useState<number[]>([0]);
  const [availableForHireFilter, setAvailableForHireFilter] = useState<boolean>(false);
  const [onTourFilter, setOnTourFilter] = useState<boolean>(false);
  const [selectedShowId, setSelectedShowId] = useState<string | null>(null);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (stored) {
      setAuthToken(stored);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const loadListings = async () => {
      try {
        const [artistRes, hostRes] = await Promise.all([listArtists(), listHosts()]);
        if (!active) return;
        const fallbackImage = "/photos/7bca2e83-a717-4819-8ffa-1fb44e15ad32_rw_1920.jpg";
        const mappedArtists: Artist[] = artistRes.artists.map((artist) => ({
          id: artist.id,
          name: artist.displayName,
          tagline: artist.tagline ?? '',
          hometown: artist.hometown ?? '',
          image: artist.imageUrl ?? artist.images?.[0] ?? fallbackImage,
          genres: artist.genres ?? [],
          memberCount: artist.memberCount ?? 1,
          rating: artist.rating ?? 0,
          totalShows: artist.totalShows ?? 0,
          typicalDraw: artist.typicalDraw ?? '',
          availableForHire: artist.availableForHire ?? false,
          needsSleep: artist.needsSleep ?? false,
          upcomingTourDates: artist.upcomingTourDates ?? [],
        }));

        const mappedHouses: House[] = hostRes.hosts.map((host) => ({
          id: host.id,
          neighborhood: host.neighborhood ?? '',
          city: host.city ?? '',
          capacity: host.capacity ?? 0,
          images: host.images && host.images.length > 0 ? host.images : [fallbackImage],
          topGenres: host.topGenres ?? [],
          artistSleep: host.artistSleep ?? false,
          hostName: host.displayName,
          description: host.bio ?? '',
          venueType: (host.venueType as House['venueType']) ?? 'indoor',
        }));

        setArtists(mappedArtists);
        setHouses(mappedHouses);
      } catch {
        if (!active) return;
        setArtists([]);
        setHouses([]);
      }
    };

    loadListings();
    return () => {
      active = false;
    };
  }, []);

  const saveAuthToken = (token: string) => {
    setAuthToken(token);
    setIsAuthenticated(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  };

  // Handlers
  const handleGetStarted = (type: 'artist' | 'host' | 'fan') => {
    setSignupUserType(type);
    setAuthPage('login');
  };

  const handleSignIn = () => {
    setSignupUserType('fan'); // Default to fan if just signing in
    setAuthPage('login');
  };

  const handlePhoneAuthComplete = async (
    phoneNumber: string,
    isNewUser: boolean,
    idToken: string
  ) => {
    setIsLoadingProfiles(true);
    try {
      const auth = await loginWithFirebase(idToken);
      saveAuthToken(auth.token);

      const nextUserType = signupUserType ?? 'fan';

      if (isNewUser) {
        setUserType(nextUserType);
        setProfileCompleted(false);
        setAuthPage('signup');
        return;
      }

      let resolvedType: UserType = nextUserType;
      let host: HostProfileData | null = null;
      let artist: ArtistProfileData | null = null;

      try {
        const hostRes = await getMyHostProfile(auth.token);
        host = hostRes.profile;
      } catch {
        host = null;
      }

      try {
        const artistRes = await getMyArtistProfile(auth.token);
        artist = artistRes.profile;
      } catch {
        artist = null;
      }

      if (host) resolvedType = 'host';
      else if (artist) resolvedType = 'artist';
      else resolvedType = 'fan';

      setHostProfile(host);
      setArtistProfile(artist);
      setUserType(resolvedType);
      setProfileCompleted(Boolean(host || artist || resolvedType === 'fan'));

      if (resolvedType === 'artist') {
        setCurrentPage('venues');
      } else if (resolvedType === 'host') {
        setCurrentPage('artists');
      } else {
        setCurrentPage('shows');
      }
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  const handleProfileComplete = (userData: any) => {
    handleAccountCreationComplete({ ...userData, userType });
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

  const handleAccountCreationComplete = async (userData: any) => {
    if (!authToken) return;
    setIsLoadingProfiles(true);

    try {
      if (userData.email) {
        await updateMe({ email: userData.email }, authToken);
      }

      if (userData.userType === 'artist') {
        const genres = userData.genres
          ? String(userData.genres)
              .split(',')
              .map((g: string) => g.trim())
              .filter(Boolean)
          : [];

        const images = (userData.images ?? []).map((img: any) => img.url);
        const profileImage = (userData.images ?? []).find((img: any) => img.isProfile)?.url;

        const payload = {
          displayName: userData.bandName || userData.name,
          tagline: userData.tagline,
          bio: userData.bio,
          hometown: userData.hometown,
          genres,
          imageUrl: profileImage,
          images,
          memberCount: userData.memberCount ? Number(userData.memberCount) : undefined,
          typicalDraw: userData.typicalDraw,
          availableForHire: userData.availableForHire ?? false,
          needsSleep: userData.needsSleep ?? false,
          spotifyArtistId: userData.spotifyLink,
          instagramUrl: userData.instagramLink,
          websiteUrl: userData.websiteLink,
          appleMusicUrl: userData.appleMusicLink,
        };

        let profile;
        try {
          profile = (await createArtistProfile(payload, authToken)).profile;
        } catch {
          profile = (await updateArtistProfile(payload, authToken)).profile;
        }
        setArtistProfile(profile);
        setUserType('artist');
        setProfileCompleted(true);
        setCurrentPage('artistProfile');
      } else if (userData.userType === 'host') {
        const images = (userData.images ?? []).map((img: any) => img.url);
        const profileImage = (userData.images ?? []).find((img: any) => img.isProfile)?.url;
        const payload = {
          displayName: userData.venueName || userData.name,
          bio: userData.venueDescription,
          city: userData.city,
          neighborhood: userData.neighborhood,
          capacity: userData.capacity ? Number(userData.capacity) : undefined,
          venueType: userData.venueType,
          artistSleep: userData.artistSleep ?? false,
          sleepDetails: userData.sleepDetails,
          topGenres: userData.topGenres
            ? String(userData.topGenres)
                .split(',')
                .map((g: string) => g.trim())
                .filter(Boolean)
            : undefined,
          images: profileImage ? [profileImage, ...images.filter((img: string) => img !== profileImage)] : images,
          amenities: userData.amenities
            ? String(userData.amenities)
                .split(',')
                .map((g: string) => g.trim())
                .filter(Boolean)
            : undefined,
          availability: userData.availability,
          responseTime: userData.responseTime,
        };

        let profile;
        try {
          profile = (await createHostProfile(payload, authToken)).profile;
        } catch {
          profile = (await updateHostProfile(payload, authToken)).profile;
        }
        setHostProfile(profile);
        setUserType('host');
        setProfileCompleted(true);
        setCurrentPage('hostProfile');
      } else {
        setUserType('fan');
        setProfileCompleted(true);
        setCurrentPage('shows');
      }
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  const handleBuyTickets = (showId: string) => {
    setSelectedShowId(showId);
    setCurrentPage('ticketConfirmation');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    setProfileCompleted(false);
    setAuthPage('home');
    setAuthToken(null);
    setArtistProfile(null);
    setHostProfile(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
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

  const handleEditProfile = () => {
    if (!userType) return;
    setEditingProfileType(userType);
    setCurrentPage('editProfile');
  };

  // Get all unique genres and cities
  const allGenres = Array.from(
    new Set(houses.flatMap(house => house.topGenres))
  ).sort();

  const allCities = Array.from(
    new Set(houses.map(house => house.city))
  ).sort();

  const allArtistGenres = Array.from(
    new Set(artists.flatMap(artist => artist.genres))
  ).sort();

  const allArtistCities = Array.from(
    new Set(artists.map(artist => artist.hometown))
  ).sort();

  const maxCapacity = houses.length ? Math.max(...houses.map(h => h.capacity)) : 0;

  // Filter houses and artists
  const filteredHouses = houses.filter(house => {
    const matchesSearch = house.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         house.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         house.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || house.topGenres.includes(selectedGenre);
    const matchesCity = selectedCity === 'all' || house.city === selectedCity;
    const matchesArtistSleep = !artistSleepFilter || house.artistSleep === true;
    const matchesCapacity = house.capacity >= minCapacity[0];
    
    return matchesSearch && matchesGenre && matchesCity && matchesArtistSleep && matchesCapacity;
  });

  const filteredArtists = artists.filter(artist => {
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
        </>
      );
    }
    
    if (authPage === 'signup' && signupUserType) {
      return (
        <>
          <AccountCreation
            userType={signupUserType as 'artist' | 'host' | 'fan'}
            onComplete={handleAccountCreationComplete}
            onBack={() => setAuthPage('home')}
          />
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
      </>
    );
  }

  if (currentPage === 'eventProposal') {
    return (
      <>
        <EventProposal onBack={() => setCurrentPage('messages')} />
      </>
    );
  }

  if (currentPage === 'hostProfile') {
    if (!hostProfile) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
          No host profile found yet.
        </div>
      );
    }
    return (
      <>
        <HostProfile
          profile={hostProfile}
          onEdit={handleEditProfile}
          onBack={() => setCurrentPage(userType === 'artist' ? 'venues' : (userType === 'host' ? 'artists' : 'shows'))}
        />
      </>
    );
  }

  if (currentPage === 'artistProfile') {
    if (!artistProfile) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
          No artist profile found yet.
        </div>
      );
    }
    return (
      <>
        <ArtistProfile
          profile={artistProfile}
          onEdit={handleEditProfile}
          onBack={() => setCurrentPage(userType === 'host' ? 'artists' : (userType === 'artist' ? 'venues' : 'shows'))}
        />
      </>
    );
  }

  if (currentPage === 'editProfile' && editingProfileType) {
    const initialData =
      editingProfileType === 'host' && hostProfile
        ? {
            userType: 'host',
            name: hostProfile.displayName,
            venueName: hostProfile.displayName,
            venueDescription: hostProfile.bio ?? '',
            city: hostProfile.city ?? '',
            neighborhood: hostProfile.neighborhood ?? '',
            capacity: hostProfile.capacity ?? '',
            venueType: hostProfile.venueType ?? '',
            artistSleep: hostProfile.artistSleep ?? false,
            sleepDetails: hostProfile.sleepDetails ?? '',
            topGenres: (hostProfile.topGenres ?? []).join(', '),
            amenities: (hostProfile.amenities ?? []).join(', '),
            images: (hostProfile.images ?? []).map((url, index) => ({ id: url, url, isProfile: index === 0 })),
          }
        : editingProfileType === 'artist' && artistProfile
          ? {
              userType: 'artist',
              name: artistProfile.displayName,
              bandName: artistProfile.displayName,
              tagline: artistProfile.tagline ?? '',
              bio: artistProfile.bio ?? '',
              hometown: artistProfile.hometown ?? '',
              genres: (artistProfile.genres ?? []).join(', '),
              images: (artistProfile.images ?? []).map((url, index) => ({ id: url, url, isProfile: url === artistProfile.imageUrl || index === 0 })),
              spotifyLink: artistProfile.spotifyArtistId ?? '',
              instagramLink: artistProfile.instagramUrl ?? '',
              websiteLink: artistProfile.websiteUrl ?? '',
              appleMusicLink: artistProfile.appleMusicUrl ?? '',
            }
          : null;

    return (
      <AccountCreation
        userType={editingProfileType as 'artist' | 'host' | 'fan'}
        mode="edit"
        initialData={initialData ?? undefined}
        onComplete={handleAccountCreationComplete}
        onBack={() => setCurrentPage(editingProfileType === 'host' ? 'hostProfile' : 'artistProfile')}
      />
    );
  }

  if (currentPage === 'ticketConfirmation') {
    return (
      <>
        <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
          <TicketConfirmation
            eventId={selectedShowId ?? 'mock-show'}
            token={''}
            onBack={() => setCurrentPage('shows')}
          />
        </div>
      </>
    );
  }

  if (currentPage === 'eventDashboard') {
    return (
      <>
        <EventDashboard userType={userType as 'artist' | 'host'} onBack={() => setCurrentPage('shows')} />
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
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                      : 'text-foreground hover:bg-secondary border border-border'
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
                className="font-['Teko',sans-serif] text-lg text-foreground hover:bg-secondary border border-border rounded-sm"
              >
                <Calendar className="w-4 h-4 mr-2" />
                My Events
              </Button>

              {/* Messages button with notification dot */}
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPage('messages')}
                className="relative text-foreground hover:bg-secondary border border-border rounded-sm"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
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
                className="relative text-foreground hover:bg-secondary border border-border rounded-sm"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <ShowsPage onBuyTickets={handleBuyTickets} shows={[]} />
        )}
      </div>
      
    </div>
  );
}
