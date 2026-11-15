// Login with the ICTebook account (Supabase Auth, Google sign-in).
// Only the login is used: CV data is never sent to the server.
import { CONFIG } from './config.js';
import { CDN, loadScript } from './utils.js';

let client = null;

const toUser = (session) => (session?.user ? {
  id: session.user.id,
  email: session.user.email || '',
  name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
} : null);

// Returns the signed-in user, or null. Calls onChange(user|null) on later sign-in/out.
export async function initAuth(onChange) {
  const { mode, supabaseUrl, supabaseKey } = CONFIG.auth;
  if (mode === 'off') return { id: 'guest', email: '', name: '' };

  await loadScript(CDN.supabase);
  client = window.supabase.createClient(supabaseUrl, supabaseKey);
  const { data } = await client.auth.getSession();
  client.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') onChange(toUser(session));
  });
  return toUser(data.session);
}

export async function signInWithGoogle() {
  const { error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: location.origin + location.pathname },
  });
  if (error) throw error;
}

export const signOut = () => client?.auth.signOut();
export const authEnabled = () => CONFIG.auth.mode !== 'off';
