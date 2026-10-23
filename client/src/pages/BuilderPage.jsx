import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { TEMPLATES, getTemplateById } from '../templates';
import { exportResumeToPDF, printResumeNative } from '../lib/pdfExport';

import PersonalInfoSection from '../components/builder/PersonalInfoSection';
import SummarySection from '../components/builder/SummarySection';
import ExperienceSection from '../components/builder/ExperienceSection';
import EducationSection from '../components/builder/EducationSection';
import SkillsSection from '../components/builder/SkillsSection';
import ProjectsSection from '../components/builder/ProjectsSection';
import AdditionalSections from '../components/builder/AdditionalSections';

import Button from '../components/ui/Button';
import {
  Download,
  Printer,
  Save,
  Check,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  ChevronLeft,
  Eye,
  Edit3,
} from 'lucide-react';
import './Builder.css';

export default function BuilderPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const {
    currentResume,
    updateCurrentResume,
    updateContentSection,
    setTemplate,
    saveResume,
    saveStatus,
    isDirty,
    selectResume,
  } = useResume();

  const [activeTab, setActiveTab] = useState('personal');
  const [mobileMode, setMobileMode] = useState('edit'); // 'edit' | 'preview'
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef(null);

  // Sync template from URL query param if specified (e.g. /builder?template=modern)
  useEffect(() => {
    const templateQuery = searchParams.get('template');
    if (templateQuery && TEMPLATES.some((t) => t.id === templateQuery)) {
      setTemplate(templateQuery);
    }
  }, [searchParams, setTemplate]);

  // Sync resume ID from query if specified
  useEffect(() => {
    const idQuery = searchParams.get('id');
    if (idQuery && currentResume.id !== idQuery) {
      selectResume(idQuery);
    }
  }, [searchParams, currentResume.id, selectResume]);

  const handleManualSave = async () => {
    try {
      await saveResume();
      toast.success('Resume saved successfully!');
    } catch {
      toast.error('Failed to save resume. Changes are saved locally in your browser.');
    }
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    toast.info('Generating high-resolution PDF...');
    try {
      const filename = `${(currentResume.title || 'Resume').replace(/\s+/g, '_')}.pdf`;
      await exportResumeToPDF(previewRef.current, filename);
      toast.success('PDF downloaded successfully!');
    } catch (err) {
      console.error(err);
      toast.error('PDF export failed. Using browser print as fallback.');
      printResumeNative();
    } finally {
      setIsExporting(false);
    }
  };

  const activeTemplateObj = getTemplateById(currentResume.templateId || 'classic');
  const TemplateComponent = activeTemplateObj.component;

  const tabs = [
    { id: 'personal', label: 'Personal', icon: <User size={14} /> },
    { id: 'summary', label: 'Summary', icon: <FileText size={14} /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase size={14} /> },
    { id: 'education', label: 'Education', icon: <GraduationCap size={14} /> },
    { id: 'skills', label: 'Skills', icon: <Wrench size={14} /> },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 size={14} /> },
    { id: 'additional', label: 'Certifications & More', icon: <Award size={14} /> },
  ];

  return (
    <div className="builder-page">
      {/* Builder Top Bar */}
      <div className="builder-topbar no-print">
        <div className="builder-topbar-left">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            leftIcon={<ChevronLeft size={16} />}
          >
            Dashboard
          </Button>

          <input
            type="text"
            className="builder-title-input"
            value={currentResume.title || 'Untitled Resume'}
            onChange={(e) => updateCurrentResume({ title: e.target.value })}
            placeholder="Resume Title"
            aria-label="Resume Title"
          />

          <span
            className={`save-status-pill ${
              saveStatus === 'saved'
                ? 'save-status-saved'
                : saveStatus === 'saving'
                ? 'save-status-saving'
                : saveStatus === 'error'
                ? 'save-status-error'
                : 'save-status-unsaved'
            }`}
          >
            {saveStatus === 'saved' && <><Check size={12} /> Saved</>}
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'error' && '⚠ Save failed — changes in browser'}
            {saveStatus === 'unsaved' && 'Unsaved changes'}
          </span>
        </div>

        {/* Mobile View Switcher */}
        <div className="mobile-view-tabs">
          <button
            type="button"
            className={`mobile-view-tab ${mobileMode === 'edit' ? 'active' : ''}`}
            onClick={() => setMobileMode('edit')}
          >
            <Edit3 size={13} style={{ display: 'inline', marginRight: 4 }} /> Edit
          </button>
          <button
            type="button"
            className={`mobile-view-tab ${mobileMode === 'preview' ? 'active' : ''}`}
            onClick={() => setMobileMode('preview')}
          >
            <Eye size={13} style={{ display: 'inline', marginRight: 4 }} /> Preview
          </button>
        </div>

        <div className="builder-topbar-right">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualSave}
            disabled={!isDirty && saveStatus === 'saved'}
            leftIcon={<Save size={14} />}
          >
            Save
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={printResumeNative}
            leftIcon={<Printer size={14} />}
            title="Open print preview"
          >
            Print
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleDownloadPDF}
            isLoading={isExporting}
            leftIcon={<Download size={14} />}
          >
            Download PDF
          </Button>
        </div>
      </div>

      {/* Guest save reminder banner */}
      {!user && (
        <div className="builder-guest-banner no-print">
          <span>💾 Your resume is saved in this browser only.</span>
          <Link to="/signup" className="builder-guest-banner-link">Create a free account</Link>
          <span>to save it to the cloud and access it anywhere.</span>
        </div>
      )}

      {/* Main Split Layout */}
      <div className="builder-split-body">
        {/* Left: Form Editor */}
        <div
          className="builder-editor-pane no-print"
          style={{ display: mobileMode === 'edit' || window.innerWidth >= 1024 ? 'flex' : 'none' }}
        >
          {/* Section Tabs */}
          <div className="builder-nav-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`builder-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Form Scroll Area */}
          <div className="builder-form-scroll">
            {activeTab === 'personal' && (
              <PersonalInfoSection
                data={currentResume.content.personalInfo || {}}
                onChange={(data) => updateContentSection('personalInfo', data)}
              />
            )}

            {activeTab === 'summary' && (
              <SummarySection
                summary={currentResume.content.summary || ''}
                fullResumeData={currentResume.content}
                onChange={(summary) => updateContentSection('summary', summary)}
              />
            )}

            {activeTab === 'experience' && (
              <ExperienceSection
                experience={currentResume.content.experience || []}
                onChange={(experience) => updateContentSection('experience', experience)}
              />
            )}

            {activeTab === 'education' && (
              <EducationSection
                education={currentResume.content.education || []}
                onChange={(education) => updateContentSection('education', education)}
              />
            )}

            {activeTab === 'skills' && (
              <SkillsSection
                skills={currentResume.content.skills || []}
                onChange={(skills) => updateContentSection('skills', skills)}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsSection
                projects={currentResume.content.projects || []}
                onChange={(projects) => updateContentSection('projects', projects)}
              />
            )}

            {activeTab === 'additional' && (
              <AdditionalSections
                certifications={currentResume.content.certifications || []}
                achievements={currentResume.content.achievements || []}
                languages={currentResume.content.languages || []}
                onCertificationsChange={(data) => updateContentSection('certifications', data)}
                onAchievementsChange={(data) => updateContentSection('achievements', data)}
                onLanguagesChange={(data) => updateContentSection('languages', data)}
              />
            )}
          </div>
        </div>

        {/* Right: Live A4 Preview */}
        <div
          className="builder-preview-pane"
          style={{ display: mobileMode === 'preview' || window.innerWidth >= 1024 ? 'flex' : 'none' }}
        >
          <div className="preview-controls-bar no-print">
            <div className="template-selector-pill">
              <span className="text-xs text-muted font-medium">Template:</span>
              <select
                className="template-select"
                value={currentResume.templateId || 'classic'}
                onChange={(e) => setTemplate(e.target.value)}
                aria-label="Select resume template"
              >
                {TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.category})
                  </option>
                ))}
              </select>
            </div>

            <span className="text-xs text-muted">A4 Preview • Live Synchronized</span>
          </div>

          {/* Render Target for html2canvas / PDF Export */}
          <div className="preview-scale-wrapper print-only-container">
            <div ref={previewRef} className="w-full">
              <TemplateComponent data={currentResume.content} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
