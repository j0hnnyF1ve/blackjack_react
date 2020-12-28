// MoneyDisplay - Presentational Component to display the user's current credits
const MoneyDisplay = props => {
    let { money } = props;

    return (
        <section className="MoneyDisplay">
          <label>Credits: </label> <span>{money}</span>
        </section>
    );
};

export default MoneyDisplay;