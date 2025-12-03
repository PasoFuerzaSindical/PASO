
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Trash2, ShieldCheck, AlertTriangle, Download, Upload } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/Alert';

const SettingsPage: React.FC = () => {
    const { admins, addAdmin, removeAdmin } = useAuth();
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [importFile, setImportFile] = useState<File | null>(null);
    
    // In a real app, the title would be managed by a separate settings context/provider.
    // For simplicity, we'll just show the concept here.
    const [appTitle, setAppTitle] = useState('P.A.S.O. Campaign Hub');

    const handleAddAdmin = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!newUsername.trim() || !newPassword.trim()) {
            setError("El nombre de usuario y la contraseña no pueden estar vacíos.");
            return;
        }

        const added = addAdmin(newUsername, newPassword);
        if (added) {
            setSuccess(`Administrador "${newUsername}" añadido correctamente.`);
            setNewUsername('');
            setNewPassword('');
        } else {
            setError(`El nombre de usuario "${newUsername}" ya existe.`);
        }
    };

    const handleDeleteAdmin = (id: string) => {
        const adminToDelete = admins.find(a => a.id === id);
        if (window.confirm(`¿Estás seguro de que quieres eliminar al administrador "${adminToDelete?.username}"?`)) {
            removeAdmin(id);
        }
    };

    const handleExport = () => {
        const backupData: { [key: string]: any } = {};
        const backupKeys = [
            'bingo-theme',
            'gallery-posts',
            'saved-consultations',
            'paso-admins',
            'paso-campaign-phase',
            'filosofia-page-content',
            'exclusive-content',
            'diploma-custom-content',
        ];

        backupKeys.forEach(key => {
            const data = localStorage.getItem(key);
            if (data) {
                backupData[key] = data;
            }
        });

        const jsonString = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = `paso-campaign-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    };
    
    const handleImport = () => {
        if (!importFile) {
            alert('Por favor, selecciona primero un archivo de copia de seguridad.');
            return;
        }

        if (!window.confirm('¿Estás seguro? Esto sobrescribirá TODOS los datos actuales de la campaña. Esta acción no se puede deshacer.')) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result;
                if (typeof text !== 'string') throw new Error("File could not be read");
                
                const data = JSON.parse(text);
                
                Object.keys(data).forEach(key => {
                    localStorage.setItem(key, data[key]);
                });

                alert('¡Importación completada con éxito! La aplicación se recargará para aplicar los cambios.');
                window.location.reload();

            } catch (err) {
                console.error("Error importing data:", err);
                alert('El archivo de copia de seguridad no es válido o está corrupto.');
            }
        };
        reader.readAsText(importFile);
    };

    return (
        <div className="container mx-auto max-w-4xl space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Configuración de la Campaña</CardTitle>
                    <CardDescription>
                        Ajusta el título principal que se muestra en la aplicación.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="appTitle">Título de la Aplicación</Label>
                        <Input 
                            id="appTitle" 
                            value={appTitle} 
                            onChange={(e) => setAppTitle(e.target.value)} 
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => alert('En una app real, esto guardaría el título.')}>Guardar Título</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Gestión de Administradores</CardTitle>
                    <CardDescription>
                        Añade o elimina usuarios con acceso al panel de administración.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">Administradores Actuales</h3>
                        <ul className="space-y-2">
                            {admins.map(admin => (
                                <li key={admin.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="h-5 w-5 text-ugt-green" />
                                        <span className="font-medium">{admin.username}</span>
                                    </div>
                                    <Button 
                                        variant="destructive" 
                                        size="icon" 
                                        onClick={() => handleDeleteAdmin(admin.id)}
                                        disabled={admins.length <= 1}
                                        title={admins.length <= 1 ? "No se puede eliminar al último administrador" : "Eliminar"}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <form onSubmit={handleAddAdmin} className="space-y-4 pt-4 border-t border-secondary/50">
                        <h3 className="font-semibold">Añadir Nuevo Administrador</h3>
                        {error && (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                         {success && (
                            <Alert>
                                <ShieldCheck className="h-4 w-4 text-ugt-green" />
                                <AlertTitle>Éxito</AlertTitle>
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-username">Nuevo Usuario</Label>
                                <Input 
                                    id="new-username" 
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    placeholder="ej: miembro_equipo"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">Nueva Contraseña</Label>
                                <Input 
                                    id="new-password" 
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                         <Button type="submit" className="w-full sm:w-auto">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Añadir Administrador
                        </Button>
                    </form>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Copia de Seguridad</CardTitle>
                    <CardDescription>
                        Exporta todos los datos de la campaña a un archivo o importa desde una copia de seguridad.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="font-semibold">Exportar Datos</h3>
                        <p className="text-sm text-muted-foreground">Guarda una copia de seguridad de todo el contenido y configuración en tu ordenador.</p>
                        <Button onClick={handleExport}>
                            <Download className="h-4 w-4 mr-2"/> Exportar a Archivo
                        </Button>
                    </div>
                     <div className="space-y-2 pt-4 border-t border-secondary/50">
                        <h3 className="font-semibold">Importar Datos</h3>
                        <p className="text-sm text-muted-foreground">Restaura la campaña desde un archivo de copia de seguridad. <strong>Atención:</strong> esto reemplazará todos los datos actuales.</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                             <Input 
                                type="file" 
                                accept=".json" 
                                onChange={(e) => setImportFile(e.target.files ? e.target.files[0] : null)}
                                className="flex-1"
                            />
                            <Button onClick={handleImport} variant="destructive" disabled={!importFile}>
                                <Upload className="h-4 w-4 mr-2"/> Importar y Sobrescribir
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
};

export default SettingsPage;
