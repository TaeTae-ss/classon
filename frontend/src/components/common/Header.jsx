const Header = () => {

    return (
        <header className="main-header">

            <div className="header-inner">

                {/* 로고 */}
                <button
                    type="button"
                    className="main-logo classon_logo"
                >
                    CLASS:ON
                </button>

                {/* 메뉴 */}
                <nav className="main-nav">
                    <button type="button">
                        클래스 탐색
                    </button>

                    <button type="button">
                        공지사항
                    </button>
                </nav>

                {/* 검색 */}
                <div className="header-search">
                    <input
                        type="text"
                        placeholder="어떤 클래스를 찾고 계신가요?"
                    />

                    <button type="button" className="search-button">
                        🔍
                    </button>
                </div>

                {/* 사용자 메뉴 */}
                <div className="header-user">
                    <button
                        type="button"
                        className="login-button"
                    >
                        로그인
                    </button>

                    <button
                        type="button"
                        className="signup-button"
                    >
                        회원가입
                    </button>
                </div>

            </div>

        </header>
    );
};

export default Header;