    let socket; ///creamos el socket pero todavia no lo inicializamos, asi evitamos conexion al servidor sin antes validar el nombre

    const nombre = sessionStorage.getItem('Username') //obtenemos el Username del session storage

    console.log('1. Nombre obtenido del sessionStorage:', nombre);

    if (nombre == null) { ///validamos si el nombre existe
      window.location.href = 'info.html'; // si no existe entramos aca
    }
    else {
      socket = io(); //si existe el nombre creamos la conexion al servidor
    }

    ///referencias
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const mensajes = document.getElementById('messages');
    const usuariosConectados = document.getElementById('usuarios-conectados')
    const contador = document.getElementById('onlineCount')

    form.addEventListener( ///cuando se hace submit en el form se ejecuta la func anonima
      'submit', 
      function(e) { ///el parametro e es un objeto generado por el formulario con los datos del mismo

        e.preventDefault(); ///esto le indica al navegador que no recargue la pagina

        if (input.value.trim()) { 

          socket.emit('chat message', { //esto le emite al socket, a chat-message, un mensaje y el usuario que lo mando
            mensaje: input.value,
            usuario: nombre,
            tipo: 'texto'
          }); 
          input.value = '';

        }
    });


    socket.on( //escucha al socket, justamente a online users
      'online users', 
      function (users) { //cuando lo escucha ejecuta esta funcion

      console.log(users);
      
      usuariosConectados.innerHTML = ''; //aca limpiamos lo que hay dentro de la lista para cargar la nueva

      contador.textContent = users.length; //cambia el contenido del contado por la longitud del array
      
      users.forEach(element => { //bucle por cada elemento del array

        const newItem = document.createElement('li'); //crea una lista

        newItem.textContent = element.nombre; //a esa lsita le carga el nombre

        usuariosConectados.appendChild(newItem); //se le agrega un hijo(newItem) al padre(usuariosConectados)

      });

    })

    socket.on( //escuchamos al socket // a chat message
  'chat message', 
  function (msg) { //cuando escuchamos ejecutamos esta funcion

  const item = document.createElement('li'); 

  if (msg.tipo === 'imagen') {
    // Crear elemento para imagen
    item.innerHTML = `
        <div class="message-content">
            <strong>${msg.usuario}:</strong>
            <div class="image-message">
                <img src="${msg.imagen}" alt="${msg.nombreArchivo}" class="chat-image" onclick="openImageModal('${msg.imagen}')">
                <small class="image-filename">${msg.nombreArchivo}</small>
            </div>
        </div>
    `;
  } else {
    // Mensaje de texto normal
    item.innerHTML = `<strong>${msg.usuario}:</strong> ${msg.mensaje}`;
  }

  mensajes.appendChild(item);

  mensajes.scrollTop = mensajes.scrollHeight; // Baja al último mensaje
});

    socket.on(
      'connect', 
      function() {

      console.log('2. Socket conectado, enviando nombre:', nombre);

      socket.emit('enviar-nombre', nombre); //emitimos nuestro nombre al socket

    });

// Referencias para el toggle móvil
const mobileToggle = document.getElementById('mobileToggle');
const usersPanel = document.getElementById('usersPanel');
const toggleUsers = document.getElementById('toggleUsers');
const overlay = document.getElementById('overlay');

// Función para abrir el panel de usuarios en móvil
function openUsersPanel() {
    usersPanel.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Previene scroll del body
}

// Función para cerrar el panel de usuarios en móvil
function closeUsersPanel() {
    usersPanel.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = ''; // Restaura scroll del body
}

// Event listener para el botón de 3 líneas (móvil)
mobileToggle.addEventListener('click', function(e) {
    e.preventDefault();
    openUsersPanel();
});

// Event listener para el botón X dentro del panel
toggleUsers.addEventListener('click', function(e) {
    e.preventDefault();
    closeUsersPanel();
});

// Event listener para cerrar al hacer click en el overlay
overlay.addEventListener('click', function() {
    closeUsersPanel();
});

// Cerrar panel con tecla Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeUsersPanel();
    }
});

// Cerrar panel automáticamente cuando la pantalla se hace más grande
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        closeUsersPanel();
    }
});

// Referencias para el manejo de archivos
const fileInput = document.getElementById('fileInput');
const btnFile = document.querySelector('.btn-file');

console.log('Elementos encontrados:');
console.log('fileInput:', fileInput);
console.log('btnFile:', btnFile);

// Event listener para el botón de archivo
btnFile.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Botón clickeado - intentando abrir selector de archivo');
    
    // Crear un nuevo input temporal si el original no funciona
    const tempInput = document.createElement('input');
    tempInput.type = 'file';
    tempInput.accept = 'image/*';
    tempInput.style.display = 'none';
    
    tempInput.addEventListener('change', function(e) {
        console.log('Archivo seleccionado desde input temporal');
        const file = e.target.files[0];
        
        if (!file) return;
        
        console.log('Archivo:', file.name, file.type, file.size);
        
        // Validar que sea una imagen
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona solo imágenes');
            return;
        }
        
        // Validar tamaño (máximo 20MB)
        if (file.size > 20 * 1024 * 1024) {
            alert('La imagen es muy grande. Máximo 20MB');
            return;
        }
        
        // Leer el archivo como base64
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const imageData = event.target.result;
            console.log('Enviando imagen al servidor');
            
            // Enviar la imagen al servidor
            socket.emit('chat message', {
                mensaje: '', // mensaje vacío para imágenes
                usuario: nombre,
                tipo: 'imagen',
                imagen: imageData,
                nombreArchivo: file.name
            });
        };
        
        reader.readAsDataURL(file);
        
        // Remover el input temporal
        document.body.removeChild(tempInput);
    });
    
    // Agregar al DOM y hacer click
    document.body.appendChild(tempInput);
    tempInput.click();
});

// Función para abrir imagen en modal
function openImageModal(imageSrc) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <img src="${imageSrc}" alt="Imagen ampliada" class="modal-image">
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar modal
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('close-modal')) {
            document.body.removeChild(modal);
        }
    });
}