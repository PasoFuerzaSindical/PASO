
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '../../lib/utils';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import useLocalStorage from '../../hooks/useLocalStorage';

interface MainLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, pageTitle }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isManuallyCollapsed, setManuallyCollapsed] = useLocalStorage('sidebar-collapsed', false);

  const isSidebarCollapsed = isMobile || isManuallyCollapsed;

  const handleSetCollapsed = (collapsed: boolean) => {
    if (!isMobile) {
      setManuallyCollapsed(collapsed);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative selection:bg-ugt-green/30 selection:text-ugt-green transition-colors duration-300">
      {/* Global CRT Overlay - Managed by CSS (hidden in light mode) */}
      <div className="crt-lines"></div>
      
      <Sidebar isCollapsed={isSidebarCollapsed} setCollapsed={handleSetCollapsed} />
      <div className={cn(
          "flex-1 flex flex-col transition-all duration-300 w-full relative z-10",
          isMobile ? "ml-0 pb-16" : (isSidebarCollapsed ? "ml-20" : "ml-64")
        )}>
        <Header pageTitle={pageTitle} />
        {/* Reduced padding from p-4 lg:p-8 to p-2 lg:p-4 to maximize screen usage */}
        <main className="flex-1 p-2 lg:p-4 overflow-y-auto overflow-x-hidden w-full scrollbar-thin flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
