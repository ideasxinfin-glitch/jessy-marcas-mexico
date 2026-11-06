const icons = {
  whatsapp: '<path d="M20.52 3.48A11.87 11.87 0 0 0 12.05 0C5.5 0 .16 5.33.16 11.88c0 2.09.55 4.13 1.59 5.93L.06 24l6.33-1.66a11.9 11.9 0 0 0 5.66 1.44h.01c6.55 0 11.88-5.33 11.89-11.88a11.8 11.8 0 0 0-3.43-8.42zM12.06 21.8a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.76.98 1-3.66-.24-.38a9.84 9.84 0 0 1-1.51-5.27c0-5.45 4.44-9.89 9.9-9.89a9.82 9.82 0 0 1 7 2.9 9.82 9.82 0 0 1 2.89 7c0 5.46-4.44 9.9-9.88 9.91zm5.42-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.67-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.5 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"/>',
  facebook: '<path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2"/>',
};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icons[name]}</svg>`;
const img = name => IMAGE_DATA[name] || '';
const productRef = product => 'JMM-' + String(P.indexOf(product) + 1).padStart(3, '0');
const productId = product => 'articulo-' + productRef(product);
function productLink(product) {
  const url = new URL(location.href);
  url.search = '';
  url.hash = productId(product);
  return url.href;
}
function whats(product) {
  const text = [
    'Hola, vengo de la landing de Jessy Marcas México.',
    'Quisiera conocer el precio y la disponibilidad de este artículo:',
    `Artículo: ${product[0]}`,
    `Marca: ${product[3]}`,
    `Categoría: ${product[2]}`,
    `Referencia: ${productRef(product)}`,
    `Ver artículo: ${productLink(product)}`,
  ].join('\n');
  return 'https://wa.me/529995526909?text=' + encodeURIComponent(text);
}

// General contacts identify the landing; product contacts carry their own reference.
document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
  link.href = 'https://wa.me/529995526909?text=' + encodeURIComponent('Hola, vengo de la landing de Jessy Marcas México. Me gustaría recibir información sobre el catálogo. ' + location.origin + location.pathname);
  link.innerHTML = icon('whatsapp') + link.innerHTML.replace(/◉\s*(?:&nbsp;)?\s*/g, '');
  link.rel = 'noopener noreferrer';
});
const floating = document.querySelector('.floating-wa');
floating.innerHTML = icon('whatsapp');
floating.setAttribute('aria-label', 'Consultar por WhatsApp');
floating.title = 'Escríbenos por WhatsApp';

const socialLinks = {
  instagram: 'https://www.instagram.com/jessymarcasmexico/',
  facebook: 'https://www.facebook.com/profile.php?id=61557276932599',
};
document.querySelector('.small-social').innerHTML = Object.entries(socialLinks).map(([name, href]) => `<a class="social-icon ${name}" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${name === 'facebook' ? 'Facebook' : 'Instagram'}" title="${name === 'facebook' ? 'Facebook' : 'Instagram'}">${icon(name)}</a>`).join('');
document.querySelectorAll('.footer a[href*="instagram.com"], .footer a[href*="facebook.com"]').forEach(link => {
  const name = link.href.includes('instagram.com') ? 'instagram' : 'facebook';
  const label = name === 'facebook' ? 'Facebook' : 'Instagram';
  link.innerHTML = `<span class="social-icon ${name}">${icon(name)}</span> ${label}`;
  link.setAttribute('aria-label', label);
});
document.querySelector('.socialname .ig').innerHTML = icon('instagram');
document.querySelector('.socialbtn').innerHTML = icon('instagram') + ' Ver perfil en Instagram';

document.getElementById('categories').innerHTML = C.map(([category, photo]) => `<a class="cat" href="#catalogo" data-cat="${category}"><img src="${img(photo)}" alt="${category}" loading="lazy"><span>${category}</span></a>`).join('');
let active = 'Todos';
document.getElementById('filters').innerHTML = ['Todos', ...C.map(item => item[0])].map(category => `<button class="filter ${category === 'Todos' ? 'active' : ''}" data-filter="${category}" aria-pressed="${category === 'Todos'}">${category}</button>`).join('');
function render() {
  const search = document.getElementById('search').value.toLocaleLowerCase('es');
  const filtered = P.filter(product => (active === 'Todos' || product[2] === active) && (product[0] + ' ' + product[3]).toLocaleLowerCase('es').includes(search));
  document.getElementById('products').innerHTML = filtered.length ? filtered.map(product => `<article class="product" id="${productId(product)}" tabindex="-1"><button class="fav" title="Marcar favorito" aria-label="Marcar ${product[0]} como favorito" aria-pressed="false">♡</button><img src="${img(product[1])}" alt="${product[0]}" loading="lazy"><h3 class="prodname">${product[0]}</h3><div class="prodbrand">${product[3]}</div><div class="prodref">Ref. ${productRef(product)}</div><a href="${whats(product)}" target="_blank" rel="noopener noreferrer" class="prodcta" aria-label="Consultar ${product[0]} por WhatsApp">${icon('whatsapp')} Consultar artículo</a></article>`).join('') : '<p>No se encontraron productos en esta categoría.</p>';
}
function selectFilter(category) {
  active = category;
  document.querySelectorAll('.filter').forEach(button => {
    const selected = button.dataset.filter === category;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  render();
}
document.getElementById('filters').addEventListener('click', event => {
  const button = event.target.closest('[data-filter]');
  if (button) selectFilter(button.dataset.filter);
});
document.getElementById('categories').addEventListener('click', event => {
  const category = event.target.closest('[data-cat]');
  if (category) { document.getElementById('search').value = ''; selectFilter(category.dataset.cat); }
});
document.getElementById('search').addEventListener('input', render);
document.getElementById('products').addEventListener('click', event => {
  const button = event.target.closest('.fav');
  if (!button) return;
  const selected = button.classList.toggle('active');
  button.textContent = selected ? '♥' : '♡';
  button.setAttribute('aria-pressed', String(selected));
});
render();
document.getElementById('arrivals').innerHTML = [P[6], P[7], P[5], P[8], P[1], P[2]].map(product => `<a class="arrival" href="${whats(product)}" target="_blank" rel="noopener noreferrer" aria-label="Consultar ${product[0]} por WhatsApp"><img src="${img(product[1])}" alt="${product[0]}" loading="lazy"><span>${product[0]} · ${productRef(product)}</span></a>`).join('');
document.getElementById('thumbs').innerHTML = ['bolsa-rosa', 'lentes-rosa', 'tenis-alo', 'cinturones-gucci', 'tacones-dior-cafe', 'bolsas-chanel'].map(name => `<a href="${socialLinks.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Ver colección en Instagram"><img src="${img(name)}" alt="Galería Instagram" loading="lazy"></a>`).join('');

function revealArticle() {
  const id = location.hash.slice(1);
  if (!P.some(product => productId(product) === id)) return;
  if (!document.getElementById(id)) {
    document.getElementById('search').value = '';
    selectFilter('Todos');
  }
  requestAnimationFrame(() => {
    const article = document.getElementById(id);
    article.scrollIntoView({ behavior: 'instant', block: 'center' });
    article.focus({ preventScroll: true });
  });
}
window.addEventListener('hashchange', revealArticle);
revealArticle();
const menu = document.querySelector('.menu-toggle');
const navigation = document.getElementById('navigation');
menu.removeAttribute('onclick');
menu.setAttribute('aria-controls', 'navigation');
menu.setAttribute('aria-expanded', 'false');
function closeMenu() {
  navigation.classList.remove('mobile-open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Abrir menú');
}
menu.addEventListener('click', () => {
  const open = navigation.classList.toggle('mobile-open');
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); menu.focus(); } });
document.querySelectorAll('a[target="_blank"]').forEach(link => { link.rel = 'noopener noreferrer'; });
