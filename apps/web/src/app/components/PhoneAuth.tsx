import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft } from 'lucide-react';

interface PhoneAuthProps {
  onComplete: (phoneNumber: string, isNewUser: boolean) => void;
  onBack: () => void;
}

export function PhoneAuth({ onComplete, onBack }: PhoneAuthProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [isNewUser] = useState(true); // Mock - would come from backend

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send SMS verification code
    setStep('verify');
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would verify the code
    onComplete(phoneNumber, isNewUser);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-['Teko',sans-serif] text-xl">Back</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Auth Form Section */}
        <div className="bg-card border border-border rounded-sm p-8">
          <div className="text-center mb-8">
            <h1 className="font-['Teko',sans-serif] text-5xl font-bold text-foreground mb-2">
              {step === 'phone' ? 'Welcome to houseshow' : 'Verify your number'}
            </h1>
            <p className="text-muted-foreground font-['Times',serif]">
              {step === 'phone' 
                ? 'Enter your phone number to continue' 
                : `We sent a code to ${phoneNumber}`}
            </p>
          </div>

          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-['Times',serif] text-muted-foreground mb-2">
                  Phone number
                </label>
                <div className="flex gap-3">
                  <select 
                    className="bg-background border border-border text-foreground rounded-sm px-3 py-3 focus:outline-none focus:border-primary font-['Times',serif]"
                  >
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+33">🇫🇷 +33</option>
                  </select>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 bg-background border-border text-foreground rounded-sm focus:border-primary font-['Times',serif] text-lg py-6"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-['Teko',sans-serif] text-xl py-6 rounded-sm transition-all duration-200"
              >
                Next
              </Button>

              <p className="text-xs text-muted-foreground text-center font-['Times',serif]">
                By signing up, you agree to our Terms of Use and acknowledge our Privacy Policy
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifySubmit} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-['Times',serif] text-muted-foreground mb-2">
                  Verification code
                </label>
                <Input
                  id="code"
                  type="text"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full bg-background border-border text-foreground rounded-sm focus:border-primary font-['Times',serif] text-center text-2xl tracking-widest py-6"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-['Teko',sans-serif] text-xl py-6 rounded-sm transition-all duration-200"
              >
                Verify & Continue
              </Button>

              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-sm text-muted-foreground hover:text-foreground underline font-['Times',serif]"
                >
                  Use a different number
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}