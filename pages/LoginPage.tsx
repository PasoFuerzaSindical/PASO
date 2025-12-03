

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/Alert';
import { useAuth } from '../contexts/AuthContext';
import { Shield, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const success = login(username, password);
        if (!success) {
            setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center bg-background">
            <div className="container mx-auto max-w-md">
                 <Card className="w-full animate-fade-in">
                    <form onSubmit={handleSubmit}>
                        <CardHeader className="text-center">
                            <Shield className="mx-auto h-12 w-12 text-ugt-red" />
                            <CardTitle>Zona de Administración</CardTitle>
                            <CardDescription>
                                Acceso restringido para el equipo de campaña.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Error de Acceso</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="username">Usuario</Label>
                                <Input 
                                    id="username" 
                                    type="text" 
                                    placeholder="admin" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input 
                                    id="password" 
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button className="w-full" type="submit">
                                Acceder
                            </Button>
                             <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
                                Volver a la página principal
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;