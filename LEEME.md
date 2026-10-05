# Tarjetas LilGhost Studio

Qué hace cada archivo:

| Archivo | Para qué sirve | ¿Lo editas? |
|---|---|---|
| `ajustes.js` | Nombre del negocio, WhatsApp y estadísticas | Sí, una vez |
| `tarjetas.json` | La lista de tarjetas y a dónde lleva cada una | Lo genera el panel |
| `index.html` | Recibe a quien escanea y lo manda al link | No |
| `panel/index.html` | Tu panel para agregar tarjetas y bajar los QR | No |
| `panel/qrcode.js` | Librería que dibuja los QR (licencia MIT, Kazuhiko Arase) | No |

## Para cambiar o agregar tarjetas

1. Abre tu panel: `https://lilghost99.github.io/tarjetas/panel/`
2. Agrega, edita o pausa tarjetas.
3. Da clic en **Descargar tarjetas.json**.
4. En GitHub: **Add file → Upload files**, arrastra el archivo y da **Commit changes**.
5. Espera 1 o 2 minutos.

## Para grabar una tarjeta NFC

1. En el panel da clic en **Copiar dirección** de la tarjeta.
2. Abre **NFC Tools** → Escribir → Agregar registro → URL/URI → pega la dirección.
3. Toca **Escribir** y acerca la tarjeta al celular.

Consejo: si un cliente deja de pagar, usa **Pausar** en lugar de borrar.
