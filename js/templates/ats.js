// ATS Minimal: plain text layout that job-portal software reads reliably. No photo, no colour.
import * as p from './helpers.js';

export default {
  id: 'ats',
  name: 'ATS Minimal',
  tag: { bn: 'অনলাইন আবেদন ও বিদেশি চাকরি', en: 'Online and overseas applications' },
  render: (v) => `<article class="cv cv--ats">
    <header class="cv-head">
      <h1>${p.esc(v.name)}</h1>
      ${v.title ? `<div class="cv-title">${p.esc(v.title)}</div>` : ''}
      <div class="cv-contactline">${p.contactLine(v, '|')}</div>
    </header>
    ${p.section('Summary', p.paragraph(v.objective))}
    ${p.section('Skills', p.skillRows(v))}
    ${p.section('Experience', p.experience(v))}
    ${p.section('Education', p.educationList(v))}
    ${p.section('Projects', p.projects(v))}
    ${p.section('Certifications', p.training(v))}
    ${p.section('Additional Information', p.details(v, ['Present Address', 'Religion', 'Blood Group']), 'cv-two')}
    ${p.section('References', p.references(v))}
  </article>`,
};
