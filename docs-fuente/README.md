# Documentos fuente (programas electorales)

Texto extraído (`pdftotext -layout`, con salto de página `\f`) de los programas oficiales, para poder citar página y
literal. Cada fichero se acompaña de URL oficial de origen y huella SHA-256 del PDF original en `MANIFEST.md`.

- Los PDF originales **no** se versionan (`*.pdf` en `.gitignore`); se verifican con la huella.
- Si añades un PDF a mano (p. ej. porque la web del partido bloquea descargas automáticas), indica en `MANIFEST.md` la URL
  oficial desde la que lo descargaste y la fecha, y ejecuta `pdftotext -layout docs-fuente/<partido>.pdf docs-fuente/<partido>.txt`.
