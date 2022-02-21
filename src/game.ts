import { Abbreviation, abbr } from "abbrev";
import { Letter, alphabet } from "alphabet";

export enum GameType {
    Abbr2Term,
    Term2Abbr,

    Letter2Phonetics,
    Letter2Word,
    Number2Phonetics,

    Random
}

export const Questions = new Map<GameType, string>([
    [GameType.Abbr2Term, "What is the term for '{}'?"],
    [GameType.Term2Abbr, "What is the abbrev. for '{}'?"],
    [GameType.Letter2Phonetics, "How to pronounce the letter '{}'?"],
    [GameType.Letter2Word, "How to write the letter '{}'?"],
    [GameType.Number2Phonetics, "How to pronounce the number '{}'?"]]);

export const GameComboTitles = new Map<GameType, string>([
    [GameType.Abbr2Term, "Find the term"],
    [GameType.Term2Abbr, "Find the abbrev."],
    [GameType.Letter2Phonetics, "Pronounce a letter"],
    [GameType.Letter2Word, "Write the letter"],
    [GameType.Number2Phonetics, "Pronounce a number"],
    [GameType.Random, "Random game"]
]);



export class Game {
    readonly abbr?: Abbreviation;
    readonly letter?: Letter;
    readonly type: GameType;

    readonly solution: string;
    readonly question: string;

    constructor(type: GameType) {
        if (type === GameType.Random) {
            type = randomInt(5);
        }
        this.type = type;

        switch (type) {
            case GameType.Abbr2Term:
            case GameType.Term2Abbr:
                this.abbr = abbr[randomInt(abbr.length)];
                break;

            case GameType.Number2Phonetics:
                this.letter = findLetter(String.fromCharCode('0'.charCodeAt(0) + randomInt(10)));
                break;

            case GameType.Letter2Phonetics:
            case GameType.Letter2Word:
                this.letter = findLetter(String.fromCharCode('A'.charCodeAt(0) + randomInt(26)));
                break;
        }

        this.solution = this.getSolution();
        this.question = this.getQuestion();
    }

    public isValid(ans: string): boolean {
        ans = this.clearString(ans);
        /* switch (this.type) {
             case GameType.Abbr2Term:
 
                 for (const a of abbr) {
                     if (a.Abbreviation === this.abbr!.Abbreviation
                         && ans === this.clearString(a.Term)) {
                         return true;
                     }
                 }
                 return false;
             default:*/
        return this.clearString(this.solution) === ans;
        /*  }*/
    }

    private clearString(str: string): string {
        return str.toLowerCase().replaceAll(/[ /-]/g, "");
    }

    private getSolution(): string {
        switch (this.type) {
            case GameType.Abbr2Term:
                return this.abbr!.Term;

            case GameType.Term2Abbr:
                return this.abbr!.Abbreviation;

            case GameType.Letter2Phonetics:
                return this.letter!.Pronunciation;

            case GameType.Letter2Word:
                return this.letter!.Word;

            case GameType.Number2Phonetics:
                return this.letter!.Pronunciation;

            default:
                throw new Error("no such type " + this.type);
        }
    }

    private getQuestion(): string {
        let q;
        let ctx;

        switch (this.type) {
            case GameType.Abbr2Term:
                q = this.abbr!.Abbreviation;
                ctx = this.abbr?.Context;
                break;

            case GameType.Term2Abbr:
                q = this.abbr!.Term;
                ctx = this.abbr?.Context;
                break;

            case GameType.Letter2Phonetics:
            case GameType.Letter2Word:
            case GameType.Number2Phonetics:
                q = this.letter!.Letter;

                break;

            default:
                throw new Error("no such type " + this.type);
        }

        let question: string = Questions.get(this.type)!;
        return question.replaceAll("{}", q) + (ctx ? "(" + ctx + ")" : "");
    }
}

function findLetter(letter: string): Letter {
    for (let idx = 0; idx < alphabet.length; idx++) {
        const ltr: Letter = alphabet[idx];
        if (ltr.Letter === letter) {
            return ltr;
        }
    }

    throw new Error("No such letter " + letter);
}

function randomInt(scale: number): number {
    return Math.floor((Math.random() * scale * 10) / 10);
}
