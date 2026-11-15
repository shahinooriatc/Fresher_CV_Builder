// Modern Two-Column: dark sidebar for contact and skills, main column for the story.
import * as p from './helpers.js';

export default {
  id: 'modern',
  name: 'Modern Two-Column',
  tag: { bn: 'আইটি ও কর্পোরেট চাকরি', en: 'IT and corporate jobs' },
  // Tells the PDF export to continue the sidebar colour on every page.
  sidebar: { x: 0, width: 270 / 794, color: '#1f2a44' },
  render: (v) => `<article class="cv cv--modern">
    <aside class="cv-side">
      ${p.photo(v)}
      ${p.section('Contact', p.contactStack(v))}
      ${p.section('Skills', p.bulletList(v.skills))}
      ${p.section('Soft Skills', p.bulletList(v.soft))}
      ${p.section('Languages', p.bulletList(v.languages))}
      ${p.section('Interests', p.bulletList(v.interests))}
    </aside>
    <div class="cv-main">
      <header class="cv-head">
        <h1>${p.esc(v.name)}</h1>
        ${v.title ? `<div class="cv-title">${p.esc(v.title)}</div>` : ''}
      </header>
      ${p.section('Profile', p.paragraph(v.objective))}
      ${p.section('Experience', p.experience(v))}
      ${p.section('Education', p.educationList(v))}
      ${p.section('Projects', p.projects(v))}
      ${p.section('Training & Certifications', p.training(v))}
      ${p.section('Personal Details', p.details(v, ['Present Address']))}
      ${p.section('References', p.references(v))}
    </div>
  </article>`,
};
