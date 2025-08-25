import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Components/Header/Header';
import Routers from '../Routes/Routers';
import Footer from '../Components/Footer/Footer';
import Sidebar from '../Components/Sidebar';

const Layout = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const location = useLocation();

    // Check if sidebar should be hidden
    const shouldHideSidebar = location.pathname === '/' || 
                             location.pathname === '/login' || 
                             location.pathname === '/forgot-pin';

    // Listen for sidebar state changes (you can pass this as context if needed)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarExpanded(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar />
            
            {/* Main Content Area */}
            <div 
                className={`flex-1 flex flex-col transition-all duration-300 ${
                    shouldHideSidebar 
                        ? 'ml-0' 
                        : sidebarExpanded 
                            ? 'ml-64' 
                            : 'ml-16'
                }`}
            >
                {/* Header - only show when not on login/forgot-pin pages */}
              
                {/* Main Content */}
                <main className={`flex-grow ${shouldHideSidebar ? 'p-0' : 'p-6'}`}>
                    <Routers />
                </main>
                
                {/* Footer - only show when not on login/forgot-pin pages */}
                {/* {!shouldHideSidebar && <Footer />} */}
            </div>
        </div>
    );
};

export default Layout;