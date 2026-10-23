import React from 'react';
import Input from '../ui/Input';
import { Mail, Phone, MapPin, Globe, Briefcase } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '../ui/BrandIcons';

export default function PersonalInfoSection({ data = {}, onChange }) {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="builder-form-section">
      <div className="grid-2-col">
        <Input
          label="Full Name"
          placeholder="e.g. Alex Morgan"
          value={data.fullName || ''}
          onChange={(e) => handleChange('fullName', e.target.value)}
          required
        />
        <Input
          label="Job Title / Headline"
          placeholder="e.g. Senior Full Stack Engineer"
          value={data.jobTitle || ''}
          onChange={(e) => handleChange('jobTitle', e.target.value)}
          leftIcon={<Briefcase size={14} />}
        />
      </div>

      <div className="grid-2-col">
        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. alex@example.com"
          value={data.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          leftIcon={<Mail size={14} />}
        />
        <Input
          label="Phone Number"
          type="tel"
          placeholder="e.g. +1 (555) 234-5678"
          value={data.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          leftIcon={<Phone size={14} />}
        />
      </div>

      <div className="grid-2-col">
        <Input
          label="Location"
          placeholder="e.g. San Francisco, CA"
          value={data.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          leftIcon={<MapPin size={14} />}
        />
        <Input
          label="Personal Website / Portfolio"
          placeholder="e.g. https://alexmorgan.dev"
          value={data.website || ''}
          onChange={(e) => handleChange('website', e.target.value)}
          leftIcon={<Globe size={14} />}
        />
      </div>

      <div className="grid-2-col">
        <Input
          label="LinkedIn Profile"
          placeholder="e.g. https://linkedin.com/in/alexmorgan"
          value={data.linkedin || ''}
          onChange={(e) => handleChange('linkedin', e.target.value)}
          leftIcon={<LinkedinIcon size={14} />}
        />
        <Input
          label="GitHub Profile"
          placeholder="e.g. https://github.com/alexmorgan"
          value={data.github || ''}
          onChange={(e) => handleChange('github', e.target.value)}
          leftIcon={<GithubIcon size={14} />}
        />
      </div>
    </div>
  );
}
