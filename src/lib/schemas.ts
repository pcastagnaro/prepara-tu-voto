import { z } from 'zod';
import { VERDICT_IDS, isNonTruthful } from './verdicts';

const id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'usa minúsculas y guiones');
const fecha = z.coerce.date();

export const AMBITOS = ['estatal', 'autonomico', 'municipal'] as const;

export const party = z.object({
  nombre: z.string(),
  siglas: z.string(),
  ambito: z.enum(['estatal', 'autonomico']),
  comunidades: z.array(id).default([]),
  web_oficial: z.string().url().optional(),
  denominaciones: z.array(z.object({ comunidad: id, nombre: z.string() })).default([]),
  notas: z.string().optional(),
  programa_url: z.string().url().optional(),
  ideologia_declarada: z.string().optional(),
});

export const person = z.object({
  nombre: z.string(),
  cargo_actual: z.string().optional(),
  trayectoria: z.array(z.object({
    partido: id,
    desde: fecha.optional(),
    hasta: fecha.optional(),
    cargo: z.string().optional(),
    fuentes: z.array(id).min(1),
  })).default([]),
  perfil_oficial: z.string().url().optional(),
});

export const topic = z.object({
  nombre: z.string(),
  orden: z.number().int(),
  resumen: z.string(),
  mvp: z.boolean().default(false),
});

export const constituency = z.object({
  nombre: z.string(),
  comunidad: id,
  cabezas_de_lista: z.array(z.object({ partido: id, persona: id, fuente: id })).default([]),
  escanos_congreso: z.number().int().optional(),
  fuente: z.string().url().optional(),
});

export const source = z.object({
  url: z.string().url(),
  titular: z.string(),
  medio: z.string(),
  fecha,
  tipo: z.enum(['oficial', 'prensa', 'verificador', 'audiovisual', 'dato-oficial']),
  archivo_url: z.string().url().optional(), // copia en archive.org
  minuto: z.string().optional(), // p. ej. "01:12:30" para vídeo/podcast
});

export const appearance = z.object({
  programa: z.string(),
  fecha,
  url: z.string().url(),
  persona: id,
  temas: z.array(id).default([]),
});

export const claim = z
  .object({
    persona: id.optional(),
    partido: id,
    tema: id,
    tipo: z.enum(['promesa', 'postura', 'accion-de-gobierno', 'cambio-de-postura']),
    texto: z.string().min(10),
    fecha,
    ambito: z.enum(AMBITOS),
    estado: z.enum(['en-revision', 'publicado']).default('en-revision'),
    peso: z.enum(['normal', 'estructural']).default('normal'),
    fuentes: z.array(id).min(1, 'sin fuente no hay afirmación'),
    veredicto: z.enum(VERDICT_IDS).optional(),
    explicacion: z.string().optional(),
    contraste: z.array(id).default([]),
    // Cada revisión indica si fue humana o por IA; la UI lo muestra siempre.
    revisado_por: z.array(z.object({ tipo: z.enum(['ia', 'humano']), nombre: z.string(), fecha })).default([]),
    fecha_revision: fecha.optional(),
  })
  .superRefine((c, ctx) => {
    if (c.estado !== 'publicado') return;
    const need = (cond: boolean, path: string, message: string) =>
      cond || ctx.addIssue({ code: 'custom', path: [path], message });
    need(!!c.veredicto, 'veredicto', 'un claim publicado necesita veredicto');
    need(!!c.explicacion, 'explicacion', 'un claim publicado necesita explicación');
    need(c.contraste.length >= 1, 'contraste', 'se exige contraste con al menos 1 dato/fuente');
    need(new Set(c.revisado_por.map((r) => r.nombre)).size >= 2, 'revisado_por', 'se exige doble revisión independiente (2 revisores distintos, IA o humanos)');
    need(!!c.fecha_revision, 'fecha_revision', 'falta fecha de revisión');
    if (c.veredicto && isNonTruthful(c.veredicto)) {
      need(new Set([...c.fuentes, ...c.contraste]).size >= 2, 'contraste',
        'un veredicto no veraz exige al menos 2 fuentes distintas');
    }
  });

export const timelineEvent = z.object({
  persona: id,
  fecha,
  tipo: z.enum(['contradiccion', 'cambio-de-partido', 'cambio-de-postura', 'cumplimiento', 'incumplimiento']),
  titulo: z.string(),
  descripcion: z.string(),
  claims: z.array(id).default([]),
  fuentes: z.array(id).min(1),
});

export const affinityQuestion = z.object({
  tema: id,
  texto: z.string(),
  fuentes: z.array(id).default([]),
});

export const affinityPosition = z.object({
  partido: id,
  pregunta: id,
  posicion: z.enum(['a-favor', 'en-contra', 'neutral', 'sin-posicion']),
  fuente: id,
});

export const SCHEMAS = {
  parties: party, people: person, topics: topic, constituencies: constituency, sources: source,
  appearances: appearance, claims: claim, timeline: timelineEvent,
  'affinity/questions': affinityQuestion, 'affinity/positions': affinityPosition,
} as const;
