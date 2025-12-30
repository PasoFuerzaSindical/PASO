
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Wand2, SquareCheck, MessageCircleQuestion, LayoutDashboard, Bot, GalleryVertical, BookCheck, ChevronsLeft, ChevronsRight, Palette, Medal, Users2, BrainCircuit, Star, BookHeart, Settings, FileEdit, Sparkles, Home, Activity, Gamepad2, X, Swords, Instagram, Facebook, StickyNote } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import Logo from '../ui/Logo';

const publicLinks = [
  { to: '/', icon: Home, text: 'Inicio' },
  { to: '/muro', icon: StickyNote, text: 'Muro Realidad' },
  { to: '/validator', icon: Wand2, text: 'Validador' },
  { to: '/bingo', icon: SquareCheck, text: 'Bingo' },
  { to: '/consultorio', icon: MessageCircleQuestion, text: 'Consultorio' },
  { to: '/simulator', icon: Gamepad2, text: 'Simulador' },
  { to: '/filosofia', icon: BrainCircuit, text: 'Filosofía' },
];

const adminLinks = [
  { to: '/dashboard', icon: LayoutDashboard, text: 'Dashboard' },
  { to: '/muro-admin', icon: StickyNote, text: 'Muro Admin' },
  { to: '/acronym-generator', icon: Sparkles, text: 'Generador' },
  { to: '/script-generator', icon: Bot, text: 'Contenido' },
  { to: '/poster-generator', icon: Palette, text: 'Carteles' },
  { to: '/diploma-editor', icon: Medal, text: 'Diplomas' },
  { to: '/gallery', icon: GalleryVertical, text: 'Galería' },
  { to: '/exclusive-content', icon: Star, text: 'Exclusivo' },
  { to: '/consultorio-admin', icon: BookHeart, text: 'Revisión' },
  { to: '/simulator-admin', icon: Swords, text: 'Simulador' },
  { to: '/personajes', icon: Users2, text: 'Personajes' },
  { to: '/page-management', icon: FileEdit, text: 'Páginas' },
  { to: '/strategy', icon: BookCheck, text: 'Estrategia' },
  { to: '/settings', icon: Settings, text: 'Ajustes' },
];

interface SidebarProps {
    isCollapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setCollapsed }) => {
    const { isAuthenticated } = useAuth();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [showMobileAdminMenu, setShowMobileAdminMenu] = useState(false);

    const renderLink = (link: typeof publicLinks[0], isMobileView: boolean) => (
        <NavLink
            key={link.text}
            to={link.to}
            end={link.to === '/'}
            children={({ isActive }) => (
                <div className={cn(
                    "flex items-center rounded-lg transition-all duration-200 relative overflow-hidden group w-full",
                    isMobileView ? "h-full" : "",
                    
                    isActive 
                        ? "text-brand-green bg-brand-green/10 shadow-[0_0_15px_-5px_rgba(10,255,96,0.5)] border border-brand-green/20" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                    
                    isMobileView 
                        ? "flex-col justify-center p-1 text-[10px] gap-1"
                        : cn("p-2 my-1", isCollapsed ? "justify-center" : "justify-start pl-3")
                )}>
                    <link.icon className={cn(
                        "h-5 w-5 transition-all flex-shrink-0", 
                        isActive ? "drop-shadow-[0_0_5px_rgba(10,255,96,0.8)]" : "group-hover:text-foreground",
                        isMobileView && "h-6 w-6"
                    )} />
                    {(!isCollapsed && !isMobileView) && <span className="ml-3 font-medium truncate">{link.text}</span>}
                    {isMobileView && <span className="text-[9px] truncate max-w-full">{link.text}</span>}
                    
                    {isActive && !isMobileView && (
                        <div className="absolute left-0 top-0 h-full w-1 bg-brand-green shadow-[0_0_10px_#0aff60]"></div>
                    )}
                </div>
            )}
            className={isMobileView ? "flex-1 h-full" : "block w-full"}
            title={link.text}
        />
    );

    const renderInstagramLink = (isMobileView: boolean) => (
        <a
            href="https://www.instagram.com/paso.xti"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "flex items-center rounded-lg transition-all duration-300 relative overflow-hidden group w-full text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                isMobileView ? "flex-1 h-full flex-col justify-center p-1 text-[10px] gap-1" : cn("p-2 my-1", isCollapsed ? "justify-center" : "justify-start pl-3")
            )}
            title="Síguenos en Instagram"
        >
            <Instagram className={cn(
                "h-5 w-5 transition-all flex-shrink-0 group-hover:text-pink-500 group-hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]",
                isMobileView && "h-6 w-6"
            )} />
            {(!isCollapsed && !isMobileView) && <span className="ml-3 font-medium truncate">Instagram</span>}
            {isMobileView && <span className="text-[9px] truncate max-w-full">Instagram</span>}
        </a>
    );

    const renderFacebookLink = (isMobileView: boolean) => (
        <a
            href="https://www.facebook.com/profile.php?id=61585934602862"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "flex items-center rounded-lg transition-all duration-300 relative overflow-hidden group w-full text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                isMobileView ? "flex-1 h-full flex-col justify-center p-1 text-[10px] gap-1" : cn("p-2 my-1", isCollapsed ? "justify-center" : "justify-start pl-3")
            )}
            title="Síguenos en Facebook"
        >
            <Facebook className={cn(
                "h-5 w-5 transition-all flex-shrink-0 group-hover:text-blue-500 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]",
                isMobileView && "h-6 w-6"
            )} />
            {(!isCollapsed && !isMobileView) && <span className="ml-3 font-medium truncate">Facebook</span>}
            {isMobileView && <span className="text-[9px] truncate max-w-full">Facebook</span>}
        </a>
    );

    if (isMobile) {
        return (
            <>
                {/* Mobile Admin Overlay Menu */}
                {isAuthenticated && showMobileAdminMenu && (
                    <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl flex flex-col animate-fade-in">
                        <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/20">
                            <h2 className="text-lg font-bold text-brand-red flex items-center gap-2 font-mono tracking-wider">
                                <Settings className="h-5 w-5 animate-spin-slow" /> ZONA DE MANDO
                            </h2>
                            <button 
                                onClick={() => setShowMobileAdminMenu(false)}
                                className="p-2 rounded-full bg-secondary text-foreground hover:bg-secondary/80 border border-border active:scale-95 transition-all"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 pb-24">
                            <div className="grid grid-cols-3 gap-3">
                                {adminLinks.map(link => (
                                    <NavLink
                                        key={link.text}
                                        to={link.to}
                                        onClick={() => setShowMobileAdminMenu(false)}
                                        className={({ isActive }) => cn(
                                            "flex flex-col items-center justify-center p-3 rounded-xl border bg-secondary/30 gap-2 text-center transition-all duration-200 aspect-square",
                                            isActive 
                                                ? "border-brand-red text-brand-red shadow-[0_0_15px_rgba(255,15,75,0.3)] bg-brand-red/10" 
                                                : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground hover:border-brand-red/50"
                                        )}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <link.icon className={cn("h-8 w-8 mb-1", isActive ? "text-brand-red" : "text-muted-foreground")} />
                                                <span className="text-[10px] font-medium leading-tight">{link.text}</span>
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile Bottom Navigation */}
                <nav className="fixed bottom-0 left-0 w-full h-16 bg-background/90 backdrop-blur-xl border-t border-border z-50 flex items-center justify-around px-2 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] pb-safe">
                    {/* Render subset on mobile to avoid overcrowding, or keep it if scroll/space allows */}
                    {publicLinks.slice(0, 4).map(link => renderLink(link, true))}
                    {renderInstagramLink(true)}
                    {renderFacebookLink(true)}
                    {isAuthenticated && (
                         <button
                            onClick={() => setShowMobileAdminMenu(!showMobileAdminMenu)}
                            className={cn(
                                "flex flex-col items-center justify-center p-1 text-[10px] flex-1 h-full gap-1 rounded-lg transition-all duration-300 active:scale-95",
                                showMobileAdminMenu 
                                    ? "text-brand-red bg-brand-red/10 shadow-[0_0_15px_-5px_rgba(255,15,75,0.5)] border border-brand-red/20"
                                    : "text-brand-red hover:bg-secondary"
                            )}
                         >
                             <Settings className={cn("h-6 w-6", showMobileAdminMenu && "animate-spin-slow")} />
                             <span>Admin</span>
                         </button>
                    )}
                </nav>
            </>
        );
    }

    return (
        <aside className={cn(
            "fixed top-0 left-0 h-full bg-background/60 backdrop-blur-xl border-r border-border flex flex-col transition-all duration-300 z-20",
            isCollapsed ? "w-20" : "w-64"
        )}>
            <div className="flex flex-col items-center justify-center h-24 border-b border-border px-2 relative overflow-hidden flex-shrink-0">
                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,255,96,0.15),transparent_70%)] animate-pulse pointer-events-none"></div>
                 
                 <div className={cn("relative z-10 transition-all duration-300", isCollapsed ? "h-12 w-12" : "h-16 w-16 flex items-center gap-2")}>
                    <Logo className="w-full h-full" />
                    {!isCollapsed && (
                        <div className="flex flex-col justify-center">
                            <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-brand-green via-foreground to-brand-green drop-shadow-[0_0_5px_rgba(10,255,96,0.5)]">
                                P.A.S.O.
                            </h1>
                        </div>
                    )}
                 </div>
            </div>
            
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                <div className="mb-2 px-3">
                    <span className={cn("text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]", isCollapsed && "hidden")}>
                        Protocolos
                    </span>
                </div>
                {publicLinks.map(l => renderLink(l, false))}
                
                <div className="my-4 border-t border-border/50 relative">
                    <span className={cn("absolute -top-3 left-4 bg-background/80 px-2 text-[9px] text-muted-foreground/50 font-mono uppercase tracking-widest", isCollapsed && "hidden")}>
                        Social
                    </span>
                </div>
                {renderInstagramLink(false)}
                {renderFacebookLink(false)}
                
                {isAuthenticated && (
                    <>
                        <div className="my-4 border-t border-border relative">
                            <span className={cn("absolute -top-3 left-4 bg-background px-2 text-[10px] text-muted-foreground/50 font-mono uppercase tracking-widest", isCollapsed && "hidden")}>
                                Core System
                            </span>
                        </div>
                        {adminLinks.map(l => renderLink(l, false))}
                    </>
                )}
            </nav>
            
            <div className="p-4 border-t border-border bg-secondary/10">
                <button 
                    onClick={() => setCollapsed(!isCollapsed)} 
                    className="w-full flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                    {isCollapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
