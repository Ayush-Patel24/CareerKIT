import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardContent } from '../components/ui/Card';
import { Mail, ArrowLeft, CheckCircle, FileText } from 'lucide-react';
import './Auth.css';

export default function ForgotPasswordPage() {
  const { resetPasswordForEmail, isSupabaseConfigured } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your email address.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const { error: resetErr } = await resetPasswordForEmail(email);
      if (resetErr) {
        setError(resetErr.message || 'Could not send reset link');
      } else {
        setSubmitted(true);
        toast.success('Password reset link sent!');
      }
    } catch (err) {
      setError(err.message || 'Password reset request failed');
    } finally {
      setIsLoading(false);
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
          <h1 className="auth-heading">Reset your password</h1>
          <p className="auth-sub">Enter your email and we will send you a secure link to reset it</p>
        </div>

        <Card>
          <CardContent>
            {submitted ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-50 text-green-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={24} />
                </div>
                <h3 className="text-base font-semibold mb-1">Check your inbox</h3>
                <p className="text-xs text-muted mb-4">
                  We've sent a password reset link to <strong>{email}</strong>.
                </p>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {error && <div className="auth-error-alert">{error}</div>}

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

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full mt-2"
                    isLoading={isLoading}
                  >
                    Send Reset Link
                  </Button>
                </form>

                <div className="text-center mt-4">
                  <Link to="/login" className="inline-flex items-center gap-1 text-xs text-muted hover-underline">
                    <ArrowLeft size={13} /> Back to Sign In
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
