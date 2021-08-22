"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Bingo {
    constructor() {
        this.NumberConections = 0;
        this.Gamers = Array();
        this.Numbers = 75; // cantidad numeros del carton
        this.Sorteados = Array();

        this.CardNums = 25;
        this.IntervaloSorteio = 10000;

        this.NumberConections = 0;

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
    ResetBingo() {
        this.Sorteados = [];
    }
    VerifyWin(array) {


        if (this.columnWin(array) || this.filWin(array)) {
            return true;
        } else {
            return false;
        }
    }
    columnWin(array) {
        var element;
        var band = 0;
        var band_mayor = 0;
        var arrayAux = [];
        for (let index = 0; index < 5; index++) {
            /*             const element = array[index]; */
            element = 0;
            arrayAux = [];
            band = 0;
            for (let jindex = index * 5; jindex < (index + 1) * 5; jindex++) {
                element = array[jindex];

                for (let sorteados = 0; sorteados < this.Sorteados.length; sorteados++) {
                    var elementsorteados = this.Sorteados[sorteados];

                    if (element == elementsorteados) {
                        band++;

                        if (band > band_mayor) {
                            band_mayor = band;

                        } else if (band == 4 && index == 2) {
                            return true;
                        }
                    }
                }


            }
        }
        if (band_mayor == 5) {
            return true;
        }
        return false;
    }

    filWin(array) {
        var element;
        var band = 0;
        var band_mayor = 0;
        var arrayAux = [];
        for (let index = 0; index < 5; index++) {
            /*             const element = array[index]; */
            element = 0;
            arrayAux = [];
            band = 0;

            for (let jindex = 0; jindex < 5; jindex++) {



                for (let sorteados = 0; sorteados < this.Sorteados.length; sorteados++) {
                    var elementsorteados = this.Sorteados[sorteados];

                    if (element == elementsorteados) {
                        band++;
                        console.log(band);
                        if (band > band_mayor) {
                            band_mayor = band;

                        } else if (band == 4 && index == 2) {
                            return true;
                        }
                    }
                }

            }
        }
        if (band_mayor == 5) {
            return true;
        }
        return false;

    }
}
exports.default = new Bingo();
