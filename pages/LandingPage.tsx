
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Heartbeat from '../components/ui/Heartbeat';
import CyberBackground from '../components/ui/CyberBackground';
import Logo from '../components/ui/Logo';
import { BrainCircuit, Siren, Stethoscope, Microscope, Activity, Radio, Terminal, Eye, Gamepad2, Swords } from 'lucide-react';
import { cn } from '../lib/utils';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const tools = [
    {
      title: "Tratamiento Paliativo",
      subtitle: "Protocolo de Descompresión",
      icon: Stethoscope,
      descMedical: "Terapia gamificada para el alivio sintomático del turno.",
      
      secretTitle: "BINGO DEL PRECARIADO",
      secretMsg: "TU SALUD MENTAL LO NECESITA",
      secretIcon: Radio,
      
      path: "/bingo",
      color: "text-brand-green",
      hoverColor: "group-hover:text-brand-green",
      borderColor: "group-hover:border-brand-green",
      glowColor: "group-hover:shadow-[0_0_30px_-5px_rgba(22,163,74,0.4)]",
      delay: "100ms"
    },
    {
      title: "Triaje Psicológico",
      subtitle: "Interconsulta Anónima",
      icon: BrainCircuit,
      descMedical: "Evaluación de daños psicosociales por burocracia.",

      secretTitle: "EL ORÁCULO NO MIENTE",
      secretMsg: "LA VERDAD DUELE, PERO CURA",
      secretIcon: Eye,

      path: "/consultorio",
      color: "text-brand-red",
      hoverColor: "group-hover:text-brand-red",
      borderColor: "group-hover:border-brand-red",
      glowColor: "group-hover:shadow-[0_0_30px_-5px_rgba(227,6,19,0.4)]",
      delay: "200ms"
    },
    {
      title: "Diagnóstico de Realidad",
      subtitle: "Análisis de Acrónimos",
      icon: Microscope,
      descMedical: "Estudio de patologías lingüísticas administrativas.",

      secretTitle: "HACKEA EL LENGUAJE",
      secretMsg: "REESCRIBE EL ABSURDO",
      secretIcon: Terminal,

      path: "/validator",
      color: "text-blue-400",
      hoverColor: "group-hover:text-blue-400",
      borderColor: "group-hover:border-blue-400",
      glowColor: "group-hover:shadow-[0_0_30px_-5px_rgba(96,165,250,0.4)]",
      delay: "300ms"
    },
    {
      title: "Bioética del Sistema",
      subtitle: "Filosofía Estructural",
      icon: Activity,
      descMedical: "Informe forense sobre la muerte de la vocación.",

      secretTitle: "FILOSOFÍA P.A.S.O.",
      secretMsg: "DESPIERTA, NEO.",
      secretIcon: Siren,

      path: "/filosofia",
      color: "text-yellow-400",
      hoverColor: "group-hover:text-yellow-400",
      borderColor: "group-hover:border-yellow-400",
      glowColor: "group-hover:shadow-[0_0_30px_-5px_rgba(250,204,21,0.4)]",
      delay: "400ms"
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col overflow-x-hidden bg-background w-full group/page justify-between">
      
      <CyberBackground className="z-0" />

      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-4 left-4 text-[9px] font-mono text-brand-green/30 space-y-1 hidden md:block">
          <p className="typing-effect">SYS.STATUS: UNSTABLE</p>
          <p>BURNOUT_LVL: CRITICAL</p>
        </div>
        <div className="absolute bottom-32 left-0 w-full opacity-10 mix-blend-screen">
             <Heartbeat />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center pt-4 pb-8 md:pt-10 md:pb-12 px-4 text-center w-full">
        <div className="w-24 h-24 md:w-40 md:h-40 mb-4 relative">
            <div className="absolute inset-0 bg-brand-green/20 blur-3xl rounded-full animate-pulse"></div>
            <Logo className="w-full h-full" />
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter mb-4 glitch-text relative select-none" data-text="P.A.S.O.">
          P.A.S.O.
        </h1>
        
        <p className="text-sm md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light px-2">
          <span className="text-brand-green font-mono mr-2">root@sacyl:~#</span>
          La <span className="text-foreground font-medium border-b-2 border-brand-red/50 hover:border-brand-red transition-colors cursor-help">UCI de la Dignidad</span> para el personal sanitario.
        </p>
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl px-4 pb-8 w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
          
          {/* SIMULATOR CARD - NOW FIRST AND SPANNING 2 COLUMNS */}
          <div 
                onClick={() => navigate('/simulator')}
                className="group relative h-40 sm:h-48 md:h-56 cursor-pointer overflow-hidden rounded-xl bg-secondary/20 border border-white/5 backdrop-blur-sm transition-all duration-500 md:col-span-2 hover:border-cyber-violet group-hover:shadow-[0_0_40px_-5px_rgba(185,87,206,0.5)] border-l-4 border-l-cyber-violet"
                style={{ animationDelay: "0ms" }}
            >
                 <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between transition-all duration-300 group-hover:opacity-0 group-hover:scale-95 group-hover:blur-sm">
                    <div className="flex items-start justify-between">
                        <div className="p-1.5 md:p-2 rounded-md bg-white/5 text-cyber-violet">
                            <Gamepad2 className="h-6 w-6 md:h-8 md:w-8" />
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] md:text-[10px] font-mono text-muted-foreground/50 border border-white/10 px-2 py-0.5 rounded mb-1">
                               SIM_TRAINING_v4.2
                            </span>
                            <span className="text-[10px] text-cyber-violet animate-pulse font-bold uppercase tracking-tighter">Acceso Prioritario</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl md:text-3xl font-black text-foreground/90 leading-tight uppercase tracking-tight">Entrenamiento de Negociación</h3>
                        <p className="text-sm md:text-base text-muted-foreground mt-1 leading-tight font-light">Enfréntate al Sistema en un entorno controlado antes del turno real.</p>
                    </div>
                 </div>

                 <div className="absolute inset-0 p-4 md:p-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/90 z-10">
                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                     <div className="flex items-center gap-4 md:gap-8">
                        <Swords className="h-10 w-10 md:h-16 md:w-16 text-cyber-violet animate-pulse" />
                        <div className="text-left">
                             <h3 className="text-3xl md:text-5xl font-black tracking-widest uppercase glitch-text text-cyber-violet" data-text="BOSS BATTLE">
                                BOSS BATTLE
                            </h3>
                            <p className="text-xs md:text-sm font-mono text-white/80 border-l-2 border-cyber-violet pl-4 py-1">
                                DERROTA A DON BUROCRACIO. <br className="hidden md:block" />
                                CONSIGUE TUS DERECHOS.
                            </p>
                        </div>
                     </div>
                 </div>
            </div>

          {/* OTHER TOOLS */}
          {tools.map((tool, index) => (
            <div 
                key={index}
                onClick={() => navigate(tool.path)}
                className={cn(
                    "group relative h-32 sm:h-40 md:h-48 cursor-pointer overflow-hidden rounded-xl bg-secondary/20 border border-white/5 backdrop-blur-sm transition-all duration-500",
                    tool.borderColor,
                    tool.glowColor,
                    "hover:border-opacity-50 hover:bg-secondary/40"
                )}
                style={{ animationDelay: tool.delay }}
            >
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between transition-all duration-300 group-hover:opacity-0 group-hover:scale-95 group-hover:blur-sm">
                    <div className="flex items-start justify-between">
                        <div className={cn("p-1.5 md:p-2 rounded-md bg-white/5", tool.color)}>
                            <tool.icon className="h-5 w-5 md:h-6 md:w-6" />
                        </div>
                        <span className="text-[9px] md:text-[10px] font-mono text-muted-foreground/50 border border-white/10 px-2 py-0.5 rounded">
                           PROT_0{index + 1}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-lg md:text-xl font-bold text-foreground/90 leading-tight">{tool.title}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-tight">{tool.subtitle}</p>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-muted-foreground/20 to-transparent opacity-50"></div>
                </div>

                <div className="absolute inset-0 p-4 md:p-6 flex flex-col items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/80 z-10">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    
                    <tool.secretIcon className={cn("h-8 w-8 md:h-10 md:w-10 mb-2 md:mb-3 animate-pulse", tool.hoverColor)} />
                    
                    <h3 className={cn("text-xl md:text-2xl font-black tracking-widest uppercase glitch-text leading-tight", tool.hoverColor)} data-text={tool.secretTitle}>
                        {tool.secretTitle}
                    </h3>
                    
                    <p className="text-[10px] md:text-xs font-mono text-white/80 mt-2 border-t border-white/20 pt-2 w-full max-w-[200px]">
                        {tool.secretMsg}
                    </p>
                </div>
            </div>
          ))}

        </div>
      </div>

      <div className="mt-auto border-t border-secondary/50 bg-background/90 backdrop-blur py-2 md:py-3 overflow-hidden w-full relative z-20">
         <div className="marquee-container flex whitespace-nowrap">
             <div className="marquee-content flex gap-8 md:gap-12 text-xs md:text-sm font-mono font-bold text-muted-foreground/60 uppercase tracking-widest">
                 <span className="text-brand-red">/// SI PASAS DE TODO, P.A.S.O. ES TU SINDICATO ///</span>
                 <span className="text-brand-green">LA FUERZA SINDICAL ESTÁ DESPERTANDO</span>
                 <span>TU SILENCIO ES RUIDO</span>
                 <span className="text-blue-400">NO ES TU CULPA, ES EL PROTOCOLO</span>
                 <span className="text-brand-red">/// SI PASAS DE TODO, P.A.S.O. ES TU SINDICATO ///</span>
                 <span className="text-brand-green">LA FUERZA SINDICAL ESTÁ DESPERTANDO</span>
                 <span>TU SILENCIO ES RUIDO</span>
                 <span className="text-blue-400">NO ES TU CULPA, ES EL PROTOCOLO</span>
             </div>
         </div>
      </div>
    </div>
  );
};

export default LandingPage;
