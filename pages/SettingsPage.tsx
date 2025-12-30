
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Trash2, ShieldCheck, AlertTriangle, Download, Upload, KeyRound, Radio } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/Alert';
import { cn } from '../lib/utils';
import useLocalStorage from '../hooks/useLocalStorage';

const SettingsPage: React.FC = () => {
    const { admins, addAdmin, removeAdmin, updatePassword, currentUser } = useAuth();
    const [newUsername, setNewUsername] = useState('');
    const [newAdminPassword, setNewAdminPassword] = useState('');
    
    // Webhook Configuration - Default set to user provided URL
    const [webhookUrl, setWebhookUrl] = useLocalStorage<string>('paso-webhook-url', 'https://discord.com/api/webhooks/1455616560440938744/4sG3-kIsF6blUl001FNCJmBb8dIaBPDDQHOK73k8qJUbFZdfnW8CU0OtYC2G7_sw8nX_');
    
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

    const handleExport = () => {
        const backupData: { [key: string]: any } = {};
        const backupKeys = ['bingo-theme', 'gallery-posts', 'saved-consultations', 'paso-admins', 'paso-campaign-phase', 'filosofia-page-content', 'exclusive-content', 'diploma-custom-content', 'paso-webhook-url'];
        backupKeys.forEach(key => {
            const data = localStorage.getItem(key);
            if (data) backupData[key] = data;
        });
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = `paso-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    return (
        <div className="container mx-auto max-w-4xl space-y-8">
            {(error || success) && (
                <div className="animate-fade-in space-y-4">
                    {error && <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                    {success && <Alert className="border-brand-green text-brand-green"><ShieldCheck className="h-4 w-4" /><AlertTitle>Éxito</AlertTitle><AlertDescription>{success}</AlertDescription></Alert>}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                <Card className="h-full">
                    <form onSubmit={handleChangePassword}>
                        <CardHeader>
                            <div className="flex items-center gap-2"><KeyRound className="h-5 w-5 text-brand-green" /><CardTitle>Seguridad</CardTitle></div>
                            <CardDescription>Usuario activo: <span className="text-foreground font-bold">{currentUser}</span></CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2"><Label>Actual</Label><Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required /></div>
                            <div className="space-y-2"><Label>Nueva</Label><Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required /></div>
                            <div className="space-y-2"><Label>Confirmar</Label><Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></div>
                        </CardContent>
                        <CardFooter><Button type="submit" className="w-full">Actualizar Contraseña</Button></CardFooter>
                    </form>
                </Card>

                <Card className="h-full border-brand-green/30">
                    <CardHeader>
                        <div className="flex items-center gap-2"><Radio className="h-5 w-5 text-brand-green animate-pulse" /><CardTitle>Telemetría Global</CardTitle></div>
                        <CardDescription>Recibe alertas en Discord/Slack cuando los usuarios interactúan.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Webhook URL</Label>
                            <Input 
                                type="url" 
                                value={webhookUrl} 
                                onChange={(e) => setWebhookUrl(e.target.value)} 
                                placeholder="https://discord.com/api/webhooks/..." 
                                className="font-mono text-[10px]"
                            />
                        </div>
                        <div className="p-3 bg-secondary/30 rounded border text-[10px] text-muted-foreground leading-relaxed">
                            <p className="font-bold text-brand-green mb-1 uppercase tracking-widest">¿Cómo funciona?</p>
                            Cada vez que alguien publique en el muro, haga Bingo o consulte al Oráculo, recibirás una notificación silenciosa en tu canal configurado. Esto te permite saber si la campaña está teniendo éxito en tiempo real.
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-brand-green text-black font-bold" onClick={() => setSuccess("Webhook configurado. La telemetría está activa.")}>Guardar Configuración</Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader><CardTitle>Copia de Seguridad</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <Button onClick={handleExport} className="w-full"><Download className="h-4 w-4 mr-2"/> Exportar Todo</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Añadir Administrador</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2"><Label>Usuario</Label><Input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} /></div>
                        <div className="space-y-2"><Label>Password</Label><Input type="password" value={newAdminPassword} onChange={(e) => setNewAdminPassword(e.target.value)} /></div>
                    </CardContent>
                    <CardFooter><Button onClick={handleAddAdmin} variant="secondary" className="w-full">Crear Acceso</Button></CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default SettingsPage;
