<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{

    
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    // public function boot(): void
    // {
    //     Vite::prefetch(concurrency: 3);
    // }
    
    public function boot()
    {
        // Paksa HTTPS saat tidak di lokal
        if (env('APP_ENV') !== 'local') {
            \URL::forceScheme('https');
        }
    }
    
}
