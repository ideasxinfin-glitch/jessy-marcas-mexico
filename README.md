# Jessy Marcas México

Demo estática de la boutique y catálogo digital.

- `index.html`: página principal con estilos, filtros e imágenes integradas.
- `Jessy-Marcas-Landing-Demo.html`: archivo original conservado.
- `vercel.json`: sirve la raíz sin instalación ni compilación.
- `assets/landing.css` y `assets/landing.js`: ajustes adaptables, iconos y consultas por artículo.

Las fotografías están incluidas como datos base64; no dependen de carpetas externas ni de ChatGPT. Las tipografías se descargan de Google Fonts.

## Vercel

Importar con Framework Preset **Other** y Root Directory en la raíz (vacío o `./`). La configuración incluida fija Output Directory a `.` y desactiva los comandos de instalación y compilación. No hace falta descomprimir archivos ZIP.

Si el proyecto ya existía, comprobar Root Directory y desplegar el commit más reciente. `vercel.json` no puede corregir una Root Directory incorrecta en el panel.

## Vista local

Abrir `index.html` en un navegador. Se conservan los contactos y enlaces del original. La demo no incluye base de datos ni panel administrativo.

## Consultas y vista móvil

La página principal muestra las fotos completas. Facebook e Instagram tienen accesos animados y WhatsApp permanece flotante. Se respeta la preferencia del dispositivo de reducir animaciones.

Cada artículo tiene una referencia estable (JMM-001 a JMM-015). Sus botones y las novedades preparan un mensaje de WhatsApp con el nombre, marca, categoría, referencia y enlace directo al artículo. El visitante revisa y envía el mensaje en WhatsApp; la landing no lo envía automáticamente. Al abrir un enlace a un artículo se muestra su tarjeta y se resalta. Los botones generales indican que la consulta viene de la landing.

`Jessy-Marcas-Landing-Demo.html` conserva la entrega original; la versión actual se abre desde `index.html`.

## Verificación

Con Node.js y Chrome instalados: instalar Playwright en un directorio de desarrollo (`npm install --no-save --package-lock=false playwright`) y ejecutar `node --test tests/landing.test.cjs`. No hay dependencias necesarias para publicar la página. Para comprobar un despliegue, establecer `DEMO_URL` a su URL antes de ejecutar las pruebas.
