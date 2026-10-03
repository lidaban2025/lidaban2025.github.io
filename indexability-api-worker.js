// Stub: the original indexability API worker file was lost (never committed).
// No site page references /api/indexability-check; this keeps the route defined
// in worker.js harmless until the tool is rebuilt.
export default {
  async fetch() {
    return new Response(JSON.stringify({ error: 'endpoint retired' }), {
      status: 404,
      headers: { 'content-type': 'application/json' },
    });
  },
};
