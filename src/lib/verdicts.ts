/** Taxonomía única de veredictos. Fuente de verdad para UI, esquemas y validación. */
export const VERDICT_IDS = [
  'verdadero',
  'verdadero-pero',
  'discutible',
  'apresurado',
  'exagerado',
  'enganoso',
  'falso',
  'insostenible',
  'incomprobable',
] as const;

export type VerdictId = (typeof VERDICT_IDS)[number];
export type VerdictGroup = 'visible' | 'no-veraz';

export interface Verdict {
  id: VerdictId;
  label: string;
  icon: string; // no depender solo del color (accesibilidad)
  group: VerdictGroup;
  definition: string;
}

export const VERDICTS: Record<VerdictId, Verdict> = {
  verdadero: {
    id: 'verdadero', label: 'Verdadero', icon: '✔', group: 'visible',
    definition: 'La afirmación se confirma con fuentes y datos confiables.',
  },
  'verdadero-pero': {
    id: 'verdadero-pero', label: 'Verdadero, pero…', icon: '✔…', group: 'visible',
    definition: 'Es consistente con los datos disponibles, aunque omite algún elemento clave o contexto.',
  },
  discutible: {
    id: 'discutible', label: 'Discutible', icon: '⚖', group: 'visible',
    definition: 'La conclusión depende de las variables o criterios con los que se analice el dato.',
  },
  apresurado: {
    id: 'apresurado', label: 'Apresurado', icon: '⏩', group: 'no-veraz',
    definition: 'Podría ser cierta, pero se basa en una proyección y no en un dato objetivo comprobado.',
  },
  exagerado: {
    id: 'exagerado', label: 'Exagerado', icon: '📈', group: 'no-veraz',
    definition: 'No es estrictamente cierta en su magnitud, pero sí lo es el concepto o tendencia general a la que alude.',
  },
  enganoso: {
    id: 'enganoso', label: 'Engañoso', icon: '⚠', group: 'no-veraz',
    definition: 'Coincide parcialmente con ciertos datos, pero —intencionalmente o no— se manipula para generar un mensaje determinado.',
  },
  falso: {
    id: 'falso', label: 'Falso', icon: '✖', group: 'no-veraz',
    definition: 'Se demuestra que el dato o afirmación no es cierto al contrastarlo con las fuentes.',
  },
  insostenible: {
    id: 'insostenible', label: 'Insostenible', icon: '⛔', group: 'no-veraz',
    definition: 'Surge de investigaciones sin sustento, con graves errores metodológicos, o resulta imposible de comprobar.',
  },
  incomprobable: {
    id: 'incomprobable', label: 'Incomprobable', icon: '❔', group: 'no-veraz',
    definition: 'Se aplica solo al analizar piezas completas (como un spot o folleto) donde no hay ninguna afirmación basada en hechos o datos contrastables.',
  },
};

export const isNonTruthful = (id: VerdictId) => VERDICTS[id].group === 'no-veraz';
export const verdictsByGroup = (g: VerdictGroup) => VERDICT_IDS.filter((i) => VERDICTS[i].group === g).map((i) => VERDICTS[i]);
