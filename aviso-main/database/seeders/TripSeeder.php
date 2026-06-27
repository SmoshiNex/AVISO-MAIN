<?php

namespace Database\Seeders;

use App\Models\Trip;
use Illuminate\Database\Seeder;

class TripSeeder extends Seeder
{
    public function run(): void
    {
        // Trip 1 — City Proper, 2026-06-13
        Trip::updateOrCreate(
            ['rider_code' => 'rider_juan', 'started_at' => '2026-06-13 08:00:00'],
            [
                'start_lat'   => 6.9056400,
                'start_lng'   => 122.0768300,
                'current_lat' => 6.9051300,
                'current_lng' => 122.0765400,
                'end_lat'     => 6.9051300,
                'end_lng'     => 122.0765400,
                'route_points' => [
                    ['lat' => 6.9056400, 'lng' => 122.0768300],
                    ['lat' => 6.9066000, 'lng' => 122.0759300],
                    ['lat' => 6.9073300, 'lng' => 122.0737700],
                    ['lat' => 6.9070100, 'lng' => 122.0719400],
                    ['lat' => 6.9060700, 'lng' => 122.0692200],
                    ['lat' => 6.9063800, 'lng' => 122.0690900],
                    ['lat' => 6.9051300, 'lng' => 122.0765400],
                ],
                'status'     => 'ended',
                'ended_at'   => '2026-06-13 17:30:00',
            ]
        );

        // Trip 2 — Calarian → San Roque, 2026-06-14
        Trip::updateOrCreate(
            ['rider_code' => 'rider_juan', 'started_at' => '2026-06-14 08:00:00'],
            [
                'start_lat'   => 6.9390600,
                'start_lng'   => 122.0433900,
                'current_lat' => 6.9440900,
                'current_lng' => 122.0425800,
                'end_lat'     => 6.9440900,
                'end_lng'     => 122.0425800,
                'route_points' => [
                    ['lat' => 6.9390600, 'lng' => 122.0433900],
                    ['lat' => 6.9360100, 'lng' => 122.0409800],
                    ['lat' => 6.9369800, 'lng' => 122.0365600],
                    ['lat' => 6.9417100, 'lng' => 122.0311200],
                    ['lat' => 6.9360000, 'lng' => 122.0401200],
                    ['lat' => 6.9403700, 'lng' => 122.0477000],
                    ['lat' => 6.9389500, 'lng' => 122.0645400],
                    ['lat' => 6.9421600, 'lng' => 122.0666900],
                    ['lat' => 6.9414200, 'lng' => 122.0714800],
                    ['lat' => 6.9440900, 'lng' => 122.0425800],
                ],
                'status'     => 'ended',
                'ended_at'   => '2026-06-14 09:02:00',
            ]
        );
    }
}
