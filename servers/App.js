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
                console.info('A user connected!');
            }
            socket.on('ADD CONNECTION', (msg) => {
                Bingo_1.default.NumberConections++;
            })
            socket.on('NEW CONNECTION', (msg) => {
                console.log(Bingo_1.default.NumberConections);
                if (Bingo_1.default.NumberConections > 1) {


                    socket.emit('NEW NUMBER POINTS', Bingo_1.default.Numbers);
                    socket.emit('NUMBERS DRAW', Bingo_1.default.Sorteados);
                    const card = Bingo_1.default.NewCard();
                    socket.card = card;
                    socket.selectedCards = Array();
                    socket.emit('NEW CARD', card);
                    Bingo_1.default.Gamers.push(socket);
                    console.log("nueva!");
                }

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
                if (socket.selectedCards.length >= Bingo_1.default.CardNums) {
                    let NumerosChekededs = 0;
                    Bingo_1.default.Sorteados.forEach((N) => {
                        socket.selectedCards.forEach(function (n) {
                            if (n == N && (socket.card.indexOf(n) > -1)) {
                                NumerosChekededs++;
                            }
                            else {
                                /*User lost*/
                                socket.emit('YOU LOST');
                                if (this.debug) {
                                    console.info('Trapaça! Numero não sorteado');
                                }
                            }
                        });
                    });
                    if (NumerosChekededs >= Bingo_1.default.CardNums) {
                        /*User win Game*/
                        socket.emit('YOU WIN');
                        socket.broadcast.emit('you lost');
                        if (this.debug) {
                            console.info('Alguém ganhou!');
                        }
                    }
                }
                else {
                    /*User lost*/
                    if (this.debug) {
                        console.info('Alguém Perdeu! A Cartela não foi toda preenchida!');
                    }
                    socket.emit('YOU LOST');
                }
            });
            socket.on('disconnect', () => {
                Bingo_1.default.Gamers.splice(Bingo_1.default.Gamers.indexOf(socket), 1);
                if (this.debug) {
                    console.info('User disconnected!');
                }
            });
        });
    }
    runtime() {
        setInterval((io) => {
            let newNumber;
            do {
                newNumber = Bingo_1.default.GetNewNum() + 1;
            } while (Bingo_1.default.Sorteados.indexOf(newNumber) !== -1);

            if (Bingo_1.default.Gamers.length > 0) {

                Bingo_1.default.Sorteados.push(newNumber);
                io.emit('DRAW NUMBER', newNumber);
            }

        }, Bingo_1.default.IntervaloSorteio, this.io);
        setInterval((io) => {
            io.emit('INFO', {
                gamers: Bingo_1.default.Gamers.length,
                win_possible: Bingo_1.default.PossibleGamersWinners(),
                draw_numbers_counts: Bingo_1.default.Sorteados.length,
            });

        }, 10000, this.io);
    }
}
exports.default = new App();
