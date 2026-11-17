# Prepara Tu Voto

Sitio web (Astro + TypeScript, alojado en GitHub Pages) para entender en ~15 minutos qué dice y qué hace cada partido ante las **elecciones generales del 29-N-2026**. Primera fase: Cataluña y Madrid.

Principios: máxima objetividad posible, fuentes citadas y archivadas para cada dato, veredictos con criterios públicos, solo hechos y cargos públicos. Es un objetivo, no una garantía; los errores se corrigen en abierto.

## Desarrollo
```bash
npm install
npm run dev        # servidor local
npm run validate   # valida /data (esquemas + referencias + reglas editoriales)
npm run check      # tipos
npm run build      # validate + build estático en /dist
```

## Datos
Todo vive en `/data/<colección>/<id>.yaml` y se valida con `src/lib/schemas.ts`. Un claim **publicado** exige: fuente(s) con copia archivada, contraste, explicación, veredicto, y doble revisión. Los claims no verificados quedan `en-revision` y se muestran sin veredicto. Ver `CONTRIBUTING.md`.

Veredictos: `src/lib/verdicts.ts`. Despliegue: push a `main` → GitHub Pages (activar Settings → Pages → Source: GitHub Actions).
