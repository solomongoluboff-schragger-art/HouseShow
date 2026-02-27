import { Button } from './ui/button';
import heroImage from 'figma:asset/bc0c6734fcb5aed959ff61810829b5d7a3e805f8.png';

interface HomePageProps {
  onGetStarted: (userType: 'artist' | 'host' | 'fan') => void;
  onSignIn: () => void;
}

export function HomePage({ onGetStarted, onSignIn }: HomePageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Concert crowd" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-card/80 via-card/60 to-card/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-8xl font-black text-foreground mb-6 tracking-tight">
            house<span className="text-primary">show</span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-foreground mb-12 max-w-2xl mx-auto">
            Connecting indie artists, indie fans, and indie venues.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              onClick={() => onGetStarted('artist')}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-bold"
            >
              For Artists
            </Button>
            <Button 
              onClick={() => onGetStarted('host')}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-bold"
            >
              For Hosts
            </Button>
            <Button 
              onClick={() => onGetStarted('fan')}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-bold"
            >
              For Music Lovers
            </Button>
          </div>

          {/* Sign In Link */}
          <div className="mt-6">
            <button 
              onClick={onSignIn}
              className="text-muted-foreground hover:text-foreground underline transition-colors"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
