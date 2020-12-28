class Hand {
    constructor(bet=0, cards=[], finished=false) {
        this.bet        = bet;
        this.cards      = cards;
        this.finished   = finished;
        this.win        = null;
        this.stand      = false;
        this.doubleDown = false;
    }

    addCard(card) {
        if((card <= 0 || card > 13) || card !== parseInt(card, 10) ) {
            throw new Error("[Hand.addCard] - Card passed in was invalid (between 1 and 13)");
        }
        this.cards.push(card);
    }
    getCards() { return this.cards; }

    setFinished(finished) { 
        if(typeof finished !== "boolean") { 
            throw new Error("[Hand.setFinished] - finished was not a boolean");
        }
        this.finished = finished; 
    }

    getFinished() { 
        return this.finished;
    }

    setWin(win) {
        if(typeof win !== "boolean") { 
            throw new Error("[Hand.setWin] - win was not a boolean");
        }
        this.win = win; 
    }

    getWin() { return this.win; }

    setStand(stand) {
        if(typeof stand !== "boolean") { 
            throw new Error("[Hand.setStand] - stand was not a boolean");
        }
        this.stand = stand; 
    }    
    getStand() { return this.stand; }

    setDoubleDown(doubleDown) {
        if(typeof doubleDown !== "boolean") { 
            throw new Error("[Hand.setdoubleDown] - doubleDown was not a boolean");
        }
        this.doubleDown = doubleDown; 
    }    
    getDoubleDown() { return this.doubleDown; }

    setBet(bet) {
        if( !Number.isInteger(bet) ) { 
            throw new Error("[Hand.setBet] - bet was not an integer");
        }
        this.bet = bet;
    }

    getBet() { return this.bet; }
};

export default Hand;