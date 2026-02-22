// Configure aqui (ou substitua via Vercel Environment Variables e um build simples).
// Para projeto 100% estático, você precisa colar a URL e a ANON KEY do Supabase.
window.SUPABASE_URL = window.SUPABASE_URL || "COLE_AQUI_SUA_SUPABASE_URL";
window.SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || "COLE_AQUI_SUA_SUPABASE_ANON_KEY";

// Supabase JS v2 via CDN precisa estar carregado antes deste arquivo.
window.supabase = window.supabase || {};
window.supabase.client = window.supabase.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);