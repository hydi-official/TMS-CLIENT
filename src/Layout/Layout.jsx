import React from 'react';
import Header from '../Components/Header/Header';
import Routers from '../Routes/Routers';
import Footer from '../Components/Footer/Footer';

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen">
           {/* <Header className="fixed top-0 w-full z-50" /> */}
           <main className="flex-grow">
               <Routers />
           </main>
           {/* <Footer /> */}
        </div>
    );
};

export default Layout;