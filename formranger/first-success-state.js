(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.FormRangerFirstSuccessState = api;
}(typeof window !== "undefined" ? window : null, function () {
  "use strict";

  var VERSION = 1;
  var STATES = ["not-installed", "testing", "successful"];

  function normalize(input) {
    input = input && typeof input === "object" ? input : {};
    var currentState = STATES.indexOf(input.state) !== -1 ? input.state : "not-installed";
    var steps = Array.isArray(input.steps) ? input.steps.slice(0, 4).map(Boolean) : [];
    while (steps.length < 4) steps.push(false);
    return {
      version: VERSION,
      state: currentState,
      steps: steps,
      previewConfirmed: input.previewConfirmed === true
    };
  }

  function parse(raw) {
    try {
      return normalize(JSON.parse(raw || "{}"));
    } catch (err) {
      return normalize({});
    }
  }

  function canRequestReview(input) {
    var state = normalize(input);
    return state.previewConfirmed && state.steps.every(Boolean);
  }

  return { VERSION: VERSION, normalize: normalize, parse: parse, canRequestReview: canRequestReview };
}));
