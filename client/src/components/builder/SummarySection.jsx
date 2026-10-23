import React, { useState } from 'react';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { Sparkles, Check } from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';

export default function SummarySection({ summary = '', onChange, fullResumeData = {} }) {
  const toast = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const handleAiImprove = async () => {
    setIsGenerating(true);
    try {
      const result = await api.improveSummary({
        currentSummary: summary,
        personalInfo: fullResumeData.personalInfo,
        experience: fullResumeData.experience,
        skills: fullResumeData.skills,
      });

      if (result.suggestions && result.suggestions.length > 0) {
        setAiSuggestions(result.suggestions);
        toast.success('Generated AI summary suggestions!');
      } else {
        toast.info('No suggestions returned. Try adding more work experience or skills first.');
      }
    } catch (err) {
      toast.error('AI assistant error: ' + (err.message || 'Make sure server is running and Gemini API key is configured'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplySuggestion = (text) => {
    onChange(text);
    setAiSuggestions(null);
    toast.success('Summary updated!');
  };

  return (
    <div className="builder-form-section">
      <div className="section-header-flex">
        <label className="input-label">Professional Summary</label>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAiImprove}
          isLoading={isGenerating}
          leftIcon={<Sparkles size={14} />}
        >
          {summary ? 'Improve with AI' : 'Generate with AI'}
        </Button>
      </div>

      <Textarea
        placeholder="Write a concise 2-4 sentence overview of your key experience, domain expertise, and quantifiable achievements..."
        value={summary}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        helperText="Pro Tip: Keep it under 60-80 words. Highlight impact, years of experience, and primary core technologies."
      />

      {/* AI Suggestions Review Tray */}
      {aiSuggestions && aiSuggestions.length > 0 && (
        <div className="ai-suggestions-tray animate-fade-in">
          <div className="ai-tray-header">
            <span className="ai-tray-title">
              <Sparkles size={14} /> AI Suggested Variations (Click to Apply)
            </span>
            <Button variant="ghost" size="sm" onClick={() => setAiSuggestions(null)}>
              Dismiss
            </Button>
          </div>
          <div className="ai-suggestions-list">
            {aiSuggestions.map((item, idx) => (
              <div key={idx} className="ai-suggestion-card">
                <div className="ai-suggestion-badge">{item.label || `Variation ${idx + 1}`}</div>
                <p className="ai-suggestion-body">{item.text || item}</p>
                <div className="ai-suggestion-actions">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApplySuggestion(item.text || item)}
                    leftIcon={<Check size={13} />}
                  >
                    Apply This Version
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
