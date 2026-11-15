// Saves one user's CV data in this browser (localStorage). No server involved.
import { CONFIG } from './config.js';
import { emptyData } from './schema.js';
import { ls } from './utils.js';

export function createStore(userId, onSaveError = () => {}) {
  const key = `cvb:v1:${userId}`;
  let timer = null;

  let saved = {};
  try { saved = JSON.parse(ls.get(key)) || {}; } catch { saved = {}; }
  const state = {
    data: { ...emptyData(), ...(saved.data || {}) },
    template: saved.template || CONFIG.defaultTemplate,
  };

  function flush() {
    clearTimeout(timer);
    timer = null;
    if (!ls.set(key, JSON.stringify(state))) onSaveError();
  }
  const touch = () => { clearTimeout(timer); timer = setTimeout(flush, 300); };

  // Do not lose the last keystrokes when the tab is closed or hidden.
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => { if (document.hidden && timer) flush(); });

  return {
    get data() { return state.data; },
    get template() { return state.template; },
    setTemplate(id) { state.template = id; flush(); },
    // path examples: "personal.fullName", "education.0.degree"
    set(path, value) {
      const parts = path.split('.');
      let node = state.data;
      for (const p of parts.slice(0, -1)) node = node[p] ??= {};
      node[parts.at(-1)] = value;
      touch();
    },
    addItem(listKey) { (state.data[listKey] ??= []).push({}); flush(); },
    removeItem(listKey, index) { state.data[listKey].splice(index, 1); flush(); },
    flush,
  };
}
