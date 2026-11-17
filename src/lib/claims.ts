import { getCollection } from 'astro:content';
import type { VerdictId } from './verdicts';

/** Carga claims de un tema/región y los convierte en props de <ClaimCard>. */
export async function claimsFor(opts: { tema: string; partido?: string }) {
  const [claims, sources, parties, people] = await Promise.all([
    getCollection('claims'), getCollection('sources'), getCollection('parties'), getCollection('people'),
  ]);
  const src = (ids: string[]) => ids.flatMap((id) => {
    const s = sources.find((x) => x.id === id);
    return s ? [{ id, ...s.data }] : [];
  });
  return claims
    .filter((c) => c.data.tema === opts.tema && (!opts.partido || c.data.partido === opts.partido))
    .map((c) => ({
      id: c.id,
      partidoId: c.data.partido,
      partido: parties.find((p) => p.id === c.data.partido)?.data.siglas ?? c.data.partido,
      autor: c.data.persona ? people.find((p) => p.id === c.data.persona)?.data.nombre : undefined,
      texto: c.data.texto, fecha: c.data.fecha, peso: c.data.peso,
      veredicto: c.data.estado === 'publicado' ? (c.data.veredicto as VerdictId | undefined) : undefined,
      explicacion: c.data.estado === 'publicado' ? c.data.explicacion : undefined,
      fuentes: src(c.data.fuentes), contraste: src(c.data.contraste), fechaRevision: c.data.fecha_revision,
      revision: c.data.revisado_por,
    }));
}
