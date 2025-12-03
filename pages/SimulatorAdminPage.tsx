
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Label } from '../components/ui/Label';
import { Swords, Save } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/Alert';

const SimulatorAdminPage: React.FC = () => {
    const [currentObjective, setCurrentObjective] = useLocalStorage<string>('simulator-objective', 'Conseguir un día de libre disposición (moscoso)');
    const [inputValue, setInputValue] = useState(currentObjective);
    const [saved, setSaved] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentObjective(inputValue);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="container mx-auto max-w-2xl space-y-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
                    <Swords className="h-8 w-8 text-cyber-violet" />
                    Configuración del Simulador
                </h1>
                <p className="text-muted-foreground mt-2">Define la batalla que librarán los usuarios contra Don Burocracio.</p>
            </div>

            <Card>
                <form onSubmit={handleSave}>
                    <CardHeader>
                        <CardTitle>Objetivo del Juego</CardTitle>
                        <CardDescription>
                            ¿Qué deben conseguir los usuarios? (Ej: "Pedir material nuevo", "Cambiar el turno de Nochebuena").
                            La IA adaptará sus excusas a este objetivo.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="objective">Misión Actual</Label>
                            <Input 
                                id="objective" 
                                value={inputValue} 
                                onChange={(e) => setInputValue(e.target.value)} 
                                placeholder="Escribe el objetivo aquí..."
                            />
                        </div>
                        
                        <div className="p-4 bg-secondary/30 rounded-lg border border-secondary">
                            <h4 className="font-semibold text-sm mb-2 text-ugt-green">Consejo Táctico:</h4>
                            <p className="text-xs text-muted-foreground">
                                Sé específico. Si pones "Conseguir material", la IA dirá que no hay presupuesto. 
                                Si pones "Conseguir sillas ergonómicas", la IA dirá que vuestras espaldas no están en el presupuesto del año vigente.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            <Save className="h-4 w-4 mr-2" />
                            {saved ? '¡Objetivo Actualizado!' : 'Guardar Misión'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {saved && (
                <Alert className="animate-fade-in border-ugt-green text-ugt-green">
                    <AlertTitle>Configuración Aplicada</AlertTitle>
                    <AlertDescription>
                        Don Burocracio ha recibido las nuevas instrucciones. Los usuarios ahora lucharán por: "{inputValue}".
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default SimulatorAdminPage;
