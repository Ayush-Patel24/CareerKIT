import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ConfirmModal from '../components/ui/ConfirmModal';
import { User, Lock, ShieldCheck, Database, LogOut, Download } from 'lucide-react';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, updateProfile, updatePassword, signOut, isSupabaseConfigured } = useAuth();
  const toast = useToast();

  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.full_name || ''
  );
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isClearDataModalOpen, setIsClearDataModalOpen] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await updateProfile({ displayName });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile: ' + err.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await updatePassword(newPassword);
      if (error) throw error;
      toast.success('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error('Password update failed: ' + err.message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleExportData = () => {
    try {
      const resumes = localStorage.getItem('careerkit_saved_resumes') || '[]';
      const analyses = localStorage.getItem('careerkit_analyses') || '[]';
      const exportBlob = new Blob(
        [JSON.stringify({ resumes: JSON.parse(resumes), analyses: JSON.parse(analyses) }, null, 2)],
        { type: 'application/json' }
      );
      const url = URL.createObjectURL(exportBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `careerkit-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully!');
    } catch {
      toast.error('Export failed');
    }
  };

  const handleClearLocalData = () => {
    localStorage.removeItem('careerkit_saved_resumes');
    localStorage.removeItem('careerkit_analyses');
    localStorage.removeItem('careerkit_active_draft');
    toast.info('Local data cleared');
    setIsClearDataModalOpen(false);
    navigate('/');
  };

  const handleConfirmSignOut = async () => {
    await signOut();
    toast.info('Signed out');
    navigate('/');
  };

  return (
    <div className="container page-content" style={{ maxWidth: 760 }}>
      <div className="mb-8 pb-4 border-b">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <p className="text-sm text-muted">
          Manage your personal profile, credentials, and privacy options.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={18} /> Personal Profile
            </CardTitle>
            <CardDescription>Your public display name and account email.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-3">
              <Input
                label="Display Name"
                placeholder="e.g. Alex Morgan"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <Input
                label="Email Address"
                value={user?.email || 'guest@careerkit.local'}
                disabled
                helperText="Email is managed via your authentication provider."
              />
              <div className="flex justify-end mt-2">
                <Button type="submit" variant="primary" size="sm" isLoading={isSavingProfile}>
                  Save Profile
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Password Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={18} /> Password & Security
            </CardTitle>
            <CardDescription>Update your login credentials.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3">
              <div className="grid-2-col">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-end mt-2">
                <Button type="submit" variant="outline" size="sm" isLoading={isUpdatingPassword}>
                  Change Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sync & Cloud Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database size={18} /> Cloud Storage & Sync
            </CardTitle>
            <CardDescription>Persistent storage connection status.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 bg-secondary rounded-md">
              <div>
                <span className="text-sm font-semibold block">Supabase PostgreSQL</span>
                <span className="text-xs text-muted">
                  {isSupabaseConfigured
                    ? 'Connected • Resumes & analyses sync securely to the cloud'
                    : 'Unconfigured • Running in browser local storage fallback mode'}
                </span>
              </div>
              <Badge variant={isSupabaseConfigured ? 'success' : 'warning'}>
                {isSupabaseConfigured ? 'Cloud Sync Active' : 'Local Storage Mode'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck size={18} /> Data & Privacy Controls
            </CardTitle>
            <CardDescription>Export your data or clear local browser storage.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-sm font-medium block">Export Resume & Analysis Data</span>
                <span className="text-xs text-muted">
                  Download all your resumes and analysis history in JSON format.
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportData}
                leftIcon={<Download size={14} />}
              >
                Export JSON
              </Button>
            </div>

            <div className="border-t mt-4 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-sm font-medium text-danger block">Clear Local Cached Data</span>
                <span className="text-xs text-muted">
                  Erase local browser storage for resumes, drafts, and history.
                </span>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setIsClearDataModalOpen(true)}
              >
                Clear Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sign Out Card */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold block">Sign Out</span>
                <span className="text-xs text-muted">End your current session on this device.</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSignOutModalOpen(true)}
                leftIcon={<LogOut size={14} />}
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sign Out Confirmation */}
      <ConfirmModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={handleConfirmSignOut}
        title="Sign Out of CareerKit?"
        description="Are you sure you want to end your session? Make sure your current changes are saved."
        confirmText="Sign Out"
        confirmVariant="primary"
      />

      {/* Clear Data Confirmation */}
      <ConfirmModal
        isOpen={isClearDataModalOpen}
        onClose={() => setIsClearDataModalOpen(false)}
        onConfirm={handleClearLocalData}
        title="Clear Local Data?"
        description="This will clear locally cached resumes and analysis records from this browser. This cannot be undone."
        confirmText="Erase All Local Data"
        confirmVariant="danger"
      />
    </div>
  );
}
