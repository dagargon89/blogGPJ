<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(RoleSeeder::class);

        $user = User::firstOrCreate(
            ['email' => 'dgarcia@planjuarez.org'],
            [
                'name' => 'D. García',
                'password' => Hash::make(env('ADMIN_SEED_PASSWORD', 'change-me')),
                'email_verified_at' => now(),
            ]
        );

        $user->assignRole('admin');
    }
}
