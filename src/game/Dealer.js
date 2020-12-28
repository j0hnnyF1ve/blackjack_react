import Hand from './Hand';

class Dealer {
    constructor(hand = new Hand() ) {
        this.hand = hand;
    }

    getHand() { return this.hand; }
};

export default Dealer;