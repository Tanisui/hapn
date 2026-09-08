<?php

use App\Http\Middleware\SecurityHeaders;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Applied to every response, including error responses rendered by the
        // exception handler.
        $middleware->append(SecurityHeaders::class);

        // Laravel 12 does not rate limit the api group by default.
        $middleware->api(prepend: [
            'throttle:api',
        ]);

        // Cloudflare fronts this origin, so REMOTE_ADDR is always a Cloudflare
        // edge IP. Without this, every visitor shares one throttle bucket and
        // the app cannot tell HTTPS from HTTP.
        $middleware->trustProxies(
            at: '*',
            headers: Request::HEADER_X_FORWARDED_FOR
                | Request::HEADER_X_FORWARDED_HOST
                | Request::HEADER_X_FORWARDED_PORT
                | Request::HEADER_X_FORWARDED_PROTO
        );
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
