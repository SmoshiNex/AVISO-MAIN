<?php

namespace App\Services;

use App\Models\HazardLog;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getMetrics(): array
    {
        // 1. Stat Cards
        $activeHazardsCount = HazardLog::where('status', 'active')->count();
        $todayDetectionsCount = HazardLog::whereDate('detected_at', Carbon::today())->count();
        $avgConfidence = HazardLog::avg('confidence') ?? 0;

        $dashboardStats = [
            [
                'label' => 'Active Hazards',
                'value' => number_format($activeHazardsCount),
                'sub' => 'Currently active across the city',
                'subVariant' => 'destructive',
            ],
            [
                'label' => 'Total Detections (Today)',
                'value' => number_format($todayDetectionsCount),
                'sub' => 'Across all 7 hazard categories',
                'subVariant' => 'muted',
            ],
            [
                'label' => 'System Status',
                'value' => 'Online',
                'sub' => 'Model running · Avg. confidence ' . round($avgConfidence) . '%',
                'subVariant' => 'muted',
            ],
        ];

        // 2. Hazard Types Distribution (Donut)
        $hazardTypesDataRaw = HazardLog::select('type', DB::raw('count(*) as value'))
            ->groupBy('type')
            ->get();
        
        $typeMapping = [
            'Pothole' => 'Potholes',
            'Road Excavation' => 'Road Excavation',
            'Road Barrier' => 'Road Barriers',
            'Traffic Sign' => 'Traffic Signs',
            'Traffic Light' => 'Traffic Light (Red)',
        ];

        $hazardTypesData = collect($typeMapping)->map(function ($chartName, $dbType) use ($hazardTypesDataRaw) {
            $record = $hazardTypesDataRaw->firstWhere('type', $dbType);
            return [
                'name' => $chartName,
                'value' => $record ? $record->value : 0,
            ];
        })->values()->toArray();

        // 3. Detection Accuracy by Type (Bar)
        $accuracyMapping = [
            'Pothole' => 'Pothole',
            'Road Excavation' => 'Excavation',
            'Road Barrier' => 'Barriers',
            'Traffic Sign' => 'Signs',
            'Traffic Light' => 'TL Red',
        ];

        $detectionAccuracyDataRaw = HazardLog::select('type', DB::raw('AVG(confidence) as accuracy'))
            ->groupBy('type')
            ->get();

        $detectionAccuracyData = collect($accuracyMapping)->map(function ($chartName, $dbType) use ($detectionAccuracyDataRaw) {
            $record = $detectionAccuracyDataRaw->firstWhere('type', $dbType);
            return [
                'name' => $chartName,
                'accuracy' => $record ? round($record->accuracy) : 0,
            ];
        })->values()->toArray();

        // 4. Hazards Over Time (7-day Area Chart)
        $last7Days = collect();
        for ($i = 6; $i >= 0; $i--) {
            $last7Days->push(Carbon::today()->subDays($i)->format('Y-m-d'));
        }

        $hazardsOverTimeRaw = HazardLog::select(
            DB::raw('DATE(detected_at) as date'),
            'type',
            DB::raw('count(*) as count')
        )
            ->where('detected_at', '>=', Carbon::today()->subDays(6))
            ->groupBy('date', 'type')
            ->get();

        $hazardsOverTimeData = $last7Days->map(function ($date) use ($hazardsOverTimeRaw) {
            $dayData = $hazardsOverTimeRaw->where('date', $date);
            return [
                'day' => Carbon::parse($date)->format('D'),
                'potholes' => $dayData->where('type', 'Pothole')->sum('count'),
                'roadExcavation' => $dayData->where('type', 'Road Excavation')->sum('count'),
                'roadBarriers' => $dayData->where('type', 'Road Barrier')->sum('count'),
                'trafficSigns' => $dayData->where('type', 'Traffic Sign')->sum('count'),
                'trafficLightRed' => $dayData->where('type', 'Traffic Light')->sum('count'),
                'trafficLightGreen' => 0,
                'trafficLightOrange' => 0,
            ];
        })->toArray();

        return [
            'dashboardStats' => $dashboardStats,
            'hazardTypesData' => $hazardTypesData,
            'detectionAccuracyData' => $detectionAccuracyData,
            'hazardsOverTimeData' => $hazardsOverTimeData,
        ];
    }
}
