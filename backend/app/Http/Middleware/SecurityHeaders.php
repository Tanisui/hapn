<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Attaches baseline security headers to every response leaving the origin.
 *
 * The static site sets its own headers at the edge (see frontend/public/.htaccess),
 * but this API is a separate origin and cannot rely on them. Cloudflare sits in
 * front of this host, so anything cacheable here is cacheable by a shared cache.
 */
class SecurityHeaders
{
    /**
     * Headers applied to every response regardless of content type.
     *
     * @var array<string, string>
     */
    private const BASELINE = [
        'X-Content-Type-Options' => 'nosniff',
        'X-Frame-Options' => 'DENY',
        'Referrer-Policy' => 'strict-origin-when-cross-origin',
        'Cross-Origin-Opener-Policy' => 'same-origin',
        'Cross-Origin-Resource-Policy' => 'same-site',
        'Permissions-Policy' => 'accelerometer=(), autoplay=(), camera=(), display-capture=(), '
            .'encrypted-media=(), fullscreen=(self), geolocation=(self), gyroscope=(), '
            .'magnetometer=(), microphone=(), midi=(), payment=(), usb=()',
    ];

    /**
     * Headers that leak the server stack. PHP emits X-Powered-By at the SAPI
     * level, so it needs header_remove() as well as a response-bag removal.
     *
     * @var list<string>
     */
    private const FINGERPRINTING = ['X-Powered-By', 'Server'];

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        foreach (self::BASELINE as $header => $value) {
            $response->headers->set($header, $value);
        }

        foreach (self::FINGERPRINTING as $header) {
            $response->headers->remove($header);
        }

        if (! headers_sent()) {
            header_remove('X-Powered-By');
        }

        // Only meaningful over TLS; sending it on plain HTTP hides a misconfigured origin.
        if ($request->secure()) {
            $response->headers->set(
                'Strict-Transport-Security',
                'max-age=31536000; includeSubDomains; preload'
            );
        }

        if ($this->isApiResponse($request)) {
            // This origin serves per-user JSON. Never let Cloudflare or any
            // intermediary hold a copy of it.
            $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
            $response->headers->set('Pragma', 'no-cache');

            // An API origin never needs to load or embed anything.
            $response->headers->set(
                'Content-Security-Policy',
                "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'"
            );
        }

        return $response;
    }

    private function isApiResponse(Request $request): bool
    {
        return $request->is('api/*') || $request->expectsJson();
    }
}
