import Hand from './Hand';
import Player from './Player';

describe('Player', () => {
    let player = null;
    beforeEach( () => {
        player = new Player();
    });

    describe('* getHand', () => {
        let hand;
        beforeEach( () => {
            player.setHands([new Hand()]);
        });

        test('** a valid index should return a Hand', () => {
            hand = player.getHand(0);
            expect(hand).toBeInstanceOf(Hand);
        });
        test('** an invalid index should return undefined', () => {
            hand = player.getHand(1);
            expect(hand).toBeUndefined();
        });
    });

    test('* getHands returns a list',  () => {
        let hands = player.getHands();

        expect(hands).toBeInstanceOf(Array);
    });

    test('* getNumOfHands returns the number of total hands',  () => {
        player.addHand(new Hand() );
        let count = player.getNumOfHands();

        expect(count).toBe(1);
    });


    describe('* addHand', () => {
        test('** a valid index should return a Hand', () => {
            player.addHand(new Hand() );
            let hand = player.getHand(0);
            expect(hand).toBeInstanceOf(Hand);
        });
        test('** not passing in a Hand will throw', () => {
            expect( () => {
                player.addHand(-99);
            }).toThrow();
        });
    });


    describe('* deleteHand', () => {
        test('** deleting a hand should leave total hands at 0', () => {
            player.addHand(new Hand() );
            player.deleteHand(0);

            expect(player.getNumOfHands()).toBe(0);
        });

        test('** deleting a hand should leave total hands at 2', () => {
            player.addHand(new Hand(10) );
            player.addHand(new Hand(20) );
            player.addHand(new Hand(30) );
            player.deleteHand(1);

            expect(player.getNumOfHands()).toBe(2);
            expect(player.getHand(0).bet).toBe(10);
            expect(player.getHand(1).bet).toBe(30);
        });

    });    

    describe('* setHands', () => {
        test('** if input is not an array, throw an Error', () => {
            expect( () => {
                player.setHands(-99);
            }).toThrow();
        });
        test('** if input is an array with one Hand, getHands will return an array', () => {
            player.setHands([new Hand()]);
            let hands = player.getHands();
            
            expect(hands).toBeInstanceOf(Array);
            expect(player.getHand(0) ).toBeInstanceOf(Hand);
        });
    });
});