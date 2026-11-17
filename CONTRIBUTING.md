# Cómo contribuir datos

1. Crea `data/sources/<id>.yaml` por cada fuente (URL, titular, medio, fecha, tipo, `archivo_url` de archive.org, minuto si es audio/vídeo).
2. Crea `data/claims/<id>.yaml` con `estado: en-revision`. Pasa a `publicado` solo con veredicto, explicación neutral, contraste y dos revisores distintos.
3. Prioridad: fuentes primarias (programas, BOE, Congreso, INE…). La prensa solo como hecho comprobable; sin adjetivación ni opinión.
4. Mismo protocolo para todos los partidos. Si dudas, no publiques.
5. `npm run validate` debe pasar. Abre un PR con la plantilla.

Veredictos y criterios: ver `/veredictos` en el sitio.
