<?php

namespace App\Services;

use App\Models\HazardLog;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class HazardLogService
{
    /**
     * Get paginated and filtered hazard logs for the Admin Panel.
     */
    public function getPaginatedAdminLogs(array $filters): LengthAwarePaginator
    {
        $query = HazardLog::query();

        if (!empty($filters['search'])) {
            $query->search($filters['search']);
        }

        if (!empty($filters['type'])) {
            $query->byType($filters['type']);
        }

        if (!empty($filters['area'])) {
            $query->byArea($filters['area']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $sort = $filters['sort'] ?? '-detected_at';
        $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';
        $column    = ltrim($sort, '-');

        $allowedSorts = ['haz_code', 'type', 'area', 'confidence', 'distance', 'detected_at', 'status'];
        if (in_array($column, $allowedSorts)) {
            $query->orderBy($column, $direction);
        } else {
            $query->orderBy('detected_at', 'desc');
        }

        $perPage = (int) ($filters['per_page'] ?? 15);
        $perPage = in_array($perPage, [10, 15, 25, 50]) ? $perPage : 15;

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * Get summary statistics for the Admin Panel hazard logs header.
     */
    public function getAdminStats(): array
    {
        $stats = HazardLog::selectRaw('type, count(*) as total')
            ->groupBy('type')
            ->pluck('total', 'type');

        $areaCounts = HazardLog::selectRaw('area, count(*) as total')
            ->groupBy('area')
            ->pluck('total', 'area');

        return [
            'stats'      => $stats,
            'areaCounts' => $areaCounts,
        ];
    }

    /**
     * Process an incoming hazard detection from the Rider App/Edge Device.
     */
    public function processIncomingHazard(array $data): HazardLog
    {
        $data['area'] = $this->resolveArea(
            (float) $data['latitude'],
            (float) $data['longitude']
        );

        $prefix = 'HAZ-';
        if (isset($data['type'])) {
            if ($data['type'] === 'Traffic Sign') {
                $prefix = 'TS-';
            } elseif ($data['type'] === 'Traffic Light') {
                $prefix = 'TL-';
            }
        }
        $data['haz_code']    = $prefix . strtoupper(Str::random(6));
        $data['status']      = HazardLog::STATUS_ACTIVE;
        $data['detected_at'] = $data['detected_at'] ?? now();

        return HazardLog::create($data);
    }

    /**
     * Coarse bounding-box → area label mapping.
     */
    private function resolveArea(float $lat, float $lng): string
    {
        $boxes = [
            'City Proper'  => [[6.900, 6.912], [122.065, 122.082]],
            'Calarian'     => [[6.920, 6.945], [122.020, 122.050]],
            'San Roque'    => [[6.935, 6.950], [122.040, 122.075]],
            'Sta Maria'    => [[6.915, 6.945], [122.060, 122.082]],
            'Tugbungan'    => [[6.908, 6.930], [122.075, 122.100]],
            'Talon-Talon'  => [[6.905, 6.922], [122.093, 122.115]],
            'Pasonanca'    => [[6.940, 6.970], [122.060, 122.085]],
            'Putik'        => [[6.920, 6.950], [122.085, 122.120]],
            'Tumaga'       => [[6.938, 6.958], [122.070, 122.098]],
            'Lunzuran'     => [[6.950, 6.978], [122.090, 122.108]],
            'Baliwasan'    => [[6.910, 6.922], [122.050, 122.070]],
            'San Jose Gusu'=> [[6.918, 6.935], [122.040, 122.056]],
        ];

        foreach ($boxes as $area => [$latRange, $lngRange]) {
            if ($lat  >= $latRange[0] && $lat  <= $latRange[1] &&
                $lng  >= $lngRange[0] && $lng  <= $lngRange[1]) {
                return $area;
            }
        }

        return 'Unknown';
    }
}
