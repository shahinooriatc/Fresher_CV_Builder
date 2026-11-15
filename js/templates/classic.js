// Classic Professional: single column, serif, centred header. Default template.
import * as p from './helpers.js';

export default {
  id: 'classic',
  name: 'Classic Professional',
  tag: { bn: 'যেকোনো চাকরির জন্য', en: 'Works for any job' },
  render: (v) => `<article class="cv cv--classic">
    <header class="cv-head ${v.photo ? 'has-photo' : ''}">
      ${p.photo(v)}
      <h1>${p.esc(v.name)}</h1>
      ${v.title ? `<div class="cv-title">${p.esc(v.title)}</div>` : ''}
      <div class="cv-contactline">${p.contactLine(v)}</div>
    </header>
    ${p.section('Career Objective', p.paragraph(v.objective))}
    ${p.section('Work Experience', p.experience(v))}
    ${p.section('Education', p.educationList(v))}
    ${p.section('Skills', p.skillRows(v))}
    ${p.section('Training & Certifications', p.training(v))}
    ${p.section('Projects', p.projects(v))}
    ${p.section('Personal Details', p.details(v, ['Present Address']), 'cv-two')}
    ${p.section('Interests', p.inlineList(v.interests))}
    ${p.section('References', p.references(v))}
  </article>`,
};
