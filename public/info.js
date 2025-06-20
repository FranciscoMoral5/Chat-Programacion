    const loginForm = document.getElementById('loginForm'); ///formulario

    const usernameInput = document.getElementById('username'); ///input

    const joinButton = document.getElementById('joinButton'); //boton de entrar chat

    // validacion de caracteres
    usernameInput.addEventListener( ///cualquier cambio que se haga en el usernameInput dispara esta funcion // funcion callback
        'input', //al tipo de evento que escucha 
        function() { //que hace despues de escuchar a ese evento, en este caso ejecuta una func anonima

        const value = this.value.trim();
        const isValid = value.length >= 2 && value.length <= 20;
        
        joinButton.disabled = !isValid;
        
        if (isValid) {
            this.style.borderColor = '#27ae60';
        } else if (value.length > 0) {
            this.style.borderColor = '#e74c3c';
        } else {
            this.style.borderColor = '#e1e8ed';
        }
    });


    ///envio del formulario
    loginForm.addEventListener( ///funcion callback
        'submit', ///cuando escucha un submit se dispara la funcion anonima
        function(e) { ///funcion anonima

        e.preventDefault(); //esto evita que el navegador haga lo que haria por defecto(recargar la pagina), sin esto se recargaria la pagina y perderiamos todos los datos

        const username = usernameInput.value.trim();
        console.log(username)
        
        if (username.length < 2) {
            showError('El nombre debe tener al menos 2 caracteres');
            return;
        }
        
        if (username.length > 20) {
            showError('El nombre no puede tener más de 20 caracteres');
            return;
        }
        
        if (!username.replace(/\s/g, '').length) {
            showError('El nombre no puede estar vacío o contener solo espacios');
            return;
        }
        
        usernameInput.value = '';

        joinChat(username);
    });

    function joinChat(username) { ///funcion para unirse al chat
        joinButton.classList.add('loading');
        joinButton.textContent = 'Conectando...';
        joinButton.disabled = true;

            sessionStorage.setItem('Username', username); ///guarda en el sessionstorage el nombre para poder captarlo desde la otra pestaña
            
            ///espera 100 ms para dar tiempo a guardar en el sessionstorage
            setTimeout(() => {
                window.location.href = 'index.html'; ///redirige a index.html, que es donde esta el chat
            }, 100);
    }


    function showError(message) {
        // Agregar efecto de shake al input
        usernameInput.classList.add('shake');
        usernameInput.style.borderColor = '#e74c3c';
        
        // Crear o actualizar mensaje de error
        let errorMsg = document.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.style.color = '#e74c3c';
            errorMsg.style.fontSize = '14px';
            errorMsg.style.marginTop = '10px';
            errorMsg.style.textAlign = 'center';
            usernameInput.parentNode.appendChild(errorMsg);
        }
        
        errorMsg.textContent = message;
        
        setTimeout(() => {
            usernameInput.classList.remove('shake');
            if (errorMsg) {
                errorMsg.remove();
            }
        }, 3000);
    }

    // Enfocar automáticamente el campo de texto al cargar
    window.addEventListener('load', () => {
        usernameInput.focus();
    });