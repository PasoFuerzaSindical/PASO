
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Label } from '../components/ui/Label';
import { Select } from '../components/ui/Select';
import useLocalStorage from '../hooks/useLocalStorage';
import { CampaignPost, SocialMetricEntry } from '../lib/types';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
    ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { Plus, BarChart3, TrendingUp, Users, Share2, Trash2 } from 'lucide-react';
import BingoSettings from '../components/admin/BingoSettings';
import CampaignPhaseSettings from '../components/admin/CampaignPhaseSettings';

const PLATFORMS = ['Instagram', 'X (Twitter)', 'TikTok', 'YouTube', 'Web/Blog'] as const;
const METRIC_TYPES = ['Alcance', 'Interacciones', 'Seguidores'] as const;

const COLORS = {
    'Instagram': '#E1306C',
    'X (Twitter)': '#1DA1F2',
    'TikTok': '#00f2ea',
    'YouTube': '#FF0000',
    'Web/Blog': '#16a34a'
};

const DashboardPage: React.FC = () => {
    const [savedPosts] = useLocalStorage<CampaignPost[]>('gallery-posts', []);
    const [metrics, setMetrics] = useLocalStorage<SocialMetricEntry[]>('social-metrics', []);
    
    // Form state
    const [platform, setPlatform] = useState<SocialMetricEntry['platform']>('Instagram');
    const [type, setType] = useState<SocialMetricEntry['metricType']>('Interacciones');
    const [value, setValue] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleAddMetric = (e: React.FormEvent) => {
        e.preventDefault();
        if (!value || isNaN(Number(value))) return;

        const newEntry: SocialMetricEntry = {
            id: Date.now().toString(),
            platform,
            metricType: type,
            value: Number(value),
            date: date
        };

        setMetrics(prev => [...prev, newEntry]);
        setValue('');
    };

    const deleteMetric = (id: string) => {
        setMetrics(prev => prev.filter(m => m.id !== id));
    };

    // Data Processing for Charts
    const stats = useMemo(() => {
        const totalInteractions = metrics
            .filter(m => m.metricType === 'Interacciones')
            .reduce((acc, curr) => acc + curr.value, 0);
            
        const totalReach = metrics
            .filter(m => m.metricType === 'Alcance')
            .reduce((acc, curr) => acc + curr.value, 0);
            
        const currentFollowers = metrics
            .filter(m => m.metricType === 'Seguidores')
            .reduce((acc, curr) => acc + curr.value, 0);

        // Platform distribution
        const platformData = PLATFORMS.map(p => ({
            name: p,
            value: metrics.filter(m => m.platform === p).reduce((acc, curr) => acc + curr.value, 0),
            color: COLORS[p]
        })).filter(p => p.value > 0);

        // Time series (grouped by date)
        const dailyDataMap: Record<string, number> = {};
        metrics.forEach(m => {
            dailyDataMap[m.date] = (dailyDataMap[m.date] || 0) + m.value;
        });
        
        const timeData = Object.entries(dailyDataMap)
            .map(([date, val]) => ({ date, value: val }))
            .sort((a, b) => a.date.localeCompare(b.date));

        return { totalInteractions, totalReach, currentFollowers, platformData, timeData };
    }, [metrics]);

    return (
        <div className="container mx-auto space-y-6 pb-20">
            {/* KPI CARDS */}
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                <Card className="border-l-4 border-l-brand-green">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Share2 className="h-4 w-4 text-brand-green" /> Interacción Total
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalInteractions.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Enganche acumulado en redes</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-400">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-blue-400" /> Alcance Total
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalReach.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Impactos visuales únicos</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-cyber-violet">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Users className="h-4 w-4 text-cyber-violet" /> Comunidad
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.currentFollowers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Seguidores totales P.A.S.O.</p>
                    </CardContent>
                </Card>
                <div className="hidden lg:block">
                     <CampaignPhaseSettings />
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* LOG METRICS FORM */}
                <Card className="lg:col-span-1">
                    <form onSubmit={handleAddMetric}>
                        <CardHeader>
                            <CardTitle className="text-lg">Registrar Actividad</CardTitle>
                            <CardDescription>Añade los datos de tus últimas analíticas.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Plataforma</Label>
                                <Select value={platform} onChange={(e) => setPlatform(e.target.value as any)}>
                                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label>Métrica</Label>
                                    <Select value={type} onChange={(e) => setType(e.target.value as any)}>
                                        {METRIC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Valor</Label>
                                    <Input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="0" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Fecha</Label>
                                <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full">
                                <Plus className="h-4 w-4 mr-2" /> Registrar Hito
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                {/* CHARTS */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Evolución de la Campaña</CardTitle>
                        <CardDescription>Crecimiento de impactos por día.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.timeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                                <XAxis dataKey="date" stroke="#666" fontSize={10} />
                                <YAxis stroke="#666" fontSize={10} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                                    itemStyle={{ color: '#0aff60' }}
                                />
                                <Line type="monotone" dataKey="value" stroke="#0aff60" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* PLATFORM PIE */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Distribución por Canal</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                        {stats.platformData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.platformData} layout="vertical">
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" stroke="#999" fontSize={10} width={80} />
                                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#111' }} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {stats.platformData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-muted-foreground text-sm">Sin datos suficientes</div>
                        )}
                    </CardContent>
                </Card>

                {/* LOG HISTORY */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Últimos Registros</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                            {[...metrics].reverse().slice(0, 10).map(m => (
                                <div key={m.id} className="flex items-center justify-between p-2 bg-secondary/20 rounded border border-border/50">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[m.platform] }}></span>
                                            <span className="text-sm font-bold">{m.platform}</span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">{m.date} - {m.metricType}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-mono">+{m.value}</span>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteMetric(m.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <div className="lg:hidden">
                 <CampaignPhaseSettings />
            </div>
            <BingoSettings />
        </div>
    );
};

export default DashboardPage;
