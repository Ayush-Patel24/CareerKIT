import { getGeminiModel } from '../config/gemini.js';
import { config } from '../config/env.js';

/**
 * Cleanly extracts and parses JSON from Gemini model output
 */
function parseGeminiJson(rawText) {
  if (!rawText) throw new Error('Received empty response from Gemini model.');

  let cleaned = rawText.trim();

  // Strip markdown code fences if model enclosed JSON in ```json ... ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }

  // Find the first '{' and last '}'
  const startIdx = cleaned.indexOf('{');
  const endIdx = cleaned.lastIndexOf('}');

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse Gemini response as JSON. Raw text:', rawText);
    throw new Error('Unable to parse AI response into structured data. Please try again.');
  }
}

/**
 * Executes a Gemini prompt with automatic fallback across available models
 * if a specific model encounters temporary high demand (503), rate limit (429), or 404.
 */
async function generateWithFallback(prompt) {
  // Unique list of active, supported candidate models in priority order
  const candidateModels = Array.from(
    new Set([
      config.geminiModel,
      'gemini-3.5-flash',
      'gemini-3.5-flash-lite',
      'gemini-3.8-flash',
    ])
  );

  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      const model = getGeminiModel(modelName);
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      return parseGeminiJson(responseText);
    } catch (err) {
      lastError = err;
      const isTemporary =
        err.message?.includes('503') ||
        err.message?.includes('429') ||
        err.message?.includes('404') ||
        err.message?.includes('high demand') ||
        err.message?.includes('RESOURCE_EXHAUSTED');

      if (isTemporary) {
        console.warn(`Model ${modelName} unavailable (${err.message.slice(0, 80)}...). Trying next fallback model...`);
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('All candidate Gemini models failed. Please try again shortly.');
}

export const geminiService = {
  /**
   * Comprehensive resume analysis & ATS evaluation
   */
  async analyzeResume({ resumeText, jobDescription = '', resumeTitle = '' }) {
    const prompt = `
You are an expert ATS (Applicant Tracking System) engineer and senior talent acquisition leader.
Analyze the following resume objectively. Do NOT fabricate qualifications or flatter the user.
Evaluate based on:
1. Impact & Quantifiable Results (metrics, numbers, percentages, outcomes)
2. ATS Readability & Linear Hierarchy (standard sections, parseable headings, no confusing layouts)
3. Action Verbs & Brevity (strong active verbs, concise sentences, no passive filler)
4. Skills & Competencies (relevance, clarity, categorization)

${jobDescription ? `Target Job Description to match against:\n"""\n${jobDescription.substring(0, 5000)}\n"""\n` : ''}

Candidate Resume:
"""
${resumeText.substring(0, 15000)}
"""

You MUST respond strictly with a valid JSON object matching this exact schema:
{
  "overallScore": <integer between 0 and 100 representing estimated ATS / recruiter score>,
  "summaryReview": "<2-3 sentence candid executive summary of the resume quality>",
  "categories": {
    "impact": {
      "name": "Impact & Measurable Metrics",
      "score": <integer 0-100>,
      "feedback": "<specific feedback on numbers, percentages, and quantifiable achievements>"
    },
    "atsReadability": {
      "name": "ATS Readability & Formatting",
      "score": <integer 0-100>,
      "feedback": "<feedback on section structure, headings, and parser friendliness>"
    },
    "actionVerbs": {
      "name": "Action Verbs & Brevity",
      "score": <integer 0-100>,
      "feedback": "<feedback on strong active verbs vs passive or vague duties>"
    },
    "skills": {
      "name": "Skills & Technical Breadth",
      "score": <integer 0-100>,
      "feedback": "<feedback on skill organization, clarity, and depth>"
    }
  },
  "strengths": [
    "<strength 1>",
    "<strength 2>",
    "<strength 3>"
  ],
  "improvements": [
    "<area for improvement 1>",
    "<area for improvement 2>",
    "<area for improvement 3>"
  ],
  "missingKeywords": [
    "<keyword or skill that would strengthen this resume>",
    "<keyword or skill 2>"
  ],
  "actionableSteps": [
    "<actionable step 1 for the candidate to implement>",
    "<actionable step 2>",
    "<actionable step 3>"
  ]
  ${
    jobDescription
      ? `,
  "jobMatch": {
    "matchPercentage": <integer 0-100>,
    "analysis": "<detailed paragraph comparing candidate profile with the target job requirements>",
    "matchingKeywords": ["<keyword 1>", "<keyword 2>"],
    "missingKeywords": ["<critical requirement missing 1>", "<critical requirement missing 2>"]
  }`
      : ''
  }
}
`;

    return generateWithFallback(prompt);
  },

  /**
   * Generates or improves professional summary based on candidate experience
   */
  async improveSummary({ currentSummary, personalInfo = {}, experience = [], skills = [] }) {
    const prompt = `
You are a senior executive career coach.
Generate 3 distinct, high-impact professional summary options for this candidate based on their background.
CRITICAL RULE: Do NOT invent fake experience, companies, or degrees that are not mentioned in their background.

Candidate Details:
- Target Title: ${personalInfo.jobTitle || 'Professional'}
- Current Summary: ${currentSummary || 'None provided'}
- Experience Summary: ${experience.map((e) => `${e.title} at ${e.company} (${e.description?.slice(0, 100)})`).join('; ')}
- Core Skills: ${skills.map((s) => `${s.category}: ${s.items}`).join('; ')}

Respond ONLY with a JSON object:
{
  "suggestions": [
    {
      "label": "Impact & Leadership Focus",
      "text": "<concise 2-3 sentence summary highlighting measurable outcomes and domain expertise>"
    },
    {
      "label": "Technical Depth Focus",
      "text": "<concise 2-3 sentence summary highlighting core architecture, tools, and technical delivery>"
    },
    {
      "label": "Concise & Direct",
      "text": "<tight 2 sentence summary suitable for compact 1-page resumes>"
    }
  ]
}
`;

    return generateWithFallback(prompt);
  },

  /**
   * Improves experience or project bullet points using the STAR method
   */
  async improveBullet({ bulletText, role = '', company = '' }) {
    const prompt = `
You are an expert resume writer specializing in the STAR (Situation, Task, Action, Result) methodology.
Polish and strengthen the following bullet point(s) from a resume.
Role: ${role || 'Candidate Role'}
Company / Context: ${company || 'Organization'}

Original Bullet(s):
"""
${bulletText.substring(0, 1500)}
"""

CRITICAL RULES:
1. Start with a strong action verb (e.g. "Architected", "Engineered", "Orchestrated", "Accelerated").
2. Clarify the business impact or technical outcome.
3. If the user included specific numbers, preserve and highlight them. If no metrics were provided, frame the sentence so the candidate can easily insert their actual metric (e.g. "[by X%]"), but do NOT invent specific false numbers.
4. Output 2-3 improved variations.

Respond ONLY with a JSON object:
{
  "suggestions": [
    {
      "text": "<rewritten bullet point following STAR method>",
      "reason": "<one sentence explaining why this version is stronger>"
    },
    {
      "text": "<alternative variation emphasizing metrics and scale>",
      "reason": "<one sentence explanation>"
    }
  ]
}
`;

    return generateWithFallback(prompt);
  },

  /**
   * Compares resume with job description
   */
  async matchJobDescription({ resumeText, jobDescription }) {
    const prompt = `
Compare this resume against the target job description.
Identify matching competencies, missing requirements, and specific tailoring suggestions.

Job Description:
"""
${jobDescription.substring(0, 5000)}
"""

Resume:
"""
${resumeText.substring(0, 10000)}
"""

Respond ONLY with a JSON object:
{
  "matchPercentage": <integer 0-100>,
  "analysis": "<detailed paragraph assessing the candidate's alignment with the role>",
  "matchingKeywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>"],
  "missingKeywords": ["<critical requirement missing 1>", "<critical requirement missing 2>"],
  "tailoringTips": [
    "<specific suggestion 1 on how to adjust phrasing to better match this role>",
    "<specific suggestion 2>"
  ]
}
`;

    return generateWithFallback(prompt);
  },
};
