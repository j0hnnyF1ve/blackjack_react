// Header - presentational components where messages are displayed
const Header = props => {
    let { messages } = props;

    let messageHtml = messages.map( message => <span>{message}</span>)

    return (
        <header className="Header">
            <p>{messageHtml}</p>
        </header>
    );
};

export default Header;