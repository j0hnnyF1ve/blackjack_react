import Deck from './Deck';

describe('Deck', () => {
    beforeEach( () => {
        Deck.resetDeck();
    });

    test('* Exhaustive Deck Test', () => {
        let deckMap = new Map();
        let card = null;

        // Use the deckMap to collect the cards dealt
        for(let i=1; i <= 52; i++) {
            card = Deck.dealCard();

            if(deckMap.has(card) ) {
                deckMap.set(card, deckMap.get(card)*1 + 1);
            }
            else {
                deckMap.set(card, 1);
            }
        }

        expect(deckMap.size).toBe(13);

        for(let i=1; i <= 13; i++) {
            let numCards = deckMap.get(i);

            expect(deckMap.has(i)).toBeTruthy();
            expect(numCards).toBe(4);
        }

    });

    test("Dealing 53 cards should call console.error and return null", () => {
        console.error = jest.fn();

        for(let i=1; i <= 52; i++) {
            Deck.dealCard();
        }

        let nullCard = Deck.dealCard();

        expect(nullCard).toBeNull();
        expect(console.error).toHaveBeenCalled();
    });

    describe("* dealCard", () => {

        test("** dealCard should return a random card between 1 & 13 for 52 cards", () => {
            for(let i=1; i <= 52; i++) {
                let card = Deck.dealCard();
                expect(card).toBeGreaterThanOrEqual(1);
                expect(card).toBeLessThanOrEqual(13);                
            }
        });

        test("** passing an argument to dealCard should return that card", () => {
            for(let i=1; i <= 13; i++) {
                let card = Deck.dealCard(i);
                expect(card).toBe(i);
            }
        });

        test("** passing an argument less than 1 will throw an error", () => {
            expect( () => { Deck.dealCard(0); }).toThrow(Error);
        });

        test("** passing an argument greater than 13 will throw an error", () => {
            expect( () => { Deck.dealCard(14); }).toThrow(Error);
        });


        test("** passing an argument more than 4 times will console.error and return null", () => {
            console.error = jest.fn();

            let card; 

            expect( () => { 
                card = Deck.dealCard(10);
                card = Deck.dealCard(10);
                card = Deck.dealCard(10);
                card = Deck.dealCard(10);
                card = Deck.dealCard(10);
            }).toThrow(Error);
        });
    });

    test("resetDeck should return a 52 card deck", () => {
        Deck.resetDeck();
        expect(Deck.getNumCards() ).toBe(52);
    });
});

