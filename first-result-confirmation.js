(function () {
  'use strict';
  document.querySelectorAll('[data-result-confirmation]').forEach(function (section) {
    var button = section.querySelector('button');
    var checks = Array.prototype.slice.call(section.querySelectorAll('input[type="checkbox"]'));
    var status = section.querySelector('[role="status"]');
    section.addEventListener('change', function () {
      button.disabled = !checks.every(function (input) { return input.checked; });
    });
    button.addEventListener('click', function () {
      if (!checks.every(function (input) { return input.checked; })) return;
      var data = { product: section.getAttribute('data-product'), source: 'self_reported_copied_form_test' };
      var name = section.getAttribute('data-result-confirmation');
      if (window.FormSuiteTrack) window.FormSuiteTrack.event(name, data);
      else (window.formsuiteTrackQueue = window.formsuiteTrackQueue || []).push({name:name,data:data});
      button.disabled = true;
      button.hidden = true;
      status.textContent = 'Your self-reported result is noted. This is not an independent product verification or a payment record.';
    });
  });
})();
