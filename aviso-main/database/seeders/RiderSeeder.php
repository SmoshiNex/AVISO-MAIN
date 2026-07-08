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
                'contact_number' => '+639171234001',
                'street'         => 'City Proper',
                'barangay_id'    => '0931700001',
                'city_id'        => '0931700',
                'province_id'    => '09317',
                'region_id'      => '09',
                'password'       => bcrypt('password'),
                'role'           => 'rider',
            ],
            [
                'first_name'     => 'Maria',
                'last_name'      => 'Santos',
                'username'       => 'rider_maria',
                'email'          => 'maria.santos@aviso.com',
                'contact_number' => '+639171234002',
                'street'         => 'Calarian',
                'barangay_id'    => '0931700002',
                'city_id'        => '0931700',
                'province_id'    => '09317',
                'region_id'      => '09',
                'password'       => bcrypt('password'),
                'role'           => 'rider',
            ],
            [
                'first_name'     => 'Pedro',
                'last_name'      => 'Reyes',
                'username'       => 'rider_pedro',
                'email'          => 'pedro.reyes@aviso.com',
                'contact_number' => '+639171234003',
                'street'         => 'San Roque',
                'barangay_id'    => '0931700004',
                'city_id'        => '0931700',
                'province_id'    => '09317',
                'region_id'      => '09',
                'password'       => bcrypt('password'),
                'role'           => 'rider',
            ],
            [
                'first_name'     => 'Ana',
                'last_name'      => 'Gomez',
                'username'       => 'rider_ana',
                'email'          => 'ana.gomez@aviso.com',
                'contact_number' => '+639171234004',
                'street'         => 'Tugbungan',
                'barangay_id'    => '0931700005',
                'city_id'        => '0931700',
                'province_id'    => '09317',
                'region_id'      => '09',
                'password'       => bcrypt('password'),
                'role'           => 'rider',
            ],
            [
                'first_name'     => 'Carlos',
                'last_name'      => 'Fernandez',
                'username'       => 'rider_carlos',
                'email'          => 'carlos.fernandez@aviso.com',
                'contact_number' => '+639171234005',
                'street'         => 'Sta Maria',
                'barangay_id'    => '0931700010',
                'city_id'        => '0931700',
                'province_id'    => '09317',
                'region_id'      => '09',
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
