<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HazardLog;
use App\Services\HazardLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HazardLogsController extends Controller
{
    protected $hazardLogService;

    public function __construct(HazardLogService $hazardLogService)
    {
        $this->hazardLogService = $hazardLogService;
    }

    /**
     * Display the paginated, filterable Hazard Logs page.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'type', 'area', 'status', 'sort', 'per_page']);

        if ($request->input('export') === 'csv') {
            $logs = $this->hazardLogService->getExportLogs($filters);
            
            $headers = [
                "Content-type"        => "text/csv",
                "Content-Disposition" => "attachment; filename=hazard_logs.csv",
                "Pragma"              => "no-cache",
                "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
                "Expires"             => "0"
            ];
            
            $callback = function() use ($logs) {
                $file = fopen('php://output', 'w');
                fputcsv($file, ['Code', 'Type', 'Area', 'Latitude', 'Longitude', 'Confidence', 'Distance (m)', 'Status', 'Detected At']);
                
                foreach ($logs as $log) {
                    fputcsv($file, [
                        $log->haz_code,
                        $log->type,
                        $log->area,
                        $log->latitude,
                        $log->longitude,
                        $log->confidence . '%',
                        $log->distance,
                        $log->status,
                        $log->detected_at ? $log->detected_at->format('Y-m-d H:i:s') : ''
                    ]);
                }
                fclose($file);
            };
            
            return response()->stream($callback, 200, $headers);
        }

        if ($request->input('export') === 'pdf') {
            $logs = $this->hazardLogService->getExportLogs($filters);
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('exports.hazards-pdf', ['logs' => $logs]);
            return $pdf->download('hazard_logs.pdf');
        }

        $paginated = $this->hazardLogService->getPaginatedAdminLogs($filters);
        $stats = $this->hazardLogService->getAdminStats($filters);

        return Inertia::render('main/HazardLogs', array_merge([
            'hazards'    => $paginated,
            'filters'    => $filters,
            'types'      => HazardLog::TYPES,
            'areas'      => HazardLog::AREAS,
        ], $stats));
    }
}
