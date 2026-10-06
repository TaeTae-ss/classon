import Header from "../components/common/Header.jsx";
import Footer from "../components/common/Footer.jsx";

const BasicLayout = ({
    children
}) => {

    return (
        <div className="app-background min-h-screen bg-white flex flex-col">

                <Header/>

                <main className="flex-1 px-[10px] py-[35px]">
                    {children}
                </main>

                <Footer />

        </div>
    );
};

export default BasicLayout;