import { useState } from 'react';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp, Code } from 'lucide-react';

interface DeveloperToolbarProps {
  onNavigate: (page: string, userType?: 'artist' | 'host' | 'fan') => void;
}

export function DeveloperToolbar({ onNavigate }: DeveloperToolbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const navigation = [
    { section: 'Auth Flow', items: [
      { label: '1. Homepage', page: 'home' },
      { label: '2. Login', page: 'login' },
      { label: '3. Sign Up (Artist)', page: 'signup', userType: 'artist' as const },
      { label: '3. Sign Up (Host)', page: 'signup', userType: 'host' as const },
      { label: '3. Sign Up (Fan)', page: 'signup', userType: 'fan' as const },
    ]},
    { section: 'Artist Flow', items: [
      { label: '4. Find Venues (Artist View)', page: 'venues', userType: 'artist' as const },
      { label: '5. Host Profile', page: 'hostProfile', userType: 'artist' as const },
      { label: '6. Messages', page: 'messages', userType: 'artist' as const },
      { label: '7. Create Event Proposal', page: 'eventProposal', userType: 'artist' as const },
      { label: '8. Event Dashboard', page: 'eventDashboard', userType: 'artist' as const },
    ]},
    { section: 'Host Flow', items: [
      { label: '4. Find Artists (Host View)', page: 'artists', userType: 'host' as const },
      { label: '5. Artist Profile', page: 'artistProfile', userType: 'host' as const },
      { label: '6. Messages', page: 'messages', userType: 'host' as const },
      { label: '7. Event Confirmation', page: 'eventConfirmation', userType: 'host' as const },
      { label: '8. Event Dashboard', page: 'eventDashboard', userType: 'host' as const },
    ]},
    { section: 'All Users', items: [
      { label: 'Upcoming Shows', page: 'shows', userType: 'artist' as const },
    ]},
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t-2 border-primary shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-primary/10">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-primary" />
          <span className="font-bold text-sm text-foreground uppercase tracking-wide">
            Developer Navigation
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      {isExpanded && (
        <div className="px-4 py-4 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {navigation.map((section) => (
              <div key={section.section}>
                <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  {section.section}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Button
                      key={item.label}
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigate(item.page, item.userType)}
                      className="w-full justify-start text-xs text-foreground hover:bg-primary/10 hover:text-primary font-normal"
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
