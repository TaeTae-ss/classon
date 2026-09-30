
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
                        <button type="button">공지사항</button>
                        <button type="button">문의하기</button>
                    
                    </nav>

                </div>

                <div className="footer-bottom">
                    © 2026 CLASS:ON. All rights reserved.
                </div>

            </div>

        </footer>
    );
};

export default Footer;