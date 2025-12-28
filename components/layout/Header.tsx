
import React, { useState, useEffect } from 'react';
import { Bell, User, LogIn, LogOut, Flame, Sun, Moon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  pageTitle: string;
}

const Header: React.FC<HeaderProps> = ({ pageTitle }) => {
  const { isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [burnoutLevel, setBurnoutLevel] = useState(85);

  // Simulate system instability / burnout fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setBurnoutLevel(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.min(99, Math.max(60, prev + change));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getBurnoutColor = (level: number) => {
      if (level > 90) return 'bg-destructive text-destructive-foreground animate-pulse';
      if (level > 75) return 'bg-orange-500 text-white';
      return 'bg-brand-green text-white';
  };

  return (
    <header className="flex items-center justify-between h-16 px-4 lg:px-8 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-40 transition-colors duration-300">
      
      {/* Title Section */}
      <div className="flex flex-col justify-center min-w-0 flex-1 mr-2">
          <h1 className="text-lg md:text-2xl font-semibold text-foreground truncate" title={pageTitle}>
            {pageTitle}
          </h1>
      </div>
      
      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        
        {/* BURNOUT METER */}
        <div className="hidden md:flex flex-col items-end w-32 group cursor-help relative" title="Nivel de Hartazgo del Sistema">
            <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground mb-1">
                <Flame className="h-3 w-3" />
                <span>BURNOUT_LVL</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden border border-border">
                <div 
                    className={`h-full transition-all duration-1000 ease-out ${getBurnoutColor(burnoutLevel)}`}
                    style={{ width: `${burnoutLevel}%` }}
                ></div>
            </div>
            <div className="absolute top-10 right-0 bg-background border border-border p-2 rounded shadow-xl text-xs w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <p className="font-bold text-foreground">Medidor de Hartazgo Global</p>
                <p className="text-muted-foreground">Monitorización en tiempo real de la indignación colectiva.</p>
            </div>
        </div>

        <div className="h-8 w-[1px] bg-border hidden md:block"></div>

        {/* THEME TOGGLE */}
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? 'Modo Hospital (Claro)' : 'Modo Búnker (Oscuro)'}
            className="shrink-0"
        >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Alternar Tema</span>
        </Button>

        <Button variant="ghost" size="icon" className="relative shrink-0">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
        </Button>
        
        {isAuthenticated ? (
            <>
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-secondary flex items-center justify-center border border-border shrink-0">
                  <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <Button variant="outline" size="sm" onClick={logout} className="shrink-0">
                <LogOut className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Salir</span>
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate('/login')} className="shrink-0 whitespace-nowrap">
              <LogIn className="h-4 w-4 mr-2" />
              <span>Admin</span>
            </Button>
          )}
      </div>
    </header>
  );
};

export default Header;
