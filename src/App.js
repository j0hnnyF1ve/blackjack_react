import { useState, useEffect } from 'react';

// React View Components, View in the MVC approach
import './App.css';
import Header from './components/Header';
import PlayerCards from './components/PlayerCards';
import MoneyDisplay from './components/MoneyDisplay';
import Controls from './components/Controls';

// Vanilla JS GameEngine
// GameEngine would be the Controller in an MVC approach
import GameEngine from './game/GameEngine';

// Statements to initialize the GameEngine
GameEngine.initialize();
GameEngine.dealToDealer();
GameEngine.dealToDealer();
GameEngine.dealToPlayer();
GameEngine.dealToPlayer();


function App() {
  // These state variables concern the state of the game, and affect 
  // flow of the game
  let [hideDealerCard, setHideDealerCard]   = useState(true);
  let [gameFinished, setGameFinished]       = useState(false);
  let [didPlayerStand, setDidPlayerStand]   = useState(false);
  let [didPlayerSplit, setDidPlayerSplit]   = useState(false);

  let [activeHand, setActiveHand]           = useState(GameEngine.getActiveHandIndex() );
  let [playerMoney, setPlayerMoney]         = useState(GameEngine.getPlayer().getMoney() );

  let [messages, setMessages]           = useState([]);
  let [dealerCards, setDealerCards]     = useState([...GameEngine.getDealer().getHand().getCards() ]);
  let [playerCards, setPlayerCards]     = useState([...GameEngine.getPlayer().getHands()]);
  
  // These control whether a button is enabled or disabled
  let [controlsStatus, setControlsStatus] = useState({
    hitDisabled: false,
    standDisabled: false,
    doubleDownDisabled: false, 
    splitDisabled: true,
    restartDisabled: false,
    resetDisabled: true
  });

  // This effect only occurs when a player stands
  // It indicates that the Game Engine should finish the game
  // by dealing cards to the dealer until it has 17 or greater or busts
  useEffect( () => {
    let interval = null;
    if(didPlayerStand === true) {
      interval = setInterval( () => {
        const currentState = GameEngine.evaluate(gameFinished);
        
        if(currentState.dealer.shouldHit === true) {
          GameEngine.dealToDealer();
          setDealerCards([...GameEngine.getDealer().hand.getCards() ]);
        }
        else {
          setGameFinished(true);
          clearInterval(interval);
        }
    
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameFinished, didPlayerStand]);

  // This effect will run every time the players cards change
  // Or the game reaches a finished state in some way
  useEffect( () => {
    const currentState = GameEngine.evaluate(gameFinished);

    setActiveHand(GameEngine.getActiveHandIndex() );

    let { dealer } = currentState;

    let messages = [];
    if(currentState.gameFinished === true) {
      GameEngine.calculateWinnings(currentState.playerHands);

      setHideDealerCard(false);
      let state = {
        hitDisabled: true,
        standDisabled: true,
        doubleDownDisabled: true, 
        splitDisabled: true,
        restartDisabled: false,
        resetDisabled: true
      };

      if( GameEngine.getPlayer().getMoney() <= 0) {
        messages.push('Game Over!');
        setControlsStatus({...state, restartDisabled:true, resetDisabled: false});
      }
      else {
        setControlsStatus(state);
      }
    }

    // Evaluate each player hand
    // Add a message, or check for possible splits
    currentState.playerHands.forEach( (hand, index) => {
      if(hand.win === true) {
        let message = `Win: Hand ${index*1 + 1} wins! `;
        
        
        if(hand.hasBlackjack === true)  message += ` Blackjack!`;
        else if(dealer.bust === true)   message += ` Dealer went bust! (${dealer.value})`;
        else                            message += ` ${hand.value} > ${dealer.value} `;

        messages.push(message);
      }
      else if(hand.bust === true) {
        messages.push(`Loss: Hand ${index*1 + 1} went bust!`);
      }
      else if(hand.loss === true) {
        let message = `Loss: Hand ${index*1 + 1} was beaten by dealer! `;
        if(dealer.hasBlackjack === true)  message += ` Dealer has blackjack!`;
        else                              message += ` ${hand.value} < ${dealer.value}`;

        messages.push(message);
      }
      else if(hand.push === true) {
        messages.push(`Push: Hand ${index*1 + 1} pushed! ${hand.value} == ${dealer.value}`);
      }

      // Currently limiting splits to only 1
      else if(didPlayerSplit === false && hand.canSplit === true) {
        setControlsStatus({ 
          hitDisabled: false,
          standDisabled: false,
          doubleDownDisabled: false, 
          splitDisabled: false,
          restartDisabled: false,
          resetDisabled: true          
        });   
      }
    });

    setMessages(messages);
    setPlayerMoney(GameEngine.getPlayer().getMoney() );
  }, [didPlayerSplit, gameFinished, playerCards]);
  
  // hitHandler - Handles when the user clicks the hit button
  const hitHandler = () => { 
    GameEngine.dealToPlayer(null, activeHand);

    setPlayerCards( [...GameEngine.getPlayer().getHands()] );
    setControlsStatus({
      splitDisabled: true,
      restartDisabled: true,
      resetDisabled: true           
    });     
  };

  // standHandler - Handles when the user clicks the stand button
  const standHandler = () => {
    let hand = GameEngine.getActiveHand();
    hand.setStand(true);

    if(GameEngine.getPlayer().getNumOfHands() > 1) {
      GameEngine.incrementActiveHand();
      setActiveHand(GameEngine.getActiveHandIndex() );
    }

    if(GameEngine.didAllHandsFinish() || GameEngine.getActiveHandIndex() <= -99) {
      setControlsStatus({
        hitDisabled: true,
        standDisabled: true,
        doubleDownDisabled: true, 
        splitDisabled: true,
        restartDisabled: true,
        resetDisabled: true            
      });   
  
      setDidPlayerStand(true);
    }
  };

  // doubleDownHandler - Handles when the user clicks the Double Down button
  const doubleDownHandler = () => {   
    GameEngine.dealToPlayer(null, activeHand);
    GameEngine.doubleDown(activeHand);

    setPlayerCards( [...GameEngine.getPlayer().getHands()] );

    if(GameEngine.didAllHandsFinish() ) {
      setControlsStatus({
        hitDisabled: true,
        standDisabled: true,
        doubleDownDisabled: true, 
        splitDisabled: true,
        restartDisabled: true,
        resetDisabled: true            
      });   
  
      setDidPlayerStand(true);
    }
  };
  
  // splitHandler - Handles when the user clicks the Split button
  const splitHandler = () => { 
    let indexes = GameEngine.splitPlayerHand( GameEngine.getActiveHandIndex() );

    GameEngine.dealToPlayer(null, indexes[0]);
    GameEngine.dealToPlayer(null, indexes[1]);

    setControlsStatus({
      hitDisabled: false,
      standDisabled: false,
      doubleDownDisabled: false, 
      splitDisabled: true,
      restartDisabled: true,
      resetDisabled: true        
    });
    setDidPlayerSplit(true);
    setPlayerCards( [...GameEngine.getPlayer().getHands()] );
  };

  // continueHandler - Handles when the user clicks the Continue button
  const continueHandler = () => {
    console.clear(); 
    setMessages([]);
    setHideDealerCard(true);
    setGameFinished(false);
    setDidPlayerStand(false);
    setDidPlayerSplit(false);

    GameEngine.resetGame();
    GameEngine.dealToDealer();
    GameEngine.dealToDealer();
    GameEngine.dealToPlayer();
    GameEngine.dealToPlayer();

    setDealerCards([...GameEngine.getDealer().getHand().getCards() ]);
    setPlayerCards([...GameEngine.getPlayer().getHands() ]);

    setControlsStatus({
      hitDisabled: false,
      standDisabled: false,
      doubleDownDisabled: false, 
      splitDisabled: true,
      restartDisabled: false,
      resetDisabled: true          
    });
  };

  // resetHandler - Handles when the user clicks the Reset button
  // Similar to the Continue button, but resets the game to the beginning
  const resetHandler = () => {
    GameEngine.initialize();
    continueHandler();
  };

  // PlayerCards html for the actual Player
  let playerDecks = playerCards.map( (hand, index) => { 
    let finished = hand.stand || hand.finished;
    let bet = hand.bet;
    let win = hand.win;

    return (<PlayerCards 
      win={win} 
      bet={bet} 
      finished={finished} 
      key={index} 
      cards={hand.getCards()}></PlayerCards>);
  });

  return (
    <div className="App">
      <Header messages={messages}></Header>
      <content className="Content">
        <PlayerCards cards={dealerCards} hideDealerCard={hideDealerCard}></PlayerCards>
        <div className="PlayerContent">{playerDecks}</div>
      </content>
      <MoneyDisplay money={playerMoney}></MoneyDisplay>
      <Controls 
        players={playerCards}
        status={controlsStatus}

        activeHand={activeHand}
        hit={hitHandler} 
        stand={standHandler} 
        doubleDown={doubleDownHandler} 
        split={splitHandler}
        restart={continueHandler}
        reset={resetHandler}
      ></Controls>
    </div>
  );
}

export default App;
