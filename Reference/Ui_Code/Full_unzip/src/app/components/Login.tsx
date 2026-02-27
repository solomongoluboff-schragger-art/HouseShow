import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onBack: () => void;
}

export function Login({ onLogin, onBack }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          ← back
        </Button>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Sign in to your houseshow account
          </p>
        </div>

        <Card className="p-8 border-border shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-foreground mb-2">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input-background border-border"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-foreground mb-2">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input-background border-border"
                placeholder="••••••••"
              />
            </div>

            <Button 
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button className="text-sm text-muted-foreground hover:text-foreground underline">
              Forgot password?
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
