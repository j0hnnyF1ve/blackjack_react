// Card - presentational component that takes care of displaying a card
const Card = (props) => {

    let { facedown, number:cardNumber } = props;
    let className = "Card";
    className += facedown ? " hide" : "";

    switch(props.number) {
        case 1:     cardNumber = 'A'; break;
        case 11:    cardNumber = 'J'; break;
        case 12:    cardNumber = 'Q'; break;
        case 13:    cardNumber = 'K'; break;
        default:    cardNumber = props.number; break;
    }

    return (
        <div className={className}>
            <div className="ul">{cardNumber}</div>        
            <div className="lr">{cardNumber}</div>
        </div>
    )
};

export default Card;