(function () {
  "use strict";

  var script = document.currentScript;
  var endpoint = script && script.dataset ? script.dataset.endpoint || "" : "";
  var plausibleDomain = script && script.dataset ? script.dataset.plausibleDomain || "formsuite.dev" : "formsuite.dev";
  var plausibleSrc = script && script.dataset ? script.dataset.plausibleSrc || "https://plausible.io/js/script.js" : "https://plausible.io/js/script.js";
  var products = [
    ["formguard", "FormGuard"],
    ["formnotifier", "FormNotifier"],
    ["formcopy", "FormCopy Pro"],
    ["formmerge", "FormMerge Pro"],
    ["docforge", "DocForge"],
    ["formflow", "FormFlow"],
    ["formranger", "FormRanger"],
    ["sheetformula", "Sheet Formula Helper"]
  ];
  var workflowStates = ["not-installed", "testing", "successful"];
  var workflowSteps = ["select-source", "map-question", "preflight", "update-preview"];

  function approvedValue(value, allowed) {
    return allowed.indexOf(value) !== -1 ? value : "";
  }

  function approvedProgress(value) {
    return typeof value === "number" && isFinite(value) && value >= 0 && value <= 4 ? Math.floor(value) : "";
  }

  function approvedComplete(value) {
    return value === true || value === false ? value : "";
  }

  function productFromPath(pathname) {
    var lower = String(pathname || "").toLowerCase();
    for (var i = 0; i < products.length; i += 1) {
      if (lower.indexOf("/" + products[i][0] + "/") !== -1) return products[i][1];
    }
    return "FormSuite";
  }

  function loadPlausible() {
    if (!plausibleDomain || window.__formsuitePlausibleLoaded) return;
    var host = window.location.hostname.toLowerCase();
    var domain = plausibleDomain.toLowerCase();
    if (host !== domain && host !== "www." + domain) return;

    window.__formsuitePlausibleLoaded = true;
    window.plausible = window.plausible || function () {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };

    var existing = document.querySelector('script[data-domain="' + plausibleDomain + '"][src*="plausible"]');
    if (existing) return;

    var tag = document.createElement("script");
    tag.defer = true;
    tag.src = plausibleSrc;
    tag.setAttribute("data-domain", plausibleDomain);
    document.head.appendChild(tag);
  }

  function plausibleProps(payload) {
    return {
      product: payload.product || "",
      page: payload.page || "",
      target_type: payload.target_type || "",
      destination_host: payload.destination_host || "",
      destination_path: payload.destination_path || "",
      utm_source: payload.utm_source || "",
      utm_medium: payload.utm_medium || "",
      utm_campaign: payload.utm_campaign || "",
      utm_content: payload.utm_content || "",
      source_param: payload.source_param || "",
      link_text: payload.link_text || "",
      source: payload.source || "",
      state: payload.state || "",
      step: payload.step || "",
      complete: payload.complete,
      progress_complete: payload.progress_complete,
      confirmation: payload.confirmation || ""
    };
  }

  function productFromUrl(url, text) {
    var haystack = (url.href + " " + (text || "")).toLowerCase();
    if (haystack.indexOf("formguard") !== -1 || haystack.indexOf("-llsuht2fji") !== -1) return "FormGuard";
    if (haystack.indexOf("formnotifier") !== -1 || haystack.indexOf("s-vlyac2cww") !== -1) return "FormNotifier";
    if (haystack.indexOf("formcopy") !== -1 || haystack.indexOf("cnjfgdfl52m") !== -1) return "FormCopy Pro";
    if (haystack.indexOf("formmerge") !== -1 || haystack.indexOf("smin_klpfky") !== -1) return "FormMerge Pro";
    if (haystack.indexOf("docforge") !== -1 || haystack.indexOf("yaecjc42lfg") !== -1) return "DocForge";
    if (haystack.indexOf("formranger") !== -1) return "FormRanger";
    if (haystack.indexOf("formflow") !== -1 || haystack.indexOf("1082615279531") !== -1) return "FormFlow";
    if (haystack.indexOf("sheetformula") !== -1 || haystack.indexOf("sheet formula") !== -1) return "Sheet Formula Helper";
    return productFromPath(window.location.pathname);
  }

  function targetType(url) {
    var host = url.hostname.toLowerCase();
    var path = url.pathname.toLowerCase();
    if (host === "workspace.google.com" && path.indexOf("/marketplace/") !== -1) return "marketplace";
    if (host === "youtu.be" || host.indexOf("youtube.com") !== -1 || host.indexOf("youtube-nocookie.com") !== -1) return "demo_video";
    if (path.indexOf("/resources/google-workspace-add-ons-first-run-checklist") !== -1) return "first_run_checklist";
    if (path.indexOf("/test-google-forms-") !== -1 && path.indexOf("-before-launch") !== -1) return "first_run_checklist";
    if (path.indexOf("/review-after-first-success") !== -1) return "review_after_success";
    if (path.indexOf("/setup-help") !== -1) return "setup_help";
    if (path.indexOf("/support") !== -1) return "support";
    if (path.indexOf("/permissions") !== -1) return "permissions";
    return "";
  }

  function eventName(type) {
    if (type === "marketplace") return "marketplace_cta_click";
    if (type === "demo_video") return "demo_video_click";
    if (type === "first_run_checklist") return "first_run_checklist_click";
    if (type === "review_after_success") return "review_after_success_click";
    if (type === "setup_help") return "setup_help_click";
    if (type === "support") return "support_click";
    if (type === "permissions") return "permissions_click";
    return "";
  }

  function pageViewEvent() {
    var path = window.location.pathname.toLowerCase();
    if (path === "/" || path === "/index.html") {
      return "homepage_view";
    }
    if (path === "/install.html") {
      return "install_center_view";
    }
    if (path === "/choose-google-workspace-addon.html") {
      return "chooser_view";
    }
    if (path === "/sheetformula/" || path === "/sheetformula/index.html" || /^\/sheetformula\/.+\.html$/.test(path)) {
      return "sheetformula_page_view";
    }
    if (/\/(formguard|formnotifier|formcopy|formmerge|docforge|formranger|formflow)\/$/.test(path) || /\/(formguard|formnotifier|formcopy|formmerge|docforge|formranger|formflow)\/index\.html$/.test(path)) {
      return "product_page_view";
    }
    if (/\/(formguard|formnotifier|formcopy|formmerge|docforge|formranger|formflow)\/.+\.html$/.test(path) || path.indexOf("/resources/") !== -1) {
      return "seo_page_view";
    }
    return "";
  }

  function storageGet(storage, key) {
    try {
      return storage ? storage.getItem(key) || "" : "";
    } catch (err) {
      return "";
    }
  }

  function storageSet(storage, key, value) {
    try {
      if (storage) storage.setItem(key, value);
    } catch (err) {}
  }

  function randomId(prefix) {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return prefix + "_" + window.crypto.randomUUID();
    }
    return prefix + "_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 12);
  }

  function getStableId(storage, key, prefix) {
    var existing = storageGet(storage, key);
    if (existing) return existing;
    var value = randomId(prefix);
    storageSet(storage, key, value);
    return value;
  }

  function currentUrlWithoutHash() {
    return window.location.origin + window.location.pathname;
  }

  function attributionFromSearch(search) {
    var output = {
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      utm_content: "",
      utm_term: "",
      source_param: "",
      ref_param: "",
      signin: ""
    };
    var params;
    try {
      params = new URLSearchParams(search || "");
    } catch (err) {
      return output;
    }

    Object.keys(output).forEach(function (key) {
      var paramName = key;
      if (key === "source_param") paramName = "source";
      if (key === "ref_param") paramName = "ref";
      output[key] = (params.get(paramName) || "").slice(0, 160);
    });
    return output;
  }

  function attributionSearch(search) {
    var attribution = attributionFromSearch(search);
    var params = new URLSearchParams();
    Object.keys(attribution).forEach(function (key) {
      if (!attribution[key]) return;
      var paramName = key;
      if (key === "source_param") paramName = "source";
      if (key === "ref_param") paramName = "ref";
      params.set(paramName, attribution[key]);
    });
    return params.toString() ? "?" + params.toString() : "";
  }

  function referrerInfo() {
    if (!document.referrer) {
      return { referrer_host: "", referrer_path: "" };
    }
    try {
      var url = new URL(document.referrer);
      return {
        referrer_host: url.hostname,
        referrer_path: url.pathname
      };
    } catch (err) {
      return { referrer_host: "", referrer_path: "" };
    }
  }

  function getLandingInfo() {
    var key = "formsuite_landing";
    var stored = storageGet(window.sessionStorage, key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (err) {}
    }

    var attribution = attributionFromSearch(window.location.search);
    var referrer = referrerInfo();
    var landing = {
      landing_path: window.location.pathname,
      landing_search: attributionSearch(window.location.search),
      landing_utm_source: attribution.utm_source,
      landing_utm_medium: attribution.utm_medium,
      landing_utm_campaign: attribution.utm_campaign,
      landing_utm_content: attribution.utm_content,
      landing_utm_term: attribution.utm_term,
      landing_referrer_host: referrer.referrer_host,
      landing_referrer_path: referrer.referrer_path
    };
    storageSet(window.sessionStorage, key, JSON.stringify(landing));
    return landing;
  }

  function send(name, data) {
    if (!name) return;
    data = data || {};
    var attribution = attributionFromSearch(window.location.search);
    var referrer = referrerInfo();
    var landing = getLandingInfo();
    var payload = {
      event: name,
      product: data.product || productFromPath(window.location.pathname),
      page: window.location.pathname,
      path: window.location.pathname,
      url: currentUrlWithoutHash(),
      search: attributionSearch(window.location.search),
      referrer_host: referrer.referrer_host,
      referrer_path: referrer.referrer_path,
      visitor_id: getStableId(window.localStorage, "formsuite_visitor_id", "v"),
      session_id: getStableId(window.sessionStorage, "formsuite_session_id", "s"),
      timestamp: new Date().toISOString(),
      timezone_offset_minutes: String(new Date().getTimezoneOffset()),
      utm_source: attribution.utm_source,
      utm_medium: attribution.utm_medium,
      utm_campaign: attribution.utm_campaign,
      utm_content: attribution.utm_content,
      utm_term: attribution.utm_term,
      source_param: attribution.source_param,
      ref_param: attribution.ref_param,
      signin: attribution.signin,
      landing_path: landing.landing_path || "",
      landing_search: landing.landing_search || "",
      landing_utm_source: landing.landing_utm_source || "",
      landing_utm_medium: landing.landing_utm_medium || "",
      landing_utm_campaign: landing.landing_utm_campaign || "",
      landing_utm_content: landing.landing_utm_content || "",
      landing_utm_term: landing.landing_utm_term || "",
      landing_referrer_host: landing.landing_referrer_host || "",
      landing_referrer_path: landing.landing_referrer_path || "",
      target_type: data.target_type || "",
      destination_host: data.destination_host || "",
      destination_path: data.destination_path || "",
      destination_search: data.destination_search || "",
      destination_utm_source: data.destination_utm_source || "",
      destination_utm_medium: data.destination_utm_medium || "",
      destination_utm_campaign: data.destination_utm_campaign || "",
      destination_utm_content: data.destination_utm_content || "",
      destination_utm_term: data.destination_utm_term || "",
      link_text: data.link_text || "",
      source: data.source || "formsuite.dev",
      state: approvedValue(data.state, workflowStates),
      step: approvedValue(data.step, workflowSteps),
      complete: approvedComplete(data.complete),
      progress_complete: approvedProgress(data.progress_complete),
      confirmation: data.confirmation === "Alpha|Beta" ? "Alpha|Beta" : ""
    };

    if (typeof window.gtag === "function") {
      window.gtag("event", name, payload);
    }
    if (typeof window.plausible === "function") {
      window.plausible(name, { props: plausibleProps(payload) });
    }
    if (window.umami && typeof window.umami.track === "function") {
      window.umami.track(name, payload);
    }
    if (endpoint && navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, JSON.stringify(payload));
    } else if (endpoint && typeof window.fetch === "function") {
      window.fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        keepalive: true,
        body: JSON.stringify(payload)
      }).catch(function () {});
    }
  }

  window.FormSuiteTrack = {
    event: function (name, data) {
      send(name, data || {});
    }
  };
  loadPlausible();
  (window.formsuiteTrackQueue || []).forEach(function (queued) {
    if (!queued || !queued.name) return;
    send(queued.name, queued.data || {});
  });
  window.formsuiteTrackQueue = [];

  document.addEventListener("click", function (event) {
    var link = event.target && event.target.closest ? event.target.closest("a[href]") : null;
    if (!link) return;

    var url;
    try {
      url = new URL(link.getAttribute("href"), window.location.href);
    } catch (err) {
      return;
    }

    var type = targetType(url);
    var name = eventName(type);
    if (!name) return;
    var destinationAttribution = attributionFromSearch(url.search);

    send(name, {
      product: productFromUrl(url, link.textContent),
      target_type: type,
      destination_host: url.hostname,
      destination_path: url.pathname,
      destination_search: attributionSearch(url.search),
      destination_utm_source: destinationAttribution.utm_source,
      destination_utm_medium: destinationAttribution.utm_medium,
      destination_utm_campaign: destinationAttribution.utm_campaign,
      destination_utm_content: destinationAttribution.utm_content,
      destination_utm_term: destinationAttribution.utm_term,
      link_text: link.textContent.replace(/\s+/g, " ").trim().slice(0, 120)
    });
  }, { capture: true });

  send(pageViewEvent(), {
    target_type: "page",
    destination_host: window.location.hostname
  });
}());
