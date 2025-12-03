
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Microscope, Compass, Wrench, Target, Rocket, Info } from 'lucide-react';
import { cn } from '../lib/utils';

const strategyPillars = [
  {
    icon: Microscope,
    title: "1. Diagnóstico: La Frustración como Materia Prima",
    description: "Observamos la realidad del sector: agotamiento, desmotivación, cinismo. No luchamos contra estos sentimientos, los canalizamos. Son el combustible de nuestra campaña, la prueba de que el sistema actual no funciona. La ironía es nuestro microscopio para analizar el absurdo.",
  },
  {
    icon: Compass,
    title: "2. Estrategia: El Humor como Caballo de Troya",
    description: "Frente a un discurso sindical tradicional que genera rechazo, usamos el humor y el surrealismo para infiltrarnos en la conversación. P.A.S.O. se presenta como un 'no-sindicato' para conectar con quienes 'pasan' de los sindicatos. Desarmamos las defensas con una sonrisa para luego plantar la semilla de la acción colectiva.",
  },
  {
    icon: Wrench,
    title: "3. Herramienta: La Creación Colectiva",
    description: "Esta plataforma no es un monólogo, es una conversación. El 'Validador de Acrónimos', el 'Bingo del Precariado' y el 'Consultorio' son herramientas para que el personal sanitario se apropie de la narrativa, comparta sus experiencias y convierta la queja individual en un meme colectivo, el primer paso hacia la conciencia de clase.",
  },
  {
    icon: Target,
    title: "4. Objetivo Final: De la Ironía a la Acción",
    description: "El objetivo de P.A.S.O. no es quedarse en el chiste. Es demostrar que si la única opción parece ser 'pasar de todo', es porque las opciones actuales son insuficientes. La campaña busca aglutinar el descontento para, en una fase final, revelar una propuesta seria y organizada que dé una salida real a la frustración que hemos visibilizado.",
  },
  {
    icon: Rocket,
    title: "5. Despliegue: La Plataforma como Herramienta Real",
    description: "Esta funcionalidad de despliegue (el icono de la nave 🚀) ha estado disponible desde el inicio del proyecto. Permite convertir esta aplicación de un entorno de desarrollo a un sitio web real y público con un solo clic. Y sí, es completamente gratis. Aprovechamos las plataformas modernas de alojamiento para aplicaciones web que ofrecen generosos planes gratuitos, haciendo que la difusión de nuestra campaña sea accesible para todos.",
  }
];

const StrategyPage: React.FC = () => {
  return (
    <div className="container mx-auto max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">La Filosofía P.A.S.O.</h1>
        <p className="mt-4 text-xl text-muted-foreground">Más que una campaña, una autopsia del sistema.</p>
      </div>
      <div className="space-y-8">
        {strategyPillars.map((pillar, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="p-6 bg-secondary/50 flex items-center justify-center md:w-32">
                <pillar.icon className={cn("h-12 w-12", index % 2 === 0 ? "text-ugt-green" : "text-ugt-red")} />
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
        ))}
        
        <Card className="mt-8 border-ugt-green/50">
            <div className="flex flex-col md:flex-row">
                <div className="p-6 bg-secondary/50 flex items-center justify-center md:w-32">
                    <Info className="h-12 w-12 text-ugt-green" />
                </div>
                <div className="flex-1">
                    <CardHeader>
                        <CardTitle>Transparencia de Costos y Facturación</CardTitle>
                        <CardDescription>
                            Aclarando el "Setup Billing" y por qué la campaña sigue siendo gratuita.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground">
                        <p>
                            Has encontrado un paso que dice "Setup Billing" (Configurar Facturación). ¡Es normal alarmarse! Pero tranquilo, te explicamos por qué aparece y por qué <strong>no vas a pagar nada</strong> por el uso previsto de la campaña.
                        </p>
                        <ul className="list-disc list-inside space-y-2">
                            <li>
                                <strong>¿Por qué lo piden?</strong> Las plataformas tecnológicas que nos dan la Inteligencia Artificial (como Google) necesitan una forma de verificar la identidad y prevenir abusos. Pedir una configuración de facturación es su método estándar de seguridad, incluso para los servicios gratuitos.
                            </li>
                            <li>
                                <strong>El Plan Gratuito:</strong> Estas plataformas operan con un modelo "Freemium". Te ofrecen un límite de uso mensual <strong>muy generoso y completamente gratuito</strong>. Para una campaña como P.A.S.O., es prácticamente imposible superar este límite.
                            </li>
                            <li>
                                <strong>Tu Tranquilidad:</strong> No se te cobrará nada. Puedes proceder con la configuración con la seguridad de que es un mero formalismo para activar los servicios.
                            </li>
                        </ul>
                        <a href="https://ai.google.dev/gemini-api/pricing" target="_blank" rel="noopener noreferrer" className="text-ugt-green hover:underline font-medium">
                            Puedes consultar los precios oficiales aquí para tu total transparencia.
                        </a>
                    </CardContent>
                </div>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default StrategyPage;
