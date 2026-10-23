import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardContent } from '../components/ui/Card';
import { Mail, Lock, FileText, AlertCircle } from 'lucide-react';
import { GoogleIcon } from '../components/ui/BrandIcons';
import './Auth.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInWithGoogle, isSupabaseConfigured } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const { error: authError } = await signIn({ email, password });
      if (authError) {
        if (authError.message?.toLowerCase().includes('email not confirmed')) {
          setError('Email not confirmed yet. Please check your Gmail/inbox for the Supabase confirmation email, or turn off "Confirm email" in your Supabase Dashboard.');
        } else {
          setError(authError.message || 'Invalid login credentials');
        }
      } else {
        toast.success('Signed in successfully!');
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    if (!isSupabaseConfigured) {
      toast.info('Google OAuth requires Supabase project configuration in .env');
      return;
    }

    setIsGoogleLoading(true);
    try {
      const { error: authError } = await signInWithGoogle();
      if (authError) {
        setError(authError.message || 'Google sign-in failed');
        setIsGoogleLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-wrap animate-fade-in">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="logo-icon">
              <FileText size={18} />
            </div>
            <span className="logo-text">
              Career<span>Kit</span>
            </span>
          </Link>
          <h1 className="auth-heading">Sign in to your account</h1>
          <p className="auth-sub">Access your saved resumes, templates, and AI analyses</p>
        </div>

        <Card>
          <CardContent>
            {error && (
              <div className="auth-error-alert">
                <div className="flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <div className="flex-1 text-xs leading-relaxed">{error}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <Input
                label="Email address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                leftIcon={<Mail size={15} />}
              />

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="input-label" style={{ margin: 0 }}>Password</span>
                  <Link to="/forgot-password" className="text-xs text-muted hover-underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  leftIcon={<Lock size={15} />}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="md"
              className="w-full"
              onClick={handleGoogleSignIn}
              isLoading={isGoogleLoading}
              leftIcon={<GoogleIcon size={16} />}
            >
              Continue with Google
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted mt-6">
          Don't have an account yet?{' '}
          <Link to="/signup" className="text-primary font-semibold hover-underline">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
