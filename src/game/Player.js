import Hand from './Hand';

class Player {
    constructor() {
        this.money = 0;
        this.hands = [];
    }

    getMoney() { return this.money; }
    setMoney(money) { this.money = money; }

    getHand(index) { return this.hands[index]; }
    getHands() { return this.hands; }
    getNumOfHands() { return this.hands.length; }

    addHand(hand) {
        if(!(hand instanceof Hand)) {
            throw new Error(`[Player.addHand] - hand must be an instance of Hand`);
        }
        return this.hands.push(hand) - 1;
    }
    deleteHand(index) {
        this.hands.splice(index, 1);
    }
    setHands(hands = []) { 
        if(!Array.isArray(hands)) { 
            throw new Error(`[Player.setHands] - Must pass in an array`);
        }
        this.hands = hands;
    }    
};

export default Player;