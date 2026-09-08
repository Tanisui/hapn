<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SecurityHeadersTest extends TestCase
{
    use RefreshDatabase;

    public static function protectedRoutes(): array
    {
        return [
            'web root' => ['/'],
            'api endpoint' => ['/api/categories'],
        ];
    }

    /**
     * @dataProvider protectedRoutes
     */
    public function test_baseline_security_headers_are_present(string $uri): void
    {
        $response = $this->get($uri);

        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('X-Frame-Options', 'DENY');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->assertHeader('Cross-Origin-Opener-Policy', 'same-origin');
        $response->assertHeader('Permissions-Policy');
    }

    /**
     * @dataProvider protectedRoutes
     */
    public function test_server_fingerprinting_headers_are_removed(string $uri): void
    {
        $response = $this->get($uri);

        $response->assertHeaderMissing('X-Powered-By');
        $response->assertHeaderMissing('Server');
    }

    public function test_hsts_is_not_sent_over_plain_http(): void
    {
        // Sending HSTS over http is meaningless and masks a misconfigured origin.
        $this->get('http://localhost/')->assertHeaderMissing('Strict-Transport-Security');
    }

    public function test_hsts_is_sent_over_https(): void
    {
        $response = $this->get('https://localhost/');

        $response->assertHeader(
            'Strict-Transport-Security',
            'max-age=31536000; includeSubDomains; preload'
        );
    }

    public function test_api_responses_are_not_cached_by_shared_caches(): void
    {
        // Cloudflare sits in front of this origin; JSON must never land in a shared cache.
        $response = $this->get('/api/categories');

        $this->assertStringContainsString('no-store', $response->headers->get('Cache-Control'));
    }
}
