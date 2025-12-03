
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '../ui/Card';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Label } from '../ui/Label';
import { Rocket } from 'lucide-react';
import { useCampaign } from '../../contexts/CampaignContext';
import { CampaignPhase } from '../../lib/campaignGems';

const phaseDescriptions: Record<CampaignPhase, string> = {
    Llegada: "Fase 1: Misterio. Generar intriga y curiosidad.",
    Observacion: "Fase 2: Sátira. Reflejar la realidad con ironía.",
    Abduccion: "Fase 3: Acción. Invitar a una reflexión activa.",
    Revelacion: "Fase 4: Llamada. Conectar P.A.S.O. con UGT.",
};

const CampaignPhaseSettings: React.FC = () => {
    const { campaignPhase, setCampaignPhase } = useCampaign();

    const handlePhaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCampaignPhase(e.target.value as CampaignPhase);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Fase de la Campaña</CardTitle>
                <CardDescription>Controla el tono y la narrativa de la app.</CardDescription>
            </CardHeader>
            <CardContent>
                <Label htmlFor="campaign-phase-select">Fase Actual</Label>
                <Select id="campaign-phase-select" value={campaignPhase} onChange={handlePhaseChange}>
                    <option value="Llegada">1: La Llegada</option>
                    <option value="Observacion">2: La Observación</option>
                    <option value="Abduccion">3: La Abducción</option>
                    <option value="Revelacion">4: La Revelación</option>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">{phaseDescriptions[campaignPhase]}</p>
            </CardContent>
        </Card>
    );
};

export default CampaignPhaseSettings;
