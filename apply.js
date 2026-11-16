// The application form: checks the required fields, then opens an email to business@lahgog.app in the visitor's
// mail app with the answers in the body (and shows the same text to copy if no mail app opens). Nothing is sent to a
// server by this page.
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var TO = 'business@lahgog.app';
  var FIELDS = [
    ['kind', 'סוג הפנייה', true], ['category', 'התחום', true], ['business', 'שם העסק', true], ['publicName', 'שם מוכר', false],
    ['link', 'אתר / אינסטגרם', true], ['areas', 'אזורי שירות', false], ['about', 'על העסק', false],
    ['contact', 'איש קשר', true], ['phone', 'טלפון', true], ['email', 'אימייל', true],
    ['entity', 'סוג העסק', false], ['number', 'מספר עוסק / ח.פ.', false],
  ];
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var PHONE = /^[0-9+\-\s]{9,20}$/;

  function value(id) { return String($(id).value || '').replace(/\s+/g, ' ').trim(); }
  function fail(message) { $('error').textContent = message; $('error').hidden = false; }

  $('apply').addEventListener('submit', function (e) {
    e.preventDefault();
    $('error').hidden = true;
    for (var i = 0; i < FIELDS.length; i++) {
      if (FIELDS[i][2] && !value(FIELDS[i][0])) { $(FIELDS[i][0]).focus(); return fail('חסר: ' + FIELDS[i][1] + '.'); }
    }
    if (!EMAIL.test(value('email'))) { $('email').focus(); return fail('האימייל לא נראה תקין.'); }
    if (!PHONE.test(value('phone'))) { $('phone').focus(); return fail('הטלפון לא נראה תקין.'); }
    if (!$('agree').checked) return fail('כדי שנוכל לחזור אליכם, סמנו את האישור.');
    var lines = ['בקשה להצטרפות ללחגוג לעסקים', ''];
    FIELDS.forEach(function (f) { var v = value(f[0]); if (v) lines.push(f[1] + ': ' + v); });
    lines.push('', 'אישור: מאשרים שתחזרו אלינו בנוגע לבקשה.');
    var body = lines.join('\n');
    var subject = 'בקשה להצטרפות: ' + value('business');
    $('mailText').value = 'אל: ' + TO + '\nנושא: ' + subject + '\n\n' + body;
    var mailto = 'mailto:' + TO + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    $('reopen').href = mailto;
    $('apply').hidden = true;
    $('done').hidden = false;
    window.location.href = mailto;
  });
  $('copy').addEventListener('click', function () {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText($('mailText').value).then(function () { $('copy').textContent = 'הועתק ✓'; });
  });
})();
