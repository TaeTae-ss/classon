import { Link } from "react-router";

const Header = () => {

    return (
        <header className="sticky top-0 z-[100] w-full bg-white border-b-[1.2px] border-line">

            <div className="max-w-[1440px] h-[86.4px] mx-auto px-[28.8px] flex items-center gap-[43.2px] max-lg:h-auto max-lg:min-h-[86.4px] max-lg:py-[19.2px] max-lg:flex-wrap max-lg:gap-[19.2px] max-[600px]:px-[24px] max-[600px]:gap-[14.4px]">

                <Link
                    to="/"
                    className="classon_logo p-0 text-brand tracking-[1.2px] text-[30px] font-bold whitespace-nowrap no-underline"
                >
                    CLASS:ON
                </Link>

                <nav className="flex items-center gap-[28.8px] whitespace-nowrap max-[600px]:order-3 max-[600px]:w-full">
                    <Link to="/class" className="py-[9.6px] border-0 bg-transparent text-ink text-[16.8px] font-bold no-underline hover:text-brand">
                        클래스
                    </Link>

                    <Link to="/notice" className="py-[9.6px] border-0 bg-transparent text-ink text-[16.8px] font-bold no-underline hover:text-brand">
                        공지사항
                    </Link>
                </nav>

                <div className="h-12 flex items-center flex-1 max-w-[420px] ml-auto bg-[#F9FAFB] border-[1.2px] border-line rounded-[24px] overflow-hidden max-lg:order-3 max-lg:flex-[0_0_100%] max-lg:max-w-none max-lg:ml-0 max-[600px]:order-4">
                    <input
                        type="text"
                        placeholder="어떤 클래스를 찾고 계신가요?"
                        className="min-w-0 h-full flex-1 pl-[19.2px] border-0 outline-none bg-transparent text-ink text-[15.6px] placeholder:text-ink-sub"
                    />

                    <button type="button" className="w-[50.4px] h-full border-0 bg-transparent text-[16.8px]">
                        <i className="fi fi-br-search"></i>
                    </button>
                </div>

                <div className="flex items-center gap-[9.6px] whitespace-nowrap max-lg:ml-auto max-[600px]:order-2">
                     <Link
                        to="/auth/login"
                        className="px-[14.4px] py-[10.8px] border-0 bg-transparent text-ink text-[15.6px] font-semibold no-underline hover:bg-[#ea6500] hover:text-white transition-[background-color,color] duration-150"
                    >
                        로그인
                    </Link>

                    <Link
                        to="/auth/signup"
                        className="px-[19.2px] py-[10.8px] border-0 rounded-[21.6px] bg-brand text-white text-[15.6px] font-bold no-underline hover:bg-[#ea6500] transition-colors duration-150"
                    >
                        회원가입
                    </Link>
                </div>

            </div>

        </header>
    );
};

export default Header;
