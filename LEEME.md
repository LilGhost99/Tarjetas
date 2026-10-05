# Tarjetas LilGhost Studio

| Archivo | Para qué sirve | ¿Lo editas? |
|---|---|---|
| `ajustes.js` | Nombre del negocio, WhatsApp y estadísticas | Sí, una vez |
| `tarjetas.json` | La lista de tarjetas y a dónde lleva cada una | Lo maneja el panel |
| `acceso.json` | Usuarios del panel (todo va cifrado) | Lo maneja el panel |
| `index.html` | Recibe a quien escanea y lo manda al link | No |
| `panel/index.html` | Tu panel para administrar tarjetas | No |
| `panel/qrcode.js` | Librería que dibuja los QR (MIT, Kazuhiko Arase) | No |

## Cómo funciona el acceso

- Cada persona entra con su usuario y contraseña.
- El token de GitHub va cifrado en `acceso.json`. Sin la contraseña correcta no se puede sacar.
- Contraseñas de 12 caracteres o más. Una frase sirve: `tacos-al-pastor-2026`.

## Tareas del administrador (panel → Usuarios)

- **Agregar persona:** usuario + contraseña. Pásale la contraseña en persona.
- **Quitar persona:** pide un token nuevo de GitHub. Después borra el viejo en GitHub.
- **Cambiar token:** cada 90 días, cuando venza. Después borra el viejo en GitHub.

Crear token: https://github.com/settings/personal-access-tokens/new
(Only select repositories → tarjetas · Contents: Read and write)

## Para grabar una tarjeta NFC

1. En el panel da clic en **Copiar dirección**.
2. **NFC Tools** → Escribir → Agregar registro → URL/URI → pega.
3. **Escribir** y acerca la tarjeta. Luego ponle contraseña en Otros → Establecer contraseña.

Si un cliente deja de pagar, usa **Pausar** en lugar de borrar.
