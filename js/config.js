// All site-wide settings live here. Change values in this file only.
export const CONFIG = {
  appName: 'CV Builder',
  homeUrl: 'https://www.ictebook.com', // "back to ICTebook" link
  signupUrl: 'https://www.ictebook.com/login', // where a student creates an ICTebook account

  auth: {
    // 'supabase' = login required with the ICTebook account.
    // 'off'      = no login (for local development only).
    mode: 'supabase',
    supabaseUrl: 'https://jexuwampjfzdzuezjfol.supabase.co',
    supabaseKey: 'sb_publishable_QMOeTLzzUDb0Czqr80oqwg_pvUkS5KY', // publishable key, safe in the browser
  },

  defaultLang: 'bn',          // 'bn' | 'en'
  defaultTemplate: 'classic', // id from js/templates/index.js
  exportScale: 3,             // 3 = about 288 dpi on A4 (HD print)
};
