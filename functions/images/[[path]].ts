// Pages Function: serve existing assets through the ASSETS binding; return a real
// 404 only for missing assets. A Function matching /images/* must NOT unconditionally
// return 404, because it can intercept valid restaurant images.
type AssetContext = {
  request: Request;
  env: { ASSETS: { fetch(request: Request): Promise<Response> } };
};

export const onRequest = async ({ request, env }: AssetContext): Promise<Response> => {
  const asset = await env.ASSETS.fetch(request);
  const contentType = (asset.headers.get('Content-Type') || '').toLowerCase();
  // SPA fallback may return index.html as a 200 for an unknown asset URL.
  if (asset.ok && !contentType.includes('text/html')) return asset;

  return new Response('Asset not found', {
    status: 404,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
