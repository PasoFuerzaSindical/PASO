
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Wand2, SquareCheck, MessageCircleQuestion, LayoutDashboard, 
  Bot, GalleryVertical, BookCheck, ChevronsLeft, ChevronsRight, 
  Palette, Medal, Users2, BrainCircuit, Star, BookHeart, 
  Settings, FileEdit, Sparkles, Home, Gamepad2, X, Swords, 
  Instagram, Facebook, StickyNote, Activity, ShieldCheck
} from 'lucide-react';
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

    const SectionHeader = ({ label }: { label: string }) => (
      <div className={cn(
        "flex items-center gap-2 mt-6 mb-2 px-3",
        isCollapsed && "justify-center px-0"
      )}>
        {!isCollapsed ? (
          <>
            <div className="h-[1px] w-4 bg-brand-green/30"></div>
            <span className="text-[10px] font-black text-brand-green/60 uppercase tracking-[0.2em] whitespace-nowrap">
              {label}
            </span>
            <div className="h-[1px] flex-1 bg-brand-green/10"></div>
          </>
        ) : (
          <div className="h-[1px] w-8 bg-brand-green/20"></div>
        )}
      </div>
    );

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
                        ? "text-brand-green bg-brand-green/10 shadow-[0_0_15px_-5px_rgba(10,255,96,0.3)] border border-brand-green/20" 
                        : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]",
                    
                    isMobileView 
                        ? "flex-col justify-center p-1 text-[10px] gap-1"
                        : cn("p-2.5 my-0.5", isCollapsed ? "justify-center" : "justify-start pl-4")
                )}>
                    <link.icon className={cn(
                        "h-5 w-5 transition-all flex-shrink-0", 
                        isActive ? "drop-shadow-[0_0_8px_rgba(10,255,96,0.8)] scale-110" : "group-hover:text-foreground",
                        isMobileView && "h-6 w-6"
                    )} />
                    {(!isCollapsed && !isMobileView) && (
                      <span className={cn(
                        "ml-3 text-sm font-medium truncate tracking-tight transition-all",
                        isActive ? "font-bold" : "font-normal"
                      )}>
                        {link.text}
                      </span>
                    )}
                    {isMobileView && <span className="text-[9px] truncate max-w-full font-bold">{link.text}</span>}
                    
                    {isActive && !isMobileView && (
                        <div className="absolute left-0 top-0 h-full w-1 bg-brand-green shadow-[0_0_10px_#0aff60]"></div>
                    )}
                </div>
            )}
            className={isMobileView ? "flex-1 h-full" : "block w-full px-1"}
            title={link.text}
        />
    );

    const renderSocialLink = (icon: any, text: string, url: string, colorClass: string, isMobileView: boolean) => (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "flex items-center rounded-lg transition-all duration-300 relative overflow-hidden group w-full text-muted-foreground hover:text-foreground hover:bg-white/[0.03]",
                isMobileView ? "flex-1 h-full flex-col justify-center p-1 text-[10px] gap-1" : cn("p-2.5 my-0.5", isCollapsed ? "justify-center" : "justify-start pl-4")
            )}
            title={`Síguenos en ${text}`}
        >
            <div className={cn("transition-all duration-300 flex items-center justify-center", isMobileView ? "h-6 w-6" : "h-5 w-5")}>
              {React.createElement(icon, {
                className: cn("h-full w-full flex-shrink-0 transition-all", colorClass)
              })}
            </div>
            {(!isCollapsed && !isMobileView) && <span className="ml-3 text-sm font-medium truncate">{text}</span>}
            {isMobileView && <span className="text-[9px] truncate max-w-full">{text}</span>}
        </a>
    );

    if (isMobile) {
        return (
            <>
                {/* Mobile Admin Overlay Menu */}
                {isAuthenticated && showMobileAdminMenu && (
                    <div className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-2xl flex flex-col animate-fade-in">
                        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-secondary/20">
                            <h2 className="text-lg font-black text-brand-red flex items-center gap-3 font-mono tracking-widest">
                                <Activity className="h-5 w-5 animate-pulse" /> CENTRO DE CONTROL
                            </h2>
                            <button 
                                onClick={() => setShowMobileAdminMenu(false)}
                                className="p-2 rounded-xl bg-white/5 text-foreground hover:bg-white/10 border border-white/10 active:scale-95 transition-all"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-5 pb-24">
                            <div className="grid grid-cols-3 gap-4">
                                {adminLinks.map(link => (
                                    <NavLink
                                        key={link.text}
                                        to={link.to}
                                        onClick={() => setShowMobileAdminMenu(false)}
                                        className={({ isActive }) => cn(
                                            "flex flex-col items-center justify-center p-4 rounded-2xl border bg-white/5 gap-3 text-center transition-all duration-300 aspect-square",
                                            isActive 
                                                ? "border-brand-red text-brand-red shadow-[0_0_20px_rgba(255,15,75,0.2)] bg-brand-red/10" 
                                                : "border-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                                        )}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <link.icon className={cn("h-8 w-8", isActive ? "text-brand-red" : "text-muted-foreground/60")} />
                                                <span className="text-[10px] font-black leading-tight uppercase tracking-tighter">{link.text}</span>
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile Bottom Navigation */}
                <nav className="fixed bottom-0 left-0 w-full h-18 bg-background/95 backdrop-blur-xl border-t border-white/5 z-50 flex items-center justify-around px-2 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] pb-safe">
                    {/* Inicio, Consultorio y Bingo fijos en móvil */}
                    {renderLink(publicLinks[0], true)} {/* Inicio */}
                    {renderLink(publicLinks[4], true)} {/* Consultorio */}
                    {renderLink(publicLinks[3], true)} {/* Bingo */}
                    
                    {/* Botón de Instagram (público) o Botón Admin (si logueado) */}
                    {isAuthenticated ? (
                         <button
                            onClick={() => setShowMobileAdminMenu(!showMobileAdminMenu)}
                            className={cn(
                                "flex flex-col items-center justify-center p-1 text-[10px] flex-1 h-full gap-1 rounded-lg transition-all duration-300 active:scale-95",
                                showMobileAdminMenu 
                                    ? "text-brand-red bg-brand-red/10 border border-brand-red/20 shadow-[0_0_15px_-5px_rgba(255,15,75,0.5)]"
                                    : "text-brand-red font-bold"
                            )}
                         >
                             <Settings className={cn("h-6 w-6", showMobileAdminMenu && "animate-spin-slow")} />
                             <span className="uppercase font-black text-[8px] tracking-tighter">Admin</span>
                         </button>
                    ) : (
                      renderSocialLink(Instagram, 'Instagram', 'https://www.instagram.com/paso_fuerzasindical', 'group-hover:text-pink-500', true)
                    )}
                </nav>
            </>
        );
    }

    return (
        <aside className={cn(
            "fixed top-0 left-0 h-full bg-background/80 backdrop-blur-2xl border-r border-white/5 flex flex-col transition-all duration-500 z-20 shadow-[10px_0_40px_rgba(0,0,0,0.3)]",
            isCollapsed ? "w-22" : "w-68"
        )}>
            {/* LOGO SECTION */}
            <div className="flex flex-col items-center justify-center h-28 px-4 relative overflow-hidden flex-shrink-0 border-b border-white/5">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(10,255,96,0.1),transparent_70%)] animate-pulse pointer-events-none"></div>
                 
                 <div className={cn("relative z-10 transition-all duration-500 flex items-center gap-3", isCollapsed ? "h-14 w-14" : "w-full justify-start")}>
                    <Logo className={cn("transition-all", isCollapsed ? "w-14 h-14" : "w-12 h-12")} />
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-black tracking-tighter text-foreground drop-shadow-[0_0_10px_rgba(10,255,96,0.2)]">
                                P.A.S.O.
                            </h1>
                            <span className="text-[8px] font-mono text-brand-green/60 uppercase tracking-[0.3em] -mt-1">Campaign Hub</span>
                        </div>
                    )}
                 </div>
            </div>
            
            {/* NAVIGATION LINKS */}
            <nav className="flex-1 px-3 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                
                <SectionHeader label="Operaciones" />
                <div className="space-y-1">
                  {publicLinks.map(l => renderLink(l, false))}
                </div>
                
                <SectionHeader label="Escucha" />
                <div className="space-y-1">
                  {renderSocialLink(Instagram, 'Instagram', 'https://www.instagram.com/paso_fuerzasindical', 'group-hover:text-pink-500 group-hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]', false)}
                  {renderSocialLink(Facebook, 'Facebook', 'https://www.facebook.com/profile.php?id=61585934602862', 'group-hover:text-blue-500 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]', false)}
                </div>
                
                {isAuthenticated && (
                    <>
                        <SectionHeader label="Mando" />
                        <div className="space-y-1">
                          {adminLinks.map(l => renderLink(l, false))}
                        </div>
                    </>
                )}
            </nav>
            
            {/* FOOTER SECTION */}
            <div className="p-4 mt-auto space-y-3 bg-white/[0.02] border-t border-white/5">
                {!isCollapsed && (
                  <div className="px-2 py-3 mb-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-foreground uppercase tracking-widest">Protocolo</span>
                      <span className="text-[8px] font-mono text-brand-green/60 uppercase">Activo v1.0.4</span>
                    </div>
                  </div>
                )}

                <button 
                    onClick={() => setCollapsed(!isCollapsed)} 
                    className="w-full flex items-center justify-center p-3 rounded-xl text-muted-foreground hover:text-brand-green hover:bg-brand-green/10 border border-transparent hover:border-brand-green/20 transition-all active:scale-95 shadow-inner"
                >
                    {isCollapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
