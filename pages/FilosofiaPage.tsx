


import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { GitCommit, SatelliteDish, Users, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCampaign } from '../contexts/CampaignContext';
import { CampaignPhase } from '../lib/campaignGems';
import useLocalStorage from '../hooks/useLocalStorage';
import { PageContentPillar } from '../lib/types';

const initialPhilosophyPillars: PageContentPillar[] = [
  {
    phase: 'Llegada',
    title: "Has Recibido una Transmisión",
    description: "Hemos detectado una anomalía en vuestro sector. Un patrón de resignación que resuena en el cosmos. Nos llamamos P.A.S.O. No venimos a liderar, venimos a observar. A entender por qué los que más cuidan han dejado de hacerse oír. Permaneced a la escucha.",
  },
  {
    phase: 'Observacion',
    title: "Informe de Campo: El Ecosistema Sanitario",
    description: "Nuestros sensores analizan vuestro hábitat. Rituales curiosos como la 'queja del café', que se disipa al volver al puesto. Comportamientos de evitación frente a tablones con información vital. Fascinante. Os reconocéis, ¿verdad? No estáis solos en esta observación.",
  },
  {
    phase: 'Abduccion',
    title: "Iniciando Protocolo de Abducción",
    description: "La observación pasiva ha terminado. Es hora de alterar la frecuencia. No es una abducción física, es un despertar de la conciencia. Un recordatorio de que 'pasar' es una elección, no un destino. El primer paso es cuestionar. El primer acto de rebeldía es mirar el tablón, preguntar al compañero. ¿Sientes el cambio?",
  },
  {
    phase: 'Revelacion',
    title: "Fin de la Transmisión. Inicio de la Conexión.",
    description: "P.A.S.O. nunca fue una entidad cósmica. Fuimos un espejo. Una idea nacida de vuestros propios compañeros en UGT, un intento de hablar un idioma diferente cuando el de siempre ya no se escuchaba. La ironía era el vehículo, pero el destino es real: recuperar la dignidad. P.A.S.O. se disuelve ahora en cada uno de vosotros que decide actuar. La Fuerza Sindical sois vosotros. UGT es la herramienta.",
  },
];

const icons: Record<string, React.ElementType> = {
    'Llegada': SatelliteDish,
    'Observacion': GitCommit,
    'Abduccion': Users,
    'Revelacion': Sparkles,
};

const phaseOrder: CampaignPhase[] = ['Llegada', 'Observacion', 'Abduccion', 'Revelacion'];

const FilosofiaPage: React.FC = () => {
  const { campaignPhase } = useCampaign();
  const [philosophyPillars] = useLocalStorage<PageContentPillar[]>('filosofia-page-content', initialPhilosophyPillars);
  
  const currentPhaseIndex = phaseOrder.indexOf(campaignPhase);
  const visiblePillars = philosophyPillars.slice(0, currentPhaseIndex + 1);

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">La Filosofía P.A.S.O.</h1>
        <p className="mt-4 text-xl text-muted-foreground">La Fuerza Sindical ha establecido contacto.</p>
      </div>
      <div className="space-y-8">
        {visiblePillars.map((pillar, index) => {
          const Icon = icons[pillar.phase];
          return (
            <Card key={index} className="overflow-hidden animate-fade-in">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 bg-secondary/50 flex items-center justify-center md:w-32">
                  <Icon className={cn("h-12 w-12", index % 2 === 0 ? "text-ugt-green" : "text-ugt-red")} />
                </div>
                <div className="flex-1">
                  <CardHeader>
                    <CardTitle>{pillar.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{pillar.description}</CardDescription>
                  </CardContent>
                </div>
              </div>
            </Card>
          )
        })}
         {currentPhaseIndex < phaseOrder.length - 1 && (
            <div className="text-center py-10 border-2 border-dashed border-secondary/50 rounded-lg">
                <p className="text-muted-foreground italic">Nuevas fases de la filosofía se revelarán pronto...</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default FilosofiaPage;
