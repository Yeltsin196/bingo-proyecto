"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http_1 = require("http");
const socketIo = require("socket.io");
const Bingo_1 = require("./Bingo");
class App {
    constructor() {
        this.PORT = 8080;
        this.debug = false;
        this.routes();
        this.sockets();
        this.listen();
        this.runtime();
    }
    routes() {
        this.app = express();
        this.app.use(express.static('public'));
    }
    sockets() {
        this.server = http_1.createServer(this.app);
        this.io = new socketIo.Server(this.server);
    }
    listen() {
        this.io.on('connection', (socket) => {
            if (this.debug) {
                console.log('A user connected!');
            }

            socket.on('ADD CONNECTION', (msg) => {
                Bingo_1.default.NumberConections++;
            });
            socket.on('NEW CONNECTION', (msg) => {

                socket.emit('NEW NUMBER POINTS', Bingo_1.default.Numbers);
                socket.emit('NUMBERS DRAW', Bingo_1.default.Sorteados);
                const card = Bingo_1.default.NewCard();

                socket.card = card;
                socket.selectedCards = Array();
                socket.emit('NEW CARD', card);





                Bingo_1.default.Gamers.push(socket);

                console.log("nueva!");

            });
            socket.on('select number', (msg) => {
                if (socket.card.indexOf(msg) > -1) {
                    socket.selectedCards.push(msg);
                }
                if (this.debug) {
                    console.info(socket.card, socket.selectedCards);
                }
            });
            socket.on('button bingo', (msg) => {
                /*  console.log(socket.card); */
                var winVariable = Bingo_1.default.VerifyWin(socket.card);
                console.log(winVariable);
                if (winVariable) {
                    socket.emit('YOU WIN');
                } else {
                    socket.emit('YOU LOST');
                }
                /* socket.emit('VerifyWin', Bingo_1.default.VerifyWin(socket.card)); */

                /* if (socket.selectedCards.length >= Bingo_1.default.CardNums) {
                    let NumerosChekededs = 0;
                    Bingo_1.default.Sorteados.forEach((N) => {
                        socket.selectedCards.forEach(function (n) {
                            if (n == N && (socket.card.indexOf(n) > -1)) {
                                NumerosChekededs++;
                            }
                            else {
                               
                                socket.emit('YOU LOST');
                                if (this.debug) {
                                    console.info('Trapa??a! Numero n??o sorteado');
                                }
                            }
                        });
                    });
                    if (NumerosChekededs >= Bingo_1.default.CardNums) {
                     
                        socket.emit('YOU WIN');
                        socket.broadcast.emit('you lost');
                        if (this.debug) {
                            console.info('alguien gano!');
                        }
                    }
                }
                else {
                 
                    if (this.debug) {
                        console.info('Algu??m Perdeu! A Cartela n??o foi toda preenchida!');
                    }
                    socket.emit('YOU LOST');
                } */
            });
            socket.on('disconnect', () => {
                console.log("desconection");
                Bingo_1.default.Gamers.splice(Bingo_1.default.Gamers.indexOf(socket), 1);
                if (this.debug) {
                    console.info('User disconnected!');
                }
            });
            socket.on('reset', () => {

                socket.emit('NEW NUMBER POINTS', Bingo_1.default.Numbers);
                socket.emit('NUMBERS DRAW', Bingo_1.default.Sorteados);
                const card = Bingo_1.default.NewCard();
                socket.card = card;
                socket.selectedCards = Array();
                socket.emit('NEW CARD', card);
                Bingo_1.default.Sorteados = [];
            });
        });
    }
    runtime() {
        setInterval((io) => {
            let newNumber;
            do {
                newNumber = Bingo_1.default.GetNewNum() + 1;
            } while (Bingo_1.default.Sorteados.indexOf(newNumber) !== -1);


            if (Bingo_1.default.Sorteados.length > Bingo_1.default.Numbers - 1) {
                Bingo_1.default.Sorteados = [];
            }
            if (Bingo_1.default.Gamers.length >= 2) {

                Bingo_1.default.Sorteados.push(newNumber);
                io.emit('DRAW NUMBER', Bingo_1.default.Sorteados);

            }



        }, Bingo_1.default.IntervaloSorteio, this.io);
        setInterval((io) => {
            io.emit('INFO', {
                gamers: Bingo_1.default.Gamers.length,
                win_possible: Bingo_1.default.PossibleGamersWinners(),
                draw_numbers_counts: Bingo_1.default.Sorteados.length,
            });

        }, 5000, this.io);
    }
}
exports.default = new App();
