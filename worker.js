import formulaApi from './sheetformula/api-formula-worker.js';
import indexabilityApi from './indexability-api-worker.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    const legacyFormFlow = {
      '/formflow-site': '/formflow/',
      '/formflow-site/': '/formflow/',
      '/formflow-site/index.html': '/formflow/',
      '/formflow-site/privacy.html': '/formflow/privacy-policy.html',
      '/formflow-site/privacy-policy.html': '/formflow/privacy-policy.html',
      '/formflow-site/terms.html': '/formflow/terms-of-service.html',
      '/formflow-site/terms-of-service.html': '/formflow/terms-of-service.html'
    };
    if (Object.prototype.hasOwnProperty.call(legacyFormFlow, url.pathname)) {
      return Response.redirect(new URL(legacyFormFlow[url.pathname] + url.search, url.origin).toString(), 301);
    }

    if (url.pathname === '/api/formula') {
      return formulaApi.fetch(request, env, ctx);
    }

    if (url.pathname === '/api/indexability-check') {
      return indexabilityApi.fetch(request, env, ctx);
    }

    if (url.pathname === '/formcopy' || url.pathname.startsWith('/formcopy/')) {
      return Response.redirect(new URL('/', url.origin).toString(), 301);
    }

    return env.ASSETS.fetch(request);
  }
};
