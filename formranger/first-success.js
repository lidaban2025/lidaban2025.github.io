(function () {
  "use strict";

  var api = window.FormRangerFirstSuccessState;
  if (!api) return;

  var key = "formsuite.formranger.firstSuccess.v1";
  var state = api.parse(read());

  function read() {
    try {
      return localStorage.getItem(key) || "";
    } catch (err) {
      return "";
    }
  }

  function save() {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {}
  }

  function track(name, data) {
    var payload = Object.assign({ product: "FormRanger" }, data || {});
    if (window.FormSuiteTrack) {
      window.FormSuiteTrack.event(name, payload);
      return;
    }
    window.formsuiteTrackQueue = window.formsuiteTrackQueue || [];
    window.formsuiteTrackQueue.push({ name: name, data: payload });
  }

  var actions = {
    "not-installed": {
      label: "Install FormRanger",
      href: "https://workspace.google.com/marketplace/app/formranger_pro_dynamic_choice_sync/18856558524?utm_source=formsuite&utm_medium=site_cta&utm_campaign=formranger_low_install&utm_content=first_success_state"
    },
    testing: {
      label: "Run the Alpha/Beta copied-form test",
      href: "/formranger/test-google-forms-dynamic-choices-before-launch.html"
    },
    successful: {
      label: "Confirm the public preview",
      href: "/formranger/test-google-forms-dynamic-choices-before-launch.html#preview-success"
    }
  };

  function renderHome(root) {
    root.querySelectorAll("[data-formranger-state]").forEach(function (button) {
      var selected = button.dataset.formrangerState === state.state;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    var action = actions[state.state];
    root.querySelector("[data-formranger-state-action]").innerHTML = '<a class="btn btn-primary" href="' + action.href + '">' + action.label + "</a>";
  }

  document.querySelectorAll("[data-formranger-success-center]").forEach(function (root) {
    var buttons = Array.prototype.slice.call(root.querySelectorAll("[data-formranger-state]"));
    buttons.forEach(function (button, index) {
      button.addEventListener("click", function () {
        state = api.normalize(Object.assign({}, state, { state: button.dataset.formrangerState }));
        save();
        renderHome(root);
        track("formranger_state_select", { state: state.state });
      });
      button.addEventListener("keydown", function (event) {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        var direction = event.key === "ArrowRight" ? 1 : -1;
        var next = buttons[(index + direction + buttons.length) % buttons.length];
        next.focus();
        next.click();
      });
    });
    renderHome(root);
  });

  var workspace = document.querySelector("[data-formranger-first-run]");
  if (!workspace) return;

  var inputs = Array.prototype.slice.call(workspace.querySelectorAll("[data-first-run-step]"));
  var confirm = workspace.querySelector("[data-preview-confirm]");
  var review = workspace.querySelector("[data-review-outcome]");
  var support = workspace.querySelector("[data-support-outcome]");
  var progress = workspace.querySelector("[data-first-run-progress]");

  function renderWorkspace() {
    inputs.forEach(function (input, index) {
      input.checked = state.steps[index];
    });
    confirm.checked = state.previewConfirmed;
    var complete = state.steps.filter(Boolean).length;
    progress.textContent = complete + "/4 complete";
    var unlocked = api.canRequestReview(state);
    review.hidden = !unlocked;
    support.hidden = unlocked;
  }

  inputs.forEach(function (input, index) {
    input.addEventListener("change", function () {
      var steps = state.steps.slice();
      steps[index] = input.checked;
      var nextState = api.canRequestReview({ steps: steps, previewConfirmed: state.previewConfirmed }) ? "successful" : "testing";
      state = api.normalize(Object.assign({}, state, { state: nextState, steps: steps }));
      save();
      renderWorkspace();
      track("formranger_first_run_step", {
        step: input.dataset.firstRunStep,
        complete: input.checked,
        progress_complete: steps.filter(Boolean).length
      });
    });
  });

  confirm.addEventListener("change", function () {
    var unlocked = api.canRequestReview({ steps: state.steps, previewConfirmed: confirm.checked });
    state = api.normalize(Object.assign({}, state, {
      state: unlocked ? "successful" : "testing",
      previewConfirmed: confirm.checked
    }));
    save();
    renderWorkspace();
    if (confirm.checked) {
      track("formranger_public_preview_confirmed", {
        confirmation: "Alpha|Beta",
        progress_complete: state.steps.filter(Boolean).length
      });
    }
  });

  renderWorkspace();
}());
