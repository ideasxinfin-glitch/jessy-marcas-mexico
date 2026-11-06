# Jessy Marcas México

Demo estática de la boutique y catálogo digital.

- `index.html`: página principal con estilos, filtros e imágenes integradas.
- `Jessy-Marcas-Landing-Demo.html`: archivo original conservado.
- `vercel.json`: sirve la raíz sin instalación ni compilación.

Las fotografías están incluidas como datos base64; no dependen de carpetas externas ni de ChatGPT. Las tipografías se descargan de Google Fonts.

## Vercel

Importar con Framework Preset **Other** y Root Directory en la raíz (vacío o `./`). La configuración incluida fija Output Directory a `.` y desactiva los comandos de instalación y compilación. No hace falta descomprimir archivos ZIP.

Si el proyecto ya existía, comprobar Root Directory y desplegar el commit más reciente. `vercel.json` no puede corregir una Root Directory incorrecta en el panel.

## Vista local

Abrir `index.html` en un navegador. Se conservan los contactos y enlaces del original. La demo no incluye base de datos ni panel administrativo.
