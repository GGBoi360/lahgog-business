# lahgog.com: "לחגוג לעסקים" (R87, stage A)

A static site for businesses, kept apart from the app's site (`../site/`, lahgog.app). Built 2026-11-16 by the
website session. Decisions and their sources: `docs/website/DECISIONS.md` ("Business list and labelling (R87)");
research: `docs/website/research/vendor-site.md` (§5.3 is the plan this follows).

- **Pages:** `/` (round 2, 2026-11-17: hero "הלקוחות הבאים שלכם כבר מתכננים" with the real planner screenshot and
  its "להזמין הפעלה" to-do marked; who it's for, every events field with entertainers and workshops opening first; how
  the vendor list will work, with the one thing that exists today marked; how to join; what a business gets later;
  the founding-partner terms; FAQ), `/apply` (the application, ten fields), `/verification` (what the free "עסק מאומת"
  mark checks and means), `/privacy` (this site's own policy; the app's is lahgog.app/privacy), `404.html`.
- **Top bar and footer** come from `../site/tools/chrome.mjs` (the same script as lahgog.app; `chrome.css` is a
  copy of `../site/chrome.css`). Edit them there, run it, and run `--check` before publishing.
- **The screenshot's highlight** (`.biz-shot .spot` in `biz.css`) is placed in pixels for a 280 px phone; replacing
  `shots/plan-card.webp` means measuring the to-do's row again.
- **Owner's decisions it follows (2026-11-12):** first categories kids' birthday entertainers and workshops; the mark is
  free and means only that the business exists and the applicant represents it; no payment system, so nothing here
  sells anything. Never: fake counters, logos of businesses that didn't agree, dates promised for "later" items.
- **The application goes to our server** (since migration 95, owner 2026-11-17): `apply.js` checks the fields and
  calls `submit_business_application` with the app's public anon key. The rows are in `public.business_applications`
  (closed to every client; the owner reads and updates `status`, `notes`, `left_at` in the Supabase dashboard). Caps
  answer like a success (30 an hour site-wide, one a day per phone or email); a hidden field that only scripts fill
  stops the page before sending. The owner gets at most one push an hour, a count only. If the server can't be
  reached (or the migration isn't live yet), the page offers a ready email to `business@lahgog.app` with a copy
  fallback, so that address must keep forwarding (Porkbun) to the owner's mailbox; the privacy page names Supabase,
  Porkbun and Google for that reason. Retention (12 months, monthly purge) is in the migration and `privacy.html`.
- **Email copy (migration 096):** each new row wakes the `email-business-application` Edge Function, which emails it
  in full to `business@lahgog.app` through Resend (from `noreply@lahgog.app`, reply goes to the applicant). Needs the
  Edge Function secret `RESEND_API_KEY` and the domain lahgog.app verified in Resend (DNS at Porkbun: DKIM TXT
  `resend._domainkey`, CNAMEs `send` and `rsend`, DMARC). A failed send is written to the row's `email_error`.
- **Handling an application (owner):** dashboard → Table editor → `business_applications`; set `status` as it moves
  (`contacted`, `verifying`, `accepted`, `rejected`, `withdrawn`). An accepted business that leaves the list gets
  `left_at`, which starts its 12 months. A request to delete is a plain row delete.
- **Showing applications anywhere (security review, bdays-bd 2026-11-17):** names, the description and the link are
  stored as the applicant typed them. Any page that ever shows them (a dashboard, the future vendor list) inserts them
  as text (`textContent`, never `innerHTML`), and renders the link only as an `http(s)` href (add `https://` to a bare
  domain). The server already refuses links with another scheme (`javascript:`, `data:`), and the per-contact daily
  cap compares phones by digits with +972 as 0.
- **Shared look:** `landing.css`, `fonts/` and the icons are copies from `../site/`; `biz.css` adds this site's parts.
  After a change to `../site/landing.css` that matters here, copy it again.
- **Publishing:** this folder is the source of truth; the public repo **GGBoi360/lahgog-business** (GitHub Pages,
  branch `main`, root, custom domain `lahgog.com` via `CNAME`) only mirrors it, like `site/` and GGBoi360/lahgog-site.
  To publish: copy this folder's files over a clone of that repo, commit, push.
- **DNS (Porkbun, owner):** the apex `lahgog.com` A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
  `185.199.111.153` and AAAA `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`,
  `2606:50c0:8003::153`; `www` CNAME `ggboi360.github.io`. Then "Enforce HTTPS" in the repo's Pages settings.
