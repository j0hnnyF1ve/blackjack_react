import GameEngine from './GameEngine';
import Hand from './Hand'; // used for incrementActiveHand test

describe('GameEngine', () => {
  beforeEach( () => {
    GameEngine.initialize(1000);
  });

  describe('initialize', () => {
    test('* calling initialize with 500 should set Player\'s money to 500 and restart the game', () => {
      GameEngine.initialize(500);
      expect(GameEngine.getPlayer().getMoney()).toBe(500);
    });
  });

  describe('evaluate', () => {
    // TODO, evaluate is more complex than the other methods because it combines multiple responsibilities
    // evaluate would be properly tested in the context of UI using it to determine its current state
  });

  describe('evaluateDealer', () => {
    test('* calling with 21 sets blackjack = true, gameFinished = true', () => {
      let dealerState = GameEngine.evaluateDealer(21);

      expect(dealerState.gameFinished).toBeTruthy();
      expect(dealerState.win).toBeTruthy();
      expect(dealerState.hasBlackjack).toBeTruthy();
    });

    test('* calling with >21 sets bust = true, gameFinished = true, win = false', () => {
      let dealerState = GameEngine.evaluateDealer(25);

      expect(dealerState.gameFinished).toBeTruthy();
      expect(dealerState.win).toBeFalsy();
      expect(dealerState.bust).toBeTruthy();
    });   
    
    test('* calling with <17 sets shouldHit = true', () => {
      let dealerState = GameEngine.evaluateDealer(16);
      expect(dealerState.shouldHit).toBeTruthy();
    });      
  });

  describe('evaluatePlayer', () => {
    test('* calling with a hand\'s value = 21 sets blackjack = true, handFinished = true', () => {
      GameEngine.dealToPlayer(10);
      GameEngine.dealToPlayer(1);

      let { playersState: playerHands } = GameEngine.evaluatePlayer(false, 15, { hasBlackjack: false });

      expect(playerHands[0].hasBlackjack).toBeTruthy();
      expect(GameEngine.getPlayer().getHand(0).getFinished() ).toBeTruthy();
    });

    test('* calling with a hand\'s value > 21 sets blackjack = true, handFinished = true', () => {
      GameEngine.dealToPlayer(10);
      GameEngine.dealToPlayer(11);
      GameEngine.dealToPlayer(12);

      let { playersState: playerHands } = GameEngine.evaluatePlayer(false, 15, { hasBlackjack: false });

      expect(playerHands[0].bust).toBeTruthy();
      expect(GameEngine.getPlayer().getHand(0).getFinished() ).toBeTruthy();
    });

    test('* if the dealer busts, win = true, handFinished = true', () => {
      GameEngine.dealToPlayer(10);
      GameEngine.dealToPlayer(11);

      let { playersState: playerHands } = GameEngine.evaluatePlayer(false, 15, { bust: true });

      expect(playerHands[0].win).toBeTruthy();
      expect(GameEngine.getPlayer().getHand(0).getFinished() ).toBeTruthy();
    });


    describe('* if game is finished', () => {
      beforeEach( () => {
        GameEngine.dealToPlayer(10);
        GameEngine.dealToPlayer(5);
      });

      test('* playerVal (15) > dealerVal (13), win = true', () => {
        let { playersState: playerHands } = GameEngine.evaluatePlayer(true, 13, { });
  
        expect(playerHands[0].win).toBeTruthy();
        expect(GameEngine.getPlayer().getHand(0).getFinished() ).toBeTruthy();
      });

      test('* playerVal (15) < dealerVal (17), loss = true', () => {
        let { playersState: playerHands } = GameEngine.evaluatePlayer(true, 17, { });
  
        expect(playerHands[0].loss).toBeTruthy();
        expect(GameEngine.getPlayer().getHand(0).getFinished() ).toBeTruthy();
      });

      test('* playerVal (15) == dealerVal (15), push = true', () => {
        let { playersState: playerHands } = GameEngine.evaluatePlayer(true, 15, { });
  
        expect(playerHands[0].push).toBeTruthy();
        expect(GameEngine.getPlayer().getHand(0).getFinished() ).toBeTruthy();
      });

    });

    test('* calling evaluatePlayer with an empty hand will throw', () => {
      expect( () => 
        GameEngine.evaluatePlayer(false, 15, { }) )
          .toThrow(Error);
    });
  });


  describe('calculateWinnings', () => {
    test('* If player loses and bets 200, expect money = 800', () => {
      GameEngine.getPlayer().setMoney(1000);
      GameEngine.calculateWinnings([{
        bet: 200,
        loss: true
      }]);

      expect(GameEngine.getPlayer().getMoney() ).toBe(800);
    });

    test('* If player wins and bets 300, expect money = 1300', () => {
      GameEngine.getPlayer().setMoney(1000);
      GameEngine.calculateWinnings([{
        bet: 300,
        win: true
      }]);

      expect(GameEngine.getPlayer().getMoney() ).toBe(1300);
    });

  });

  describe('getCardsVal', () => {
    test('* Passing [11] should return a value of 10', () => {
      expect(GameEngine.getCardsVal([11])).toBe(10);
    });
    test('* Passing [12] should return a value of 10', () => {
      expect(GameEngine.getCardsVal([12])).toBe(10);
    });
    test('* Passing [13] should return a value of 10', () => {
      expect(GameEngine.getCardsVal([13])).toBe(10);
    });
  
    test('* Passing [1, 10] should return a value of 21', () => {
      expect(GameEngine.getCardsVal([1, 10])).toBe(21);
    });

    test('* Passing [10, 1, 10] should return a value of 21', () => {
      expect(GameEngine.getCardsVal([10, 1, 10])).toBe(21);
    });

    test('* Passing [13, 1, 12, 8] should return a value of 29', () => {
      expect(GameEngine.getCardsVal([13, 1, 12, 8])).toBe(29);
    });

    test('* Passing null should throw', () => {
      expect( () => {
        GameEngine.getCardsVal()
      }).toThrow(Error);
    });

    test('* Passing an empty array should throw', () => {
      expect( () => {
        GameEngine.getCardsVal([])
      }).toThrow(Error);
    });
  });

  describe('dealToPlayer', () => {
    test('* Calling with no arguments will deal a card between 1 and 13', () => {
      GameEngine.dealToPlayer();
      expect(GameEngine.getPlayer().getHand(0).getCards()[0]).toBeGreaterThanOrEqual(1);
      expect(GameEngine.getPlayer().getHand(0).getCards()[0]).toBeLessThanOrEqual(13);
    });

    test('* Calling with card = 1 will give the player a card with value of 1', () => {
      GameEngine.dealToPlayer(1);
      expect(GameEngine.getPlayer().getHand(0).getCards()[0]).toBe(1);
    });    

    test('* Passing an index out of range will throw', () => {
      expect( () => {
        GameEngine.dealToPlayer(null, -1);
      }).toThrow(Error);
    });
  });

  describe('dealToDealer', () => {
    test('* Calling with no arguments will deal a card between 1 and 13', () => {
      GameEngine.dealToDealer();
      expect(GameEngine.getDealer().getHand().getCards()[0]).toBeGreaterThanOrEqual(1);
      expect(GameEngine.getDealer().getHand().getCards()[0]).toBeLessThanOrEqual(13);
    });
  });

  describe('splitPlayerHand', () => {
    test('* Calling splitPlayerHand will split a hand into two hands, each with one card', () => {
      GameEngine.dealToPlayer(2);
      GameEngine.dealToPlayer(2);
      GameEngine.splitPlayerHand(0);

      expect(GameEngine.getPlayer().getHand(0).getCards()[0]).toBe(2);
      expect(GameEngine.getPlayer().getHand(1).getCards()[0]).toBe(2);
    });

    test('* Passing an index out of range will throw', () => {
      expect( () => {
        GameEngine.splitPlayerHand(-1);
      }).toThrow(Error);
    });    

    test('* Not passing an index will throw', () => {
      expect( () => {
        GameEngine.splitPlayerHand();
      }).toThrow(Error);
    });   
    
    test('* Splitting a hand that\'s not two cards will throw', () => {
      expect( () => {
        GameEngine.splitPlayerHand(0);
      }).toThrow(Error);
    });     
  });

  describe('doubleDown', () => {
    test('* Calling doubleDown will double the bet of the current hand, and set it to finished', () => {
      GameEngine.doubleDown(0);

      expect(GameEngine.getPlayer().getHand(0).getBet() ).toBe(200);
      expect(GameEngine.getPlayer().getHand(0).getFinished() ).toBeTruthy();
    });
  });

  describe('didAllHandsFinish', () => {
    test('* Calling didAllHandsFinish returns false when all hands aren\'t finished', () => {
      expect(GameEngine.didAllHandsFinish() ).toBeFalsy();
    });

    test('* Calling didAllHandsFinish returns true when all hands are finished', () => {
      GameEngine.getPlayer().getHand(0).setFinished(true);
      expect(GameEngine.didAllHandsFinish() ).toBeTruthy();
    });
  });

  describe('incrementActiveHand', () => {
    test('* One hand - sets active hand index to 0', () => {
      GameEngine.incrementActiveHand();
      expect(GameEngine.getActiveHandIndex() ).toBe(0);
    });

    test('* Three hands - sets active hand index to 1', () => {
      GameEngine.getPlayer().addHand(new Hand() );
      GameEngine.getPlayer().addHand(new Hand() );

      GameEngine.incrementActiveHand();
      expect(GameEngine.getActiveHandIndex() ).toBe(1);
    });

    test('* Three hands - sets active hand index = 0 when current active hand = 2', () => {
      GameEngine.getPlayer().addHand(new Hand() );
      GameEngine.getPlayer().addHand(new Hand() );
      GameEngine.setActiveHand(2);

      GameEngine.incrementActiveHand();
      expect(GameEngine.getActiveHandIndex() ).toBe(0);
    });


    test('* Three hands - sets game to finished when all hands are finished', () => {
      GameEngine.getPlayer().addHand(new Hand() );
      GameEngine.getPlayer().addHand(new Hand() );
      GameEngine.getPlayer().getHands().forEach( hand => hand.setFinished(true) );

      GameEngine.incrementActiveHand();
      expect(GameEngine.getGameFinished() ).toBeTruthy();
    });

  });


/*
  // template
  describe('', () => {
    test('', () => {

    });
  });
*/
});
