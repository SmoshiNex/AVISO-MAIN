import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AdminLayout from '@/layouts/AdminLayout';
import { useEffect, useState } from 'react';
import { Skeleton } from 'boneyard-js/react';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from '@/components/ui/chart';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from 'recharts';
import { ChartConfig } from '@/components/ui/chart';

const hazardsChartConfig = {
    potholes:           { label: 'Potholes',                color: 'oklch(0.577 0.245 27.325)'  },
    roadExcavation:     { label: 'Road Excavation',         color: 'oklch(0.705 0.213 47.604)'  },
    roadBarriers:       { label: 'Road Barriers',           color: 'oklch(0.795 0.184 86.047)'  },
    trafficSigns:       { label: 'Traffic Signs',           color: 'oklch(0.600 0.180 240.000)' },
    trafficLightRed:    { label: 'Traffic Light (Red)',     color: 'oklch(0.637 0.237 15.330)'  },
    trafficLightGreen:  { label: 'Traffic Light (Green)',   color: 'oklch(0.627 0.194 149.214)' },
    trafficLightOrange: { label: 'Traffic Light (Orange)',  color: 'oklch(0.750 0.183 55.934)'  },
} satisfies ChartConfig;

const hazardTypesChartConfig = hazardsChartConfig;

const HAZARD_TYPE_COLORS = [
    'oklch(0.577 0.245 27.325)',  // Potholes — deep red
    'oklch(0.705 0.213 47.604)',  // Road Excavation — orange
    'oklch(0.795 0.184 86.047)',  // Road Barriers — yellow
    'oklch(0.600 0.180 240.000)', // Traffic Signs — blue
    'oklch(0.637 0.237 15.330)',  // Traffic Light Red
    'oklch(0.627 0.194 149.214)', // Traffic Light Green
    'oklch(0.750 0.183 55.934)',  // Traffic Light Orange
] as const;

const detectionAccuracyChartConfig = {
    accuracy: { label: 'Accuracy %', color: 'var(--primary)' },
} satisfies ChartConfig;
interface DashboardProps {
    dashboardStats: any[];
    hazardTypesData: any[];
    detectionAccuracyData: any[];
    hazardsOverTimeData: any[];
}

export default function Dashboard({
    dashboardStats,
    hazardTypesData,
    detectionAccuracyData,
    hazardsOverTimeData,
}: DashboardProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AdminLayout>
            <Head title="Metrics" />

            <div className="mb-6">
                <h1 className="text-3xl font-heading font-bold tracking-tight">Metrics</h1>
                <p className="text-muted-foreground mt-1">
                    Analyze system performance and historical hazard trends.
                </p>
            </div>

            <Skeleton loading={isLoading} animate="pulse" transition>
                {/* Stat Cards */}
                <div className="grid gap-6 md:grid-cols-3 mb-6">
                    {dashboardStats.map((stat) => (
                        <Card key={stat.label}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.label}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-4xl font-heading font-bold ${stat.label === 'System Status' ? 'text-green-600 dark:text-green-500' : ''}`}>
                                    {stat.value}
                                </div>
                                <p className={`text-xs mt-1 ${stat.subVariant === 'destructive' ? 'text-destructive' : 'text-muted-foreground'}`}>
                                    {stat.sub}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Area Chart — Hazards Over Time */}
                    <Card className="col-span-1 lg:col-span-2 border-border/50 shadow-md">
                        <CardHeader>
                            <CardTitle>Hazards Detected Over Time</CardTitle>
                            <CardDescription>7-day trend across all road hazard and traffic categories.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={hazardsChartConfig} className="h-[300px] w-full">
                                <AreaChart data={hazardsOverTimeData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                                    <defs>
                                        <linearGradient id="colorPotholes" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%"  stopColor="var(--color-potholes)"          stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--color-potholes)"          stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorRoadExcavation" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%"  stopColor="var(--color-roadExcavation)"    stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--color-roadExcavation)"    stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorRoadBarriers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%"  stopColor="var(--color-roadBarriers)"      stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--color-roadBarriers)"      stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorTrafficSigns" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%"  stopColor="var(--color-trafficSigns)"      stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--color-trafficSigns)"      stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorTrafficLightRed" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%"  stopColor="var(--color-trafficLightRed)"   stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--color-trafficLightRed)"   stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorTrafficLightGreen" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%"  stopColor="var(--color-trafficLightGreen)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--color-trafficLightGreen)" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorTrafficLightOrange" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%"  stopColor="var(--color-trafficLightOrange)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--color-trafficLightOrange)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                    <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                                    <YAxis tickLine={false} axisLine={false} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <ChartLegend content={<ChartLegendContent />} />
                                    <Area type="monotone" dataKey="potholes"           stroke="var(--color-potholes)"           fill="url(#colorPotholes)"          strokeWidth={2} dot={false} />
                                    <Area type="monotone" dataKey="roadExcavation"     stroke="var(--color-roadExcavation)"     fill="url(#colorRoadExcavation)"    strokeWidth={2} dot={false} />
                                    <Area type="monotone" dataKey="roadBarriers"       stroke="var(--color-roadBarriers)"       fill="url(#colorRoadBarriers)"      strokeWidth={2} dot={false} />
                                    <Area type="monotone" dataKey="trafficSigns"       stroke="var(--color-trafficSigns)"       fill="url(#colorTrafficSigns)"      strokeWidth={2} dot={false} />
                                    <Area type="monotone" dataKey="trafficLightRed"    stroke="var(--color-trafficLightRed)"    fill="url(#colorTrafficLightRed)"   strokeWidth={2} dot={false} />
                                    <Area type="monotone" dataKey="trafficLightGreen"  stroke="var(--color-trafficLightGreen)"  fill="url(#colorTrafficLightGreen)" strokeWidth={2} dot={false} />
                                    <Area type="monotone" dataKey="trafficLightOrange" stroke="var(--color-trafficLightOrange)" fill="url(#colorTrafficLightOrange)" strokeWidth={2} dot={false} />
                                </AreaChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Right Column */}
                    <div className="flex flex-col gap-6 col-span-1">
                        {/* Donut — Hazard Types */}
                        <Card className="flex-1 border-border/50 shadow-md">
                            <CardHeader>
                                <CardTitle>Hazard Types</CardTitle>
                                <CardDescription>Distribution by category.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center">
                                <ChartContainer config={hazardTypesChartConfig} className="h-[180px] w-full">
                                    <PieChart>
                                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                        <Pie
                                            data={hazardTypesData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%" cy="50%"
                                            innerRadius={50}
                                            outerRadius={78}
                                            paddingAngle={3}
                                        >
                                            {hazardTypesData.map((_, i) => (
                                                <Cell key={i} fill={HAZARD_TYPE_COLORS[i % HAZARD_TYPE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        {/* Bar — Detection Accuracy */}
                        <Card className="flex-1 border-border/50 shadow-md">
                            <CardHeader>
                                <CardTitle>Detection Accuracy</CardTitle>
                                <CardDescription>Model confidence per hazard class (%).</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={detectionAccuracyChartConfig} className="h-[130px] w-full">
                                    <BarChart data={detectionAccuracyData} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
                                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={6} tick={{ fontSize: 10 }} />
                                        <YAxis tickLine={false} axisLine={false} domain={[80, 100]} />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="accuracy" fill="var(--color-accuracy)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Skeleton>
        </AdminLayout>
    );
}
