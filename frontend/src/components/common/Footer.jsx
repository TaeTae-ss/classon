import { Link } from "react-router";

const Footer = () => {

    return (
        <footer className="w-full min-h-[216px] bg-white border-t-[1.2px] border-line">

            <div className="max-w-[1440px] mx-auto px-[28.8px] py-9 max-[600px]:px-6">

                <div className="flex items-start justify-between gap-12 max-[600px]:flex-col max-[600px]:gap-[26.4px]">

                    <div>
                        <div className="classon_logo text-brand tracking-[1.2px] text-[26.4px] font-bold">
                            CLASS:ON
                        </div>

                        <p className="mt-[9.6px] text-ink-sub text-[15.6px]">
                            취미에 ON, 일상에 ON
                        </p>
                    </div>

                    <nav className="flex items-center gap-[26.4px]">
                        <Link to="/inquiry" className="p-0 border-0 bg-transparent text-ink-sub text-[15.6px] no-underline hover:text-brand">문의하기</Link>
                    </nav>

                </div>

                <div className="mt-[33.6px] pt-[21.6px] border-t-[1.2px] border-line text-ink-sub text-[14.4px]">
                   <span>© 2026 CLASS:ON. All rights reserved.</span>

                    <span>
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
