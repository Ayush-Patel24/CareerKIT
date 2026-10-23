import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DEFAULT_RESUME_CONTENT, createEmptyResume } from '../lib/defaultResume';

const ResumeContext = createContext(null);

export function ResumeProvider({ children }) {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [currentResume, setCurrentResume] = useState(() => {
    // Check if there is an unsaved local draft in progress
    const savedDraft = localStorage.getItem('careerkit_active_draft');
    if (savedDraft) {
      try {
        return JSON.parse(savedDraft);
      } catch {
        // fallback
      }
    }
    const initial = createEmptyResume('Software Engineer Resume', 'classic');
    initial.content = { ...DEFAULT_RESUME_CONTENT };
    return initial;
  });

  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'unsaved' | 'error'
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const autoSaveTimerRef = useRef(null);

  const loadLocalResumes = useCallback(() => {
    try {
      const stored = localStorage.getItem('careerkit_saved_resumes');
      if (stored) {
        setResumes(JSON.parse(stored));
      } else {
        // Seed with a default resume for instant testing
        const sample = createEmptyResume('Sample Tech Resume', 'classic');
        sample.content = { ...DEFAULT_RESUME_CONTENT };
        setResumes([sample]);
        localStorage.setItem('careerkit_saved_resumes', JSON.stringify([sample]));
      }
    } catch (e) {
      console.error('Local resume load failed:', e);
      setResumes([]);
    }
  }, []);

  // Load all resumes for current user or local storage
  const loadResumes = useCallback(async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase && user && !user.id?.startsWith('local-')) {
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (error) {
          console.error('Error fetching resumes from Supabase:', error);
          loadLocalResumes();
        } else if (data && data.length > 0) {
          // Normalize Supabase records
          const mapped = data.map((r) => ({
            id: r.id,
            title: r.title,
            templateId: r.template_id || 'classic',
            content: r.content,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
          }));
          setResumes(mapped);
        } else {
          loadLocalResumes();
        }
      } else {
        loadLocalResumes();
      }
    } catch (err) {
      console.error('Failed to load resumes:', err);
      loadLocalResumes();
    } finally {
      setLoading(false);
    }
  }, [user, loadLocalResumes]);

  useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  // Sync draft to localStorage immediately on modification
  const updateCurrentResume = useCallback((updater) => {
    setCurrentResume((prev) => {
      const updated = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      updated.updatedAt = new Date().toISOString();
      localStorage.setItem('careerkit_active_draft', JSON.stringify(updated));
      setIsDirty(true);
      setSaveStatus('unsaved');
      return updated;
    });
  }, []);

  // Update specific section of content
  const updateContentSection = useCallback((section, data) => {
    updateCurrentResume((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [section]: data,
      },
    }));
  }, [updateCurrentResume]);

  // Set active template
  const setTemplate = useCallback((templateId) => {
    updateCurrentResume((prev) => ({
      ...prev,
      templateId,
    }));
  }, [updateCurrentResume]);

  // Save current resume persistently
  const saveResume = useCallback(
    async (resumeToSave = currentResume) => {
      setSaveStatus('saving');
      try {
        const payload = {
          ...resumeToSave,
          updatedAt: new Date().toISOString(),
        };

        if (isSupabaseConfigured && supabase && user && !user.id?.startsWith('local-')) {
          // Check if it already exists in Supabase
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.id);

          let result;
          if (isUuid) {
            result = await supabase
              .from('resumes')
              .upsert({
                id: payload.id,
                user_id: user.id,
                title: payload.title,
                template_id: payload.templateId,
                content: payload.content,
                updated_at: payload.updatedAt,
              })
              .select()
              .single();
          } else {
            // New record insert
            result = await supabase
              .from('resumes')
              .insert({
                user_id: user.id,
                title: payload.title,
                template_id: payload.templateId,
                content: payload.content,
              })
              .select()
              .single();
          }

          if (result.error) throw result.error;

          if (result.data) {
            payload.id = result.data.id;
          }
        }

        // Also persist to local resumes list
        setResumes((prev) => {
          const index = prev.findIndex((r) => r.id === payload.id);
          let updatedList;
          if (index >= 0) {
            updatedList = [...prev];
            updatedList[index] = payload;
          } else {
            updatedList = [payload, ...prev];
          }
          localStorage.setItem('careerkit_saved_resumes', JSON.stringify(updatedList));
          return updatedList;
        });

        setCurrentResume(payload);
        localStorage.setItem('careerkit_active_draft', JSON.stringify(payload));
        setIsDirty(false);
        setSaveStatus('saved');
        return payload;
      } catch (err) {
        console.error('Save failed:', err);
        setSaveStatus('error');
        // Fallback save to local storage
        setResumes((prev) => {
          const index = prev.findIndex((r) => r.id === resumeToSave.id);
          const updatedList = index >= 0 ? [...prev] : [resumeToSave, ...prev];
          if (index >= 0) updatedList[index] = resumeToSave;
          localStorage.setItem('careerkit_saved_resumes', JSON.stringify(updatedList));
          return updatedList;
        });
        throw err;
      }
    },
    [currentResume, user]
  );

  // Auto-save debounced effect (every 4 seconds when dirty)
  useEffect(() => {
    if (!isDirty) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      saveResume(currentResume).catch(() => {
        // silent fallback
      });
    }, 4000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [currentResume, isDirty, saveResume]);

  // Create new resume
  const createResume = (title = 'Untitled Resume', templateId = 'classic') => {
    const newResume = createEmptyResume(title, templateId);
    newResume.content = { ...DEFAULT_RESUME_CONTENT };
    setCurrentResume(newResume);
    localStorage.setItem('careerkit_active_draft', JSON.stringify(newResume));
    setIsDirty(true);
    setSaveStatus('unsaved');
    return newResume;
  };

  // Switch active resume by ID
  const selectResume = (id) => {
    const found = resumes.find((r) => r.id === id);
    if (found) {
      setCurrentResume(found);
      localStorage.setItem('careerkit_active_draft', JSON.stringify(found));
      setIsDirty(false);
      setSaveStatus('saved');
      return found;
    }
    return null;
  };

  // Delete resume
  const deleteResume = async (id) => {
    try {
      if (isSupabaseConfigured && supabase && user && !user.id?.startsWith('local-')) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        if (isUuid) {
          await supabase.from('resumes').delete().eq('id', id).eq('user_id', user.id);
        }
      }

      setResumes((prev) => {
        const filtered = prev.filter((r) => r.id !== id);
        localStorage.setItem('careerkit_saved_resumes', JSON.stringify(filtered));
        return filtered;
      });

      if (currentResume.id === id) {
        const remaining = resumes.filter((r) => r.id !== id);
        if (remaining.length > 0) {
          selectResume(remaining[0].id);
        } else {
          createResume();
        }
      }
    } catch (err) {
      console.error('Delete resume failed:', err);
      throw err;
    }
  };

  // Duplicate resume
  const duplicateResume = async (id) => {
    const target = resumes.find((r) => r.id === id);
    if (!target) return null;

    const copy = {
      ...JSON.parse(JSON.stringify(target)),
      id: 'res-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      title: `${target.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveResume(copy);
    return copy;
  };

  const value = {
    resumes,
    currentResume,
    saveStatus,
    isDirty,
    loading,
    setCurrentResume,
    updateCurrentResume,
    updateContentSection,
    setTemplate,
    saveResume,
    createResume,
    selectResume,
    deleteResume,
    duplicateResume,
    loadResumes,
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
