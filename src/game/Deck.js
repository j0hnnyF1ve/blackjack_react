class Deck {

    constructor() {
        this.deckMap = new Map();
        this.numCards = 0;   

        this.resetDeck();
    }

    // selectedCard allows us to select the card to be dealt
    // This normally would be used for testing only
    // Real games should randomize cards dealt
    dealCard(selectedCard=null) {
        let card = null;

        if(this.numCards <= 0) { 
            console.error(`[Deck.dealCard] - Deck has been exhausted (numCards = 0)`);
            return null;
        }

        if(selectedCard != null) {
            if(!Number.isInteger(selectedCard)) {
                throw new Error("[Deck.dealCard] - selectedCard is not an integer")
            }
            if(selectedCard < 1 || selectedCard > 13) {
                throw new Error("[Deck.dealCard] - selectedCard must be between 1 and 13");
            }
            if(this.deckMap.get(selectedCard) <= 0) {
                throw new Error(`[Deck.dealCard] - (${selectedCard}) has been exhausted`);
            }

            card = selectedCard;
            this.deckMap.set(selectedCard, this.deckMap.get(selectedCard) - 1);
            this.numCards--;                

            return card;
        }

        while(card == null && this.numCards > 0) {
            let selection = Math.floor( Math.random() * 13)*1 + 1;;

            if( this.deckMap.get(selection) > 0) {
                card = selection;
                this.deckMap.set(selection, this.deckMap.get(selection) - 1);
                this.numCards--;
                break;
            }
        }
        
        // console.log(`[dealCard] - Selected Card ${card} - Current Deck: `, this.numCards, this.deckMap);
        return card;
    }

    resetDeck() {
        this.deckMap = new Map();
        this.numCards = 0;

        for(let i=1; i <= 13; i++) {
            this.deckMap.set(i, 4);
            this.numCards += 4;
        }   
        // console.log(this.numCards, this.deckMap);
    };

    /* 
    setDeckMap - Set the new deck map
    * newDeckMap - a Map object representing the cards, map entries should be between 1 to 13
    * numCards - number of cards in the deck
    This method is mostly for testing, to test different deck scenarios 
    */
    setDeckMap(newDeckMap, numCards) { 
        if(newDeckMap == null || !Number.isInteger(numCards) ) {
            throw new Error("[Deck.setDeckMap] - Must pass in both a deck map and the number of cards in the deckMap");
        }
        this.deckMap = newDeckMap; 

    }
    getDeckMap()  { return this.deckMap; }
    getNumCards() { return this.numCards; }
}

// Deck will be a singleton
export default new Deck();