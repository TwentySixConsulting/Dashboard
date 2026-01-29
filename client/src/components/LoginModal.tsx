import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { X, Loader2, AlertCircle, Check } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { signIn, signInWithMagicLink } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error);
    } else {
      onClose();
    }
    setLoading(false);
  }

  async function handleMagicLink() {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setLoading(true);
    setError(null);

    const result = await signInWithMagicLink(email);
    if (result.error) {
      setError(result.error);
    } else {
      setMagicLinkSent(true);
    }
    setLoading(false);
  }

  if (magicLinkSent) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
        <Card className="p-8 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Check your email</h2>
            <p className="text-slate-600 mb-4">
              We sent a login link to <strong>{email}</strong>
            </p>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <Card className="p-8 max-w-md w-full mx-4 relative" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded"
          data-testid="button-close-login"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>

        <h2 className="text-xl font-bold text-center mb-2">Admin Login</h2>
        <p className="text-slate-600 text-center mb-6">Sign in to edit dashboard content</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              data-testid="input-login-email"
            />
          </div>
          <div>
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              data-testid="input-login-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading} data-testid="button-submit-login">
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Sign In
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500">Or</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleMagicLink}
          disabled={loading}
          data-testid="button-send-magic-link"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          Send Magic Link
        </Button>
      </Card>
    </div>
  );
}
