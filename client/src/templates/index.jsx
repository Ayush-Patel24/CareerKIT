import ATSClassic from './ATSClassic';
import Professional from './Professional';
import Modern from './Modern';
import Compact from './Compact';

export const TEMPLATES = [
  {
    id: 'classic',
    name: 'ATS Classic',
    category: 'ATS-Optimized',
    description: 'A timeless, single-column linear layout engineered for 100% compliance with Applicant Tracking Systems.',
    features: ['Linear single-column hierarchy', 'Standard serif/sans typography', 'High parsing accuracy', 'Ideal for corporate & finance'],
    component: ATSClassic,
  },
  {
    id: 'professional',
    name: 'Executive Professional',
    category: 'Professional',
    description: 'Structured layout with bold left-accent indicators, dedicated competency blocks, and clear chronological flow.',
    features: ['Executive accent bar', 'Competency grid', 'Distinct date tags', 'Ideal for senior & tech roles'],
    component: Professional,
  },
  {
    id: 'modern',
    name: 'Modern Asymmetric',
    category: 'Modern',
    description: 'Contemporary two-column design with a dedicated sidebar for credentials, technical skills, and contact links.',
    features: ['Two-column grid layout', 'Visual avatar monogram', 'Skill pill tags', 'Ideal for creative & tech portfolios'],
    component: Modern,
  },
  {
    id: 'compact',
    name: 'Compact One-Page',
    category: 'Student / Graduate',
    description: 'Space-efficient format designed to pack comprehensive skills and experience into a concise, high-impact page.',
    features: ['Condensed vertical rhythm', 'Inline contact bar', 'Prominent skills section', 'Ideal for graduates & tight 1-pagers'],
    component: Compact,
  },
];

export function getTemplateById(id) {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
}

export function renderTemplate(id, data) {
  const t = getTemplateById(id);
  const Component = t.component;
  return <Component data={data} />;
}
