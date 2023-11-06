//importa el modulo "express" y lo guarda en la constante "express"
//En JS los modules normalmente se cargan e importan como variables/const son objetos JS que representan todo el contenido del modulo
const express = require("express");
//importa el modulo "http" y lo guarda en la constante "http".
//El modulo http provee funcionalidades para crear y manejar un servidor HTTP
const http = require("http");
//instancia el modulo "express" llamando a la funcion express(). El resultado se guarda en la constante "app"
const app = require("express")();
//importa el modulo JS que permite interactura con el sistema de archivos. Lo asigna al a const fs
const fs = require('fs');
const e = require("express");
//importa el objecto jsdom del modulo jsdom (modulo ajeno, no propio de js) y lo guarda en la constante "jsdom"
//permite manejar DOcument Object Model (DOM) con Node.js. En este caso, usa el DOM que representa el webpage. 
//representa el archivo html coomo estrucutra de arbol en memoria. 
//const { JSDOM } = require("jsdom");

// Rout handler de un request de tipo HTTP GET a la ruta primaria ./ es decir (http://localhost:9000/)
//Cuando un usuario accede a la URL base, ejectua este route handler
//el objeto "req" es el request que el cliente/user hace al servidor 
//el objecto "res" es la respuesta que el servidor devuelve al cliente/user
app.get("/", function (req,res){
 res.sendFile(__dirname + "/index.html");
    //Para este route handler, se envia el archivo HTML al cliente como repuesta/"res".
    //__dirname es una variable global de Node.js que contiene la ruta del directorio del proyecto
    //por lo que envia el index.html de ese mismo directorio 
});


// APP.LISTEN = Le dice al servidor que escuche en el puerto 9091 (arranca el servidor)
//la funcion function() es el callback (espera la señal) que se ejectuará cuando el servidor empiece a escuchar en el puerto 3000 exisitosamente
//Un callback permite que una funcion espera a una señal antes de ejecutarse. No va a entrar req o res hasta que el servidor empiece a escuchar
app.listen(9091, function(){
    console.log("Listening on http port 9091");
        //La funcion funcion() devuelve por consola ese log cuando el servidor arranca correctamente

});

//importa el modulo "websocket" y lo guarda en la constante "websocketServer" y accede a la propiedad "server" del modulo
//la const webackServer es un objeto que representa el servidor websocket
const websocketServer = require("websocket").server
//crea un servidor HTTP con el metodo createServer() del modulo http y lo guarda en la constante "httpServer"
//el servidor HTTP es el que escucha los requests de HTTP de los clientes
const httpServer = http.createServer();
//Esta linea arranca la instancia servidor http creado previamente 
//y lo hace empezar a escuchar los requests http de los clientes en el puerto 9090
//tiene dos parametros, el primero es el puerto 
//el segundo () es una lista vacia. ya que la func callback no necesita un parametro solo imprime un mensaje por consola
// Dsps de los parametros sigue la funcion arrow de JS  callback que se ejecuta cuando el servidor empieza a escuchar en el puerto 9090 (envviar mensaje por consola)
//esto asegura que el servidor esta funcionando
httpServer.listen(9090, () => console.log("Listening.. on 9090"))
//hashmap clients
//objetos js vacios. para guardar los clientes y los juegos en memoria como key-value pairs. 
//cada valor tendra una key relacion 1 a 1
const clients = {};
const games = {};

//declarcion const weServer 
//crea una nueva instancia de websocket usando el constructor websocketServer que declaramos antes
const wsServer = new websocketServer({
    //se le pasa httpServer como objeto a websocketServer para que use esa instancia para la comunicacion
    "httpServer": httpServer
})

//Handle para el evento request de websocketServer y procesa los mensajes del cliente
//"request" es el eveento que esta esperando 
//request es la variable que contiene la informacion del "request" y se usara en la funcion callback
wsServer.on("request", request => {
    //connect callback function

    //llama al parametro objeto request
    //accept es un metodo del modulo websocket respnsable de establecer la coneccion ws con dos parametros
    //el primero es el protocolo y el segundo busca el origen del request que asegura que viene de un source permitido
    const connection = request.accept(null, request.origin);
    //event listeners
    //cuando recibe el evento open envia por consola el log 
   connection.on("open", () => console.log("opened!"))
    
    //cuando recibe el evento close envia por consola el log
    connection.on("close", (e) => console.log("closed!", e))


    //cuando recibe el evento message ejecuta la funcion anom
    connection.on("message", message => {
        //La data del JSON del mensaje websocket se parsea p/ guarda en el const "result" 
        const result = JSON.parse(message.utf8Data)
        //I have received a message from the client
        //a user want to create a new game
         //si el metodo de result es create
        if (result.method === "create") {
            //genera un nuevo gameId
            const clientId = result.clientId;
            //genera un nuevo gameId con guid
            const gameId = guid();
            //se guarda en coleccion de games con su guid como key
            games[gameId] = {
                "id": gameId,
                "balls": 6,
                //vacio array que guardara los clientes que se unan al juego
                "clients": []
        
            }

            const payLoad = {
                "method": "create",
                "game" : games[gameId]
            }

            const con = clients[clientId].connection;
            con.send(JSON.stringify(payLoad));
        }

        //a client want to join
        if (result.method === "join") {

            const clientId = result.clientId;
            const gameId = result.gameId;
            const game = games[gameId];
            if (game.clients.length >= 3) 
            {
                //sorry max players reach
                return;
            }
            const color =  {"0": "Red", "1": "Green", "2": "Blue"}[game.clients.length]
            game.clients.push({
                "clientId": clientId,
                "color": color
            })
            //start the game
            if (game.clients.length === 3) updateGameState();

            const payLoad = {
                "method": "join",
                "game": game
            }
            //loop through all clients and tell them that people has joined
            game.clients.forEach(c => {
                clients[c.clientId].connection.send(JSON.stringify(payLoad))
            })
        }
        //a user plays
        if (result.method === "play") {
            const gameId = result.gameId;
            const ballId = result.ballId;
            const color = result.color;
            let state = games[gameId].state;
            if (!state)
                state = {}
            
            state[ballId] = color;
            games[gameId].state = state;
            
        }

    })

    //generate a new clientId
    const clientId = guid();
    clients[clientId] = {
        "connection":  connection
    }

    const payLoad = {
        "method": "connect",
        "clientId": clientId
    }
    //send back the client connect
    connection.send(JSON.stringify(payLoad))

})


function updateGameState(){

    for (const g of Object.keys(games)) {
        const game = games[g]
        const payLoad = {
            "method": "update",
            "game": game
        }

        game.clients.forEach(c=> {
            clients[c.clientId].connection.send(JSON.stringify(payLoad))
        })
    }
    setTimeout(updateGameState, 500);
}

function playBackgroundMusic() {
    const audio = document.getElementById("backgroundMusic");
  
    // Fijarse si existe el elemento de audio existe
    if (audio) {
      audio.play().catch((error) => {
        console.error("Failed to play audio:", error);
      });
    }
  }


 
// genera un Globally Unique Identifier hardcodeado. Luego se usa como ID de nueava partida
function guid() {
    const rw = ['ball', 'car', 'cat', 'dog', 'cookie', 'milk', 'shoe', 'duck', 'book', 'hat', 'toy', 'banana',
'bear', 'apple', 'flower', 'pink', 'green', 'blue', 'supercalifragilisticoespialidoso'];
    return rw[Math.floor(Math.random() * rw.length)];
  }