(function () {
  'use strict';

  document.querySelectorAll('.answer-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var overlay = document.getElementById(btn.getAttribute('data-target'));
      if (overlay) overlay.style.display = 'flex';
    });
  });

  document.querySelectorAll('.answer-overlay__close').forEach(function (cb) {
    cb.addEventListener('click', function () {
      cb.closest('.answer-overlay').style.display = 'none';
    });
  });

  document.querySelectorAll('.answer-overlay').forEach(function (ov) {
    ov.addEventListener('click', function (e) {
      if (e.target === ov) ov.style.display = 'none';
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var open = document.querySelectorAll('.answer-overlay[style*="flex"]');
      if (open.length) {
        e.stopPropagation();
        open.forEach(function (ov) { ov.style.display = 'none'; });
      }
    }
  }, true);
})();
