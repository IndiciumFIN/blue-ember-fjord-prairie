import { readFileSync } from 'node:fs';

const fail = (msg) => { console.error('FAIL', msg); process.exitCode = 1; };
const ok = (msg) => console.log('PASS', msg);

// ── 1. Rotas nao abrem o banco nem um remoto. A leitura passa pela funcao. ──
const files = ['src/routes/admin.tsx','src/routes/assinante.tsx','src/routes/ferramentas.$slug.tsx','src/routes/assinante.ferramentas.$slug.tsx'];
for (const name of files) {
  const value = readFileSync(name,'utf8');
  if (/@\/lib\/db|supabase\.co|neon\.tech|postgres(ql)?:\/\//.test(value)) fail(`${name}: a rota abre banco ou remoto`);
  else ok(name);
}

// ── 2. O remoto não abre sozinho. O banco local embutido abre. ─────────────
//
// O backup público exigia `DB_ENABLED = false` e fazia `getSql()` rejeitar.
// Esse interruptor não existe mais neste runtime. O invariante atual é:
// sem `DATABASE_URL`, a fonte é o PostgreSQL embutido; nenhuma URL remota
// fica escrita no código; o migrador de deploy não conecta.
const db = readFileSync('src/lib/db.ts','utf8');
const migrator = readFileSync('scripts/migrate.mjs','utf8');

if (/const DB_ENABLED = false as const/.test(db)) fail('DB_ENABLED=false ainda está no runtime que abre o banco local');
else ok('o interruptor antigo DB_ENABLED=false não contradiz o runtime');

if (/postgres(ql)?:\/\/|neon\.tech|supabase\.co/.test(db)) fail('db.ts contém um endereço remoto escrito no código');
else ok('db.ts não carrega endereço remoto');

if (!/databaseUrl \? "neon" : "pglite"/.test(db)) fail('db.ts não escolhe pglite quando DATABASE_URL falta');
else ok('sem DATABASE_URL a fonte é o banco embutido');

if (!/DATABASE_URL not set — skipping/.test(migrator)) fail('scripts/migrate.mjs conectaria mesmo sem DATABASE_URL');
else ok('scripts/migrate.mjs não conecta sem DATABASE_URL');

// Importar db.ts fora do Vite dispara o bootstrap e quebra em import.meta.glob.
// O invariante observável neste processo é o texto acima, não a abertura do banco.

// ── 3. O migrador tambem nao pode conectar sem ordem ───────────────────────
if (!/DATABASE_URL/.test(migrator)) fail('scripts/migrate.mjs perdeu a guarda de DATABASE_URL');
else ok('scripts/migrate.mjs guardado');
