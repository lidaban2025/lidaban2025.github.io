import formulaApi from './sheetformula/api-formula-worker.js';
import indexabilityApi from './indexability-api-worker.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/formula') {
      return formulaApi.fetch(request, env, ctx);
    }

    if (url.pathname === '/api/indexability-check') {
      return indexabilityApi.fetch(request, env, ctx);
    }

    return env.ASSETS.fetch(request);
  }
};
