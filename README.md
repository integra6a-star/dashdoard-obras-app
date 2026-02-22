# Integra • App (estático)

Este pacote é um "app" estático (HTML/CSS/JS) com:
- login por e-mail/senha via Supabase Auth
- páginas: `index.html` (Acompanhamento) e `funcionarios.html` (Financeiro/Funcionários)
- scripts: `js/supabaseClient.js` e `js/auth.js`

## 1) Configure Supabase (obrigatório)
No Supabase, pegue:
- Project URL
- anon public key

Cole no arquivo: `js/supabaseClient.js`

> Dica: Supabase Dashboard → Project Settings → API.

## 2) Criar usuário (e-mail e senha)
Supabase Dashboard → Authentication → Users → **Add user** → **Create new user**
- Preencha e-mail e senha.

(Alternativa: habilitar signups e usar cadastro, mas aqui deixei fechado para controle.)

## 3) Banco/Tabelas
Se você já rodou o SQL do projeto, ótimo.
O app tenta garantir um registro em `public.usuarios` ao logar (funcao padrão `leitor`).

## 4) Deploy
### Opção A — Vercel
Importe este repositório e aponte o "Root Directory" para a raiz.

### Opção B — GitHub Pages (mais simples)
- Coloque os arquivos na pasta `docs/` do repositório, e ative Pages apontando para `/docs`.
- Ou use o root, se sua configuração permitir.

## 5) Teste local
Abra `login.html` no navegador (ou use um servidor simples).