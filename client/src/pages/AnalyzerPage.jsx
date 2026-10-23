import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import Button from '../components/ui/Button';
import Textarea from '../components/ui/Textarea';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import {
  Upload,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Info,
  ArrowRight,
  TrendingUp,
  Target,
  FileCheck,
} from 'lucide-react';
import './AnalyzerPage.css';

export default function AnalyzerPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [inputMode, setInputMode] = useState('upload'); // 'upload' | 'paste'
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeTitle, setResumeTitle] = useState('My Uploaded Resume');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Handle Document File Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File exceeds 5MB size limit. Please upload a smaller document.');
      return;
    }

    const extension = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(extension)) {
      toast.error('Unsupported file format. Please upload a PDF, DOCX, or TXT file.');
      return;
    }

    setUploadedFileName(file.name);
    setResumeTitle(file.name.replace(/\.[^/.]+$/, ''));
    setIsExtracting(true);

    try {
      if (extension === 'txt') {
        const text = await file.text();
        setResumeText(text);
        toast.success(`Extracted text from ${file.name}`);
      } else {
        const data = await api.extractDocumentText(file);
        if (data.text) {
          setResumeText(data.text);
          toast.success(`Extracted text from ${file.name}`);
        } else {
          toast.warning('Extracted document was empty. You can paste your resume text below.');
        }
      }
    } catch (err) {
      toast.error(err.message || 'Could not extract file text. You can paste your resume text directly.');
      setInputMode('paste');
    } finally {
      setIsExtracting(false);
    }
  };

  // Run Gemini Analysis
  const handleAnalyze = async () => {
    if (!resumeText || resumeText.trim().length < 40) {
      toast.warning('Please provide your resume content (at least 40 characters) to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await api.analyzeResume({
        resumeText,
        jobDescription,
        resumeTitle,
      });

      if (response.success && response.analysis) {
        setAnalysisResult(response.analysis);
        toast.success('Resume analysis completed!');

        // Save to Supabase analyses or local storage
        await saveAnalysisRecord(response.analysis);
      } else {
        throw new Error(response.message || 'Invalid analysis response format');
      }
    } catch (err) {
      console.error(err);
      toast.error('Analysis failed: ' + (err.message || 'Check server and Gemini API key'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Persist analysis record
  const saveAnalysisRecord = async (analysisData) => {
    const record = {
      id: 'an-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      resumeTitle: resumeTitle || 'Uploaded Resume',
      score: analysisData.overallScore || 0,
      jobDescription: jobDescription || '',
      result: analysisData,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase && user && !user.id?.startsWith('local-')) {
      try {
        await supabase.from('analyses').insert({
          user_id: user.id,
          resume_title: record.resumeTitle,
          score: record.score,
          job_description: record.jobDescription,
          result: record.result,
        });
      } catch (e) {
        console.error('Failed to save analysis to Supabase:', e);
      }
    }

    // Always keep in local storage history
    try {
      const existing = JSON.parse(localStorage.getItem('careerkit_analyses') || '[]');
      localStorage.setItem('careerkit_analyses', JSON.stringify([record, ...existing]));
    } catch (e) {
      console.error('Local history save error:', e);
    }
  };

  return (
    <div className="container page-content">
      {/* Page Title */}
      <div className="analyzer-header">
        <Badge variant="default" size="sm" className="mb-2">
          Gemini AI Engine
        </Badge>
        <h1 className="analyzer-title">AI Resume Analyzer & ATS Checker</h1>
        <p className="analyzer-subtitle">
          Upload your resume or paste text to receive an objective evaluation of your ATS readability, action verbs, keyword matching, and target job fit.
        </p>
      </div>

      <div className="analyzer-layout-grid">
        {/* Left Column: Input Panel */}
        <div className="analyzer-input-column">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>1. Resume Content</CardTitle>
                <div className="mode-toggle-group">
                  <button
                    type="button"
                    className={`mode-toggle-btn ${inputMode === 'upload' ? 'active' : ''}`}
                    onClick={() => setInputMode('upload')}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    className={`mode-toggle-btn ${inputMode === 'paste' ? 'active' : ''}`}
                    onClick={() => setInputMode('paste')}
                  >
                    Paste Text
                  </button>
                </div>
              </div>
              <CardDescription>
                Provide your latest resume in PDF, DOCX, or raw text format.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {inputMode === 'upload' ? (
                <div className="upload-dropzone">
                  <input
                    type="file"
                    id="resume-file-input"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileUpload}
                    className="file-hidden-input"
                    disabled={isExtracting}
                  />
                  <label htmlFor="resume-file-input" className="dropzone-label">
                    <div className="dropzone-icon">
                      {isExtracting ? (
                        <div className="animate-spin">
                          <Sparkles size={24} />
                        </div>
                      ) : (
                        <Upload size={24} />
                      )}
                    </div>
                    <span className="dropzone-text">
                      {isExtracting
                        ? 'Extracting document text...'
                        : uploadedFileName
                        ? `Selected: ${uploadedFileName}`
                        : 'Choose PDF or DOCX file (or drag & drop)'}
                    </span>
                    <span className="dropzone-hint">Supported: PDF, DOCX, TXT • Max 5MB</span>
                  </label>
                </div>
              ) : (
                <Textarea
                  placeholder="Paste the full text of your resume here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={9}
                  label="Resume Text"
                />
              )}

              {resumeText && inputMode === 'upload' && (
                <div className="extracted-preview-box">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-secondary flex items-center gap-1">
                      <FileCheck size={14} /> Document Text Extracted ({resumeText.length} characters)
                    </span>
                    <button
                      type="button"
                      className="text-xs text-muted hover-underline"
                      onClick={() => setInputMode('paste')}
                    >
                      View / Edit Text
                    </button>
                  </div>
                  <p className="text-xs text-muted line-clamp-3 font-mono">
                    {resumeText.substring(0, 240)}...
                  </p>
                </div>
              )}

              {/* Optional Job Description */}
              <div className="mt-4">
                <Textarea
                  label="Target Job Description (Optional)"
                  placeholder="Paste the target job description or key requirements here to analyze keyword matches, skill gaps, and role fit..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={5}
                  helperText="Providing a job description unlocks tailored ATS keyword matching and role fit scoring."
                />
              </div>

              <div className="mt-4">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleAnalyze}
                  isLoading={isAnalyzing}
                  disabled={!resumeText || isExtracting}
                  leftIcon={<Sparkles size={16} />}
                >
                  {isAnalyzing ? 'Analyzing with Gemini AI...' : 'Analyze Resume'}
                </Button>
              </div>

              <div className="honest-score-notice mt-3">
                <Info size={14} className="flex-shrink-0" />
                <p>
                  <strong>Transparency Note:</strong> CareerKit estimates ATS compatibility via algorithmic heuristics. Different corporate ATS systems (Workday, Taleo, Greenhouse) behave differently.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Analysis Results Panel */}
        <div className="analyzer-results-column">
          {!analysisResult && !isAnalyzing && (
            <div className="results-placeholder-card">
              <div className="results-placeholder-icon">
                <Target size={32} />
              </div>
              <h3 className="results-placeholder-title">Awaiting Resume Input</h3>
              <p className="results-placeholder-desc">
                Upload your resume on the left and click <strong>Analyze Resume</strong> to receive instant ATS metrics, category breakdowns, missing keywords, and actionable suggestions.
              </p>
            </div>
          )}

          {isAnalyzing && (
            <div className="results-loading-card">
              <div className="loading-radar-ring">
                <Sparkles size={32} className="animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold mt-4">Evaluating Resume with AI...</h3>
              <p className="text-sm text-muted text-center max-w-sm mt-1">
                Scanning impact metrics, ATS formatting, keyword density, and action verbs. This takes 4–8 seconds.
              </p>
            </div>
          )}

          {analysisResult && (
            <div className="analysis-report-container animate-fade-in">
              {/* Overall Score Banner */}
              <div className="score-hero-banner">
                <div className="score-circle-wrap">
                  <div className="score-number">{analysisResult.overallScore || 0}</div>
                  <div className="score-denom">/ 100</div>
                </div>
                <div className="score-hero-info">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="score-title">Estimated ATS Compatibility</h2>
                    <Badge
                      variant={
                        analysisResult.overallScore >= 80
                          ? 'success'
                          : analysisResult.overallScore >= 60
                          ? 'warning'
                          : 'danger'
                      }
                    >
                      {analysisResult.overallScore >= 80
                        ? 'Strong Match'
                        : analysisResult.overallScore >= 60
                        ? 'Needs Polish'
                        : 'Significant Gaps'}
                    </Badge>
                  </div>
                  <p className="score-summary-text">{analysisResult.summaryReview}</p>
                </div>
              </div>

              {/* Category Scores */}
              {analysisResult.categories && (
                <div className="category-scores-grid">
                  {Object.entries(analysisResult.categories).map(([key, cat]) => (
                    <div key={key} className="category-card">
                      <div className="category-card-top">
                        <span className="category-label">{cat.name || key}</span>
                        <span className="category-score">{cat.score}/100</span>
                      </div>
                      <div className="category-progress-track">
                        <div
                          className="category-progress-fill"
                          style={{ width: `${cat.score}%` }}
                        />
                      </div>
                      <p className="category-feedback">{cat.feedback}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Job Description Match Section (if JD was provided) */}
              {analysisResult.jobMatch && (
                <Card className="mb-4">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Target size={18} /> Target Job Match Analysis
                      </CardTitle>
                      <Badge variant="info">
                        Match Score: {analysisResult.jobMatch.matchPercentage}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-secondary mb-3">
                      {analysisResult.jobMatch.analysis}
                    </p>

                    {analysisResult.jobMatch.matchingKeywords?.length > 0 && (
                      <div className="mb-3">
                        <span className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-1">
                          Matching Keywords Found:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {analysisResult.jobMatch.matchingKeywords.map((kw, idx) => (
                            <Badge key={idx} variant="success" size="sm">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysisResult.jobMatch.missingKeywords?.length > 0 && (
                      <div>
                        <span className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-1">
                          Key Terms Missing from Your Resume:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {analysisResult.jobMatch.missingKeywords.map((kw, idx) => (
                            <Badge key={idx} variant="danger" size="sm">
                              + {kw}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Key Strengths & Weaknesses */}
              <div className="report-two-col-grid">
                {/* Strengths */}
                <div className="report-box strengths-box">
                  <h3 className="report-box-title text-success flex items-center gap-2">
                    <CheckCircle size={16} /> Key Strengths
                  </h3>
                  <ul className="report-points-list">
                    {analysisResult.strengths?.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div className="report-box weaknesses-box">
                  <h3 className="report-box-title text-warning flex items-center gap-2">
                    <AlertTriangle size={16} /> Areas for Improvement
                  </h3>
                  <ul className="report-points-list">
                    {analysisResult.improvements?.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actionable Next Steps */}
              {analysisResult.actionableSteps?.length > 0 && (
                <div className="actionable-steps-card">
                  <h3 className="actionable-title flex items-center gap-2">
                    <TrendingUp size={16} /> Recommended Action Steps
                  </h3>
                  <ol className="actionable-numbered-list">
                    {analysisResult.actionableSteps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>

                  <div className="actionable-card-footer">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate('/builder')}
                      rightIcon={<ArrowRight size={14} />}
                    >
                      Open Resume Builder to Apply Improvements
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
