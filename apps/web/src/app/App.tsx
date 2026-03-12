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
import { ShowDetails } from './components/ShowDetails';
import { Input } from './components/ui/input';
import { Search, MessageCircle, User, Calendar, Music } from 'lucide-react';
import { Button } from './components/ui/button';
import { Slider } from './components/ui/slider';
import { Switch } from './components/ui/switch';
import { Label } from './components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';
import {
  ArtistProfile as ArtistProfileData,
  HostProfile as HostProfileData,
  Conversation,
  EventWithDetails,
  confirmProposal,
  createArtistProfile,
  createConversation,
  createHostProfile,
  getArtist,
  getHost,
  getMe,
  getMyArtistProfile,
  getMyHostProfile,
  listArtists,
  listConversations,
  listEvents,
  listHosts,
  loginWithFirebase,
  purchaseTicket,
  rejectProposal,
  updateArtistProfile,
  updateHostProfile,
  updateMe,
} from './lib/api';

type AuthPage = 'home' | 'login' | 'signup' | 'profileCompletion' | 'app';
type UserType = 'artist' | 'host' | 'fan' | null;
type AppPage =
  | 'venues'
  | 'artists'
  | 'shows'
  | 'showDetails'
  | 'hostProfile'
  | 'artistProfile'
  | 'editProfile'
  | 'eventProposal'
  | 'messages'
  | 'eventConfirmation'
  | 'eventDashboard'
  | 'ticketConfirmation';

const FALLBACK_IMAGE =
  '/photos/7bca2e83-a717-4819-8ffa-1fb44e15ad32_rw_1920.jpg';

function upsertConversation(conversations: Conversation[], next: Conversation) {
  const existingIndex = conversations.findIndex((conversation) => conversation.id === next.id);
  if (existingIndex === -1) {
    return [next, ...conversations];
  }

  return conversations.map((conversation) => (conversation.id === next.id ? next : conversation));
}

function formatEventDate(eventDate: string | null) {
  if (!eventDate) return 'Date TBA';

  const parsed = new Date(eventDate);
  if (Number.isNaN(parsed.getTime())) {
    return eventDate;
  }

  return parsed.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function safeString(value?: string | null) {
  return value && value.trim().length > 0 ? value : undefined;
}

export default function App() {
  const [authPage, setAuthPage] = useState<AuthPage>('home');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [signupUserType, setSignupUserType] = useState<UserType>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [profileCompleted, setProfileCompleted] = useState<boolean>(false);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<AppPage>('shows');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [artistSleepFilter, setArtistSleepFilter] = useState<boolean>(false);
  const [minCapacity, setMinCapacity] = useState<number[]>([0]);
  const [availableForHireFilter, setAvailableForHireFilter] = useState<boolean>(false);
  const [onTourFilter, setOnTourFilter] = useState<boolean>(false);

  const [artists, setArtists] = useState<Artist[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [events, setEvents] = useState<EventWithDetails[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [editingProfileType, setEditingProfileType] = useState<UserType>(null);
  const [artistProfile, setArtistProfile] = useState<ArtistProfileData | null>(null);
  const [hostProfile, setHostProfile] = useState<HostProfileData | null>(null);

  const [selectedShowId, setSelectedShowId] = useState<string | null>(null);
  const [selectedHostProfileId, setSelectedHostProfileId] = useState<string | null>(null);
  const [selectedArtistProfileId, setSelectedArtistProfileId] = useState<string | null>(null);
  const [profileFetchLoading, setProfileFetchLoading] = useState(false);
  const [activeHostProfile, setActiveHostProfile] = useState<HostProfileData | null>(null);
  const [activeArtistProfile, setActiveArtistProfile] = useState<ArtistProfileData | null>(null);
  const [profileLoadError, setProfileLoadError] = useState<string | null>(null);

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [proposalConversationId, setProposalConversationId] = useState<string | null>(null);

  const saveAuthToken = (token: string) => {
    setAuthToken(token);
    setIsAuthenticated(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  };

  const loadListings = async () => {
    try {
      const [artistRes, hostRes] = await Promise.all([listArtists(), listHosts()]);

      const mappedArtists: Artist[] = artistRes.artists.map((artist) => ({
        id: artist.id,
        name: artist.displayName,
        tagline: artist.tagline ?? '',
        hometown: safeString(artist.hometown) ?? '',
        image: artist.imageUrl ?? artist.images?.[0] ?? FALLBACK_IMAGE,
        genres: artist.genres ?? [],
        userId: artist.userId,
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
        userId: host.userId,
        neighborhood: safeString(host.neighborhood) ?? '',
        city: safeString(host.city) ?? '',
        capacity: host.capacity ?? 0,
        images:
          host.images && host.images.length > 0
            ? host.images
            : [FALLBACK_IMAGE],
        topGenres: host.topGenres ?? [],
        artistSleep: host.artistSleep ?? false,
        hostName: host.displayName,
        description: host.bio ?? '',
        venueType: (host.venueType as House['venueType']) ?? 'indoor',
      }));

      setArtists(mappedArtists);
      setHouses(mappedHouses);
    } catch {
      setArtists([]);
      setHouses([]);
    }
  };

  const loadConversations = async (token: string) => {
    const data = await listConversations(token);
    setConversations(data.conversations);
  };

  const loadEvents = async (token?: string) => {
    const data = await listEvents(token);
    setEvents(data.events);
  };

  const hydrateAuthenticatedSession = async (token: string, preferredType: UserType = 'fan') => {
    setIsLoadingProfiles(true);
    try {
      const me = await getMe(token);
      setCurrentUserId(me.user.id);

      let hostProfileData: HostProfileData | null = null;
      let artistProfileData: ArtistProfileData | null = null;

      try {
        hostProfileData = (await getMyHostProfile(token)).profile;
      } catch {
        hostProfileData = null;
      }

      try {
        artistProfileData = (await getMyArtistProfile(token)).profile;
      } catch {
        artistProfileData = null;
      }

      let resolvedType: UserType = preferredType;
      if (me.user.roles.includes('ARTIST')) {
        resolvedType = 'artist';
      }
      if (me.user.roles.includes('HOST')) {
        resolvedType = 'host';
      }
      if (artistProfileData) {
        resolvedType = 'artist';
      } else if (hostProfileData) {
        resolvedType = 'host';
      } else if (preferredType === 'fan') {
        resolvedType = 'fan';
      }

      const completed = resolvedType === 'fan' || Boolean(hostProfileData || artistProfileData);
      setUserType(resolvedType);
      setHostProfile(hostProfileData);
      setArtistProfile(artistProfileData);
      setProfileCompleted(completed);

      if (!completed && resolvedType !== 'fan') {
        setAuthPage('profileCompletion');
      } else {
        setAuthPage('app');
        setCurrentPage('shows');
      }

      await Promise.all([loadConversations(token), loadEvents(token)]);
    } catch {
      handleLogout();
      return;
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  const refreshPrivateData = async () => {
    if (!authToken) {
      return;
    }

    await Promise.all([loadConversations(authToken), loadEvents(authToken)]);
  };

  useEffect(() => {
    void loadListings();
    void loadEvents();
  }, []);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (stored) {
      setAuthToken(stored);
      setIsAuthenticated(true);
      void hydrateAuthenticatedSession(stored, 'fan');
    }
  }, []);

  const handleGetStarted = (type: 'artist' | 'host' | 'fan') => {
    setSignupUserType(type);
    setAuthPage('login');
  };

  const handleSignIn = () => {
    setSignupUserType('fan');
    setAuthPage('login');
  };

  const handlePhoneAuthComplete = async (
    _phoneNumber: string,
    isNewUser: boolean,
    idToken: string,
  ) => {
    setIsLoadingProfiles(true);
    try {
      const auth = await loginWithFirebase(idToken);
      saveAuthToken(auth.token);
      try {
        const me = await getMe(auth.token);
        setCurrentUserId(me.user.id);
      } catch {
        // If we cannot hydrate the user yet, continue with the flow.
      }

      if (isNewUser) {
        const requestedType = signupUserType ?? 'fan';
        setUserType(requestedType);
        setProfileCompleted(false);
        setAuthPage('signup');
        return;
      }

      const requestedType = signupUserType ?? 'fan';
      await hydrateAuthenticatedSession(auth.token, requestedType);
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  const handleProfileComplete = async (userData: any) => {
    await handleAccountCreationComplete(userData);
  };

  const handleSkipProfileCompletion = () => {
    setProfileCompleted(true);
    setAuthPage('app');
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
        try {
          await updateMe({ email: userData.email }, authToken);
        } catch {
          // Ignore email update errors for now.
        }
      }

      if (userData.userType === 'artist') {
        const genres = userData.genres
          ? String(userData.genres)
              .split(',')
              .map((genre: string) => genre.trim())
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
        setProfileCompleted(true);
        setUserType('artist');
        setAuthPage('app');
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
                .map((genre: string) => genre.trim())
                .filter(Boolean)
            : undefined,
          images: profileImage ? [profileImage, ...images.filter((url: string) => url !== profileImage)] : images,
          amenities: userData.amenities
            ? String(userData.amenities)
                .split(',')
                .map((amenity: string) => amenity.trim())
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
        setProfileCompleted(true);
        setUserType('host');
        setAuthPage('app');
        setCurrentPage('hostProfile');
      } else {
        setProfileCompleted(true);
        setAuthPage('app');
        setCurrentPage('shows');
      }
    } finally {
      setIsLoadingProfiles(false);
      if (authToken) {
        await refreshPrivateData();
        await loadListings();
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    setProfileCompleted(false);
    setAuthPage('home');
    setAuthToken(null);
    setCurrentUserId(null);
    setCurrentPage('shows');
    setArtistProfile(null);
    setHostProfile(null);
    setConversations([]);
    setEvents([]);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  };

  const handleEditProfile = () => {
    if (!userType) return;
    setEditingProfileType(userType);
    setCurrentPage('editProfile');
  };

  const handleOpenHostProfile = async (hostId: string) => {
    setSelectedArtistProfileId(null);
    setActiveArtistProfile(null);
    setSelectedHostProfileId(hostId);
    setCurrentPage('hostProfile');

    if (hostProfile?.id === hostId) {
      setActiveHostProfile(hostProfile);
      setProfileFetchLoading(false);
      setProfileLoadError(null);
      return;
    }

    setProfileFetchLoading(true);
    setProfileLoadError(null);

    try {
      const hostData = await getHost(hostId);
      setActiveHostProfile(hostData.profile);
    } catch {
      setActiveHostProfile(null);
      setProfileLoadError('Could not load that host profile.');
    } finally {
      setProfileFetchLoading(false);
    }
  };

  const handleOpenArtistProfile = async (artistId: string) => {
    setSelectedHostProfileId(null);
    setActiveHostProfile(null);
    setSelectedArtistProfileId(artistId);
    setCurrentPage('artistProfile');

    if (artistProfile?.id === artistId) {
      setActiveArtistProfile(artistProfile);
      setProfileFetchLoading(false);
      setProfileLoadError(null);
      return;
    }

    setProfileFetchLoading(true);
    setProfileLoadError(null);

    try {
      const artistData = await getArtist(artistId);
      setActiveArtistProfile(artistData.profile);
    } catch {
      setActiveArtistProfile(null);
      setProfileLoadError('Could not load that artist profile.');
    } finally {
      setProfileFetchLoading(false);
    }
  };

  const handleOpenOwnHostProfile = () => {
    if (!hostProfile) {
      setProfileLoadError('No host profile yet.');
      setCurrentPage('hostProfile');
      return;
    }

    setSelectedHostProfileId(hostProfile.id);
    setActiveHostProfile(hostProfile);
    setProfileLoadError(null);
    setCurrentPage('hostProfile');
  };

  const handleOpenOwnArtistProfile = () => {
    if (!artistProfile) {
      setProfileLoadError('No artist profile yet.');
      setCurrentPage('artistProfile');
      return;
    }

    setSelectedArtistProfileId(artistProfile.id);
    setActiveArtistProfile(artistProfile);
    setProfileLoadError(null);
    setCurrentPage('artistProfile');
  };

  const handleStartConversationWithHost = async (hostUserId: string) => {
    if (!authToken) {
      alert('Please sign in to start a conversation.');
      return;
    }

    try {
      const data = await createConversation({ hostUserId }, authToken);
      setConversations((prev) => upsertConversation(prev, data.conversation));
      setSelectedConversationId(data.conversation.id);
      setCurrentPage('messages');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not create conversation.');
    }
  };

  const handleStartConversationWithArtist = async (artistUserId: string) => {
    if (!authToken) {
      alert('Please sign in to start a conversation.');
      return;
    }

    try {
      const data = await createConversation({ artistUserId }, authToken);
      setConversations((prev) => upsertConversation(prev, data.conversation));
      setSelectedConversationId(data.conversation.id);
      setCurrentPage('messages');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not create conversation.');
    }
  };

  const handleCreateProposal = (conversationId: string) => {
    setProposalConversationId(conversationId);
    setCurrentPage('eventProposal');
  };

  const handleReviewProposal = (conversationId: string) => {
    setProposalConversationId(conversationId);
    setCurrentPage('eventConfirmation');
  };

  const handleProposalSent = () => {
    void refreshPrivateData();
    setCurrentPage('messages');
    setProposalConversationId(null);
  };

  const handleApproveEvent = async (conversationId: string) => {
    if (!authToken) return;

    setProposalConversationId(null);

    try {
      await confirmProposal(conversationId, authToken);
      await refreshPrivateData();
      setCurrentPage('eventDashboard');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not approve proposal.');
      setProposalConversationId(conversationId);
    }
  };

  const handleRejectEvent = async (conversationId: string) => {
    if (!authToken) return;

    try {
      await rejectProposal(conversationId, authToken);
      await refreshPrivateData();
      setCurrentPage('messages');
      setProposalConversationId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not reject proposal.');
      setProposalConversationId(conversationId);
    }
  };

  const handleViewShowDetails = (showId: string) => {
    setSelectedShowId(showId);
    setCurrentPage('showDetails');
  };

  const handleBuyTickets = async (showId: string) => {
    if (!authToken) {
      alert('Please sign in to buy tickets.');
      return;
    }

    try {
      await purchaseTicket(showId, { quantity: 1 }, authToken);
      setSelectedShowId(showId);
      setCurrentPage('ticketConfirmation');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not purchase ticket.');
    }
  };

  const clearAllFilters = () => {
    setSelectedGenre('all');
    setSelectedCity('all');
    setArtistSleepFilter(false);
    setMinCapacity([0]);
    setAvailableForHireFilter(false);
    setOnTourFilter(false);
  };

  const allGenres = Array.from(new Set(houses.flatMap((house) => house.topGenres).filter(Boolean))).sort();
  const allCities = Array.from(new Set(houses.map((house) => house.city).filter(Boolean))).sort();
  const allArtistGenres = Array.from(new Set(artists.flatMap((artist) => artist.genres).filter(Boolean))).sort();
  const allArtistCities = Array.from(new Set(artists.map((artist) => artist.hometown).filter(Boolean))).sort();

  const maxCapacity = houses.length > 0 ? Math.max(...houses.map((house) => house.capacity)) : 0;

  const filteredHouses = houses.filter((house) => {
    const matchesSearch =
      house.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      house.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      house.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || house.topGenres.includes(selectedGenre);
    const matchesCity = selectedCity === 'all' || house.city === selectedCity;
    const matchesArtistSleep = !artistSleepFilter || house.artistSleep === true;
    const matchesCapacity = house.capacity >= minCapacity[0];

    return matchesSearch && matchesGenre && matchesCity && matchesArtistSleep && matchesCapacity;
  });

  const filteredArtists = artists.filter((artist) => {
    const matchesSearch =
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.hometown.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || artist.genres.includes(selectedGenre);
    const matchesCity = selectedCity === 'all' || artist.hometown === selectedCity;
    const matchesNeedsSleep = !artistSleepFilter || artist.needsSleep === true;
    const matchesForHire = !availableForHireFilter || artist.availableForHire === true;
    const matchesOnTour = !onTourFilter || artist.upcomingTourDates.length > 0;

    return matchesSearch && matchesGenre && matchesCity && matchesNeedsSleep && matchesForHire && matchesOnTour;
  });

  const hasActiveFilters =
    selectedGenre !== 'all' || selectedCity !== 'all' || artistSleepFilter || minCapacity[0] > 0 || availableForHireFilter || onTourFilter;
  const hasActiveArtistFilters =
    selectedGenre !== 'all' || selectedCity !== 'all' || artistSleepFilter || availableForHireFilter || onTourFilter;

  const showList = useMemo(() => {
    return events
      .map((event) => {
        const artistName = event.artistProfile?.displayName || 'Artist to be announced';
        const location = [event.hostProfile?.neighborhood, event.hostProfile?.city].filter(Boolean).join(', ');
        const sold = event.ticketsSold ?? 0;
        const capacity = event.capacity ?? 0;

        return {
          id: event.id,
          ticketingEnabled: event.ticketingEnabled,
          artistName,
          date: event.proposal?.date ?? event.publishedAt,
          time: safeString(event.proposal?.startTime) ?? 'TBA',
          neighborhood: safeString(location) ? location.split(',')[0] : 'Venue',
          city: safeString(event.hostProfile?.city) ?? 'TBA',
          genres: event.artistProfile?.genres ?? [],
          price: event.ticketPriceCents ? event.ticketPriceCents / 100 : 0,
          capacity,
          ticketsSold: sold,
          image:
            event.artistProfile?.imageUrl ??
            event.artistProfile?.images?.[0] ??
            event.hostProfile?.images?.[0] ??
            FALLBACK_IMAGE,
          description:
            event.proposal?.description ??
            `Live show with ${artistName}`,
          studentOnly: null,
          soldOut: capacity > 0 ? sold >= capacity : false,
        };
      })
      .sort((a, b) => {
        const aDate = new Date(a.date).getTime();
        const bDate = new Date(b.date).getTime();
        return aDate - bDate;
      });
  }, [events]);

  const filteredShows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return showList;
    return showList.filter((show) => {
      return (
        show.artistName.toLowerCase().includes(query) ||
        show.city.toLowerCase().includes(query) ||
        show.neighborhood.toLowerCase().includes(query) ||
        show.description.toLowerCase().includes(query)
      );
    });
  }, [showList, searchQuery]);

  const myEvents = useMemo(() => {
    if (!currentUserId) return [];

    return events.filter((event) => {
      const artistUserId = event.artistProfile?.userId;
      const hostUserId = event.hostProfile?.userId;
      return artistUserId === currentUserId || hostUserId === currentUserId;
    });
  }, [events, currentUserId]);

  if (!isAuthenticated) {
    if (isLoadingProfiles) {
      return <div className="min-h-screen bg-background p-8 text-muted-foreground">Loading your session...</div>;
    }

    if (authPage === 'home') {
      return <HomePage onGetStarted={handleGetStarted} onSignIn={handleSignIn} shows={showList} />;
    }

    if (authPage === 'login') {
      return (
        <PhoneAuth
          onComplete={handlePhoneAuthComplete}
          onBack={() => setAuthPage('home')}
        />
      );
    }

    if (authPage === 'signup' && signupUserType) {
      return (
        <AccountCreation
          userType={signupUserType as 'artist' | 'host' | 'fan'}
          onComplete={handleProfileComplete}
          onBack={() => setAuthPage('home')}
        />
      );
    }

    if (authPage === 'profileCompletion' && signupUserType && signupUserType !== 'fan') {
      return (
        <ProfileCompletion
          userType={signupUserType as 'artist' | 'host'}
          onComplete={handleProfileComplete}
          onSkip={handleSkipProfileCompletion}
        />
      );
    }
  }

  if (
    isAuthenticated &&
    !profileCompleted &&
    authPage === 'profileCompletion' &&
    userType !== 'fan'
  ) {
    return (
      <ProfileCompletion
        userType={userType as 'artist' | 'host'}
        onComplete={handleProfileComplete}
        onSkip={handleSkipProfileCompletion}
      />
    );
  }

  if (currentPage === 'messages') {
    if (userType !== 'artist' && userType !== 'host') {
      return (
        <div className="min-h-screen bg-background text-muted-foreground flex items-center justify-center">
          <p>Messaging is available for artist and host accounts.</p>
        </div>
      );
    }

    return (
      <MessagingSystem
        userType={userType as 'artist' | 'host'}
        onBack={() => setCurrentPage('shows')}
        currentUserId={currentUserId}
        conversations={conversations}
        authToken={authToken ?? ''}
        initialConversationId={selectedConversationId}
        onCreateProposal={
          userType === 'artist' ? handleCreateProposal : undefined
        }
        onReviewProposal={userType === 'host' ? handleReviewProposal : undefined}
      />
    );
  }

  if (currentPage === 'eventProposal') {
    if (!proposalConversationId || !authToken) {
      return (
        <div className="min-h-screen bg-background p-8">
          <EventProposal
            conversationId=""
            authToken={authToken ?? ''}
            onBack={() => setCurrentPage('messages')}
            onSent={handleProposalSent}
          />
        </div>
      );
    }

    return (
      <EventProposal
        conversationId={proposalConversationId}
        authToken={authToken}
        onBack={() => setCurrentPage('messages')}
        onSent={handleProposalSent}
      />
    );
  }

  if (currentPage === 'eventConfirmation') {
    if (!proposalConversationId || !authToken) {
      return (
        <div className="min-h-screen bg-background p-8 text-muted-foreground">
          Select a proposal to review from your messages.
          <br />
          <Button variant="ghost" onClick={() => setCurrentPage('messages')} className="mt-4">
            ← back to messages
          </Button>
        </div>
      );
    }

    return (
      <EventConfirmation
        conversationId={proposalConversationId}
        authToken={authToken}
        onApprove={handleApproveEvent}
        onReject={handleRejectEvent}
        onBack={() => {
          setCurrentPage('messages');
          setProposalConversationId(null);
        }}
      />
    );
  }

  if (currentPage === 'hostProfile') {
    if (selectedHostProfileId === null) {
      return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">No host selected.</div>;
    }

    const viewedHost = selectedHostProfileId === hostProfile?.id ? hostProfile : activeHostProfile;

    if (profileFetchLoading) {
      return <div className="min-h-screen bg-background p-8 text-muted-foreground">Loading host profile...</div>;
    }

    if (!viewedHost) {
      return (
        <div className="min-h-screen bg-background p-8 text-muted-foreground">
          {profileLoadError || 'Host profile not found.'}
          <Button variant="ghost" onClick={() => setCurrentPage('shows')} className="mt-4">
            ← back
          </Button>
        </div>
      );
    }

    const canEdit = userType === 'host' && currentUserId && viewedHost.userId === currentUserId;

    return (
      <HostProfile
        profile={viewedHost}
        onEdit={canEdit ? handleEditProfile : undefined}
        onBack={() =>
          setCurrentPage(userType === 'artist' ? 'venues' : userType === 'host' ? 'artists' : 'shows')
        }
      />
    );
  }

  if (currentPage === 'artistProfile') {
    if (selectedArtistProfileId === null) {
      return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">No artist selected.</div>;
    }

    const viewedArtist =
      selectedArtistProfileId === artistProfile?.id ? artistProfile : activeArtistProfile;

    if (profileFetchLoading) {
      return <div className="min-h-screen bg-background p-8 text-muted-foreground">Loading artist profile...</div>;
    }

    if (!viewedArtist) {
      return (
        <div className="min-h-screen bg-background p-8 text-muted-foreground">
          {profileLoadError || 'Artist profile not found.'}
          <Button variant="ghost" onClick={() => setCurrentPage('shows')} className="mt-4">
            ← back
          </Button>
        </div>
      );
    }

    const canEdit = userType === 'artist' && currentUserId && viewedArtist.userId === currentUserId;

    return (
      <ArtistProfile
        profile={viewedArtist}
        onEdit={canEdit ? handleEditProfile : undefined}
        onBack={() =>
          setCurrentPage(userType === 'host' ? 'artists' : userType === 'artist' ? 'venues' : 'shows')
        }
      />
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

  if (currentPage === 'showDetails') {
    if (!selectedShowId) {
      return (
        <div className="min-h-screen bg-background p-8 text-muted-foreground">
          Show not selected.
          <Button variant="ghost" onClick={() => setCurrentPage('shows')} className="mt-4">
            ← back to shows
          </Button>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <ShowDetails
          eventId={selectedShowId}
          token={authToken ?? undefined}
          onBack={() => setCurrentPage('shows')}
          onBuyTickets={handleBuyTickets}
        />
      </div>
    );
  }

  if (currentPage === 'ticketConfirmation') {
    if (!selectedShowId || !authToken) {
      return (
        <div className="min-h-screen bg-background p-8 text-muted-foreground">
          Event not selected yet.
          <Button variant="ghost" onClick={() => setCurrentPage('shows')} className="mt-4">
            ← back to shows
          </Button>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <TicketConfirmation eventId={selectedShowId} token={authToken} onBack={() => setCurrentPage('shows')} />
      </div>
    );
  }

  if (currentPage === 'eventDashboard') {
    if (userType !== 'artist' && userType !== 'host') {
      return (
        <div className="min-h-screen bg-background p-8 text-muted-foreground">
          Only artists and hosts can access event dashboards.
          <Button variant="ghost" onClick={() => setCurrentPage('shows')} className="mt-4">
            ← back to shows
          </Button>
        </div>
      );
    }

    return (
      <EventDashboard
        userType={userType}
        events={myEvents}
        authToken={authToken ?? ''}
        currentUserId={currentUserId}
        onRefresh={refreshPrivateData}
        onBack={() => setCurrentPage('shows')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-black text-foreground tracking-tight">
              house<span className="text-primary">show</span>
            </h1>
            <div className="flex items-center gap-3">
              {userType !== 'fan' && (
                <Button
                  onClick={() => {
                    if (userType === 'artist') setCurrentPage('venues');
                    else if (userType === 'host') setCurrentPage('artists');
                  }}
                  variant={currentPage === 'venues' || currentPage === 'artists' ? 'default' : 'ghost'}
                  className="font-['Teko',sans-serif] text-lg rounded-sm"
                >
                  {userType === 'artist' ? (
                    <>
                      <Music className="w-4 h-4 mr-2" />
                      Browse Venues
                    </>
                  ) : (
                    <>
                      <Music className="w-4 h-4 mr-2" />
                      Browse Artists
                    </>
                  )}
                </Button>
              )}

              {userType !== 'fan' && (
                <>
                  <Button
                    onClick={() => setCurrentPage('eventDashboard')}
                    variant="ghost"
                    className="font-['Teko',sans-serif] text-lg text-foreground hover:bg-secondary border border-border rounded-sm"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    My Events
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentPage('messages')}
                    className="relative text-foreground hover:bg-secondary border border-border rounded-sm"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (userType === 'artist') {
                        handleOpenOwnArtistProfile();
                      } else if (userType === 'host') {
                        handleOpenOwnHostProfile();
                      }
                    }}
                    className="relative text-foreground hover:bg-secondary border border-border rounded-sm"
                  >
                    <User className="w-5 h-5" />
                    {!profileCompleted && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
                  </Button>
                </>
              )}

              <Button
                onClick={handleLogout}
                variant="ghost"
                className="font-['Teko',sans-serif] text-lg text-foreground hover:bg-secondary border border-border rounded-sm"
              >
                Sign out
              </Button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by artist, neighborhood, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 w-full bg-input-background"
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'venues' ? (
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
                      <SelectItem value="all" className="text-foreground">
                        All Cities
                      </SelectItem>
                      {allCities.map((city) => (
                        <SelectItem key={city} value={city} className="text-foreground">
                          {city}
                        </SelectItem>
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
                      <SelectItem value="all" className="text-foreground">
                        All Genres
                      </SelectItem>
                      {allGenres.map((genre) => (
                        <SelectItem key={genre} value={genre} className="text-foreground">
                          {genre}
                        </SelectItem>
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
                  <Label
                    htmlFor="artist-sleep"
                    className="text-xs text-muted-foreground uppercase tracking-wide cursor-pointer"
                  >
                    Artist Sleep
                  </Label>
                  <Switch
                    id="artist-sleep"
                    checked={artistSleepFilter}
                    onCheckedChange={setArtistSleepFilter}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                {hasActiveFilters ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </Button>
                ) : null}
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
                  onViewProfile={() => void handleOpenHostProfile(house.id)}
                  onPitch={
                    userType === 'artist'
                      ? () => void handleStartConversationWithHost(house.userId)
                      : undefined
                  }
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
                      <SelectItem value="all" className="text-foreground">
                        All Cities
                      </SelectItem>
                      {allArtistCities.map((city) => (
                        <SelectItem key={city} value={city} className="text-foreground">
                          {city}
                        </SelectItem>
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
                      <SelectItem value="all" className="text-foreground">
                        All Genres
                      </SelectItem>
                      {allArtistGenres.map((genre) => (
                        <SelectItem key={genre} value={genre} className="text-foreground">
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 pb-1">
                  <Label
                    htmlFor="for-hire"
                    className="text-xs text-muted-foreground uppercase tracking-wide cursor-pointer"
                  >
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
                  <Label
                    htmlFor="on-tour"
                    className="text-xs text-muted-foreground uppercase tracking-wide cursor-pointer"
                  >
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
                  <Label
                    htmlFor="needs-sleep"
                    className="text-xs text-muted-foreground uppercase tracking-wide cursor-pointer"
                  >
                    Needs Sleep
                  </Label>
                  <Switch
                    id="needs-sleep"
                    checked={artistSleepFilter}
                    onCheckedChange={setArtistSleepFilter}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                {hasActiveArtistFilters ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </Button>
                ) : null}
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
                  onViewProfile={() => void handleOpenArtistProfile(artist.id)}
                  onPitch={
                    userType === 'host'
                      ? () => void handleStartConversationWithArtist(artist.userId)
                      : undefined
                  }
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
          <ShowsPage
            shows={filteredShows}
            onBuyTickets={handleBuyTickets}
            onViewDetails={handleViewShowDetails}
          />
        )}
      </div>
    </div>
  );
}
