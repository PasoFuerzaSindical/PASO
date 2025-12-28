
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Trash2, ShieldCheck, AlertTriangle, Download, Upload, KeyRound } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/Alert';
// Added missing import for 'cn' utility
import { cn } from '../lib/utils';

const SettingsPage: React.FC = () => {
    const { admins, addAdmin, removeAdmin, updatePassword, currentUser } = useAuth();
    const [newUsername, setNewUsername] = useState('');
    const [newAdminPassword, setNewAdminPassword] = useState('');
    
    // Change Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [importFile, setImportFile] = useState<File | null>(null);
    
    const [appTitle, setAppTitle] = useState('P.A.S.O. Campaign Hub');

    const handleAddAdmin = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!newUsername.trim() || !newAdminPassword.trim()) {
            setError("El nombre de usuario y la contraseña no pueden estar vacíos.");
            return;
        }

        const added = addAdmin(newUsername, newAdminPassword);
        if (added) {
            setSuccess(`Administrador "${newUsername}" añadido correctamente.`);
            setNewUsername('');
            setNewAdminPassword('');
        } else {
            setError(`El nombre de usuario "${newUsername}" ya existe.`);
        }
    };

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (newPassword !== confirmPassword) {
            setError("Las nuevas contraseñas no coinciden.");
            return;
        }

        if (newPassword.length < 6) {
            setError("La nueva contraseña debe tener al menos 6 caracteres.");
            return;
        }

        const result = updatePassword(currentPassword, newPassword);
        if (result.success) {
            setSuccess(result.message);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setError(result.message);
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
            {/* ALERT BOX FOR FEEDBACK */}
            {(error || success) && (
                <div className="animate-fade-in space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {success && (
                        <Alert className="border-brand-green text-brand-green">
                            <ShieldCheck className="h-4 w-4" />
                            <AlertTitle>Éxito</AlertTitle>
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                {/* CHANGE PASSWORD CARD */}
                <Card className="h-full">
                    <form onSubmit={handleChangePassword}>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <KeyRound className="h-5 w-5 text-brand-green" />
                                <CardTitle>Seguridad de la Cuenta</CardTitle>
                            </div>
                            <CardDescription>
                                Cambia tu contraseña de acceso para el usuario <span className="font-bold text-foreground">{currentUser}</span>.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Contraseña Actual</Label>
                                <Input 
                                    id="current-password" 
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
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
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                                <Input 
                                    id="confirm-password" 
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full">
                                Actualizar Contraseña
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                {/* ADD ADMIN CARD */}
                <Card className="h-full">
                    <form onSubmit={handleAddAdmin}>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <UserPlus className="h-5 w-5 text-cyber-violet" />
                                <CardTitle>Añadir Administrador</CardTitle>
                            </div>
                            <CardDescription>
                                Crea un nuevo acceso para otros miembros del equipo.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-username">Nombre de Usuario</Label>
                                <Input 
                                    id="new-username" 
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    placeholder="ej: miembro_equipo"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-admin-password">Contraseña</Label>
                                <Input 
                                    id="new-admin-password" 
                                    type="password"
                                    value={newAdminPassword}
                                    onChange={(e) => setNewAdminPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" variant="secondary" className="w-full">
                                Crear Acceso
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>

            {/* MANAGE ADMINS CARD */}
            <Card>
                <CardHeader>
                    <CardTitle>Administradores Actuales</CardTitle>
                    <CardDescription>
                        Lista de personas con acceso a la zona de mando. No puedes eliminarte a ti mismo si eres el último.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {admins.map(admin => (
                            <li key={admin.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className={cn("h-5 w-5", admin.username === currentUser ? "text-brand-green" : "text-muted-foreground")} />
                                    <span className="font-medium">
                                        {admin.username}
                                        {admin.username === currentUser && <span className="ml-2 text-[10px] bg-brand-green/20 text-brand-green px-2 py-0.5 rounded-full uppercase tracking-tighter">Tú</span>}
                                    </span>
                                </div>
                                <Button 
                                    variant="destructive" 
                                    size="icon" 
                                    onClick={() => handleDeleteAdmin(admin.id)}
                                    disabled={admins.length <= 1 || admin.username === currentUser}
                                    title={admin.username === currentUser ? "No puedes eliminar tu propia cuenta activa" : "Eliminar"}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
            
            {/* BACKUP & TITLE CARD */}
            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Configuración Visual</CardTitle>
                        <CardDescription>Ajusta el título global de la app.</CardDescription>
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
                        <Button variant="outline" onClick={() => alert('Título guardado localmente.')}>Guardar Título</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Copia de Seguridad</CardTitle>
                        <CardDescription>Exporta o importa toda la base de datos local.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button onClick={handleExport} className="w-full">
                            <Download className="h-4 w-4 mr-2"/> Exportar Todo
                        </Button>
                        <div className="flex flex-col gap-2">
                             <Input 
                                type="file" 
                                accept=".json" 
                                onChange={(e) => setImportFile(e.target.files ? e.target.files[0] : null)}
                                className="text-xs"
                            />
                            <Button onClick={handleImport} variant="destructive" disabled={!importFile} className="w-full">
                                <Upload className="h-4 w-4 mr-2"/> Importar Backup
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SettingsPage;
