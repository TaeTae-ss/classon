const BasicLayout = ({
    children,
    onHome,
    onNotice,
}) => {

    return (
        <div className="app-background">

            <div className="app-container">

                <Header
                    onHome={onHome}
                    onNotice={onNotice}
                />

                <main className="main-content">
                    {children}
                </main>

            </div>

        </div>
    );
};

export default BasicLayout;