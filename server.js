const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server);

app.use(express.static('public')); //sirve los archivos estaticos(front)

let onlineUsers = []; // array para guardar los usuarios online

io.on(
  'connection', 
  function(socket) { ///cuando un usuario se conecta se ejecuta esta funcion ///socket representa a un usuario en especifico y //io representa a todos los que estan conectados

  console.log('Un usuario se conecto');

  socket.on(
    'enviar-nombre', ///escucha en enviar-nombre
    function(nombre) { ///cuando escucha se ejecuta esta funcion con el parametro que recibio

    console.log('4. Servidor recibió nombre:', nombre);

    const existingUser = onlineUsers.find(user => user.nombre === nombre || user.id === socket.id); ///aca verificamos si existe el nombre

    if (!existingUser) { ///en caso de que no exista

      onlineUsers.push({id: socket.id, nombre}); //se agrega al array

      io.emit('online users', onlineUsers) //emitimos al cliente la lista de usuarios actualizada

    }
    else {
      console.log('el usuario ya existe')
    }
  })
   
 socket.on( 
  'chat message', ///escuchamos en chat message
  function(msg)  { ///cuando escuchamos se ejecuta la funcion con el parametro msg que recibio del cliente    
    
    if (msg.tipo === 'imagen') {
      console.log('imagen de ' + msg.usuario + "/" + msg.nombreArchivo)
    } else {
      // Mensaje de texto normal
      console.log('mensaje de ' + msg.usuario + "/" + msg.mensaje)
    }
    
    io.emit('chat message', msg); ///envia a todos los clientes el msg
});
  
  socket.on(
    'disconnect', //escuchamos cuando un usuario se desconecta
    function() { //esta funcion

    console.log('Un usuario se desconecto');

        onlineUsers = onlineUsers.filter(user => user.id !== socket.id); //eliminamos al usuario del array
    
        io.emit('online users', onlineUsers); //emitimos la lista actualizada
  });
});

server.listen(3000, function() {
  console.log('🚀 Servidor corriendo en http://localhost:3000');
});
