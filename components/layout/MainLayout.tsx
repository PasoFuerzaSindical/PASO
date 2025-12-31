
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
    <div className="h-screen bg-background text-foreground overflow-hidden relative selection:bg-brand-green/30 selection:text-brand-green transition-colors duration-300">
      {/* Global CRT Overlay */}
      <div className="crt-lines"></div>
      
      <Sidebar isCollapsed={isSidebarCollapsed} setCollapsed={handleSetCollapsed} />
      
      <div className={cn(
          "flex flex-col h-full transition-all duration-300 relative z-10",
          isMobile ? "ml-0 pb-16" : (isSidebarCollapsed ? "ml-20" : "ml-64")
        )}>
        <Header pageTitle={pageTitle} />
        {/* Main content area */}
        <main className="flex-1 p-2 lg:p-4 overflow-y-auto overflow-x-hidden w-full scrollbar-thin flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
