<?php     
namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;
use Illuminate\Support\Facades\Log;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        '/payments/callback',
    ];

    protected function shouldSkipCsrfVerification($request)
    {
        $path = '/' . ltrim($request->path(), '/');
        $isExcluded = in_array($path, $this->except);
        Log::info('CSRF Verification Check', [
            'path' => $path,
            'is_excluded' => $isExcluded,
            'except_array' => $this->except,
        ]);
        return $isExcluded;
    }

    // Pastikan method handle() memiliki visibilitas public
    public function handle($request, \Closure $next)
    {
        if ($this->shouldSkipCsrfVerification($request)) {
            Log::info('CSRF Verification Skipped for Request', ['path' => $request->path()]);
            return $next($request);
        }

        Log::info('CSRF Verification Applied for Request', ['path' => $request->path()]);
        return parent::handle($request, $next);
    }
}