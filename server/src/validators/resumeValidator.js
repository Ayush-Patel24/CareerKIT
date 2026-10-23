/**
 * Centralised input validation helpers for CareerKit API endpoints.
 * Keeps validation logic out of controllers and in one reusable place.
 */

/**
 * Validates a resume text payload for AI analysis or matching.
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateResumeText(resumeText) {
  if (!resumeText || typeof resumeText !== 'string') {
    return { valid: false, error: 'Resume text is required.' };
  }
  const trimmed = resumeText.trim();
  if (trimmed.length < 30) {
    return { valid: false, error: 'Resume text must contain at least 30 characters.' };
  }
  if (trimmed.length > 50000) {
    return { valid: false, error: 'Resume text exceeds the maximum allowed length of 50,000 characters.' };
  }
  return { valid: true };
}

/**
 * Validates a job description payload.
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateJobDescription(jobDescription) {
  if (!jobDescription || typeof jobDescription !== 'string') {
    return { valid: false, error: 'Job description is required.' };
  }
  if (jobDescription.trim().length < 10) {
    return { valid: false, error: 'Job description must contain at least 10 characters.' };
  }
  if (jobDescription.length > 10000) {
    return { valid: false, error: 'Job description exceeds maximum allowed length of 10,000 characters.' };
  }
  return { valid: true };
}

/**
 * Validates a bullet point text payload.
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateBulletText(bulletText) {
  if (!bulletText || typeof bulletText !== 'string') {
    return { valid: false, error: 'Bullet text is required.' };
  }
  if (bulletText.trim().length < 3) {
    return { valid: false, error: 'Bullet text is too short to improve.' };
  }
  if (bulletText.length > 1500) {
    return { valid: false, error: 'Bullet text exceeds maximum allowed length of 1,500 characters.' };
  }
  return { valid: true };
}
