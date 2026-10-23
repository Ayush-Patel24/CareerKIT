import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-icon-sm">
                <FileText size={16} />
              </div>
              <span>CareerKit</span>
            </Link>
            <p className="footer-tagline">
              Open, accessible AI-powered resume building & career intelligence. Free templates, ATS-ready layouts, and actionable AI feedback.
            </p>
          </div>

          <div className="footer-nav-grid">
            <div className="footer-col">
              <h4 className="footer-col-title">Product</h4>
              <ul className="footer-links">
                <li><Link to="/builder">Resume Builder</Link></li>
                <li><Link to="/templates">Templates Gallery</Link></li>
                <li><Link to="/analyzer">AI Resume Analyzer</Link></li>
                <li><Link to="/dashboard">User Dashboard</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Templates</h4>
              <ul className="footer-links">
                <li><Link to="/builder?template=classic">ATS Classic</Link></li>
                <li><Link to="/builder?template=professional">Executive Professional</Link></li>
                <li><Link to="/builder?template=modern">Modern Minimal</Link></li>
                <li><Link to="/builder?template=compact">Compact One-Page</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Security & Ethics</h4>
              <ul className="footer-links">
                <li><span className="footer-note">No Paywalls</span></li>
                <li><span className="footer-note">Client Privacy First</span></li>
                <li><span className="footer-note">Transparent AI Scoring</span></li>
                <li><span className="footer-note">Zero AI Fabrication</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} CareerKit. Built for job seekers, students, and professionals.
          </p>
          <div className="footer-bottom-links">
            <span>ATS-friendly standard</span>
            <span>•</span>
            <span>Gemini AI Engine</span>
            <span>•</span>
            <span>Supabase Cloud</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
