import { Link } from "react-router";

const Header = () => {

    return (
        <header className="main-header">

            <div className="header-inner">

                <Link
                    to="/"
                    className="main-logo classon_logo"
                >
                    CLASS:ON
                </Link>

                <nav className="main-nav">
                    <Link to="/class">
                        클래스
                    </Link>

                    <Link to="/notice">
                        공지사항
                    </Link>
                </nav>

                <div className="header-search">
                    <input
                        type="text"
                        placeholder="어떤 클래스를 찾고 계신가요?"
                    />

                    <button type="button" className="search-button">
                        <i class="fi fi-br-search"></i>
                    </button>
                </div>

                <div className="header-user">
                     <Link
                        to="/auth/login"
                        className="login-button"
                    >
                        로그인
                    </Link>

                    <Link
                        to="/auth/signup"
                        className="signup-button"
                    >
                        회원가입
                    </Link>
                </div>

            </div>

        </header>
    );
};

export default Header;