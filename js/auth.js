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

function _purgeSupabaseStorage(){
  // Remove vestígios locais do supabase (evita "deslogar" e continuar logado por cache)
  const purge = (storage) => {
    if(!storage) return;
    const keys = [];
    for(let i=0;i<storage.length;i++){
      const k = storage.key(i);
      if(!k) continue;
      const kk = k.toLowerCase();
      if(
        kk.includes('supabase') ||
        kk.includes('sb-') ||
        kk.includes('auth-token') ||
        kk.includes('token')
      ){
        keys.push(k);
      }
    }
    keys.forEach(k => {
      try{ storage.removeItem(k); } catch(_e){}
    });
  };

  purge(window.localStorage);
  purge(window.sessionStorage);
}

async function logout(ev){
  if(ev && typeof ev.preventDefault === 'function') ev.preventDefault();
  try{
    // Tentativa de logout via Supabase
    if(sb && sb.auth && typeof sb.auth.signOut === 'function'){
      await sb.auth.signOut();
    }
  }catch(err){
    console.warn('Falha ao sair (ignorado):', err);
  }finally{
    _purgeSupabaseStorage();
    // replace evita voltar com "voltar" do navegador
    window.location.replace('login.html');
  }
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