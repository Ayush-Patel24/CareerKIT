import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardContent } from '../components/ui/Card';
import { Mail, Lock, User, FileText, AlertCircle } from 'lucide-react';
import { GoogleIcon } from '../components/ui/BrandIcons';
import './Auth.css';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, isSupabaseConfigured } = useAuth();
  const toast = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide an email and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const { data, error: authError } = await signUp({ email, password, fullName });
      if (authError) {
        setError(authError.message || 'Signup failed');
      } else if (data?.user && !data?.session) {
        toast.info('Account created! Please check your email to confirm, or sign in.');
        setError(
          'Account created! A confirmation link was sent to your email. Please click the link in your email to activate your account.'
        );
      } else {
        toast.success('Account created! Welcome to CareerKit.');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    if (!isSupabaseConfigured) {
      toast.info('Google OAuth requires Supabase project configuration in .env');
      return;
    }

    setIsGoogleLoading(true);
    try {
      const { error: authError } = await signInWithGoogle();
      if (authError) {
        setError(authError.message || 'Google sign-up failed');
        setIsGoogleLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Google sign-up failed');
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
          <h1 className="auth-heading">Create your free account</h1>
          <p className="auth-sub">Start building ATS-optimized resumes and tracking career insights</p>
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
                label="Full name"
                placeholder="Alex Morgan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                leftIcon={<User size={15} />}
              />

              <Input
                label="Email address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                leftIcon={<Mail size={15} />}
              />

              <Input
                label="Password"
                type="password"
                placeholder="•••••••• (Min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                leftIcon={<Lock size={15} />}
                helperText="Must contain at least 6 characters"
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                Create Account
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
              onClick={handleGoogleSignUp}
              isLoading={isGoogleLoading}
              leftIcon={<GoogleIcon size={16} />}
            >
              Sign up with Google
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover-underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
