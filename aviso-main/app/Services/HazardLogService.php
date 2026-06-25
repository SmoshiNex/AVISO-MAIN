<?php

namespace App\Services;

use App\Models\HazardLog;
use App\Models\Trip;
use Illuminate\Support\Facades\Auth;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class HazardLogService
{
    private function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->search($filters['search']);
        }

        if (!empty($filters['type']) && $filters['type'] !== 'all') {
            $query->byType($filters['type']);
        }

        if (!empty($filters['area']) && $filters['area'] !== 'all') {
            $query->byArea($filters['area']);
        }

        return $query;
    }

    public function getPaginatedAdminLogs(array $filters): LengthAwarePaginator
    {
        $query = HazardLog::query();
        $this->applyFilters($query, $filters);

        $sort      = $filters['sort'] ?? '-detected_at';
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

    public function getExportLogs(array $filters)
    {
        $query = HazardLog::query();
        $this->applyFilters($query, $filters);

        $sort      = $filters['sort'] ?? '-detected_at';
        $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';
        $column    = ltrim($sort, '-');

        $allowedSorts = ['haz_code', 'type', 'area', 'confidence', 'distance', 'detected_at', 'status'];
        if (in_array($column, $allowedSorts)) {
            $query->orderBy($column, $direction);
        } else {
            $query->orderBy('detected_at', 'desc');
        }

        return $query->get();
    }

    public function getAdminStats(array $filters = []): array
    {
        $query = HazardLog::query();
        $this->applyFilters($query, $filters);

        $stats = (clone $query)->selectRaw('type, count(*) as total')
            ->groupBy('type')
            ->pluck('total', 'type');

        $areaCounts = (clone $query)->selectRaw('area, count(*) as total')
            ->groupBy('area')
            ->pluck('total', 'area');

        return [
            'stats'      => $stats,
            'areaCounts' => $areaCounts,
        ];
    }

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
            } elseif (in_array($data['type'], ['Traffic Light Red', 'Traffic Light Orange', 'Traffic Light Green'])) {
                $prefix = 'TL-';
            }
        }
        $data['haz_code']    = $prefix . strtoupper(Str::random(6));
        $data['status']      = HazardLog::STATUS_ACTIVE;
        $data['detected_at'] = $data['detected_at'] ?? now();

        if (!empty($data['rider_code'])) {
            $activeTrip = Trip::active()->byRider($data['rider_code'])->first();
            if ($activeTrip) {
                $data['trip_id'] = $activeTrip->id;
            }
        }

        return HazardLog::create($data);
    }

    public function resolve(HazardLog $hazard, int $resolvedBy): bool
    {
        return $hazard->update([
            'status'      => HazardLog::STATUS_RESOLVED,
            'resolved_by' => $resolvedBy,
            'resolved_at' => now(),
        ]);
    }

    public function getRiderLogs(): \Illuminate\Database\Eloquent\Collection
    {
        return HazardLog::orderBy('detected_at', 'desc')
            ->limit(200)
            ->get();
    }

    public function toCsvResponse(array $filters): StreamedResponse
    {
        $logs = $this->getExportLogs($filters);

        return response()->streamDownload(function () use ($logs) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, [
                'Code', 'Type', 'Area', 'Latitude', 'Longitude',
                'Confidence', 'Distance (m)', 'Status', 'Detected At',
            ]);

            foreach ($logs as $log) {
                fputcsv($handle, [
                    $log->haz_code,
                    $log->type,
                    $log->area,
                    $log->latitude,
                    $log->longitude,
                    $log->confidence . '%',
                    $log->distance,
                    $log->status,
                    $log->detected_at ? $log->detected_at->format('Y-m-d H:i:s') : '',
                ]);
            }

            fclose($handle);
        }, 'hazard_logs.csv', ['Content-Type' => 'text/csv']);
    }

    public function toPdfResponse(array $filters)
    {
        $logs = $this->getExportLogs($filters);
        $pdf  = \Barryvdh\DomPDF\Facade\Pdf::loadView('exports.hazards-pdf', ['logs' => $logs]);

        return $pdf->download('hazard_logs.pdf');
    }

    private function resolveArea(float $lat, float $lng): string
    {
        $boxes = [
            'City Proper'   => [[6.900, 6.912], [122.065, 122.082]],
            'Calarian'      => [[6.920, 6.945], [122.020, 122.050]],
            'San Roque'     => [[6.935, 6.950], [122.040, 122.075]],
            'Sta Maria'     => [[6.915, 6.945], [122.060, 122.082]],
            'Tugbungan'     => [[6.908, 6.930], [122.075, 122.100]],
            'Talon-Talon'   => [[6.905, 6.922], [122.093, 122.115]],
            'Pasonanca'     => [[6.940, 6.970], [122.060, 122.085]],
            'Putik'         => [[6.920, 6.950], [122.085, 122.120]],
            'Tumaga'        => [[6.938, 6.958], [122.070, 122.098]],
            'Lunzuran'      => [[6.950, 6.978], [122.090, 122.108]],
            'Baliwasan'     => [[6.910, 6.922], [122.050, 122.070]],
            'San Jose Gusu' => [[6.918, 6.935], [122.040, 122.056]],
        ];

        foreach ($boxes as $area => [$latRange, $lngRange]) {
            if ($lat >= $latRange[0] && $lat <= $latRange[1] &&
                $lng >= $lngRange[0] && $lng <= $lngRange[1]) {
                return $area;
            }
        }

        return 'Unknown';
    }
}
