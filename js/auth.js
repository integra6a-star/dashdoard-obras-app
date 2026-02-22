const sb = window.supabase.client;

function qs(sel){ return document.querySelector(sel); }
function setText(id, txt){ const el=qs(id); if(el) el.textContent = txt; }
function show(id){ const el=qs(id); if(el) el.style.display=""; }
function hide(id){ const el=qs(id); if(el) el.style.display="none"; }

async function requireAuth(){
  const { data: { session } } = await sb.auth.getSession();
  if(!session){
    window.location.href = "login.html";
    return null;
  }
  return session;
}

async function logout(){
  await sb.auth.signOut();
  window.location.href = "login.html";
}

async function ensureProfile(){
  // Tenta buscar um perfil em public.usuarios (se existir). Se não existir, cria.
  const { data: { user } } = await sb.auth.getUser();
  if(!user) return null;

  try{
    const { data: row, error } = await sb
      .from("usuarios")
      .select("user_id,nome,email,funcao,ativo")
      .eq("user_id", user.id)
      .maybeSingle();

    if(error) throw error;

    if(!row){
      const nome = (user.user_metadata && (user.user_metadata.name || user.user_metadata.nome)) || null;
      const email = user.email || null;

      const { data: ins, error: insErr } = await sb
        .from("usuarios")
        .insert([{ user_id: user.id, nome, email, funcao: "leitor", ativo: true }])
        .select()
        .single();

      if(insErr) throw insErr;
      return ins;
    }
    return row;
  }catch(e){
    console.warn("ensureProfile error:", e);
    return null; // não bloqueia o app
  }
}

window.IntegraAuth = { requireAuth, logout, ensureProfile };