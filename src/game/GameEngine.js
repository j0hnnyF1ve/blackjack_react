import Player from './Player';
import Dealer from './Dealer';
import Hand from './Hand';
import Deck from './Deck';

class GameEngine {

    constructor(defaultBet = 100) {
        this.gameFinished   = false;
        this.defaultBet     = defaultBet;
        this.activeHand     = 0;
        
        this.Player         = new Player();
        this.Dealer         = new Dealer();
    }

    // #public method
    // initialize - Used to initialize the game to a "start" state
    // Player's credits are initialized using this step
    initialize(money=1000) {
        this.Player.money = money;
        this.resetGame();
    }

    // #public method
    // resetGame - Used to reset the game to a new hand
    resetGame() {
        this.gameFinished = false;
        this.activeHand = 0;
        this.clearPlayerHands();
        this.clearDealerHand();
        Deck.resetDeck();
    }

    // #public method
    // evaluate - will be called by a client to figure out the current state of 
    // the game for the dealer and player
    evaluate(gameFinished=false) {
        if(this.Player.hands.length === 0 || this.Dealer.hand.cards.length === 0) {
            console.log("[GameEngine.evaluate] - Player or Dealer has no hand to evaluate");
            return;
        }

        let currentState = {
            gameFinished: false,
        };

        // Evaluate the dealer's hand
        const dealerVal = this.getCardsVal(this.Dealer.getHand().getCards() );
        const dealerState = this.evaluateDealer(dealerVal);

        currentState.gameFinished = gameFinished || dealerState.gameFinished;
        currentState.dealer = dealerState;
        
        // Evaluate each player hand
        let { handsFinished, playersState } = this.evaluatePlayer(currentState.gameFinished, dealerVal, currentState.dealer);
        currentState.playerHands = playersState;

        if(handsFinished >= this.Player.getHands().length) {
            currentState.gameFinished = true;
        }     
        return currentState;
    }

    // # private method
    // evaluateDealer - evaluate the current state of the dealer
    // * dealerVal - The dealer's current card value
    evaluateDealer(dealerVal) {
        let gameFinished = false;
        let dealerState = {
            value: -99,
            shouldHit: false,
            push: false,
            win: false,
            bust: false,
            hasBlackjack: false
        };

        dealerState.value = dealerVal;

        // Check if Dealer has Blackjack
        if(this.gotBlackjack(dealerVal) ) {
            gameFinished                = true;
            dealerState.win             = true;
            dealerState.hasBlackjack    = true;
        }
        // Check if Dealer went bust
        else if(dealerVal > 21) {
            gameFinished                = true;
            dealerState.win             = false;
            dealerState.bust            = true;
        }
        else if(dealerVal < 17) {
            dealerState.shouldHit       = true;
        }

        return {
            gameFinished,
            ...dealerState
        }
    }

    // # private method
    // evaluatePlayer - evaluate the current state of the player
    // * isGameFinished - boolean, represents the game finished state
    // * dealerVal - The dealer's current card value
    // * dealerState - The state of the dealer's current hand
    evaluatePlayer(isGameFinished, dealerVal, dealerState)  {
        let handsFinished = 0;
        let playersState = this.Player.getHands().map( (hand, index) => { 
            let playerHandVal = this.getCardsVal(hand.getCards() );

            let playerState = {
                value: playerHandVal,
                bet: hand.getBet(),
                push: false,
                win: false,
                loss: false,
                bust: false,
                hasBlackjack: false,
                canSplit: this.canSplit(hand.getCards() )
            };

            if(this.gotBlackjack(playerHandVal) ) {
                playerState.hasBlackjack = true;

                if(dealerState.hasBlackjack) {
                    playerState.push = true;
                }
                else {
                    playerState.win = true;
                }
                hand.setFinished(true);
                handsFinished++;
            }
            else if(playerHandVal > 21) { 
                playerState.bust = true; 

                hand.setFinished(true);
                handsFinished++;
            }
            else if(dealerState.bust === true) {
                playerState.win = true;
                hand.setFinished(true);
                handsFinished++;
            }
            // Game Finished: Evaluate all hands against dealer at this time.
            else if(isGameFinished === true) {
                if(playerHandVal > dealerVal) {
                    playerState.win = true;
                }
                else if(playerHandVal < dealerVal)  {
                    playerState.loss = true;
                }
                else {
                    // Push
                    playerState.push = true; 
                }
                hand.setFinished(true);
                handsFinished++;
            }

            if(hand.getFinished() === true && index === this.activeHand ) {
                this.incrementActiveHand();
            }
            
            return playerState;
        });

        return { 
            handsFinished,
            playersState
        };
    }

    // # public method
    // calculateWinnings - Calculates how to adjust the player's money based on each hand's status (win/loss)
    // * playerState - Contains the status of each hand (lose, win, bust) + its bet
    calculateWinnings(playerState) {
        playerState.forEach(hand => {
            let { loss, bust, win, bet } = hand;

            if(loss || bust) {
                this.Player.setMoney( this.Player.getMoney() - bet );
            }
            else if(win) {
                this.Player.setMoney( this.Player.getMoney() + bet );            
            }
        });
    }

    // # private method - used internally to get the value of a set of cards
    // getCardsVal - Gets the value of a list of cards
    // * cards - An array of 1 or more cards
    getCardsVal (cards) {
        if(cards == null || cards.length <= 0) throw new Error(`[GameEngine.getCardsVal] cards should be a list of at least one card`)

        let numAces = 0;    
        let curVal = cards.reduce( (acc, cur) => {
            switch(cur) {
                case 10:
                case 11: // J
                case 12: // Q
                case 13: // K
                    acc = acc + 10;
                    break;
            
                case 1: // Aces
                    numAces++;
                    acc = acc + 11;
                    break;
                default: acc += cur;
            }
            return acc;
        }, 0);
    
        // If there are aces, the value changes once the original value exceeds 21
        while(numAces > 0 && curVal > 21) {
            curVal -= 10;
            numAces--;
        }
    
        return curVal;
    }

    // # private method
    // canSplit - Checks if the cards can be split
    // * cards - An array of 2 or more cards
    canSplit(cards) {
        // Can only split a pair of cards
        if(cards.length !== 2) { return false; }
        return cards[0] === cards[1];
    }

    // # private method
    // gotBlackjack - Checks to see if the player got 21
    // * cardVal - Value of a set of cards
    gotBlackjack(cardVal) { return cardVal === 21; }

    
    // # public method
    // dealToPlayer - Deals a card to the player
    // * card - optional param to specify a card, mainly used for testing
    // * curHand - index of the player's hand
    dealToPlayer(card=null, curHand=0) {
        if(curHand < 0 || curHand > this.Player.getHands().length) {
            throw new Error(`[GameEngine.dealToPlayer] - curHand index is out of bounds (${curHand})`)
        }

        let hand = this.Player.getHand(curHand);
        if(hand.getFinished() === false) {
            hand.addCard( Deck.dealCard(card) );
        }
    }

    // # public method
    // dealToDealer - Deals a card to the dealer
    dealToDealer() {
        this.Dealer.hand.addCard( Deck.dealCard() );
    }    
    
    // # private method
    // clearPlayerHands - Clear the previous hand, 
    //   - initialize the player's hand to a new hand
    clearPlayerHands() {
        this.Player.setHands([new Hand(this.defaultBet)]);
    }
    
    // # public method
    // splitPlayerHand - Split the player's hand specified by the index
    // * index - which player's hand to split
    splitPlayerHand(index) {
        if(index < 0 || index > this.Player.getHands().length) { 
            throw new Error(`[GameEngine.splitPlayerHand] - index is out of bounds`);
        }

        if(this.Player.getHands()[index] == null) {
            throw new Error(`[GameEngine.splitPlayerHand] - hand doesn't exist`);
        }
        
        let handToSplit = this.Player.getHand(index);

        if(handToSplit.getCards().length !== 2) { 
            throw new Error(`[GameEngine.splitPlayerHand] - handToSplit length must be 2`);
        }

        this.Player.deleteHand(index);

        let indexes = [];
        indexes.push( this.Player.addHand( new Hand(handToSplit.getBet(), [handToSplit.getCards()[0]]) ) );
        indexes.push( this.Player.addHand( new Hand(handToSplit.getBet(), [handToSplit.getCards()[1]]) ) );

        return indexes;
    }

    // # public method
    // doubleDown - Double downs the specified hand, marks it as finished
    // * curHand - the index of the hand to be Doubled Down
    doubleDown(curHand = 0) {
        if(curHand < 0 || curHand > this.Player.getHands().length) {
            throw new Error(`[GameEngine.doubleDown] - curHand index is out of bounds (${curHand})`)
        }

        let hand = this.Player.getHand(curHand);
        hand.setBet( hand.getBet() * 2);
        hand.setFinished(true);
    }

    // # public method
    // didAllHandsFinish - Checks each hand to see if it's in a state that would be finished
    // - finished would be if the hand either stood, doubled down, or finished some other way (bust or win conditions)
    didAllHandsFinish() {
        let count = 0;
        this.Player.getHands().forEach( hand => {
            if(hand.getStand() === true || hand.getDoubleDown() || hand.getFinished() === true) { count++; }
        });

        return count === this.Player.getNumOfHands();
    }

    // # private method
    // clearDealerHand - clears and initializes the dealer's hand to a new one
    clearDealerHand() {
        this.Dealer.hand = new Hand();
    }

    // # public method
    // incrementActiveHand - moves to the next active hand
    incrementActiveHand() {
        const incrementIndex = val => (val+1 > this.getPlayer().getNumOfHands() - 1) ? 0 : val+1;

        // normally, we're done if hand.finished && hand.stand are false
        let index = incrementIndex( this.getActiveHandIndex() );
        let hand = this.getPlayer().getHand( index );
        
        // loop through all the hands once, but break out we complete the loop without finding an index
        let count = 0;
        while(hand.finished === true || hand.stand === true) {
            index = incrementIndex(index);
            hand = this.getPlayer().getHand( index );
        
            if(count > this.getPlayer().getNumOfHands() ) { 
                this.gameFinished = true;
                index = -99;
                break; 
            }
            count++;
        }
        this.activeHand = index;
    }

    // # private setter
    // only used for unit tests
    // activeHand - the hand to set activeHand to
    setActiveHand(activeHand) { this.activeHand = activeHand; }

    // # public method
    // getActiveHand - return the hand that the game considers active
    getActiveHand() { return this.Player.getHand(this.activeHand); }

    // # public method
    // getActiveHand - return the index of the hand that the game considers active
    getActiveHandIndex() { return this.activeHand; }

    // # public method, getter
    getPlayer() { return this.Player; }

    // # public method, getter
    getDealer() { return this.Dealer; }

    // # public method, getter
    getGameFinished() { return this.gameFinished; }
};

// GameEngine should be a singleton
export default new GameEngine();