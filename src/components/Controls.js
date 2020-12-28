// Controls - Presentational component that gives the user a set of controls for the game
const Controls = (props) => {
    const { 
        players,
        status,

        activeHand,

        hit,
        stand,
        doubleDown,
        split, 
        restart,
        reset
    } = props;

    const {
        hitDisabled,
        standDisabled,
        doubleDownDisabled,
        splitDisabled,
        restartDisabled,
        resetDisabled
    } = status;

    const playerControls = (players.length > 1) ? players.map( (player, index) => 
        // (<button key={player.index} onClick={selectPlayer} >{index*1+1}</button>)) : 
        // (<span key={player.index} onClick={selectPlayer} >{index*1+1}</span>)) : 
        (<span className={ index === activeHand ? "active" : "" } key={index} >{index*1+1}</span>)) : 
        '';

    return (
        <div className="Controls">
            <div className="PlayerControls">
                {playerControls}
            </div>
            <button disabled={hitDisabled} onClick={hit}>Hit</button>
            <button disabled={standDisabled} onClick={stand}>Stand</button>
            <button disabled={doubleDownDisabled} onClick={doubleDown}>Double Down</button>
            <button disabled={splitDisabled} onClick={split}>Split</button>
            <button disabled={restartDisabled} onClick={restart}>Continue</button>
            <button disabled={resetDisabled} onClick={reset}>Reset</button>
        </div>
    );
};

export default Controls;