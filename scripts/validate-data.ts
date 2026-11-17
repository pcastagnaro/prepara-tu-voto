/**
 * Valida /data: esquema Zod por colección + integridad referencial + reglas editoriales.
 * Falla (exit 1) ante cualquier error. Uso: npm run validate
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import { parse } from 'yaml';
import { SCHEMAS } from '../src/lib/schemas';

const ROOT = new URL('../data/', import.meta.url).pathname;
const errors: string[] = [];
const err = (m: string) => errors.push(m);

const walk = (dir: string): string[] =>
  !existsSync(dir) ? [] : readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : extname(p) === '.yaml' ? [p] : [];
  });

type Rec = Record<string, any>;
const data: Record<string, Map<string, Rec>> = {};

for (const [col, schema] of Object.entries(SCHEMAS)) {
  data[col] = new Map();
  for (const file of walk(join(ROOT, col))) {
    const id = basename(file, '.yaml');
    try {
      const res = schema.safeParse(parse(readFileSync(file, 'utf8')));
      if (!res.success) {
        for (const i of res.error.issues) err(`${col}/${id}: ${i.path.join('.') || '(raíz)'} → ${i.message}`);
      } else data[col].set(id, res.data as Rec);
    } catch (e) {
      err(`${col}/${id}: YAML inválido (${(e as Error).message})`);
    }
  }
}

const has = (col: string, id: string) => data[col]?.has(id);
const ref = (where: string, col: string, id?: string) => {
  if (id && !has(col, id)) err(`${where}: referencia inexistente ${col}/${id}`);
};

for (const [id, c] of data.claims) {
  ref(`claims/${id}.partido`, 'parties', c.partido);
  ref(`claims/${id}.persona`, 'people', c.persona);
  ref(`claims/${id}.tema`, 'topics', c.tema);
  [...c.fuentes, ...c.contraste].forEach((s: string) => ref(`claims/${id}.fuentes`, 'sources', s));
  if (c.estado === 'publicado') {
    for (const s of [...c.fuentes, ...c.contraste]) {
      if (has('sources', s) && !data.sources.get(s)!.archivo_url)
        err(`claims/${id}: la fuente "${s}" no tiene copia archivada (archivo_url) y el claim está publicado`);
    }
  }
}
for (const [id, k] of data.constituencies) k.cabezas_de_lista.forEach((h: Rec) => {
  ref(`constituencies/${id}.partido`, 'parties', h.partido);
  ref(`constituencies/${id}.persona`, 'people', h.persona);
  ref(`constituencies/${id}.fuente`, 'sources', h.fuente);
});
for (const [id, p] of data.people) p.trayectoria.forEach((t: Rec) => {
  ref(`people/${id}.trayectoria.partido`, 'parties', t.partido);
  t.fuentes.forEach((s: string) => ref(`people/${id}.trayectoria.fuentes`, 'sources', s));
});
for (const [id, e] of data.timeline) {
  ref(`timeline/${id}.persona`, 'people', e.persona);
  e.claims.forEach((c: string) => ref(`timeline/${id}.claims`, 'claims', c));
  e.fuentes.forEach((s: string) => ref(`timeline/${id}.fuentes`, 'sources', s));
}
for (const [id, a] of data.appearances) ref(`appearances/${id}.persona`, 'people', a.persona);
for (const [id, q] of data['affinity/questions']) ref(`affinity/questions/${id}.tema`, 'topics', q.tema);
for (const [id, p] of data['affinity/positions']) {
  ref(`affinity/positions/${id}.partido`, 'parties', p.partido);
  ref(`affinity/positions/${id}.pregunta`, 'affinity/questions', p.pregunta);
  ref(`affinity/positions/${id}.fuente`, 'sources', p.fuente);
}

const total = Object.values(data).reduce((n, m) => n + m.size, 0);
if (errors.length) {
  console.error(`✖ ${errors.length} error(es) de validación:\n` + errors.map((e) => ` - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`✔ Datos válidos (${total} registros en ${Object.keys(data).length} colecciones)`);
