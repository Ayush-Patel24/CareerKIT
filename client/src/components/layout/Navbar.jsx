import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import {
  FileText,
  Sparkles,
  LayoutTemplate,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  History,
} from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, signOut, isSupabaseConfigured } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.info('Signed out successfully');
      navigate('/');
    } catch (err) {
      toast.error('Failed to sign out: ' + err.message);
    }
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const userInitial = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : 'U';

  return (
    <>
      {!isSupabaseConfigured && (
        <div className="offline-banner">
          <span>
            <strong>Demo / Local Mode:</strong> Supabase keys are not set yet. Resumes & analyses are saved locally in your browser storage.
          </span>
        </div>
      )}
      <header className="navbar-header">
        <div className="container navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <div className="logo-icon">
              <FileText size={18} strokeWidth={2.2} />
            </div>
            <span className="logo-text">
              Career<span>Kit</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="desktop-nav">
            <NavLink
              to="/builder"
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              <FileText size={16} />
              <span>Builder</span>
            </NavLink>
            <NavLink
              to="/templates"
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              <LayoutTemplate size={16} />
              <span>Templates</span>
            </NavLink>
            <NavLink
              to="/analyzer"
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              <Sparkles size={16} />
              <span>AI Analyzer</span>
            </NavLink>
            {user && (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                >
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink
                  to="/history"
                  className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                >
                  <History size={16} />
                  <span>History</span>
                </NavLink>
              </>
            )}
          </nav>

          {/* Auth Actions (Desktop) */}
          <div className="desktop-auth">
            {user ? (
              <div className="user-menu-wrapper">
                <button
                  type="button"
                  className="user-avatar-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-expanded={userDropdownOpen}
                >
                  <span className="user-initial">{userInitial}</span>
                  <span className="user-display-name">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="user-dropdown animate-fade-in">
                    <div className="user-dropdown-header">
                      <p className="dropdown-name">{user.user_metadata?.full_name || 'Job Seeker'}</p>
                      <p className="dropdown-email">{user.email}</p>
                    </div>
                    <div className="dropdown-divider" />
                    <Link
                      to="/settings"
                      className="dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <User size={15} />
                      <span>Account Settings</span>
                    </Link>
                    <button
                      type="button"
                      className="dropdown-item dropdown-item-danger"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleSignOut();
                      }}
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="guest-actions">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/builder">
                  <Button variant="primary" size="sm">
                    Create Resume
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu animate-fade-in">
            <nav className="mobile-nav-links">
              <NavLink
                to="/builder"
                className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <FileText size={18} />
                <span>Resume Builder</span>
              </NavLink>
              <NavLink
                to="/templates"
                className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <LayoutTemplate size={18} />
                <span>Templates</span>
              </NavLink>
              <NavLink
                to="/analyzer"
                className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <Sparkles size={18} />
                <span>AI Analyzer</span>
              </NavLink>
              {user && (
                <>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </NavLink>
                  <NavLink
                    to="/history"
                    className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    <History size={18} />
                    <span>Analysis History</span>
                  </NavLink>
                  <NavLink
                    to="/settings"
                    className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    <User size={18} />
                    <span>Account Settings</span>
                  </NavLink>
                </>
              )}
            </nav>

            <div className="mobile-menu-auth">
              {user ? (
                <Button
                  variant="outline"
                  size="md"
                  className="w-full"
                  onClick={() => {
                    closeMenu();
                    handleSignOut();
                  }}
                  leftIcon={<LogOut size={16} />}
                >
                  Sign Out
                </Button>
              ) : (
                <div className="mobile-auth-btns">
                  <Link to="/login" onClick={closeMenu} className="w-full">
                    <Button variant="outline" size="md" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/builder" onClick={closeMenu} className="w-full">
                    <Button variant="primary" size="md" className="w-full">
                      Create Resume
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
