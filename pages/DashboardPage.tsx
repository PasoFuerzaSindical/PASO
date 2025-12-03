

import React, {
    useState,
    useEffect
} from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent
} from '../components/ui/Card';
import useLocalStorage from '../hooks/useLocalStorage';
import {
    CampaignPost
} from '../lib/types';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import BingoSettings from '../components/admin/BingoSettings';
import CampaignPhaseSettings from '../components/admin/CampaignPhaseSettings';

const generateMockData = (posts: CampaignPost[]) => {
    const interaction = posts.length * 158;
    const reach = posts.length * 2450;
    const virality = Math.min(100, Math.round(posts.length * 12.5));

    const timeData = [
        { name: 'Semana 1', Rendimiento: 2400 },
        { name: 'Semana 2', Rendimiento: 1398 },
        { name: 'Semana 3', Rendimiento: 9800 },
        { name: 'Semana 4', Rendimiento: 3908 },
        { name: 'Semana 5', Rendimiento: 4800 + (posts.length * 300)},
        { name: 'Semana 6', Rendimiento: 3800 + (posts.length * 500)},
        { name: 'Semana 7', Rendimiento: 4300 + (posts.length * 700)},
    ];
    
    const platformData = [
        { name: 'Instagram', interacciones: 4000 + (posts.filter(p => p.platform === 'Instagram').length * 400) },
        { name: 'Twitter', interacciones: 3000 + (posts.filter(p => p.platform === 'Twitter').length * 300) },
        { name: 'TikTok', interacciones: 2000 + (posts.filter(p => p.platform === 'TikTok').length * 600) },
        { name: 'Blog', interacciones: 2780 + (posts.filter(p => p.platform === 'Blog').length * 100) },
    ];

    return {
        kpis: {
            interaction,
            reach,
            virality
        },
        timeData,
        platformData
    };
};

const DashboardPage: React.FC = () => {
    const [savedPosts] = useLocalStorage < CampaignPost[] > ('gallery-posts', []);
    const [data, setData] = useState(generateMockData([]));
    
    useEffect(() => {
        setData(generateMockData(savedPosts));
    }, [savedPosts]);

    return (
        <div className="container mx-auto space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Interacción Total</CardTitle>
                        <CardDescription>Likes, comentarios, etc.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-ugt-green">{data.kpis.interaction.toLocaleString('es-ES')}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Alcance Estimado</CardTitle>
                        <CardDescription>Ojos en la campaña</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-ugt-green">{data.kpis.reach.toLocaleString('es-ES')}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Puntuación Viral</CardTitle>
                        <CardDescription>De 0 a "Pandemia"</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-ugt-green">{data.kpis.virality}%</p>
                    </CardContent>
                </Card>
                 <div className="space-y-4">
                    <CampaignPhaseSettings />
                    <BingoSettings />
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Rendimiento a lo largo del tiempo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.timeData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                                    <YAxis stroke="hsl(var(--muted-foreground))" />
                                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="Rendimiento" stroke="#16a34a" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Interacciones por Plataforma</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.platformData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                                    <YAxis stroke="hsl(var(--muted-foreground))" />
                                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
                                    <Legend />
                                    <Bar dataKey="interacciones" fill="#16a34a" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
