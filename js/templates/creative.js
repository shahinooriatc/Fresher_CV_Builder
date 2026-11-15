// Creative / Marketing: bold colour header, skill tags, light sidebar on the right.
import * as p from './helpers.js';

export default {
  id: 'creative',
  name: 'Creative / Marketing',
  tag: { bn: 'মার্কেটিং, সেলস, ডিজাইন', en: 'Marketing, sales, design' },
  sidebar: { x: 1 - 250 / 794, width: 250 / 794, color: '#f6f3fb' },
  render: (v) => `<article class="cv cv--creative">
    <header class="cv-head">
      ${p.photo(v)}
      <div>
        <h1>${p.esc(v.name)}</h1>
        ${v.title ? `<div class="cv-title">${p.esc(v.title)}</div>` : ''}
        <div class="cv-contactline">${p.contactLine(v, '|')}</div>
      </div>
    </header>
    <div class="cv-cols">
      <div class="cv-main">
        ${p.section('About Me', p.paragraph(v.objective))}
        ${p.section('Experience', p.experience(v))}
        ${p.section('Projects', p.projects(v))}
        ${p.section('Education', p.educationList(v))}
        ${p.section('Training & Certifications', p.training(v))}
        ${p.section('References', p.references(v))}
      </div>
      <aside class="cv-side">
        ${p.section('Skills', p.tags(v.skills))}
        ${p.section('Strengths', p.tags(v.soft))}
        ${p.section('Languages', p.bulletList(v.languages))}
        ${p.section('Interests', p.tags(v.interests))}
        ${p.section('Personal', p.details(v, ['Present Address']), 'cv-stack')}
      </aside>
    </div>
  </article>`,
};
