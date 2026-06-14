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
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'type', 'area', 'status', 'sort', 'per_page']);

        $paginated = $this->hazardLogService->getPaginatedAdminLogs($filters);
        $stats = $this->hazardLogService->getAdminStats();

        return Inertia::render('main/HazardLogs', array_merge([
            'hazards'    => $paginated,
            'filters'    => $filters,
            'types'      => HazardLog::TYPES,
            'areas'      => HazardLog::AREAS,
        ], $stats));
    }
}
