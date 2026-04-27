(function () {
  'use strict';

  /* ── TTS 재생 ──────────────────────────────────────────── */
  function speakWord(text) {
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.85;
    speechSynthesis.speak(u);
  }

  /* ── 🔊 버튼 생성 ─────────────────────────────────────── */
  function createBtn(text) {
    var btn = document.createElement('button');
    btn.className = 'ipa-audio-btn';
    btn.textContent = '\uD83D\uDD0A';
    btn.title = '\uBC1C\uC74C \uB4E3\uAE30: ' + text;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
      speakWord(text);
    });
    return btn;
  }

  /* ── IPA 특수 문자 필터 (영어 단어가 아닌 것 제외) ───── */
  var ipaRe = /[\u0250-\u02BF\u0300-\u036F\u0283\u0292\u026A\u025B\u0254\u0259\u028A\u028C\u0279\u014B\u03B8\u00F0\u02D0\u02C8\u0261\[\]\/]/;

  function isEnglishWord(text) {
    return text.length > 1 && text.length < 30 && !ipaRe.test(text);
  }

  /* ── 중복 방지 ─────────────────────────────────────────── */
  function hasBtn(el) {
    return el.querySelector('.ipa-audio-btn') !== null;
  }

  /* ── 1. .ex-item .word — example-box 영어 단어 ────────── */
  document.querySelectorAll('.ex-item .word').forEach(function (el) {
    if (hasBtn(el.parentElement)) return;
    var text = el.textContent.trim();
    if (isEnglishWord(text)) {
      el.parentElement.appendChild(createBtn(text));
    }
  });

  /* ── 2. table td em — 테이블 내 이탤릭 단어/쌍 (em마다 1버튼) ─────── */
  document.querySelectorAll('table td em').forEach(function (el) {
    if (!el.closest('td')) return;
    // 이미 다음 형제로 버튼이 붙어 있으면 스킵 (중복 방지)
    var next = el.nextElementSibling;
    if (next && next.classList && next.classList.contains('ipa-audio-btn')) return;
    var text = el.textContent.trim();
    if (!text || !isEnglishWord(text.replace(/\s*[\u2013\u2014\u002D]\s*/g, ' '))) return;

    if (/[\u2013\u2014]/.test(text)) {
      // "bite – light" 쌍 → pause 넣어서 읽기
      var spoken = text.replace(/\s*[\u2013\u2014]\s*/g, ' ... ');
      el.after(createBtn(spoken));
    } else if (text.length > 1) {
      el.after(createBtn(text));
    }
  });

  /* ── 3. [data-speak] — 수동 마크업 ────────────────────── */
  document.querySelectorAll('[data-speak]').forEach(function (el) {
    if (hasBtn(el)) return;
    el.appendChild(createBtn(el.dataset.speak));
  });

  /* ── 4. li > em/i — 리스트 내 영어 단어 ────────────────── */
  document.querySelectorAll('li > em, li > i').forEach(function (el) {
    if (el.closest('table')) return;
    var li = el.closest('li');
    if (!li || hasBtn(li)) return;
    var text = el.textContent.trim();
    if (isEnglishWord(text)) {
      el.after(createBtn(text));
    }
  });

  /* ── 5. Practice grid em — 연습 문제 단어 그리드 ────────── */
  document.querySelectorAll('div[style*="grid"] em, div[style*="grid"] i').forEach(function (el) {
    if (el.closest('table')) return;
    var parent = el.parentElement;
    if (hasBtn(parent)) return;
    var text = el.textContent.trim();
    if (isEnglishWord(text)) {
      parent.appendChild(createBtn(text));
    }
  });

  /* ── 6. p/div 인라인 이탤릭 영어 단어 ──────────────────── */
  document.querySelectorAll('p i, .def-box i, .answer-item i').forEach(function (el) {
    if (el.closest('table') || el.closest('li')) return;
    if (hasBtn(el.parentElement)) return;
    var text = el.textContent.trim();
    var clean = text.replace(/[\u2013\u2014]/g, ' ... ');
    if (isEnglishWord(clean) && clean.length < 40) {
      el.after(createBtn(clean));
    }
  });
})();
