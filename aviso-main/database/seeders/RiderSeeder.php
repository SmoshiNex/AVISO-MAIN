<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class RiderSeeder extends Seeder
{
    /**
     * Seed mock rider accounts for testing the admin user management panel.
     *
     * All riders share the same password: "password"
     * rider_code used in HazardLogs and Trips matches the username pattern.
     */
    public function run(): void
    {
        $riders = [
            [
                'first_name'     => 'Juan',
                'last_name'      => 'Dela Cruz',
                'username'       => 'rider_juan',
                'email'          => 'juan.delacruz@aviso.com',
                'contact_number' => '09171234001',
                'address'        => 'City Proper, Zamboanga City',
                'password'       => bcrypt('password'),
                'role'           => 'rider',
            ],
            [
                'first_name'     => 'Maria',
                'last_name'      => 'Santos',
                'username'       => 'rider_maria',
                'email'          => 'maria.santos@aviso.com',
                'contact_number' => '09171234002',
                'address'        => 'Calarian, Zamboanga City',
                'password'       => bcrypt('password'),
                'role'           => 'rider',
            ],
            [
                'first_name'     => 'Pedro',
                'last_name'      => 'Reyes',
                'username'       => 'rider_pedro',
                'email'          => 'pedro.reyes@aviso.com',
                'contact_number' => '09171234003',
                'address'        => 'San Roque, Zamboanga City',
                'password'       => bcrypt('password'),
                'role'           => 'rider',
            ],
            [
                'first_name'     => 'Ana',
                'last_name'      => 'Gomez',
                'username'       => 'rider_ana',
                'email'          => 'ana.gomez@aviso.com',
                'contact_number' => '09171234004',
                'address'        => 'Tugbungan, Zamboanga City',
                'password'       => bcrypt('password'),
                'role'           => 'rider',
            ],
            [
                'first_name'     => 'Carlos',
                'last_name'      => 'Fernandez',
                'username'       => 'rider_carlos',
                'email'          => 'carlos.fernandez@aviso.com',
                'contact_number' => '09171234005',
                'address'        => 'Sta Maria, Zamboanga City',
                'password'       => bcrypt('password'),
                'role'           => 'rider',
            ],
        ];

        foreach ($riders as $rider) {
            // Use firstOrCreate so re-running the seeder won't create duplicates
            User::firstOrCreate(
                ['email' => $rider['email']],
                $rider,
            );
        }
    }
}
