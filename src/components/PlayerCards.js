import Card from './Card';

// PlayerCards - Presentational component that displays the user's current cards and bet
const PlayerCards = props => {
    let { cards, bet, finished, hideDealerCard } = props;

    let displayCards = cards.map((card, index) => { 
        const facedown = (index === 0 && hideDealerCard) ? true : false;

        return (<Card number={card} facedown={facedown} key={index}></Card>)
    });
    let className = "PlayerCards";
    if(hideDealerCard) className += " hideDealerCard";
    if(finished) className += " finished";

    return (
        <div className={className}>
            <div className="Cards">{displayCards}</div>
            <div className="Bet">{bet}</div>
        </div>
    );
};

export default PlayerCards;