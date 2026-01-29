/**
 * Cloudflare Pages Function - SECURE IP LOGGER
 * Path: /functions/api/log.js
 */

export async function onRequestPost(context) {
    const { request, env } = context;

    // 1. Get Google Sheet URL from Cloudflare Environment Variables (HIDDEN FROM PUBLIC)
    const googleUrl = env.GOOGLE_SHEET_URL;

    if (!googleUrl) {
        return new Response('Config Missing', { status: 500 });
    }

    try {
        // 2. Grab visitor info natively from Cloudflare headers (PRIVACY-FIRST)
        // No 3rd party service needed.
        const ip = request.headers.get('cf-connecting-ip') || 'Unknown';
        const city = request.cf?.city || 'Unknown';
        const country = request.cf?.country || 'Unknown';
        const userAgent = request.headers.get('user-agent') || 'Unknown';
        const path = new URL(request.url).searchParams.get('p') || 'Unknown';

        // 3. Forward to Google Sheets
        // We do this server-to-server so the visitor NEVER sees the target URL.
        const response = await fetch(googleUrl, {
            method: 'POST',
            body: JSON.stringify({
                // We can add a secret here too if we want, but since this code is private,
                // simple forwarding is already 100x more secure.
                ip,
                city,
                country,
                userAgent,
                path
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return new Response('OK', { status: 200 });

    } catch (err) {
        return new Response('Logging Failed', { status: 500 });
    }
}
