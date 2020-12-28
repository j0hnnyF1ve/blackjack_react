import Hand from './Hand';

describe('Hand', () => {
    let hand = null;
    beforeEach( () => {
        hand = new Hand();
    })

    test('creating a Hand', () => {
        expect(hand).toBeInstanceOf(Hand);
    });

    describe('* addCard', () => {
        test('  ** valid integer argument between 1 and 13', () => {
            hand.addCard(13);
            expect(hand.getCards()[0]).toBeGreaterThanOrEqual(1);
            expect(hand.getCards()[0]).toBeLessThanOrEqual(13);
        });
        test('  ** invalid argument, out of bounds, card > 13', () => {
            expect( ()=> { hand.addCard(15); }).toThrow(Error);
        });
        test('  ** invalid argument, out of bounds, card < 1', () => {
            expect( ()=> { hand.addCard(0); }).toThrow(Error);
        });

        test('  ** invalid argument, not an integer', () => {
            expect( ()=> { hand.addCard('slajdfsdfs'); }).toThrow(Error);
        });
    });

    describe('.* getCards', () => {
        test(' ** getCards should return a list of cards', () => {
            hand.addCard(5);
            expect(hand.getCards().length ).toBe(1);            
        });
    })

    describe('* setFinished', () => {
        test(' ** valid boolean argument, true', () => {
            hand.setFinished(true);
            expect(hand.getFinished() ).toBeTruthy();
        });
        test(' ** valid boolean argument, false', () => {
            hand.setFinished(false);
            expect(hand.getFinished() ).toBeFalsy();
        });
        test(' ** invalid argument, not a boolean', () => {
            expect( ()=> { hand.setFinished('asldfjdjf'); }).toThrow(Error);
        });
    });

    describe('* setWin', () => {
        test(' ** valid boolean argument, true', () => {
            hand.setWin(true);
            expect(hand.getWin() ).toBeTruthy();
        });
        test(' ** valid boolean argument, false', () => {
            hand.setWin(false);
            expect(hand.getWin() ).toBeFalsy();
        });
        test(' ** invalid argument, not a boolean', () => {
            expect( ()=> { hand.setWin('asldfjdjf'); }).toThrow(Error);
        });
    });  

    describe('* setStand', () => {
        test(' ** valid boolean argument, true', () => {
            hand.setStand(true);
            expect(hand.stand).toBeTruthy();
        });
        test(' ** valid boolean argument, false', () => {
            hand.setStand(false);
            expect(hand.stand).toBeFalsy();
        });
        test(' ** invalid argument, not a boolean', () => {
            expect( ()=> { hand.setStand('asldfjdjf'); }).toThrow(Error);
        });
    });    

    describe('* setDoubleDown', () => {
        test(' ** valid boolean argument, true', () => {
            hand.setDoubleDown(true);
            expect(hand.getDoubleDown() ).toBeTruthy();
        });
        test(' ** valid boolean argument, false', () => {
            hand.setDoubleDown(false);
            expect(hand.getDoubleDown() ).toBeFalsy();
        });
        test(' ** invalid argument, not a boolean', () => {
            expect( ()=> { hand.setDoubleDown('asldfjdjf'); }).toThrow(Error);
        });
    });  

    describe('* setBet', () => {
        test(' ** valid integer argument', () => {
            hand.setBet(100);
            expect(hand.getBet() ).toBe(100);            
        });
        test(' ** invalid argument, not an integer', () => {
            expect( ()=> { hand.setBet('100'); }).toThrow(Error);
        });
    });
});

// Test template
// test('', () => {});
