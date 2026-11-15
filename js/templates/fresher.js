// Fresher: education first (as a table), photo on the right, full personal details.
import * as p from './helpers.js';

export default {
  id: 'fresher',
  name: 'Fresher',
  tag: { bn: 'নতুন গ্র্যাজুয়েটদের জন্য', en: 'For new graduates' },
  render: (v) => `<article class="cv cv--fresher">
    <header class="cv-head">
      <div class="cv-head-text">
        <h1>${p.esc(v.name)}</h1>
        ${v.title ? `<div class="cv-title">${p.esc(v.title)}</div>` : ''}
        <div class="cv-contactlist">${v.contacts.map((c) => `<div><b>${c.label}:</b> ${p.esc(c.value)}</div>`).join('')}</div>
      </div>
      ${p.photo(v)}
    </header>
    ${p.section('Career Objective', p.paragraph(v.objective))}
    ${p.section('Academic Qualification', p.educationTable(v))}
    ${p.section('Skills', p.skillRows(v))}
    ${p.section('Training & Certifications', p.training(v))}
    ${p.section('Projects', p.projects(v))}
    ${p.section('Experience', p.experience(v))}
    ${p.section('Personal Details', p.details(v), 'cv-two')}
    ${p.section('Interests', p.inlineList(v.interests))}
    ${p.section('References', p.references(v))}
  </article>`,
};
