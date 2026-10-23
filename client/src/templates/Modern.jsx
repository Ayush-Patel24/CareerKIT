import React from 'react';
import './Templates.css';
import './Modern.css';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '../components/ui/BrandIcons';

export default function Modern({ data = {} }) {
  const {
    personalInfo = {},
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    achievements = [],
    languages = [],
  } = data;

  const formatBullets = (text) => {
    if (!text) return [];
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => line.replace(/^[•\-*]\s*/, ''));
  };

  return (
    <div className="resume-paper modern-root">
      {/* Sidebar Column */}
      <aside className="modern-sidebar">
        <div className="modern-avatar-badge">
          {personalInfo.fullName
            ? personalInfo.fullName
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()
            : 'CK'}
        </div>

        {/* Contact Info */}
        <div className="modern-side-group">
          <h3 className="modern-side-title">Contact</h3>
          <div className="modern-side-contacts">
            {personalInfo.email && (
              <div className="modern-side-contact-item">
                <Mail size={12} />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="modern-side-contact-item">
                <Phone size={12} />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="modern-side-contact-item">
                <MapPin size={12} />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="modern-side-contact-item">
                <Globe size={12} />
                <a href={personalInfo.website} target="_blank" rel="noreferrer">
                  Website
                </a>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="modern-side-contact-item">
                <LinkedinIcon size={12} />
                <a href={personalInfo.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </div>
            )}
            {personalInfo.github && (
              <div className="modern-side-contact-item">
                <GithubIcon size={12} />
                <a href={personalInfo.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Education */}
        {education.length > 0 && (
          <div className="modern-side-group">
            <h3 className="modern-side-title">Education</h3>
            <div className="modern-side-list">
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="modern-side-entry">
                  <strong className="modern-side-entry-title">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </strong>
                  <p className="modern-side-entry-sub">{edu.institution}</p>
                  <span className="modern-side-entry-date">
                    {edu.startDate} {edu.endDate ? `– ${edu.endDate}` : ''}
                  </span>
                  {edu.gpa && <p className="modern-side-entry-detail">{edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="modern-side-group">
            <h3 className="modern-side-title">Skills</h3>
            <div className="modern-side-skills">
              {skills.map((s, idx) => (
                <div key={idx} className="modern-skill-block">
                  <span className="modern-skill-group-name">{s.category}</span>
                  <div className="modern-tags-wrap">
                    {s.items.split(',').map((skillItem, i) => (
                      <span key={i} className="modern-tag">
                        {skillItem.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className="modern-side-group">
            <h3 className="modern-side-title">Languages</h3>
            <ul className="modern-bullet-list">
              {languages.map((l, idx) => (
                <li key={l.id || idx}>
                  <strong>{l.language}</strong> — {l.proficiency}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Certifications in sidebar if compact */}
        {certifications.length > 0 && (
          <div className="modern-side-group">
            <h3 className="modern-side-title">Certifications</h3>
            <ul className="modern-bullet-list">
              {certifications.map((c, idx) => (
                <li key={c.id || idx}>
                  <strong>{c.name}</strong> {c.issuer && `(${c.issuer})`}
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* Main Content Column */}
      <main className="modern-main">
        {/* Header */}
        <header className="modern-header">
          <h1 className="modern-name">{personalInfo.fullName || 'Your Full Name'}</h1>
          {personalInfo.jobTitle && <p className="modern-headline">{personalInfo.jobTitle}</p>}
        </header>

        {/* Summary */}
        {summary && (
          <section className="modern-section">
            <h2 className="modern-sec-title">Profile</h2>
            <p className="modern-summary-text">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="modern-section">
            <h2 className="modern-sec-title">Experience</h2>
            <div className="modern-entries">
              {experience.map((exp, idx) => (
                <div key={exp.id || idx} className="modern-entry">
                  <div className="modern-entry-top">
                    <div>
                      <h3 className="modern-entry-role">{exp.title}</h3>
                      <p className="modern-entry-company">{exp.company} {exp.location && `• ${exp.location}`}</p>
                    </div>
                    <span className="modern-entry-date">
                      {exp.startDate} {exp.startDate && (exp.isCurrent ? '– Present' : exp.endDate ? `– ${exp.endDate}` : '')}
                    </span>
                  </div>
                  {exp.description && (
                    <ul className="resume-bullets">
                      {formatBullets(exp.description).map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="modern-section">
            <h2 className="modern-sec-title">Featured Projects</h2>
            <div className="modern-entries">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className="modern-entry">
                  <div className="modern-entry-top">
                    <h3 className="modern-entry-role">{proj.title}</h3>
                    {proj.technologies && <span className="modern-entry-tag">{proj.technologies}</span>}
                  </div>
                  {proj.description && (
                    <ul className="resume-bullets">
                      {formatBullets(proj.description).map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <section className="modern-section">
            <h2 className="modern-sec-title">Key Achievements</h2>
            <ul className="resume-bullets">
              {achievements.map((a, idx) => (
                <li key={a.id || idx}>
                  <strong>{a.title}</strong> {a.issuer && `(${a.issuer})`}: {a.description}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
