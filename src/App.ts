import * as express from 'express';
import { createServer, Server } from 'http';
import { Socket } from 'socket.io';
import socketIo = require('socket.io');
import bingo from './Bingo';

class App {
    public app: express.Application;
    public server: Server;
    public PORT: number = 8080;
    public debug: boolean = false;
    private io: socketIo.Server;

    constructor() {
        this.routes();
        this.sockets();
        this.listen();
        this.runtime();
    }

    routes() {
        this.app = express();
        this.app.use(express.static('public'));
    }

    private sockets(): void {
        this.server = createServer(this.app);
        this.io = new socketIo.Server(this.server);
    }

    private listen(): void {

        this.io.on('connection', (socket: any) => {
            if (this.debug) {
                console.log('A user connected!');
            }
            socket.on('ADD CONNECTION', (msg) => {
                bingo.NumberConections++;
            })
            socket.on('NEW CONNECTION', (msg) => {
                console.log(bingo.NumberConections);


                console.log("conexion nueva!");
                socket.emit('NEW NUMBER POINTS', bingo.Numbers);
                socket.emit('NUMBERS DRAW', bingo.Sorteados);

                const card = bingo.NewCard();
                socket.card = card;
                socket.selectedCards = Array();

                socket.emit('NEW CARD', card);
                bingo.Gamers.push(socket);
                console.log(bingo.Gamers);


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

                if (socket.selectedCards.length >= bingo.CardNums) {
                    let NumerosChekededs = 0;
                    bingo.Sorteados.forEach((N) => {

                        socket.selectedCards.forEach(function (n) {
                            if (n == N && (socket.card.indexOf(n) > -1)) {
                                NumerosChekededs++;
                            } else {
                                /*User lost*/
                                socket.emit('YOU LOST');
                                if (this.debug) {
                                    console.info('Trapaça! Numero não sorteado');
                                }
                            }
                        });
                    });
                    if (NumerosChekededs >= bingo.CardNums) {
                        /*User win Game*/
                        socket.emit('YOU WIN');
                        socket.broadcast.emit('you lost');
                        if (this.debug) {
                            console.info('Alguém ganhou!');
                        }
                    }
                } else {
                    /*User lost*/
                    if (this.debug) {
                        console.info('Alguém Perdeu! A Cartela não foi toda preenchida!');
                    }
                    socket.emit('YOU LOST');
                }
            });

            socket.on('disconnect', () => {
                bingo.Gamers.splice(bingo.Gamers.indexOf(socket), 1);
                if (this.debug) {
                    console.info('User disconnected!');
                }
            });
        });
    }
    private runtime() {

        setInterval((io) => {
            let newNumber;
            do {
                newNumber = bingo.GetNewNum() + 1;
            } while (bingo.Sorteados.indexOf(newNumber) !== -1);
            console.log(bingo.Gamers.length);
            if (bingo.Gamers.length > 0) {

                bingo.Sorteados.push(newNumber);
                io.emit('DRAW NUMBER', newNumber);
            }


        }, bingo.IntervaloSorteio, this.io);

        setInterval((io) => {
            io.emit('INFO', {
                gamers: bingo.Gamers.length,
                win_possible: bingo.PossibleGamersWinners(),
                draw_numbers_counts: bingo.Sorteados.length,
            });

        }, 10000, this.io);
    }
}

export default new App();
