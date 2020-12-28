// Header - presentational components where messages are displayed
const Header = props => {
    let { messages } = props;

    let messageHtml = messages.map( (message, index) => <span key={index}>{message}</span>)

    return (
        <header className="Header">
            <p>{messageHtml}</p>
        </header>
    );
};

export default Header;