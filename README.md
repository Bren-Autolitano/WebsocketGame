# WebsocketGame

This is an interactive websocket game that runs in localhost created for the class Practicas Profesionalizantes II 
in ISFT N151. The game allows up to 3 players entering through different tabs in the browser. The goal is to fill
all the boxes with your color before the other players. The first player to complete the 
entire board with their color wins. 

## How to use
Welcome to our exciting multiplayer websocket browser game! To start playing, follow these simple steps:

* Open your web browser and enter "localhost:9091" as the URL.
* Click on the "New Game" button to create a fresh game session. You'll receive a unique Game ID displayed at the top of the page. Copy this Game ID.
* Paste the Game ID into the text box provided and then click "Join Game" to initiate the game. Every player who wants to participate in the same game should use the same Game ID.
* Once all players are connected, each player will be assigned one of three colors: Red, Green, or Blue.
* Now, you're ready to strategize and make your moves. Interact with the game board by clicking on the individual boxes to change them to your designated color.
* The goal of the game is to be the first player to complete the entire game board with your color. May the best strategist win!

Enjoy the competitive fun of our multiplayer websocket game and challenge your friends to see who is victorious!

## Features

- Real-time updates with WebSockets.
- Multiplayer support for up to 3 players.
- Interactive game board where players can strategize and compete.
- A winning condition to determine the first player to complete the board with their color.

### Pre requisites

You need to have Node.js installed
In order to verify if Node.js is already installed you can run the following command
```
npm -v
```

### Instalation

Download the code and run ``` npm i ``` in order to downlowad the packages.
Verify that the IP address in the index.html file on line 103 and 104 is the same that your computer is using.
Then run ``` nodemon index.js ``` in the terminal to start the game.
Open a web browser tab and go to localhost:9091 then start the game.

## POC

Here is a visual example of how the videogame looks.

![alt text](https://github.com/Bren-Autolitano/WebsocketGame/blob/main/game1.png?raw=true)

![alt text](https://github.com/Bren-Autolitano/WebsocketGame/blob/main/game2.png?raw=true)

## Troubleshooting

If you encounter an issue where running ```nodemon index.js``` doesn't work as expected, it might be due to an issue with the `nodemon` executable not being in your system's PATH. In this case, you can use `npx` to run `nodemon` as follows:

```bash
npx nodemon index.js
```

## Built With

* [Express](https://www.npmjs.com/package/express) - Node.js framework
* [Websocket](https://www.npmjs.com/package/websocket) - Websocket Client & Server Library implementing the WebSocket protocol
* [Nodemon](https://www.npmjs.com/package/nodemon) - Simple monitor script for use during development

## Author

* **Brenda Autolitano** - *Initial work* - [Bren-Autolitano](https://github.com/Bren-Autolitano)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


