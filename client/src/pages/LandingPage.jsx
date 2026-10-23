import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { TEMPLATES } from '../templates';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Download,
  Target,
  Cpu,
  Layers,
} from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <Badge variant="outline" size="md" className="hero-pill animate-fade-in">
            <Sparkles size={13} />
            <span>Open, Free & Powered by Google Gemini AI</span>
          </Badge>

          <h1 className="hero-headline">
            Build ATS-Ready Resumes.<br />
            Accelerated by Gemini AI.
          </h1>

          <p className="hero-subheadline">
            Create professional resumes designed for human recruiters and modern applicant tracking systems. Free templates, zero paywalls, instant PDF downloads, and real AI analysis.
          </p>

          <div className="hero-actions">
            <Link to="/builder">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                Create Your Resume
              </Button>
            </Link>
            <Link to="/analyzer">
              <Button variant="outline" size="lg" leftIcon={<Sparkles size={16} />}>
                Analyze Existing Resume
              </Button>
            </Link>
          </div>

          <div className="hero-social-proof">
            <span>ATS Tested</span>
            <span>•</span>
            <span>Zero AI Fabrication</span>
            <span>•</span>
            <span>100% Free Forever</span>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="features-section">
        <div className="container">
          <div className="section-head text-center">
            <h2 className="section-title">Engineered for Results, Not Buzzwords</h2>
            <p className="section-desc">
              Every feature in CareerKit is designed to give students, graduates, and professionals a measurable edge.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Target size={22} />
              </div>
              <h3 className="feature-title">True ATS Compatibility</h3>
              <p className="feature-text">
                Templates built with single-column linear hierarchies, standard headings, and semantic layouts that ATS parsers parse without dropping sections.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Sparkles size={22} />
              </div>
              <h3 className="feature-title">Gemini AI Resume Analysis</h3>
              <p className="feature-text">
                Server-side Gemini integration evaluates action verb strength, quantifiable impact, and keyword density against target job descriptions.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Cpu size={22} />
              </div>
              <h3 className="feature-title">STAR Method Writing Assistant</h3>
              <p className="feature-text">
                AI polishes weak bullet points into high-impact accomplishments using the STAR framework. AI never hallucinates or invents fake credentials.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Download size={22} />
              </div>
              <h3 className="feature-title">Crisp Vector A4 PDF Export</h3>
              <p className="feature-text">
                Download high-resolution A4 PDFs without blurred fonts or clipped margins, or print directly using your browser's native print engine.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <ShieldCheck size={22} />
              </div>
              <h3 className="feature-title">Client-First Privacy</h3>
              <p className="feature-text">
                Your resume data is stored securely in Supabase PostgreSQL with strict Row Level Security (RLS). Offline local drafts ensure you never lose your work.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Layers size={22} />
              </div>
              <h3 className="feature-title">4 Distinct Template Designs</h3>
              <p className="feature-text">
                From ATS Classic to Executive Professional, Modern Asymmetric, and Compact 1-Page layouts. Free to switch anytime with zero data loss.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Template Previews Section */}
      <section className="templates-preview-section">
        <div className="container">
          <div className="section-head text-center">
            <h2 className="section-title">Designed for Every Career Stage</h2>
            <p className="section-desc">
              Select a template and start editing immediately. No account required to draft.
            </p>
          </div>

          <div className="templates-showcase-grid">
            {TEMPLATES.map((t) => (
              <div key={t.id} className="showcase-card">
                <div className="showcase-info">
                  <Badge variant="outline" size="sm">
                    {t.category}
                  </Badge>
                  <h3 className="showcase-name">{t.name}</h3>
                  <p className="showcase-desc">{t.description}</p>
                  <Link to={`/builder?template=${t.id}`} className="mt-auto">
                    <Button variant="outline" size="sm" rightIcon={<ArrowRight size={13} />}>
                      Use Template
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/templates">
              <Button variant="secondary" size="md">
                Browse Full Template Gallery
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-section">
        <div className="container">
          <div className="section-head text-center">
            <h2 className="section-title">How CareerKit Works</h2>
            <p className="section-desc">
              Three simple steps to build and optimize your application materials.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-num">01</div>
              <h3 className="step-title">Input or Upload Content</h3>
              <p className="step-desc">
                Fill in your education, experience, and projects using the guided multi-section editor, or upload an existing PDF/DOCX resume.
              </p>
            </div>

            <div className="step-card">
              <div className="step-num">02</div>
              <h3 className="step-title">Enhance with Gemini AI</h3>
              <p className="step-desc">
                Run the AI Analyzer to uncover missing keywords, calculate your estimated ATS score, and strengthen bullet points before applying.
              </p>
            </div>

            <div className="step-card">
              <div className="step-num">03</div>
              <h3 className="step-title">Export Clean PDF</h3>
              <p className="step-desc">
                Switch between 4 recruiter-vetted templates in real-time and download an A4 PDF ready to submit to job applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2 className="cta-headline">Ready to Upgrade Your Resume?</h2>
            <p className="cta-sub">
              No hidden fees, no subscriptions, and no paywalls. Build a resume that stands out to recruiters today.
            </p>
            <div className="cta-btns">
              <Link to="/builder">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                  Start Building for Free
                </Button>
              </Link>
              <Link to="/analyzer">
                <Button variant="outline" size="lg">
                  Analyze Existing Resume
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
