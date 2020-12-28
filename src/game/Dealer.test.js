import Hand from './Hand';
import Dealer from './Dealer';

describe('Dealer', () => {
    let dealer = null;
    beforeEach( () => {
        dealer = new Dealer();
    });

    test('* getHand returns an object of type Hand',  () => {
        let hand = dealer.getHand();
        expect(hand).toBeInstanceOf(Hand);
    });
});