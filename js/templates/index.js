// Template registry. To add a template: create a file like classic.js,
// add its styles to css/templates.css, and list it here.
import classic from './classic.js';
import fresher from './fresher.js';
import modern from './modern.js';
import creative from './creative.js';
import ats from './ats.js';

export const TEMPLATES = [classic, fresher, modern, creative, ats];
export const getTemplate = (id) => TEMPLATES.find((tpl) => tpl.id === id) || TEMPLATES[0];
