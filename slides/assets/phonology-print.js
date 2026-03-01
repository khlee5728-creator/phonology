/**
 * phonology-print.js
 * Applied English Phonology — PDF 저장 버튼 & 안내 오버레이
 *
 * 기능:
 *   1. 슬라이드 우상단에 "💾 PDF" 버튼 주입
 *   2. 클릭 시 ?print-pdf 파라미터로 새 탭 열기
 *   3. ?print-pdf URL 감지 시 Reveal 렌더링 완료 후 안내 오버레이 표시
 *      - 우상단 ✕ 닫기 버튼: 즉시 탭 닫기
 *      - "PDF 저장 시작" 버튼: window.print() 호출
 *      - afterprint 이벤트 감지: 완료 메시지 표시 후 800ms 뒤 탭 자동 닫기
 */
(function () {
  'use strict';

  // ── 1. PDF 버튼 생성 & 삽입 ──────────────────────────────────────
  var btn = document.createElement('button');
  btn.className = 'pdf-btn';
  btn.title = 'PDF로 저장';
  btn.innerHTML = '&#128190;&#8239;PDF';   // 💾 PDF

  btn.addEventListener('click', function () {
    var base = location.href.split('?')[0].split('#')[0];
    window.open(base + '?print-pdf', '_blank');
  });

  document.body.appendChild(btn);

  // ── 2. ?print-pdf 감지 → 안내 오버레이 표시 ─────────────────────
  if (location.search.indexOf('print-pdf') !== -1) {
    setTimeout(function () {
      // OS별 단축키 감지
      var isMac = /Mac|iPhone|iPad|iPod/.test(
        (navigator.platform || '') + ' ' + navigator.userAgent
      );
      var key = isMac ? '\u2318 Cmd+P' : 'Ctrl+P';

      var overlay = document.createElement('div');
      overlay.className = 'print-overlay';
      overlay.innerHTML =
        '<div class="print-overlay__box">' +
          '<button class="print-overlay__close" title="\ub2eb\uae30">&#10005;</button>' +
          '<div class="print-overlay__icon">&#128196;</div>' +
          '<h2 class="print-overlay__title">PDF \uc800\uc7a5 \uc900\ube44 \uc644\ub8cc</h2>' +
          '<p class="print-overlay__sub">' +
            '\uc2ac\ub77c\uc774\ub4dc \uc804\uccb4\uac00 PDF \ud615\uc2dd\uc73c\ub85c \ub80c\ub354\ub9c1\ub418\uc5c8\uc2b5\ub2c8\ub2e4.' +
          '</p>' +
          '<ol class="print-overlay__steps">' +
            '<li>\uc544\ub798 \ubc84\ud2bc\uc744 \ud074\ub9ad\ud558\uac70\ub098 ' +
              '<kbd>' + key + '</kbd> \ub97c \ub204\ub974\uc138\uc694</li>' +
            '<li>\uc778\uc1c4 \ub2e4\uc774\uc5bc\ub85c\uadf8\uc5d0\uc11c ' +
              '<strong>&ldquo;\ub300\uc0c1 / \ud504\ub9b0\ud130&rdquo;</strong> ' +
              '\ud56d\ubaa9\uc744 \ud074\ub9ad\ud558\uc138\uc694</li>' +
            '<li><strong>&ldquo;PDF\ub85c \uc800\uc7a5&rdquo;</strong> ' +
              '\uc744 \uc120\ud0dd\ud558\uace0 \uc800\uc7a5\ud558\uc138\uc694</li>' +
          '</ol>' +
          '<button class="print-overlay__btn">&#128229;&thinsp;PDF \uc800\uc7a5 \uc2dc\uc791</button>' +
        '</div>';

      document.body.appendChild(overlay);

      // ✕ 닫기 버튼: 즉시 탭 닫기
      overlay.querySelector('.print-overlay__close').addEventListener('click', function () {
        window.close();
      });

      // PDF 저장 시작 버튼
      overlay.querySelector('.print-overlay__btn').addEventListener('click', function () {
        // afterprint: 인쇄 다이얼로그가 닫히면 발생 (저장·취소 모두)
        window.addEventListener('afterprint', function onAfterPrint() {
          window.removeEventListener('afterprint', onAfterPrint);

          // 완료 상태로 박스 내용 교체
          var box = overlay.querySelector('.print-overlay__box');
          box.innerHTML =
            '<div class="print-overlay__icon" style="color:#2d6a4f; font-size:2.2em;">&#10003;</div>' +
            '<h2 class="print-overlay__title">\uc644\ub8cc</h2>' +
            '<p class="print-overlay__sub">\ud0ed\uc744 \ub2eb\uc2b5\ub2c8\ub2e4...</p>';

          // 800ms 후 탭 닫기 → 원래 슬라이드 탭으로 자동 복귀
          setTimeout(function () { window.close(); }, 800);
        });

        window.print();
      });

    }, 1500);
  }
})();
