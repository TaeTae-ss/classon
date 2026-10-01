import { Link } from "react-router";

const Footer = () => {

    return (
        <footer className="main-footer">

            <div className="footer-inner">

                <div className="footer-top">

                    <div className="footer-brand">
                        <div className="footer-logo classon_logo">
                            CLASS:ON
                        </div>

                        <p>
                            취미에 ON, 일상에 ON
                        </p>
                    </div>

                    <nav className="footer-nav">
                        <Link to="/notice">공지사항</Link>
                        <Link to="/inquiry">문의하기</Link>
                    </nav>

                </div>

                <div className="footer-bottom">
                   <span>© 2026 CLASS:ON. All rights reserved.</span>

                    <span className="icon-credit">
                        <a href="https://www.flaticon.com/uicons">
                            Flaticon
                        </a>
                        의 UIcon
                    </span>
                </div>

            </div>

        </footer>
    );
};

export default Footer;