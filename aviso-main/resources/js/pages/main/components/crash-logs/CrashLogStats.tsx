import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { type MinAvgMax, type RiderEventTypeStats } from "@/types/models";
import { EVENT_TYPE_STYLES } from "./eventTypes";

interface CrashLogStatsProps {
    stats: RiderEventTypeStats[];
}

function Range({ value, unit }: { value: MinAvgMax; unit: string }) {
    if (value.max === null) return <span className="text-muted-foreground">-</span>;
    return (
        <div className="font-mono text-xs leading-5">
            <div>
                <span className="text-muted-foreground">min </span>
                {value.min}
                {unit}
            </div>
            <div>
                <span className="text-muted-foreground">avg </span>
                {value.avg}
                {unit}
            </div>
            <div className="font-semibold">
                <span className="font-normal text-muted-foreground">max </span>
                {value.max}
                {unit}
            </div>
        </div>
    );
}

/**
 * Side-by-side ranges of every sensor value per category. A detection
 * threshold belongs between categories, e.g. the bump threshold above the
 * highest vertical G seen in normal riding and below most real bumps.
 */
export function CrashLogStats({ stats }: CrashLogStatsProps) {
    return (
        <Card className="border-border/50 shadow-sm mb-6">
            <CardHeader>
                <CardTitle className="text-base">Threshold reference</CardTitle>
                <CardDescription>
                    Range of each sensor value per category for the current filters. Use it to place the IoT
                    unit&apos;s thresholds between categories (values in g, gyro in °/s, tilt in degrees).
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="relative w-full overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30">
                                <TableHead className="font-semibold">Category</TableHead>
                                <TableHead className="font-semibold">Records</TableHead>
                                <TableHead className="font-semibold">Peak G</TableHead>
                                <TableHead className="font-semibold">Vertical G</TableHead>
                                <TableHead className="font-semibold">Horizontal G</TableHead>
                                <TableHead className="font-semibold">Gyro</TableHead>
                                <TableHead className="font-semibold">Tilt</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.map((s) => {
                                const style = EVENT_TYPE_STYLES[s.type];
                                const Icon = style.icon;
                                return (
                                    <TableRow key={s.type}>
                                        <TableCell>
                                            <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${style.text}`}>
                                                <Icon className="h-4 w-4" />
                                                {s.label}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">{s.total}</TableCell>
                                        <TableCell><Range value={s.g} unit=" g" /></TableCell>
                                        <TableCell><Range value={s.vertical_g} unit=" g" /></TableCell>
                                        <TableCell><Range value={s.horizontal_g} unit=" g" /></TableCell>
                                        <TableCell><Range value={s.gyro_dps} unit="°/s" /></TableCell>
                                        <TableCell><Range value={s.tilt_deg} unit="°" /></TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
