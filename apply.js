// The application form: checks the required fields, then sends them to our server (submit_business_application,
// migration 95; the contact role since 98: a closed table the owner reads; at most one notification an hour, a count). If the server can't be
// reached, the same answers can go by email to business@lahgog.app instead (the visitor sends it; nothing else
// is sent). The anon key below is the app's public key (role "anon"): access is decided by that function, not the key.
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var RPC = 'https://utoqxsnszlltpngnrtrk.supabase.co/rest/v1/rpc/submit_business_application';
  var KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0b3F4c25zemxsdHBuZ25ydHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NTcyMzQsImV4cCI6MjEwNzAzMzIzNH0.WUmGt7daEfSfYJrofqFVbpGQH0glI2hovFoyPB2qpic';
  var TO = 'business@lahgog.app';
  var FIELDS = [
    ['kind', 'סוג הפנייה', true], ['category', 'התחום', true], ['business', 'שם העסק', true], ['publicName', 'שם מוכר', false],
    ['link', 'אתר / אינסטגרם', true], ['areas', 'אזורי שירות', false], ['about', 'על העסק', false],
    ['contact', 'איש קשר', true], ['role', 'תפקיד בעסק', true], ['phone', 'טלפון', true], ['email', 'אימייל', true],
    ['entity', 'סוג העסק', false], ['number', 'מספר עוסק / ח.פ.', false],
  ];
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var PHONE = /^[0-9+\-\s]{9,20}$/;
  var sending = false;

  function value(id) { return String($(id).value || '').replace(/\s+/g, ' ').trim(); }
  function fail(message) { $('error').textContent = message; $('error').hidden = false; }
  function show(id) { $('apply').hidden = true; $(id).hidden = false; $(id).focus(); window.scrollTo(0, 0); }

  function answers() {
    var p = { agree: true };
    FIELDS.forEach(function (f) { var v = value(f[0]); if (v) p[f[0]] = v; });
    // The server keeps digits, spaces, + and - only; the number field takes digits.
    p.phone = p.phone.replace(/\s+/g, ' ');
    if (p.number) p.number = p.number.replace(/\D/g, '');
    if (!p.number) delete p.number;
    return p;
  }

  // The email fallback: a ready email in the visitor's mail app, and the same text to copy.
  function byEmail() {
    var lines = ['בקשה להצטרפות ללחגוג לעסקים', ''];
    FIELDS.forEach(function (f) { var v = value(f[0]); if (v) lines.push(f[1] + ': ' + v); });
    lines.push('', 'אישור: מאשרים שתחזרו אלינו בנוגע לבקשה.');
    var body = lines.join('\n');
    var subject = 'בקשה להצטרפות: ' + value('business');
    $('mailText').value = 'אל: ' + TO + '\nנושא: ' + subject + '\n\n' + body;
    $('mailto').href = 'mailto:' + TO + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    show('offline');
  }

  $('apply').addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;
    $('error').hidden = true;
    for (var i = 0; i < FIELDS.length; i++) {
      if (FIELDS[i][2] && !value(FIELDS[i][0])) { $(FIELDS[i][0]).focus(); return fail('חסר: ' + FIELDS[i][1] + '.'); }
    }
    if (!EMAIL.test(value('email'))) { $('email').focus(); return fail('האימייל לא נראה תקין.'); }
    if (!PHONE.test(value('phone'))) { $('phone').focus(); return fail('הטלפון לא נראה תקין.'); }
    if (value('number') && !/^[0-9]{1,12}$/.test(value('number').replace(/\D/g, ''))) { $('number').focus(); return fail('מספר העוסק: ספרות בלבד.'); }
    if (!$('agree').checked) return fail('כדי שנוכל לחזור אליכם, סמנו את האישור.');
    // A field people never see (hidden from screens and screen readers): only scripts fill it.
    if ($('website').value) return show('done');

    sending = true;
    var button = $('send');
    button.disabled = true;
    button.textContent = 'שולחים…';
    fetch(RPC, {
      method: 'POST',
      headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p: answers() }),
    }).then(function (r) {
      if (r.ok) return show('done');
      // 400 (22023): the server found a field it won't take; anything else: the server can't take it now.
      return r.json().catch(function () { return {}; }).then(function (data) {
        if (r.status === 400 && data && data.code === '22023') { fail('אחד הפרטים לא נראה תקין. בדקו את הקישור, הטלפון, האימייל ומספר העוסק.'); return; }
        byEmail();
      });
    }, byEmail).then(function () {
      sending = false;
      button.disabled = false;
      button.textContent = 'לשלוח את הבקשה';
    });
  });

  // Back to the filled form, to send again.
  $('retry').addEventListener('click', function () {
    $('offline').hidden = true;
    $('apply').hidden = false;
    $('send').focus();
  });

  $('copy').addEventListener('click', function () {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText($('mailText').value).then(function () { $('copy').textContent = 'הועתק ✓'; });
  });
})();
