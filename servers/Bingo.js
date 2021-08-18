"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Bingo {
    constructor() {
        this.Gamers = Array();
        this.Numbers = 90;
        this.Sorteados = Array();
        this.CardNums = 24;
        this.IntervaloSorteio = 5000;
    }
    NewCard() {
        const useds = Array();
        for (let i = 0; i < this.CardNums; i++) {
            let newNumber;
            do {
                newNumber = this.GetNewNum() + 1;
            } while (useds.indexOf(newNumber) !== -1);
            useds.push(newNumber);
        }
        return useds.sort((a, b) => a - b);
    }
    GetNewNum() {
        return Math.floor(Math.random() * this.Numbers);
    }
    PossibleGamersWinners() {
        let winners = 0;
        this.Gamers.forEach((J) => {
            let acertos = 0;
            for (const a of this.Sorteados) {
                for (const b of J.card) {
                    if (a == b) {
                        acertos++;
                    }
                }
            }
            if (acertos >= this.CardNums) {
                winners++;
            }
        });
        return winners;
    }
}
exports.default = new Bingo();
