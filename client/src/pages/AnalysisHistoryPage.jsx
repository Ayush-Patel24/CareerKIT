import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import ConfirmModal from '../components/ui/ConfirmModal';
import Modal from '../components/ui/Modal';
import {
  Sparkles,
  Trash2,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Eye,
} from 'lucide-react';

export default function AnalysisHistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [analyses, setAnalyses] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewingAnalysis, setViewingAnalysis] = useState(null);

  const fetchAnalyses = useCallback(async () => {
    try {
      if (isSupabaseConfigured && supabase && user && !user.id?.startsWith('local-')) {
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
      }

      // Local fallback
      const local = JSON.parse(localStorage.getItem('careerkit_analyses') || '[]');
      setAnalyses(local);
    } catch (err) {
      console.error(err);
      toast.error('Could not load analysis history');
    }
  }, [user, toast]);

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;

    try {
      if (isSupabaseConfigured && supabase && user && !user.id?.startsWith('local-')) {
        await supabase.from('analyses').delete().eq('id', id).eq('user_id', user.id);
      }

      setAnalyses((prev) => {
        const filtered = prev.filter((a) => a.id !== id);
        localStorage.setItem('careerkit_analyses', JSON.stringify(filtered));
        return filtered;
      });

      toast.success('Analysis deleted');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete analysis');
    }
  };

  return (
    <div className="container page-content">
      <div className="flex items-center justify-between mb-8 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold">Resume Analysis History</h1>
          <p className="text-sm text-muted">
            Review past scores, keyword evaluations, and ATS recommendations.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/analyzer')}
          leftIcon={<Sparkles size={14} />}
        >
          New Analysis
        </Button>
      </div>

      {analyses.length === 0 ? (
        <EmptyState
          icon={<Sparkles size={24} />}
          title="No past analyses found"
          description="You haven't run any resume analyses yet. Run an ATS check to identify missing keywords and formatting improvements."
          actionLabel="Run First Analysis"
          onAction={() => navigate('/analyzer')}
          actionIcon={<Sparkles size={15} />}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {analyses.map((an) => {
            const dateStr = new Date(an.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={an.id}
                className="card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`score-pill ${
                      an.score >= 80 ? 'score-high' : an.score >= 60 ? 'score-mid' : 'score-low'
                    }`}
                  >
                    {an.score}/100
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">{an.resumeTitle || 'Resume Analysis'}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted mt-1">
                      <span>{dateStr}</span>
                      {an.jobDescription && (
                        <Badge variant="outline" size="sm">
                          Job Description Matched
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewingAnalysis(an)}
                    leftIcon={<Eye size={14} />}
                  >
                    View Report
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteTarget(an)}
                    title="Delete record"
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Analysis History?"
        description="Are you sure you want to delete this analysis report from your history?"
        confirmText="Delete Record"
      />

      {/* View Full Analysis Modal */}
      {viewingAnalysis && (
        <Modal
          isOpen={!!viewingAnalysis}
          onClose={() => setViewingAnalysis(null)}
          title={`${viewingAnalysis.resumeTitle || 'Resume'} — Analysis Report`}
          description={`Overall Score: ${viewingAnalysis.score}/100`}
          maxWidth="700px"
        >
          <div className="flex flex-col gap-4">
            <p className="text-sm text-secondary">
              {viewingAnalysis.result?.summaryReview || 'Detailed evaluation report.'}
            </p>

            {/* Strengths */}
            {viewingAnalysis.result?.strengths?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-success uppercase tracking-wider mb-2 flex items-center gap-1">
                  <CheckCircle size={14} /> Key Strengths
                </h4>
                <ul className="resume-bullets text-xs">
                  {viewingAnalysis.result.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {viewingAnalysis.result?.improvements?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-warning uppercase tracking-wider mb-2 flex items-center gap-1">
                  <AlertTriangle size={14} /> Areas for Improvement
                </h4>
                <ul className="resume-bullets text-xs">
                  {viewingAnalysis.result.improvements.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actionable Steps */}
            {viewingAnalysis.result?.actionableSteps?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-2">
                  Actionable Next Steps
                </h4>
                <ol className="text-xs text-secondary pl-5 space-y-1">
                  {viewingAnalysis.result.actionableSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewingAnalysis(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setViewingAnalysis(null);
                  navigate('/builder');
                }}
                rightIcon={<ArrowRight size={14} />}
              >
                Edit Resume in Builder
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
