export interface Region { id: string; nombre: string; activa: boolean; }
/** Comunidades. v1: Madrid y Cataluña; el resto se activa al ampliar. */
export const REGIONS: Region[] = [
  { id: 'cataluna', nombre: 'Cataluña', activa: true },
  { id: 'madrid', nombre: 'Comunidad de Madrid', activa: true },
];
export const activeRegions = () => REGIONS.filter((r) => r.activa);
