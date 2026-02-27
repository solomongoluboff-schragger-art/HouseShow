import { ShowCard, Show } from './ShowCard';

// Mock data for upcoming shows
const mockShows: Show[] = [
  {
    id: '1',
    artistName: 'The Violet Echoes',
    date: '2024-12-28',
    time: '8:00 PM',
    neighborhood: 'Williamsburg',
    city: 'Brooklyn, NY',
    genres: ['Indie Rock', 'Dream Pop'],
    price: 15,
    capacity: 50,
    ticketsSold: 48,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMGJhbmQlMjBsaXZlfGVufDF8fHx8MTczNDU1MDQyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Ethereal indie rock with haunting vocals and shimmering guitars.',
    studentOnly: null
  },
  {
    id: '2',
    artistName: 'Luna Mara',
    date: '2024-12-30',
    time: '7:30 PM',
    neighborhood: 'Capitol Hill',
    city: 'Seattle, WA',
    genres: ['Folk', 'Singer-Songwriter'],
    price: 12,
    capacity: 35,
    ticketsSold: 35,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzaW5nZXIlMjBndWl0YXJ8ZW58MXx8fHwxNzM0NTUwNDI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Intimate acoustic performance with heartfelt storytelling.',
    studentOnly: null,
    soldOut: true
  },
  {
    id: '3',
    artistName: 'Basement Frequency',
    date: '2025-01-03',
    time: '9:00 PM',
    neighborhood: 'East Austin',
    city: 'Austin, TX',
    genres: ['Punk', 'Garage Rock'],
    price: 10,
    capacity: 60,
    ticketsSold: 32,
    image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdW5rJTIwYmFuZCUyMGxpdmV8ZW58MXx8fHwxNzM0NTUwNDI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Raw, high-energy punk show. Bring earplugs and your dancing shoes.',
    studentOnly: 'UT Austin'
  },
  {
    id: '4',
    artistName: 'Neon Drift',
    date: '2025-01-05',
    time: '8:30 PM',
    neighborhood: 'Silver Lake',
    city: 'Los Angeles, CA',
    genres: ['Electronic', 'Synth Pop'],
    price: 18,
    capacity: 40,
    ticketsSold: 37,
    image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWMlMjBsaXZlfGVufDF8fHx8MTczNDU1MDQyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Synth-driven electronic soundscapes meet infectious pop melodies.',
    studentOnly: null
  },
  {
    id: '5',
    artistName: 'The Crossroads Collective',
    date: '2025-01-08',
    time: '7:00 PM',
    neighborhood: 'Mission District',
    city: 'San Francisco, CA',
    genres: ['Jazz', 'Soul'],
    price: 20,
    capacity: 30,
    ticketsSold: 18,
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwYmFuZCUyMGxpdmV8ZW58MXx8fHwxNzM0NTUwNDI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Smooth jazz fusion with soulful vocals and improvisation.',
    studentOnly: null
  },
  {
    id: '6',
    artistName: 'Velvet Thunder',
    date: '2025-01-10',
    time: '8:00 PM',
    neighborhood: 'Wicker Park',
    city: 'Chicago, IL',
    genres: ['Alternative', 'Grunge'],
    price: 15,
    capacity: 45,
    ticketsSold: 29,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncnVuZ2UlMjBiYW5kfGVufDF8fHx8MTczNDU1MDQyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    description: '90s-inspired grunge with modern alternative edge.',
    studentOnly: 'Northwestern'
  },
  {
    id: '7',
    artistName: 'Crimson Wave',
    date: '2025-01-12',
    time: '9:00 PM',
    neighborhood: 'Allston',
    city: 'Boston, MA',
    genres: ['Indie Rock', 'Post-Punk'],
    price: 12,
    capacity: 55,
    ticketsSold: 51,
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZCUyMHBlcmZvcm1pbmd8ZW58MXx8fHwxNzM0NTUwNDI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Angular guitars and driving rhythms with introspective lyrics.',
    studentOnly: 'BU/Berklee'
  },
  {
    id: '8',
    artistName: 'Honey & Smoke',
    date: '2025-01-15',
    time: '7:30 PM',
    neighborhood: 'East Nashville',
    city: 'Nashville, TN',
    genres: ['Americana', 'Country'],
    price: 14,
    capacity: 40,
    ticketsSold: 25,
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VudHJ5JTIwbXVzaWMlMjBsaXZlfGVufDF8fHx8MTczNDU1MDQyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Contemporary country with traditional roots and authentic storytelling.',
    studentOnly: null
  }
];

interface ShowsPageProps {
  onBuyTickets?: (showId: string) => void;
}

export function ShowsPage({ onBuyTickets }: ShowsPageProps) {
  return (
    <div>
      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground uppercase tracking-wide">
          {mockShows.length} upcoming {mockShows.length === 1 ? 'show' : 'shows'}
        </p>
      </div>

      {/* Shows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockShows.map((show) => (
          <ShowCard
            key={show.id}
            show={show}
            onBuyTickets={() => onBuyTickets?.(show.id)}
          />
        ))}
      </div>
    </div>
  );
}
