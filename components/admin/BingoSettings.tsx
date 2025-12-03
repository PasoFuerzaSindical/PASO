

import React, { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Label } from '../ui/Label';
import { Save } from 'lucide-react';

const BingoSettings: React.FC = () => {
    const [theme, setTheme] = useLocalStorage<string>('bingo-theme', 'La Precariedad Cotidiana');
    const [inputValue, setInputValue] = useState<string>(theme);
    const [saved, setSaved] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setTheme(inputValue);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <Card>
            <form onSubmit={handleSave}>
                <CardHeader>
                    <CardTitle>Ajustes del Bingo</CardTitle>
                    <CardDescription>Controla el tema de la semana.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Label htmlFor="bingo-theme-input">Tema Actual</Label>
                    <Input
                        id="bingo-theme-input"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ej: Las 35 horas semanales"
                    />
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={inputValue === theme}>
                       <Save className="h-4 w-4 mr-2" />
                       {saved ? '¡Guardado!' : 'Guardar Tema'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default BingoSettings;
