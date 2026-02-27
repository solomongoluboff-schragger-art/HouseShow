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
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Header */}
      <div className="bg-[#0D0D0D] border-b border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[#E8E6E1] hover:text-[#FF6B35] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-['Teko',sans-serif] text-xl">Back</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Auth Form Section */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm p-8">
          <div className="text-center mb-8">
            <h1 className="font-['Teko',sans-serif] text-5xl font-bold text-[#E8E6E1] mb-2">
              {step === 'phone' ? 'Welcome to houseshow' : 'Verify your number'}
            </h1>
            <p className="text-[#9CA3AF] font-['Times',serif]">
              {step === 'phone' 
                ? 'Enter your phone number to continue' 
                : `We sent a code to ${phoneNumber}`}
            </p>
          </div>

          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-['Times',serif] text-[#9CA3AF] mb-2">
                  Phone number
                </label>
                <div className="flex gap-3">
                  <select 
                    className="bg-[#0D0D0D] border border-[#2a2a2a] text-[#E8E6E1] rounded-sm px-3 py-3 focus:outline-none focus:border-[#FF6B35] font-['Times',serif]"
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
                    className="flex-1 bg-[#0D0D0D] border-[#2a2a2a] text-[#E8E6E1] rounded-sm focus:border-[#FF6B35] font-['Times',serif] text-lg py-6"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full bg-[#FF6B35] hover:bg-[#ff8555] text-[#E8E6E1] font-['Teko',sans-serif] text-xl py-6 rounded-sm transition-all duration-200"
              >
                Next
              </Button>

              <p className="text-xs text-[#6B7280] text-center font-['Times',serif]">
                By signing up, you agree to our Terms of Use and acknowledge our Privacy Policy
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifySubmit} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-['Times',serif] text-[#9CA3AF] mb-2">
                  Verification code
                </label>
                <Input
                  id="code"
                  type="text"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full bg-[#0D0D0D] border-[#2a2a2a] text-[#E8E6E1] rounded-sm focus:border-[#FF6B35] font-['Times',serif] text-center text-2xl tracking-widest py-6"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-[#FF6B35] hover:bg-[#ff8555] text-[#E8E6E1] font-['Teko',sans-serif] text-xl py-6 rounded-sm transition-all duration-200"
              >
                Verify & Continue
              </Button>

              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-sm text-[#9CA3AF] hover:text-[#E8E6E1] underline font-['Times',serif]"
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