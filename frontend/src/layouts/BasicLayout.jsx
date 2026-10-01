import Header from "../components/common/Header.jsx";
import Footer from "../components/common/Footer.jsx";

const BasicLayout = ({
    children
}) => {

    return (
        <div className="app-background">

                <Header/>

                <main className="main-content">
                    {children}
                </main>

                <Footer />

        </div>
    );
};

export default BasicLayout;