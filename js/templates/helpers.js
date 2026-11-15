// Shared building blocks for all CV templates.
// buildView() cleans the raw form data once; each template then arranges the
// ready-made parts below in its own order. Every part returns '' when empty,
// so a template never shows an empty heading.
//
// class "cv-item" marks a block that must not be split across two PDF pages.
import { esc } from '../utils.js';

const txt = (v) => String(v ?? '').trim();
const splitList = (v) => txt(v).split(/[,\n]+/).map((s) => s.trim()).filter(Boolean);
const lines = (v) => txt(v).split('\n').map((s) => s.replace(/^[-•*]\s*/, '').trim()).filter(Boolean);
const nonEmpty = (list) => (list || []).filter((item) => item && Object.values(item).some(txt));
const joined = (parts, sep = ', ') => parts.map(txt).filter(Boolean).map(esc).join(sep);

function longDate(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? txt(iso) : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export function buildView(data) {
  const p = data.personal || {};
  const f = data.family || {};
  const s = data.skills || {};
  const pairs = (list) => list.filter(([, v]) => txt(v)).map(([label, v]) => ({ label, value: txt(v) }));
  return {
    name: txt(p.fullName) || 'Your Name',
    title: txt(p.title),
    photo: txt(p.photo).startsWith('data:image/') ? p.photo : '',
    contacts: pairs([['Phone', p.phone], ['Email', p.email], ['Address', p.address], ['LinkedIn', p.linkedin], ['Website', p.website]]),
    objective: txt(data.objective?.text),
    education: nonEmpty(data.education),
    experience: nonEmpty(data.experience),
    training: nonEmpty(data.training),
    projects: nonEmpty(data.projects),
    references: nonEmpty(data.references),
    skills: splitList(s.technical),
    soft: splitList(s.soft),
    languages: splitList(s.languages),
    interests: splitList(f.interests),
    details: pairs([
      ["Father's Name", f.fatherName], ["Mother's Name", f.motherName],
      ['Date of Birth', f.dob && longDate(f.dob)], ['Gender', f.gender], ['Marital Status', f.marital],
      ['Nationality', f.nationality], ['Religion', f.religion], ['Blood Group', f.bloodGroup],
      ['Present Address', p.address], ['Permanent Address', f.permanentAddress],
    ]),
  };
}

// ---- parts ---------------------------------------------------------------

export const section = (title, body, cls = '') =>
  (body ? `<section class="cv-sec ${cls}"><h2 class="cv-h">${title}</h2><div class="cv-body">${body}</div></section>` : '');

export const photo = (v) => (v.photo ? `<div class="cv-photo" style="background-image:url('${v.photo}')"></div>` : '');

export const contactLine = (v, sep = '•') =>
  v.contacts.map((c) => `<span>${esc(c.value)}</span>`).join(`<span class="cv-sep">${sep}</span>`);

export const contactStack = (v) =>
  v.contacts.map((c) => `<div class="cv-item cv-contact"><small>${c.label}</small><div>${esc(c.value)}</div></div>`).join('');

export const paragraph = (text) => (text ? `<p class="cv-item cv-p">${esc(text).replace(/\n/g, '<br>')}</p>` : '');

const bullets = (items) => (items.length ? `<ul class="cv-ul">${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '');
export const bulletList = (items) => (items.length ? `<div class="cv-item">${bullets(items)}</div>` : '');
export const inlineList = (items) => (items.length ? `<p class="cv-item">${items.map(esc).join(', ')}</p>` : '');
export const tags = (items) => (items.length ? `<div class="cv-item cv-tags">${items.map((x) => `<span>${esc(x)}</span>`).join('')}</div>` : '');

const entry = (head, date, sub, extra = '') => `<div class="cv-item">
  <div class="cv-row"><strong>${head}</strong>${date ? `<span class="cv-date">${date}</span>` : ''}</div>
  ${sub ? `<div class="cv-sub">${sub}</div>` : ''}${extra}</div>`;

export const experience = (v) => v.experience.map((e) =>
  entry(esc(txt(e.position) || txt(e.company)), joined([e.start, e.end], ' – '),
    joined(txt(e.position) ? [e.company, e.location] : [e.location]), bullets(lines(e.details)))).join('');

export const educationList = (v) => v.education.map((e) =>
  entry(esc(txt(e.degree)) + (txt(e.major) ? ` <span class="cv-light">(${esc(txt(e.major))})</span>` : ''), esc(txt(e.year)),
    joined([e.institute, e.board]), txt(e.result) ? `<div>Result: ${esc(txt(e.result))}</div>` : '')).join('');

export function educationTable(v) {
  if (!v.education.length) return '';
  const cols = [['degree', 'Exam / Degree'], ['major', 'Group / Major'], ['institute', 'Institute'], ['board', 'Board / University'], ['year', 'Year'], ['result', 'Result']]
    .filter(([k]) => v.education.some((e) => txt(e[k])));
  const head = cols.map(([, label]) => `<th>${label}</th>`).join('');
  const body = v.education.map((e) => `<tr>${cols.map(([k]) => `<td>${esc(txt(e[k]))}</td>`).join('')}</tr>`).join('');
  return `<table class="cv-item cv-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

export const training = (v) => v.training.map((x) => entry(esc(txt(x.title)), esc(txt(x.year)), esc(txt(x.institute)))).join('');

export const projects = (v) => v.projects.map((x) =>
  entry(esc(txt(x.name)), '', esc(txt(x.link)), bullets(lines(x.details)))).join('');

const keyValue = (label, value) => `<div class="cv-item cv-kv"><span>${label}</span><span>${value}</span></div>`;

export const skillRows = (v) => [['Technical Skills', v.skills], ['Soft Skills', v.soft], ['Languages', v.languages]]
  .filter(([, items]) => items.length).map(([label, items]) => keyValue(label, items.map(esc).join(', '))).join('');

export const details = (v, skip = []) => v.details.filter((d) => !skip.includes(d.label))
  .map((d) => keyValue(d.label, esc(d.value))).join('');

export const references = (v) => (v.references.length ? `<div class="cv-item cv-refs">${v.references.map((r) => `<div>
  <strong>${esc(txt(r.name))}</strong>
  ${[joined([r.designation]), joined([r.organization]), joined([r.phone]), joined([r.email])].filter(Boolean).map((x) => `<div>${x}</div>`).join('')}
  </div>`).join('')}</div>` : '');

export { esc };
