const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic request helper with JSON parsing and standardized error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: options.body instanceof FormData ? options.headers : headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.message || data.error || `Server returned ${response.status}: ${response.statusText}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(
        'Unable to connect to CareerKit AI server at ' +
          API_URL +
          '. Please ensure the backend server is running.'
      );
    }
    throw error;
  }
}

export const api = {
  // Extract text from uploaded PDF or DOCX file
  async extractDocumentText(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/parse/extract`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to extract text from document');
    }

    return data; // { success: true, text: string, metadata: {} }
  },

  // Analyze Resume with Gemini AI
  async analyzeResume({ resumeText, jobDescription = '', resumeTitle = '' }) {
    return request('/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ resumeText, jobDescription, resumeTitle }),
    });
  },

  // Improve Bullet Points using STAR method with Gemini AI
  async improveBullet({ bulletText, role = '', company = '' }) {
    return request('/ai/improve-bullet', {
      method: 'POST',
      body: JSON.stringify({ bulletText, role, company }),
    });
  },

  // Improve / Generate Professional Summary with Gemini AI
  async improveSummary({ currentSummary, personalInfo, experience, skills }) {
    return request('/ai/improve-summary', {
      method: 'POST',
      body: JSON.stringify({ currentSummary, personalInfo, experience, skills }),
    });
  },

  // Compare Resume against Job Description
  async matchJobDescription({ resumeText, jobDescription }) {
    return request('/ai/match-job', {
      method: 'POST',
      body: JSON.stringify({ resumeText, jobDescription }),
    });
  },
};
