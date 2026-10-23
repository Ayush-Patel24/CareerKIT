export const DEFAULT_RESUME_CONTENT = {
  personalInfo: {
    fullName: 'Alex Morgan',
    jobTitle: 'Senior Full Stack Software Engineer',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    website: 'https://alexmorgan.dev',
    linkedin: 'https://linkedin.com/in/alexmorgan',
    github: 'https://github.com/alexmorgan',
  },
  summary:
    'Results-driven Software Engineer with 5+ years of experience architecting resilient web applications and distributed cloud systems. Proven track record reducing API latency by 42% and driving continuous delivery pipelines for 250k+ daily active users.',
  experience: [
    {
      id: 'exp-1',
      title: 'Senior Software Engineer',
      company: 'Vanguard Tech Labs',
      location: 'San Francisco, CA',
      startDate: '2023-01',
      endDate: '',
      isCurrent: true,
      description:
        'Led migration of monolith backend to event-driven microservices in Node.js and PostgreSQL, serving 250k daily active users.\nArchitected real-time analytics pipeline reducing query response latency by 42%.\nMentored 4 junior engineers in test-driven development and system design best practices.',
    },
    {
      id: 'exp-2',
      title: 'Full Stack Engineer',
      company: 'Apex Digital Solutions',
      location: 'Austin, TX',
      startDate: '2020-06',
      endDate: '2022-12',
      isCurrent: false,
      description:
        'Engineered responsive React web application with automated CI/CD pipeline, increasing deployment frequency by 3x.\nCollaborated with product designers to implement accessibility (WCAG 2.1 AA) across 40+ interface screens.\nBuilt secure role-based authorization services integrating OAuth2 and JWT protocols.',
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      location: 'Berkeley, CA',
      startDate: '2016-08',
      endDate: '2020-05',
      gpa: '3.8 / 4.0 (Dean\'s Honors)',
    },
  ],
  skills: [
    { category: 'Languages', items: 'JavaScript (ES6+), TypeScript, Python, SQL, HTML5/CSS3' },
    { category: 'Frontend', items: 'React, Next.js, Redux Toolkit, Tailwind CSS, Vite' },
    { category: 'Backend & Cloud', items: 'Node.js, Express, PostgreSQL, Redis, Docker, AWS (S3, ECS), RESTful APIs' },
    { category: 'Developer Tools', items: 'Git, GitHub Actions, Jest, Vitest, Postman, Linux' },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'CloudMetrics — Distributed Observability Tool',
      role: 'Lead Architect',
      technologies: 'React, Node.js, TimescaleDB, WebSockets',
      liveUrl: 'https://cloudmetrics.demo.app',
      githubUrl: 'https://github.com/alexmorgan/cloudmetrics',
      description:
        'Constructed high-throughput metric monitoring dashboard capturing 50,000+ data points per second with sub-second alert dispatching.',
    },
    {
      id: 'proj-2',
      title: 'ResumeAI — Contextual Document Matcher',
      role: 'Creator & Developer',
      technologies: 'JavaScript, Supabase, Google Gemini API',
      liveUrl: 'https://resumeai.demo.app',
      githubUrl: 'https://github.com/alexmorgan/resumeai',
      description:
        'Engineered semantic analysis algorithm comparing candidate resumes against job descriptions with targeted keyword extraction.',
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      issueDate: '2023-04',
      credentialUrl: '',
    },
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'Hackathon Grand Prize Winner',
      issuer: 'TechCrunch Disrupt',
      date: '2022',
      description: 'Built an open-source decentralized identity verification tool evaluated across 120 global teams.',
    },
  ],
  languages: [
    { id: 'lang-1', language: 'English', proficiency: 'Native / Bilingual' },
    { id: 'lang-2', language: 'Spanish', proficiency: 'Professional Working' },
  ],
};

export function createEmptyResume(title = 'Untitled Resume', templateId = 'classic') {
  return {
    id: 'res-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    title,
    templateId,
    content: {
      personalInfo: {
        fullName: '',
        jobTitle: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        linkedin: '',
        github: '',
      },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      achievements: [],
      languages: [],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
