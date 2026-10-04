const API_URL = 'https://jsonplaceholder.typicode.com/users';

const catalogo = document.getElementById('catalogo');
const mensaje = document.getElementById('mensaje');
const estado = document.getElementById('estado');

// registrar service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registro = await navigator.serviceWorker.register('./sw.js');
      console.log('SW registrado. Scope:', registro.scope);
    } catch (error) {
      console.error('Error al registrar el SW:', error);
    }
  });
}

// en linea y sin conexion
function actualizarEstado() {
  if (navigator.onLine) {
    estado.textContent = '● En línea';
    estado.className = 'estado online';
  } else {
    estado.textContent = '● Sin conexión';
    estado.className = 'estado offline';
  }
}

window.addEventListener('online', () => {
  actualizarEstado();
  cargarCatalogo();
});
window.addEventListener('offline', actualizarEstado);
actualizarEstado();

// Consumir la API
async function cargarCatalogo() {
  mensaje.textContent = 'Cargando catálogo…';
  mensaje.hidden = false;

  try {
    const respuesta = await fetch(API_URL);
    if (!respuesta.ok) throw new Error('Respuesta no válida: ' + respuesta.status);

    const usuarios = await respuesta.json();
    mostrarCatalogo(usuarios);
    mensaje.hidden = true;
  } catch (error) {
    console.error('Error al cargar:', error);
    mensaje.textContent = 'No se pudo cargar el catálogo. Conéctate a internet al menos una vez para guardar los datos.';
  }
}

// tarjetas
function mostrarCatalogo(usuarios) {
  catalogo.innerHTML = '';

  usuarios.forEach((u) => {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'tarjeta';
    tarjeta.innerHTML = `
      <h2>${u.name}</h2>
      <p>${u.email}</p>
      <p>${u.phone}</p>
      <p>${u.address.city}</p>
      <p class="empresa">${u.company.name}</p>
    `;
    catalogo.appendChild(tarjeta);
  });
}

cargarCatalogo();
