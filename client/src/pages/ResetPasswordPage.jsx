import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardContent } from '../components/ui/Card';
import { Lock, FileText } from 'lucide-react';
import './Auth.css';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const toast = useToast();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const { error: updateErr } = await updatePassword(newPassword);
      if (updateErr) {
        setError(updateErr.message || 'Failed to update password');
      } else {
        toast.success('Password updated successfully!');
        navigate('/login');
      }
    } catch (err) {
      setError(err.message || 'Error updating password');
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
          <h1 className="auth-heading">Set new password</h1>
          <p className="auth-sub">Choose a strong, secure password for your account</p>
        </div>

        <Card>
          <CardContent>
            {error && <div className="auth-error-alert">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                leftIcon={<Lock size={15} />}
                helperText="Minimum 6 characters"
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                leftIcon={<Lock size={15} />}
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
