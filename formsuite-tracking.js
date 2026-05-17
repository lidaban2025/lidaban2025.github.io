(function () {
  "use strict";

  var script = document.currentScript;
  var endpoint = script && script.dataset ? script.dataset.endpoint || "" : "";
  var products = [
    ["formguard", "FormGuard"],
    ["formnotifier", "FormNotifier"],
    ["formcopy", "FormCopy Pro"],
    ["formmerge", "FormMerge Pro"],
    ["docforge", "DocForge"],
    ["formflow", "FormFlow"],
    ["formranger", "FormRanger"]
  ];

  function productFromPath(pathname) {
    var lower = String(pathname || "").toLowerCase();
    for (var i = 0; i < products.length; i += 1) {
      if (lower.indexOf("/" + products[i][0] + "/") !== -1) return products[i][1];
    }
    return "FormSuite";
  }

  function productFromUrl(url, text) {
    var haystack = (url.href + " " + (text || "")).toLowerCase();
    if (haystack.indexOf("formguard") !== -1 || haystack.indexOf("-llsuht2fji") !== -1) return "FormGuard";
    if (haystack.indexOf("formnotifier") !== -1 || haystack.indexOf("s-vlyac2cww") !== -1) return "FormNotifier";
    if (haystack.indexOf("formcopy") !== -1 || haystack.indexOf("cnjfgdfl52m") !== -1) return "FormCopy Pro";
    if (haystack.indexOf("formmerge") !== -1 || haystack.indexOf("smin_klpfky") !== -1) return "FormMerge Pro";
    if (haystack.indexOf("docforge") !== -1 || haystack.indexOf("yaecjc42lfg") !== -1) return "DocForge";
    return productFromPath(window.location.pathname);
  }

  function targetType(url) {
    var host = url.hostname.toLowerCase();
    var path = url.pathname.toLowerCase();
    if (host === "workspace.google.com" && path.indexOf("/marketplace/") !== -1) return "marketplace";
    if (host === "youtu.be" || host.indexOf("youtube.com") !== -1 || host.indexOf("youtube-nocookie.com") !== -1) return "demo_video";
    if (path.indexOf("/setup-help") !== -1) return "setup_help";
    if (path.indexOf("/support") !== -1) return "support";
    if (path.indexOf("/permissions") !== -1) return "permissions";
    return "";
  }

  function eventName(type) {
    if (type === "marketplace") return "marketplace_cta_click";
    if (type === "demo_video") return "demo_video_click";
    if (type === "setup_help") return "setup_help_click";
    if (type === "support") return "support_click";
    if (type === "permissions") return "permissions_click";
    return "";
  }

  function pageViewEvent() {
    var path = window.location.pathname.toLowerCase();
    if (/\/(formguard|formnotifier|formcopy|formmerge|docforge)\/$/.test(path) || /\/(formguard|formnotifier|formcopy|formmerge|docforge)\/index\.html$/.test(path)) {
      return "product_page_view";
    }
    if (/\/(formguard|formnotifier|formcopy|formmerge|docforge)\/.+\.html$/.test(path) || path.indexOf("/resources/") !== -1) {
      return "seo_page_view";
    }
    return "";
  }

  function send(name, data) {
    if (!name) return;
    var payload = {
      event: name,
      product: data.product || productFromPath(window.location.pathname),
      page: window.location.pathname,
      target_type: data.target_type || "",
      destination_host: data.destination_host || "",
      link_text: data.link_text || "",
      source: "formsuite.dev"
    };

    if (typeof window.gtag === "function") {
      window.gtag("event", name, payload);
    }
    if (typeof window.plausible === "function") {
      window.plausible(name, { props: payload });
    }
    if (window.umami && typeof window.umami.track === "function") {
      window.umami.track(name, payload);
    }
    if (endpoint && navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, JSON.stringify(payload));
    }
  }

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

    send(name, {
      product: productFromUrl(url, link.textContent),
      target_type: type,
      destination_host: url.hostname,
      link_text: link.textContent.replace(/\s+/g, " ").trim().slice(0, 120)
    });
  }, { capture: true });

  send(pageViewEvent(), {
    target_type: "page",
    destination_host: window.location.hostname
  });
}());
