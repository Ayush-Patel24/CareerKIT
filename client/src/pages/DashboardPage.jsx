import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useResume } from '../context/ResumeContext';
import { useToast } from '../context/ToastContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getTemplateById } from '../templates';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import ConfirmModal from '../components/ui/ConfirmModal';
import {
  Plus,
  Sparkles,
  FileText,
  Copy,
  Trash2,
  Clock,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import './DashboardPage.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { resumes, createResume, deleteResume, duplicateResume, selectResume } = useResume();
  const toast = useToast();

  const [analyses, setAnalyses] = useState([]);
  const [deleteTargetResume, setDeleteTargetResume] = useState(null);
  const [deleteTargetAnalysis, setDeleteTargetAnalysis] = useState(null);

  // Load analyses from Supabase or localStorage
  useEffect(() => {
    async function fetchAnalyses() {
      if (isSupabaseConfigured && supabase && user && !user.id?.startsWith('local-')) {
        try {
          const { data, error } = await supabase
            .from('analyses')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (!error && data) {
            const mapped = data.map((a) => ({
              id: a.id,
              resumeTitle: a.resume_title,
              score: a.score,
              jobDescription: a.job_description,
              result: a.result,
              createdAt: a.created_at,
            }));
            setAnalyses(mapped);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }

      // Local fallback
      try {
        const local = JSON.parse(localStorage.getItem('careerkit_analyses') || '[]');
        setAnalyses(local);
      } catch {
        setAnalyses([]);
      }
    }

    fetchAnalyses();
  }, [user]);

  // Handle New Resume
  const handleCreateNew = () => {
    const newResume = createResume('My New Resume', 'classic');
    toast.success('Created new resume!');
    navigate(`/builder?id=${newResume.id}`);
  };

  // Handle Edit Resume
  const handleEdit = (id) => {
    selectResume(id);
    navigate(`/builder?id=${id}`);
  };

  // Handle Duplicate Resume
  const handleDuplicate = async (id) => {
    try {
      const copy = await duplicateResume(id);
      toast.success(`Created copy: ${copy.title}`);
    } catch {
      toast.error('Failed to duplicate resume');
    }
  };

  // Confirm delete resume
  const handleConfirmDeleteResume = async () => {
    if (!deleteTargetResume) return;
    try {
      await deleteResume(deleteTargetResume.id);
      toast.success('Resume deleted');
      setDeleteTargetResume(null);
    } catch {
      toast.error('Failed to delete resume');
    }
  };

  // Delete analysis
  const handleConfirmDeleteAnalysis = async () => {
    if (!deleteTargetAnalysis) return;
    const id = deleteTargetAnalysis.id;

    if (isSupabaseConfigured && supabase && user) {
      try {
        await supabase.from('analyses').delete().eq('id', id).eq('user_id', user.id);
      } catch (e) {
        console.error(e);
      }
    }

    setAnalyses((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      localStorage.setItem('careerkit_analyses', JSON.stringify(filtered));
      return filtered;
    });

    toast.success('Analysis record deleted');
    setDeleteTargetAnalysis(null);
  };

  // Compute real metrics
  const totalResumes = resumes.length;
  const totalAnalyses = analyses.length;
  const avgScore =
    analyses.length > 0
      ? Math.round(analyses.reduce((acc, a) => acc + (a.score || 0), 0) / analyses.length)
      : 0;

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Job Seeker';

  return (
    <div className="container page-content">
      {/* Welcome Banner */}
      <div className="dashboard-welcome-banner">
        <div>
          <h1 className="dashboard-welcome-title">Welcome back, {displayName}</h1>
          <p className="dashboard-welcome-subtitle">
            Manage your resumes, review AI diagnostics, and customize ATS templates.
          </p>
        </div>
        <div className="dashboard-top-actions">
          <Button variant="outline" size="md" onClick={() => navigate('/analyzer')} leftIcon={<Sparkles size={15} />}>
            Analyze Resume
          </Button>
          <Button variant="primary" size="md" onClick={handleCreateNew} leftIcon={<Plus size={15} />}>
            Create New Resume
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap">
            <FileText size={20} />
          </div>
          <div>
            <div className="stat-value">{totalResumes}</div>
            <div className="stat-label">Active Resumes</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="stat-value">{totalAnalyses}</div>
            <div className="stat-label">Resumes Analyzed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="stat-value">{avgScore > 0 ? `${avgScore}%` : 'N/A'}</div>
            <div className="stat-label">Average ATS Match Score</div>
          </div>
        </div>
      </div>

      {/* Resumes Section */}
      <div className="dashboard-section mt-10">
        <div className="dashboard-section-head">
          <div>
            <h2 className="dashboard-section-title">Your Resumes ({totalResumes})</h2>
            <p className="dashboard-section-desc">Create multiple tailored versions for different job applications.</p>
          </div>
          {totalResumes > 0 && (
            <Button variant="outline" size="sm" onClick={handleCreateNew} leftIcon={<Plus size={14} />}>
              New Resume
            </Button>
          )}
        </div>

        {totalResumes === 0 ? (
          <EmptyState
            icon={<FileText size={24} />}
            title="No resumes created yet"
            description="Build your first ATS-friendly resume using our guided multi-section editor and vetted templates."
            actionLabel="Create Resume"
            onAction={handleCreateNew}
            actionIcon={<Plus size={15} />}
          />
        ) : (
          <div className="resumes-grid">
            {resumes.map((resume) => {
              const template = getTemplateById(resume.templateId || 'classic');
              const formattedDate = new Date(resume.updatedAt || resume.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div key={resume.id} className="resume-grid-card">
                  <div className="resume-card-body" onClick={() => handleEdit(resume.id)}>
                    <div className="resume-card-top">
                      <Badge variant="outline" size="sm">
                        {template.name}
                      </Badge>
                      <span className="resume-date-text">
                        <Clock size={11} style={{ display: 'inline', marginRight: 4 }} />
                        {formattedDate}
                      </span>
                    </div>

                    <h3 className="resume-card-title">{resume.title || 'Untitled Resume'}</h3>
                    <p className="resume-card-meta">
                      {resume.content?.personalInfo?.jobTitle || 'No target title specified'}
                    </p>
                  </div>

                  <div className="resume-card-actions">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleEdit(resume.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicate(resume.id)}
                      title="Duplicate resume"
                    >
                      <Copy size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTargetResume(resume)}
                      title="Delete resume"
                      className="btn-danger-hover"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Analyses Section */}
      <div className="dashboard-section mt-12">
        <div className="dashboard-section-head">
          <div>
            <h2 className="dashboard-section-title">Recent Resume Analyses ({totalAnalyses})</h2>
            <p className="dashboard-section-desc">Track past evaluations, scores, and job-description keyword matches.</p>
          </div>
          {totalAnalyses > 0 && (
            <Link to="/history">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />}>
                View All History
              </Button>
            </Link>
          )}
        </div>

        {totalAnalyses === 0 ? (
          <EmptyState
            icon={<Sparkles size={24} />}
            title="No analyses performed yet"
            description="Upload your resume to check its ATS score, uncover missing keywords, and review Gemini recommendations."
            actionLabel="Run First Analysis"
            onAction={() => navigate('/analyzer')}
            actionIcon={<Sparkles size={15} />}
          />
        ) : (
          <div className="analyses-list">
            {analyses.slice(0, 5).map((an) => {
              const formattedDate = new Date(an.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div key={an.id} className="analysis-row-card">
                  <div className="analysis-row-left">
                    <div
                      className={`score-pill ${
                        an.score >= 80 ? 'score-high' : an.score >= 60 ? 'score-mid' : 'score-low'
                      }`}
                    >
                      {an.score}/100
                    </div>
                    <div>
                      <h4 className="analysis-row-title">{an.resumeTitle || 'Analyzed Resume'}</h4>
                      <p className="analysis-row-meta">
                        {formattedDate} {an.jobDescription && '• Custom Job Description Matched'}
                      </p>
                    </div>
                  </div>

                  <div className="analysis-row-actions">
                    <Link to={`/analyzer`}>
                      <Button variant="outline" size="sm">
                        New Analysis
                      </Button>
                    </Link>
                    <button
                      type="button"
                      className="icon-btn icon-btn-danger"
                      onClick={() => setDeleteTargetAnalysis(an)}
                      title="Delete record"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal for Resume */}
      <ConfirmModal
        isOpen={!!deleteTargetResume}
        onClose={() => setDeleteTargetResume(null)}
        onConfirm={handleConfirmDeleteResume}
        title="Delete Resume?"
        description={`Are you sure you want to delete "${deleteTargetResume?.title}"? This action cannot be undone.`}
        confirmText="Delete Resume"
      />

      {/* Delete Confirmation Modal for Analysis */}
      <ConfirmModal
        isOpen={!!deleteTargetAnalysis}
        onClose={() => setDeleteTargetAnalysis(null)}
        onConfirm={handleConfirmDeleteAnalysis}
        title="Delete Analysis History?"
        description="Are you sure you want to remove this analysis record from your history?"
        confirmText="Delete Record"
      />
    </div>
  );
}
