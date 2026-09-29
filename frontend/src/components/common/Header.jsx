const Header = ({
    onHome,
    onNotice,
}) => {

    return (
        <header className="app-header">

            <button
                type="button"
                className="brand-button"
                onClick={onHome}
            >
                CLASS:ON
            </button>


            <nav className="main-nav">

                <button type="button">
                    클래스 탐색
                </button>

                <button
                    type="button"
                    onClick={onNotice}
                >
                    공지사항
                </button>

            </nav>


            <div className="header-user">
                사용자
            </div>

        </header>
    );
};

export default Header;