import GameEngine from './GameEngine';

describe('GameEngine', () => {
  describe('getCardsVal', () => {
    test('* Passing [11] should return a value of 10', () => {
      expect(GameEngine.getCardsVal([11])).toBe(10);
    });
    test('* Passing [12] should return a value of 10', () => {
      expect(GameEngine.getCardsVal([11])).toBe(10);
    });
    test('* Passing [13] should return a value of 10', () => {
      expect(GameEngine.getCardsVal([11])).toBe(10);
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
      }).toThrow();
    });

    test('* Passing an empty array should throw', () => {
      expect( () => {
        GameEngine.getCardsVal([])
      }).toThrow();
    });



  });
});
