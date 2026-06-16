import { X } from 'lucide-react';
import { type Rider } from './riderData';
import { getRiderThemeColor } from './riderUtils';

interface RiderDetailPanelProps {
    rider: Rider;
    theme: 'day' | 'night' | 'dusk' | 'dawn';
    onClose: () => void;
}

export function RiderDetailPanel({ rider, theme, onClose }: RiderDetailPanelProps) {
    return (
        <div className="absolute bottom-8 left-3 z-10 bg-background/95 backdrop-blur shadow-xl border rounded-xl p-4 w-72 transition-all">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full motion-safe:animate-pulse shadow-sm"
                        style={{ backgroundColor: getRiderThemeColor(rider.colorBase, theme) }}
                    />
                    <h3 className="font-bold text-sm tracking-tight">{rider.name}</h3>
                </div>
                <button
                    onClick={onClose}
                    aria-label="Stop following rider"
                    className="text-muted-foreground hover:text-foreground hover:bg-muted p-1 rounded-md transition-colors"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium text-foreground">Status:</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-600 border border-green-500/30">
                        Active Patrol
                    </span>
                </div>
                <div className="pt-1">
                    <strong className="text-foreground block text-xs uppercase tracking-wider mb-1">Assigned User</strong>
                    <p className="flex justify-between mb-0.5">
                        <span>Name:</span>
                        <span className="font-medium text-foreground">{rider.userInfo.fullName}</span>
                    </p>
                    <p className="flex justify-between mb-0.5">
                        <span>Username:</span>
                        <span className="font-mono text-xs">{rider.userInfo.username}</span>
                    </p>
                    <p className="flex justify-between mb-0.5">
                        <span>Contact:</span>
                        <span>{rider.userInfo.contact}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Address:</span>
                        <span className="truncate max-w-[120px]" title={rider.userInfo.address}>
                            {rider.userInfo.address}
                        </span>
                    </p>
                    <div className="mt-2 pt-2 border-t border-border/50">
                        <p className="flex justify-between items-center">
                            <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 motion-safe:animate-pulse" />
                                Live GPS:
                            </span>
                            <span
                                id="live-rider-coords"
                                className="font-mono text-[10px] font-bold tracking-tight text-foreground bg-muted px-1.5 py-0.5 rounded"
                            >
                                Loading...
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
