/* =====================================================================
   Onboarding course engine. You shouldn't need to edit this file —
   all course content lives in content/course.js.
   ===================================================================== */
(function () {
  "use strict";

  const COURSE = window.COURSE;
  const app = document.getElementById("app");
  if (!COURSE) {
    app.innerHTML = '<p style="padding:40px">Could not load <code>content/course.js</code>. Check it for a typo (a missing comma or quote is the usual cause) — your browser\'s developer console will show the line.</p>';
    return;
  }
  const S = COURSE.settings || {};
  document.title = (S.courseTitle || "Onboarding") + " · " + (S.companyName || "");

  /* ---------- Normalize content: ids, numbering, flat lesson list ---------- */
  const modules = (COURSE.modules || []).map((m, mi) => {
    const mod = Object.assign({}, m, { id: m.id || "m" + (mi + 1), index: mi, number: mi + 1 });
    mod.lessons = (m.lessons || []).map((l, li) =>
      Object.assign({ type: "reading" }, l, { id: l.id || `${mod.id}-l${li + 1}`, index: li, module: mod })
    );
    return mod;
  });
  const lessons = modules.flatMap((m) => m.lessons);
  const lessonById = Object.fromEntries(lessons.map((l) => [l.id, l]));
  const moduleById = Object.fromEntries(modules.map((m) => [m.id, m]));

  /* ---------- Progress (saved per browser) ---------- */
  const STORE_KEY = "onboarding-progress:" + (S.courseTitle || "course");
  let progress = { completed: {}, quiz: {}, checklist: {}, last: null };
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
    if (saved) progress = Object.assign(progress, saved);
  } catch (e) { /* storage unavailable — progress lives for this visit only */ }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (e) { /* ignore */ }
  }
  const isDone = (l) => !!progress.completed[l.id];
  function setDone(l, v) { if (v) progress.completed[l.id] = true; else delete progress.completed[l.id]; save(); }
  const pct = (list) => (list.length ? Math.round((list.filter(isDone).length / list.length) * 100) : 0);
  const coursePct = () => pct(lessons);
  const nextLesson = () => lessons.find((l) => !isDone(l)) || null;
  const resumeLesson = () => (progress.last && lessonById[progress.last] && !isDone(lessonById[progress.last]) ? lessonById[progress.last] : nextLesson());

  /* ---------- Helpers ---------- */
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const initials = (n) => String(n || "?").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  function minutes(d) {
    const m = String(d || "").match(/(\d+(?:\.\d+)?)\s*(h|hr|hour|min|m)?/i);
    if (!m) return 0;
    return /^h/i.test(m[2] || "") ? parseFloat(m[1]) * 60 : parseFloat(m[1]);
  }
  function fmtMinutes(total) {
    if (!total) return "";
    if (total < 60) return `${Math.round(total)} min`;
    const h = Math.floor(total / 60), r = Math.round(total % 60);
    return r ? `${h} hr ${r} min` : `${h} hr${h > 1 ? "s" : ""}`;
  }
  const moduleTime = (m) => fmtMinutes(m.lessons.reduce((a, l) => a + minutes(l.duration), 0));
  const TYPE_LABEL = { video: "Video", reading: "Reading", checklist: "Checklist", quiz: "Knowledge check", resource: "Resources" };
  const typeCounts = (m) => {
    const c = {};
    m.lessons.forEach((l) => (c[l.type] = (c[l.type] || 0) + 1));
    return c;
  };
  const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

  /* ---------- Icons ---------- */
  const I = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></svg>',
    checkFill: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor"/><path d="m7.5 12 3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    circle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    back: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>',
    video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="5" width="15" height="14" rx="2"/><path d="m17 10 5-3v10l-5-3"/></svg>',
    reading: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2zM22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/></svg>',
    checklist: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 6 2 2 4-4M3 14l2 2 4-4M13 6h8M13 14h8M13 20h8"/></svg>',
    quiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/></svg>',
    resource: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>'
  };
  const statusIcon = (l) => (isDone(l) ? `<span class="status done" title="Completed">${I.checkFill}</span>` : `<span class="status" title="Not started">${I.circle}</span>`);

  /* ---------- Tiny Markdown renderer ---------- */
  function inline(s) {
    return esc(s)
      .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => `<a href="${u}"${/^https?:/.test(u) ? ' target="_blank" rel="noopener"' : ""}>${t}</a>`)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
  }
  function md(src) {
    if (!src) return "";
    const lines = String(src).replace(/\r/g, "").split("\n");
    // strip common indentation so template literals can be indented in course.js
    const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
    const L = lines.map((l) => l.slice(isFinite(indent) ? indent : 0));
    let out = "", i = 0;
    while (i < L.length) {
      const line = L[i];
      if (!line.trim()) { i++; continue; }
      let m;
      if (/^\s*</.test(line)) { // raw HTML passthrough
        let block = [];
        while (i < L.length && L[i].trim()) block.push(L[i++]);
        out += block.join("\n");
      } else if ((m = line.match(/^(#{1,4})\s+(.*)/))) {
        const lvl = Math.min(m[1].length + 1, 4); // "#" → h2 (the lesson title is the h1)
        out += `<h${lvl}>${inline(m[2])}</h${lvl}>`; i++;
      } else if (/^>\s?/.test(line)) {
        let block = [];
        while (i < L.length && /^>\s?/.test(L[i])) block.push(L[i++].replace(/^>\s?/, ""));
        out += `<blockquote>${md(block.join("\n"))}</blockquote>`;
      } else if (/^\s*[-*]\s+/.test(line)) {
        let items = [];
        while (i < L.length && /^\s*[-*]\s+/.test(L[i])) items.push(L[i++].replace(/^\s*[-*]\s+/, ""));
        out += "<ul>" + items.map((t) => `<li>${inline(t)}</li>`).join("") + "</ul>";
      } else if (/^\s*\d+[.)]\s+/.test(line)) {
        let items = [];
        while (i < L.length && /^\s*\d+[.)]\s+/.test(L[i])) items.push(L[i++].replace(/^\s*\d+[.)]\s+/, ""));
        out += "<ol>" + items.map((t) => `<li>${inline(t)}</li>`).join("") + "</ol>";
      } else if (/^-{3,}\s*$/.test(line)) {
        out += "<hr>"; i++;
      } else {
        let para = [];
        while (i < L.length && L[i].trim() && !/^(#{1,4}\s|>|\s*[-*]\s|\s*\d+[.)]\s|\s*<)/.test(L[i])) para.push(L[i++]);
        if (!para.length) para.push(L[i++]);
        out += `<p>${inline(para.join(" "))}</p>`;
      }
    }
    return out;
  }

  /* ---------- Shared chrome ---------- */
  function logo() {
    return S.logoImage
      ? `<img src="${esc(S.logoImage)}" alt="${esc(S.companyName)}">`
      : esc(S.logoText || S.companyName || "company");
  }
  function header(active) {
    const r = resumeLesson();
    const cta = r ? `<a class="btn btn-primary" href="#/learn/${r.id}">${coursePct() ? "Resume" : "Start onboarding"}</a>` : `<a class="btn btn-primary" href="#/complete">View certificate</a>`;
    return `
    <div class="utility-bar"><div class="container">
      <span>${esc(S.companyName)}</span>
      <a href="#/grades">Grades</a>
      <button type="button" data-help>Help</button>
    </div></div>
    <header class="site-header"><div class="container">
      <a class="logo" href="#/" aria-label="${esc(S.courseTitle)} overview">${logo()}</a>
      <nav class="main-nav" id="main-nav" aria-label="Main">
        <a href="#/" class="${active === "overview" ? "active" : ""}">Overview</a>
        <a href="#/home" class="${active === "home" ? "active" : ""}">Course home</a>
        ${modules.map((m) => `<a href="#/module/${m.id}" class="${active === m.id ? "active" : ""}">Module ${m.number}</a>`).join("")}
        <a href="#/grades" class="${active === "grades" ? "active" : ""}">Grades</a>
      </nav>
      <div class="header-actions">
        <span class="progress-pill">${coursePct()}% complete</span>
        ${cta}
      </div>
      <button class="menu-toggle" type="button" aria-controls="main-nav" aria-expanded="false" data-menu>${I.menu}<span class="sr-only">Menu</span></button>
    </div></header>`;
  }
  function footer() {
    return `
    <footer class="site-footer"><div class="container">
      <div>
        <div class="logo">${logo()}</div>
        <p>${esc(S.tagline)}</p>
      </div>
      <div>
        <h4>Course</h4>
        <ul>
          <li><a href="#/">Overview</a></li>
          <li><a href="#/home">Course home</a></li>
          <li><a href="#/grades">Grades</a></li>
        </ul>
      </div>
      <div>
        <h4>Modules</h4>
        <ul>${modules.map((m) => `<li><a href="#/module/${m.id}">${m.number}. ${esc(m.title)}</a></li>`).join("")}</ul>
      </div>
      <div class="footer-bottom">© ${new Date().getFullYear()} ${esc(S.companyName)} · Internal onboarding — for employees only</div>
    </div></footer>`;
  }
  function helpWidget() {
    const contacts = (S.helpContacts || []).map((c) =>
      `<li><strong>${esc(c.label)}</strong>${c.url ? `<a href="${esc(c.url)}">${esc(c.detail)}</a>` : esc(c.detail)}</li>`).join("");
    return `
    <button class="help-fab" type="button" data-help aria-controls="help-panel" aria-expanded="false">${I.help}${esc(S.helpTitle || "Need help?")}</button>
    <div class="help-panel" id="help-panel" role="dialog" aria-label="${esc(S.helpTitle || "Help")}">
      <h3>${esc(S.helpTitle || "Need help?")}</h3>
      <p class="muted">Reach out any time — no question is too small.</p>
      <ul>${contacts}</ul>
    </div>`;
  }

  /* =====================================================================
     PAGE: Landing / course overview (Coursera course page, Verato style)
     ===================================================================== */
  function pageOverview() {
    const O = COURSE.overview || {};
    const r = resumeLesson();
    const startHref = r ? `#/learn/${r.id}` : "#/complete";
    const totalMin = lessons.reduce((a, l) => a + minutes(l.duration), 0);
    const pathways = COURSE.pathways || [];
    const journey = COURSE.journey || [];
    const team = COURSE.team || [];
    const faq = COURSE.faq || [];

    return `${header("overview")}
    <main id="main">
      <section class="hero on-dark">
        <div class="container hero-grid">
          <div>
            ${S.announcement ? `<a class="announcement" href="${startHref}"><b>New hire</b> – ${esc(S.announcement)} →</a>` : ""}
            <div class="eyebrow">${I.check}${esc(S.companyName)} onboarding</div>
            <h1>${esc(S.courseTitle)}</h1>
            <p class="tagline">${esc(S.tagline)}</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="${startHref}">${coursePct() ? "Resume onboarding" : "Start onboarding"}</a>
              <a class="btn btn-outline-light" href="#/home">Go to course home</a>
            </div>
            <p class="hero-meta"><strong>${plural(modules.length, "module")}</strong> · ${plural(lessons.length, "lesson")}${totalMin ? ` · about ${fmtMinutes(totalMin)} of material` : ""}</p>
          </div>
          <div class="hero-card">
            <h3>Your progress</h3>
            <div class="bar" aria-label="Course progress"><span style="width:${coursePct()}%"></span></div>
            <p style="margin:8px 0 12px;font-size:.9rem;color:rgba(255,255,255,.75)">${coursePct()}% complete</p>
            ${modules.map((m) => `<div class="module-mini"><span>${m.number}. ${esc(m.title)}</span><span>${pct(m.lessons)}%</span></div>`).join("")}
          </div>
        </div>
      </section>

      <div class="container">
        <div class="stats">
          <div class="stat"><div class="value"><a href="#/home" style="color:inherit">${plural(modules.length, "module")}</a></div><div class="label">${plural(lessons.length, "lesson")} in total</div></div>
          <div class="stat"><div class="value">${esc(S.level || "All new hires")}</div><div class="label">No prior experience required</div></div>
          <div class="stat"><div class="value">${esc((S.duration || "Self-paced").split("·")[0].trim())}</div><div class="label">${esc((S.duration || "").split("·")[1] || "Learn at your own pace")}</div></div>
          <div class="stat"><div class="value">${lessons.filter((l) => l.type === "quiz").length} checks</div><div class="label">${esc(S.format || "Short knowledge checks")}</div></div>
        </div>
      </div>

      ${pathways.length ? `
      <section class="section" style="padding-bottom:24px">
        <div class="container">
          <h2 style="font-size:1.6rem">Where do you want to start?</h2>
          <div class="pathways">
            ${pathways.map((p) => {
              const m = modules[(p.module || 1) - 1] || modules[0];
              return `<a class="pathway" href="#/module/${m ? m.id : ""}"><div class="p-title">${I.check}${esc(p.title)}</div><p>${esc(p.description)}</p></a>`;
            }).join("")}
          </div>
        </div>
      </section>` : ""}

      <nav class="section-tabs" aria-label="Sections"><div class="container">
        <button type="button" data-jump="about" class="active">About</button>
        <button type="button" data-jump="modules">Modules</button>
        ${journey.length ? '<button type="button" data-jump="journey">Your journey</button>' : ""}
        ${team.length ? '<button type="button" data-jump="team">Team</button>' : ""}
        ${faq.length ? '<button type="button" data-jump="faq">FAQ</button>' : ""}
      </div></nav>

      <section class="section" id="about">
        <div class="container two-col">
          <div>
            <div class="eyebrow">${I.check}About this course</div>
            <h2>What you'll learn</h2>
            <ul class="learn-list">${(O.whatYoullLearn || []).map((t) => `<li>${I.check}<span>${esc(t)}</span></li>`).join("")}</ul>
            <div class="prose" style="margin-top:32px">${md(O.about)}</div>
          </div>
          <aside>
            <div class="card">
              <h3>Skills you'll gain</h3>
              <div class="chips" style="margin-bottom:24px">${(O.skills || []).map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div>
              <h3>Details to know</h3>
              <ul class="details-list">
                <li><span class="k">Audience</span><span>${esc(S.level)}</span></li>
                <li><span class="k">Timing</span><span>${esc(S.duration)}</span></li>
                <li><span class="k">Format</span><span>${esc(S.format)}</span></li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section class="section section-alt" id="modules">
        <div class="container">
          <div class="section-head">
            <div class="eyebrow">${I.check}Course content</div>
            <h2>There ${modules.length === 1 ? "is 1 module" : `are ${modules.length} modules`} in this course</h2>
          </div>
          <div class="accordion">
            ${modules.map((m, i) => {
              const c = typeCounts(m);
              return `
              <div class="acc-item${i === 0 ? " open" : ""}">
                <button type="button" class="acc-btn" aria-expanded="${i === 0}" aria-controls="acc-${m.id}">
                  <span class="acc-title"><h3>${esc(m.title)}</h3><span class="acc-sub">Module ${m.number}${moduleTime(m) ? ` · ${moduleTime(m)} to complete` : ""} · ${pct(m.lessons)}% complete</span></span>
                  <span class="chev">${I.chev}</span>
                </button>
                <div class="acc-panel" id="acc-${m.id}">
                  <p>${esc(m.description)}</p>
                  <div class="includes">
                    ${Object.keys(c).map((t) => `<span>${I[t] || ""}${plural(c[t], (TYPE_LABEL[t] || t).toLowerCase())}</span>`).join("")}
                  </div>
                  <ul class="item-list">${m.lessons.map(lessonRow).join("")}</ul>
                </div>
              </div>`;
            }).join("")}
          </div>
        </div>
      </section>

      ${journey.length ? `
      <section class="section" id="journey">
        <div class="container">
          <div class="section-head">
            <div class="eyebrow">${I.check}Your onboarding journey</div>
            <h2>What to expect, step by step</h2>
          </div>
          <div class="journey">
            <div class="journey-tabs" role="tablist" aria-label="Journey">
              ${journey.map((j, i) => `<button type="button" role="tab" id="jt-${i}" aria-selected="${i === 0}" aria-controls="jp" class="${i === 0 ? "active" : ""}" data-journey="${i}"><span class="n">${i + 1}.</span>${esc(j.title)}</button>`).join("")}
            </div>
            <div class="journey-panel prose" id="jp" role="tabpanel" aria-labelledby="jt-0">
              <h3>${esc(journey[0].title)}</h3>${md(journey[0].body)}
            </div>
          </div>
        </div>
      </section>` : ""}

      ${team.length ? `
      <section class="section section-alt" id="team">
        <div class="container">
          <div class="section-head">
            <div class="eyebrow">${I.check}People who'll help you</div>
            <h2>Your onboarding team</h2>
          </div>
          <div class="team">
            ${team.map((p) => `
              <div class="card person">
                <div class="avatar">${p.photo ? `<img src="${esc(p.photo)}" alt="">` : initials(p.name)}</div>
                <div><div class="name">${esc(p.name)}</div><div class="role">${esc(p.role)}</div><p>${esc(p.bio)}</p></div>
              </div>`).join("")}
          </div>
        </div>
      </section>` : ""}

      ${faq.length ? `
      <section class="section" id="faq">
        <div class="container" style="max-width:860px">
          <h2>Frequently asked questions</h2>
          <div class="faq">${faq.map((f) => `<details><summary>${esc(f.q)}</summary><div class="answer prose">${md(f.a)}</div></details>`).join("")}</div>
        </div>
      </section>` : ""}

      <section class="cta-band"><div class="container">
        <h2>Ready to get started?</h2>
        <a class="btn btn-primary" href="${startHref}">${coursePct() ? "Resume onboarding" : "Start Module 1"} ${I.arrow}</a>
      </div></section>
    </main>
    ${footer()}${helpWidget()}`;
  }

  function lessonRow(l) {
    return `<li><a href="#/learn/${l.id}">
      ${statusIcon(l)}
      <span class="grow"><span class="i-title">${esc(l.title)}</span><br><span class="i-meta">${TYPE_LABEL[l.type] || l.type}${l.duration ? " · " + esc(l.duration) : ""}</span></span>
      <span class="type-tag">${I[l.type] || ""}${TYPE_LABEL[l.type] || l.type}</span>
    </a></li>`;
  }

  /* =====================================================================
     Learner shell: sidebar + main (Coursera learn view)
     ===================================================================== */
  function sidebar(current) {
    const curMod = current && current.module ? current.module : current;
    return `
    <aside class="sidebar" aria-label="Course navigation">
      <div class="sidebar-head">
        <div class="course-name">${esc(S.courseTitle)}</div>
        <div class="bar"><span style="width:${coursePct()}%"></span></div>
        <div class="pct">${coursePct()}% complete · ${lessons.filter(isDone).length}/${lessons.length} items</div>
      </div>
      <ul class="side-nav">
        <li><a href="#/home" class="${current === "home" ? "active" : ""}">Course home</a></li>
        <li><a href="#/grades" class="${current === "grades" ? "active" : ""}">Grades</a></li>
        <li class="side-label">Course material</li>
        ${modules.map((m) => {
          const open = curMod === m;
          const done = m.lessons.length && m.lessons.every(isDone);
          return `<li>
            <a href="#/module/${m.id}" class="${current === m ? "active" : ""}">Module ${m.number}${done ? `<span class="mod-check">${I.checkFill}</span>` : ""}</a>
            ${open ? `<ul class="side-items">${m.lessons.map((l) => `
              <li><a href="#/learn/${l.id}" class="${current === l ? "active" : ""}">${statusIcon(l)}<span>${esc(l.title)}<span class="meta">${TYPE_LABEL[l.type] || l.type}${l.duration ? " · " + esc(l.duration) : ""}</span></span></a></li>`).join("")}</ul>` : ""}
          </li>`;
        }).join("")}
      </ul>
    </aside>`;
  }
  function learnShell(current, active, inner, bottomBar) {
    return `${header(active)}
    <div class="learn-layout${sidebarCollapsed ? " collapsed" : ""}" id="learn-layout">
      ${sidebar(current)}
      <main class="learn-main" id="main"><div class="inner">
        <div class="toolbar">
          <button class="btn btn-ghost btn-sm" type="button" data-toggle-sidebar>${I.menu}<span class="lbl-desktop">${sidebarCollapsed ? "Show menu" : "Hide menu"}</span><span class="lbl-mobile">Course menu</span></button>
        </div>
        ${inner}
      </div></main>
    </div>
    ${bottomBar || ""}${helpWidget()}`;
  }
  let sidebarCollapsed = false;

  /* ---------- PAGE: Course home ---------- */
  function pageHome() {
    const r = resumeLesson();
    const inner = `
      <div class="crumbs"><a href="#/">Overview</a> / <span>Course home</span></div>
      <div class="resume-card">
        <div>
          <div class="eyebrow">${I.check}${r ? (coursePct() ? "Pick up where you left off" : "Start here") : "All done"}</div>
          <h2>${r ? esc(r.title) : "You've completed onboarding!"}</h2>
          <div class="muted">${r ? `Module ${r.module.number} · ${TYPE_LABEL[r.type]}${r.duration ? " · " + esc(r.duration) : ""}` : "Great work — grab your certificate."}</div>
        </div>
        <a class="btn btn-primary" href="${r ? "#/learn/" + r.id : "#/complete"}">${r ? (coursePct() ? "Resume" : "Start") : "View certificate"} ${I.arrow}</a>
      </div>
      <h2 style="font-size:1.5rem">Course material</h2>
      <div class="module-cards">
        ${modules.map((m) => `
          <a class="module-card" href="#/module/${m.id}">
            <div>
              <div class="m-num">Module ${m.number}${moduleTime(m) ? " · " + moduleTime(m) : ""}</div>
              <h3>${esc(m.title)}</h3>
              <div class="muted">${esc(m.description)}</div>
            </div>
            <div>
              <div class="bar"><span style="width:${pct(m.lessons)}%"></span></div>
              <div class="muted" style="font-size:.85rem;margin-top:6px">${m.lessons.filter(isDone).length}/${m.lessons.length} completed</div>
            </div>
          </a>`).join("")}
      </div>`;
    return learnShell("home", "home", inner);
  }

  /* ---------- PAGE: Module overview ---------- */
  function pageModule(m) {
    if (!m) return pageNotFound();
    const c = typeCounts(m);
    const first = m.lessons.find((l) => !isDone(l)) || m.lessons[0];
    const inner = `
      <div class="crumbs"><a href="#/home">Course home</a> / <span>Module ${m.number}</span></div>
      <div class="eyebrow">${I.check}Module ${m.number}${moduleTime(m) ? " · " + moduleTime(m) + " to complete" : ""}</div>
      <h1 style="font-size:clamp(1.8rem,3vw,2.4rem)">${esc(m.title)}</h1>
      <p class="muted" style="font-size:1.1rem">${esc(m.description)}</p>
      <div class="includes">${Object.keys(c).map((t) => `<span>${I[t] || ""}${plural(c[t], (TYPE_LABEL[t] || t).toLowerCase())}</span>`).join("")}</div>
      ${(m.objectives || []).length ? `
      <div class="card" style="margin:24px 0">
        <h3>Learning objectives</h3>
        <ul class="learn-list" style="grid-template-columns:1fr">${m.objectives.map((o) => `<li>${I.check}<span>${esc(o)}</span></li>`).join("")}</ul>
      </div>` : ""}
      <ul class="item-list" style="margin-bottom:24px">${m.lessons.map(lessonRow).join("")}</ul>
      ${first ? `<a class="btn btn-primary" href="#/learn/${first.id}">${m.lessons.some(isDone) ? "Continue module" : "Start module"} ${I.arrow}</a>` : '<div class="placeholder">This module has no lessons yet. Add some in content/course.js.</div>'}`;
    return learnShell(m, m.id, inner);
  }

  /* ---------- PAGE: Lesson ---------- */
  function videoEmbed(url) {
    if (!url) return `<div class="video"><div><div class="play">${I.play}</div>Video coming soon<br><small>Add a <code>videoUrl</code> in content/course.js</small></div></div>`;
    let m, src = null;
    if ((m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/))) src = `https://www.youtube-nocookie.com/embed/${m[1]}`;
    else if ((m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/))) src = `https://player.vimeo.com/video/${m[1]}`;
    else if ((m = url.match(/loom\.com\/(?:share|embed)\/([\w]+)/))) src = `https://www.loom.com/embed/${m[1]}`;
    else if ((m = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/))) src = `https://drive.google.com/file/d/${m[1]}/preview`;
    if (src) return `<div class="video"><iframe src="${esc(src)}" title="Lesson video" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
    if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) return `<div class="video"><video src="${esc(url)}" controls></video></div>`;
    return `<div class="video"><iframe src="${esc(url)}" title="Lesson video" allowfullscreen></iframe></div>`;
  }
  function bodyOrPlaceholder(body, what) {
    return body && String(body).trim()
      ? `<div class="prose">${md(body)}</div>`
      : `<div class="placeholder">No ${what} yet — add a <code>body</code> for this lesson in content/course.js.</div>`;
  }

  function lessonContent(l) {
    switch (l.type) {
      case "video":
        return videoEmbed(l.videoUrl) + (l.body && l.body.trim() ? `<h2 style="font-size:1.3rem">About this video</h2><div class="prose">${md(l.body)}</div>` : "");
      case "checklist": {
        const state = progress.checklist[l.id] || [];
        const items = l.items || [];
        return (l.body ? `<div class="prose">${md(l.body)}</div>` : "") +
          (items.length
            ? `<ul class="checklist">${items.map((t, i) => `<li><label><input type="checkbox" data-check="${i}" ${state[i] ? "checked" : ""}><span>${inline(t)}</span></label></li>`).join("")}</ul>`
            : '<div class="placeholder">No checklist items yet — add <code>items</code> in content/course.js.</div>');
      }
      case "resource":
        return (l.body ? `<div class="prose">${md(l.body)}</div>` : "") +
          `<div class="resources">${(l.links || []).map((r) => {
            const tag = r.url ? "a" : "div";
            const attrs = r.url ? ` href="${esc(r.url)}" target="_blank" rel="noopener"` : "";
            return `<${tag} class="resource"${attrs}><span class="r-icon">${I.resource}</span><span><span class="r-label">${esc(r.label)}</span><br><span class="r-desc">${esc(r.description || (r.url ? r.url : "Link coming soon"))}</span></span></${tag}>`;
          }).join("") || '<div class="placeholder">No links yet — add <code>links</code> in content/course.js.</div>'}</div>`;
      case "quiz":
        return quizContent(l);
      default:
        return bodyOrPlaceholder(l.body, "reading content");
    }
  }

  function quizContent(l, results) {
    const qs = l.questions || [];
    if (!qs.length) return '<div class="placeholder">No questions yet — add <code>questions</code> in content/course.js.</div>';
    const pass = l.passingScore != null ? l.passingScore : 80;
    const best = progress.quiz[l.id];
    let head = `<p class="muted">${plural(qs.length, "question")} · Passing score ${pass}%${best != null ? ` · Your best: ${best}%` : ""}</p>`;
    if (results) {
      const ok = results.score >= pass;
      head = `<div class="score-card ${ok ? "pass" : "fail"}"><div class="big">${results.score}%</div><div><strong>${ok ? "You passed!" : "Not quite — try again"}</strong><br><span class="muted">${results.correct}/${qs.length} correct · ${pass}% needed to pass</span></div></div>`;
    }
    return head + `<form id="quiz-form">${qs.map((q, qi) => {
      const chosen = results ? results.answers[qi] : null;
      return `<div class="quiz-q"><fieldset>
        <legend>${qi + 1}. ${inline(q.q)}</legend>
        ${(q.options || []).map((o, oi) => {
          let cls = "";
          if (results) { if (oi === q.answer) cls = " correct"; else if (oi === chosen) cls = " wrong"; }
          return `<label class="quiz-opt${cls}"><input type="radio" name="q${qi}" value="${oi}" ${chosen === oi ? "checked" : ""} ${results ? "disabled" : ""} required><span>${inline(o)}</span></label>`;
        }).join("")}
        ${results ? `<div class="feedback ${chosen === q.answer ? "ok" : "bad"}">${chosen === q.answer ? "Correct." : "Incorrect."} ${q.explanation ? esc(q.explanation) : ""}</div>` : ""}
      </fieldset></div>`;
    }).join("")}
    ${results ? '<button type="button" class="btn btn-outline" data-retake>Retake</button>' : '<button type="submit" class="btn btn-primary">Submit answers</button>'}
    </form>`;
  }

  function pageLesson(l) {
    if (!l) return pageNotFound();
    progress.last = l.id; save();
    const idx = lessons.indexOf(l);
    const prev = lessons[idx - 1], next = lessons[idx + 1];
    const inner = `
      <div class="crumbs"><a href="#/home">Course home</a> / <a href="#/module/${l.module.id}">Module ${l.module.number}</a> / <span>${esc(l.title)}</span></div>
      <div class="lesson-head">
        <span class="type-tag">${I[l.type] || ""}${TYPE_LABEL[l.type] || l.type}${l.duration ? " · " + esc(l.duration) : ""}</span>
        <h1>${esc(l.title)}</h1>
      </div>
      <div id="lesson-body">${lessonContent(l)}</div>`;
    const bar = `
    <div class="complete-bar learn-page-bar">
      <div>${prev ? `<a class="btn btn-ghost btn-sm" href="#/learn/${prev.id}">${I.back} Previous</a>` : ""}</div>
      <div class="right">
        ${isDone(l)
          ? `<span class="done-label">${I.checkFill} Completed</span>`
          : l.type === "quiz" ? "" : `<button class="btn btn-outline btn-sm" type="button" data-complete>Mark as completed</button>`}
        ${next
          ? `<a class="btn btn-primary btn-sm" href="#/learn/${next.id}" data-next>Go to next item ${I.arrow}</a>`
          : `<a class="btn btn-primary btn-sm" href="#/complete" data-next>Finish course ${I.arrow}</a>`}
      </div>
    </div>`;
    return learnShell(l, l.module.id, inner, bar);
  }

  /* ---------- PAGE: Grades ---------- */
  function pageGrades() {
    const quizzes = lessons.filter((l) => l.type === "quiz");
    const inner = `
      <div class="crumbs"><a href="#/home">Course home</a> / <span>Grades</span></div>
      <h1 style="font-size:2rem">Grades</h1>
      <p class="muted">Knowledge checks you need to pass to complete onboarding.</p>
      <div class="card" style="padding:0;overflow-x:auto;margin:24px 0">
        <table class="grades">
          <thead><tr><th>Item</th><th>Module</th><th>Status</th><th>Best score</th></tr></thead>
          <tbody>
            ${quizzes.map((q) => {
              const s = progress.quiz[q.id];
              const pass = q.passingScore != null ? q.passingScore : 80;
              const badge = s == null ? '<span class="badge none">Not started</span>' : s >= pass ? '<span class="badge pass">Passed</span>' : '<span class="badge fail">Try again</span>';
              return `<tr><td><a href="#/learn/${q.id}">${esc(q.title)}</a></td><td>Module ${q.module.number}</td><td>${badge}</td><td>${s == null ? "—" : s + "%"}</td></tr>`;
            }).join("") || '<tr><td colspan="4" class="muted">No knowledge checks in this course yet.</td></tr>'}
          </tbody>
        </table>
      </div>
      <div class="card">
        <h3>Overall progress</h3>
        <div class="bar"><span style="width:${coursePct()}%"></span></div>
        <p class="muted" style="margin-top:8px">${lessons.filter(isDone).length} of ${lessons.length} items completed (${coursePct()}%).</p>
        <button class="btn btn-ghost btn-sm" type="button" data-reset>Reset my progress</button>
      </div>`;
    return learnShell("grades", "grades", inner);
  }

  /* ---------- PAGE: Completion ---------- */
  function pageComplete() {
    const done = coursePct() === 100;
    return `${header("")}
    <main id="main" class="section section-alt"><div class="container">
      ${done ? `
      <div class="certificate">
        <div class="eyebrow">${I.check}Certificate of completion</div>
        <h1>${esc(S.courseTitle)}</h1>
        <p style="color:rgba(255,255,255,.8)">You've completed all ${plural(modules.length, "module")} of ${esc(S.companyName)} onboarding. Welcome to the team!</p>
        <p style="color:rgba(255,255,255,.6);font-size:.9rem">${new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</p>
        <button class="btn btn-primary" type="button" onclick="window.print()">Print certificate</button>
      </div>` : `
      <div class="card" style="max-width:720px;margin:0 auto;text-align:center;padding:48px 32px">
        <div class="eyebrow">${I.check}Almost there</div>
        <h1 style="font-size:2rem">You're ${coursePct()}% of the way through</h1>
        <p class="muted">Finish the remaining ${plural(lessons.length - lessons.filter(isDone).length, "item")} to unlock your certificate.</p>
        <a class="btn btn-primary" href="#/learn/${(nextLesson() || lessons[0]).id}">Continue ${I.arrow}</a>
      </div>`}
    </div></main>
    ${footer()}${helpWidget()}`;
  }

  function pageNotFound() {
    return `${header("")}<main id="main" class="section"><div class="container"><h1>Page not found</h1><p><a href="#/">Back to the course overview</a></p></div></main>${footer()}`;
  }

  /* =====================================================================
     Router + event wiring
     ===================================================================== */
  function render() {
    const parts = (location.hash.replace(/^#\/?/, "") || "").split("/");
    let html;
    switch (parts[0]) {
      case "": html = pageOverview(); break;
      case "home": html = pageHome(); break;
      case "module": html = pageModule(moduleById[parts[1]]); break;
      case "learn": html = pageLesson(lessonById[parts[1]]); break;
      case "grades": html = pageGrades(); break;
      case "complete": html = pageComplete(); break;
      default: html = pageNotFound();
    }
    app.innerHTML = html;
    document.body.classList.toggle("learn-page", parts[0] === "learn");
    window.scrollTo(0, 0);
    bind(parts);
  }

  function bind(parts) {
    const $ = (s) => app.querySelector(s);
    const $$ = (s) => Array.from(app.querySelectorAll(s));

    // Mobile menu
    const toggle = $("[data-menu]");
    if (toggle) toggle.addEventListener("click", () => {
      const isLearn = $("#learn-layout");
      if (isLearn && window.matchMedia("(max-width: 820px)").matches) isLearn.classList.toggle("show-menu");
      const open = $("#main-nav").classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });

    // Help widget
    const panel = $("#help-panel");
    $$("[data-help]").forEach((b) => b.addEventListener("click", () => {
      const open = panel.classList.toggle("open");
      $$(".help-fab").forEach((f) => f.setAttribute("aria-expanded", open));
    }));

    // Landing: section tabs
    $$("[data-jump]").forEach((b) => b.addEventListener("click", () => {
      $$("[data-jump]").forEach((x) => x.classList.toggle("active", x === b));
      const target = document.getElementById(b.dataset.jump);
      const offset = (document.querySelector(".site-header")?.offsetHeight || 0) + (document.querySelector(".section-tabs")?.offsetHeight || 0);
      if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset + 1, behavior: "smooth" });
    }));

    // Landing: highlight the section tab for the section in view
    if (scrollSpy) window.removeEventListener("scroll", scrollSpy);
    scrollSpy = null;
    const jumps = $$("[data-jump]");
    if (jumps.length) {
      scrollSpy = () => {
        const line = (document.querySelector(".site-header")?.offsetHeight || 0) + (document.querySelector(".section-tabs")?.offsetHeight || 0) + 40;
        let current = jumps[0];
        jumps.forEach((b) => { const s = document.getElementById(b.dataset.jump); if (s && s.getBoundingClientRect().top <= line) current = b; });
        jumps.forEach((b) => b.classList.toggle("active", b === current));
      };
      window.addEventListener("scroll", scrollSpy, { passive: true });
    }

    // Landing: module accordion
    $$(".acc-btn").forEach((b) => b.addEventListener("click", () => {
      const item = b.closest(".acc-item");
      const open = item.classList.toggle("open");
      b.setAttribute("aria-expanded", open);
    }));

    // Landing: journey tabs
    const journey = COURSE.journey || [];
    $$("[data-journey]").forEach((b) => b.addEventListener("click", () => {
      const j = journey[+b.dataset.journey];
      $$("[data-journey]").forEach((x) => { x.classList.toggle("active", x === b); x.setAttribute("aria-selected", x === b); });
      const p = $("#jp");
      p.setAttribute("aria-labelledby", b.id);
      p.innerHTML = `<h3>${esc(j.title)}</h3>${md(j.body)}`;
    }));

    // Learn: sidebar toggle
    const sb = $("[data-toggle-sidebar]");
    if (sb) sb.addEventListener("click", () => {
      const layout = $("#learn-layout");
      if (window.matchMedia("(max-width: 820px)").matches) { layout.classList.toggle("show-menu"); return; }
      sidebarCollapsed = !sidebarCollapsed;
      layout.classList.toggle("collapsed", sidebarCollapsed);
      sb.querySelector(".lbl-desktop").textContent = sidebarCollapsed ? "Show menu" : "Hide menu";
      const bar = document.querySelector(".complete-bar");
      if (bar) bar.style.left = sidebarCollapsed ? "0" : "";
    });

    if (parts[0] === "learn") bindLesson(lessonById[parts[1]]);

    // Grades: reset
    const reset = $("[data-reset]");
    if (reset) reset.addEventListener("click", () => {
      if (!confirm("Reset all of your onboarding progress on this device?")) return;
      progress = { completed: {}, quiz: {}, checklist: {}, last: null };
      save(); render();
    });
  }

  function bindLesson(l) {
    if (!l) return;
    const $ = (s) => app.querySelector(s);

    const complete = $("[data-complete]");
    if (complete) complete.addEventListener("click", () => { setDone(l, true); render(); });

    // Moving on from a reading/video/resource marks it complete (Coursera behaviour)
    const next = $("[data-next]");
    if (next) next.addEventListener("click", () => {
      if (["reading", "video", "resource"].includes(l.type)) setDone(l, true);
    });

    if (l.type === "checklist") {
      app.querySelectorAll("[data-check]").forEach((cb) => cb.addEventListener("change", () => {
        const state = progress.checklist[l.id] || [];
        state[+cb.dataset.check] = cb.checked;
        progress.checklist[l.id] = state;
        const all = (l.items || []).every((_, i) => state[i]);
        const wasDone = isDone(l);
        setDone(l, all);
        if (all !== wasDone) render();
      }));
    }

    if (l.type === "quiz") wireQuiz(l);
  }

  function wireQuiz(l) {
    const form = app.querySelector("#quiz-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const qs = l.questions || [];
      const answers = qs.map((_, qi) => {
        const c = form.querySelector(`input[name="q${qi}"]:checked`);
        return c ? +c.value : null;
      });
      const correct = qs.filter((q, qi) => answers[qi] === q.answer).length;
      const score = Math.round((correct / qs.length) * 100);
      const pass = l.passingScore != null ? l.passingScore : 80;
      progress.quiz[l.id] = Math.max(progress.quiz[l.id] || 0, score);
      if (score >= pass) setDone(l, true); else save();
      render();
      app.querySelector("#lesson-body").innerHTML = quizContent(l, { answers, correct, score });
      const retake = app.querySelector("[data-retake]");
      retake.addEventListener("click", () => {
        app.querySelector("#lesson-body").innerHTML = quizContent(l);
        wireQuiz(l);
      });
    });
  }

  let scrollSpy = null;
  window.addEventListener("hashchange", render);
  render();
})();
