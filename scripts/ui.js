/* UI rendering, role gating, local metrics, modals, live refresh, debug. */
window.SS = {
  session: null,
  usersRoleMap: {}, // optional from users.csv
  sponsors: [],
  events: [],
  enrollments: [],
  metrics: { clicks: {}, revenue: {} },
  refreshInterval: null
};

const UI = (() => {
  const qs = sel => document.querySelector(sel);
  const qsa = sel => Array.from(document.querySelectorAll(sel));

  const setDarkToggle = () => {
    const btn = qs("#darkToggle");
    if (!btn) return;
    const apply = (on) => document.documentElement.classList.toggle("dark", on);
    const stored = localStorage.getItem("SS_DARK") === "1";
    apply(stored);
    btn.addEventListener("click", () => {
      const now = !(localStorage.getItem("SS_DARK") === "1");
      localStorage.setItem("SS_DARK", now ? "1" : "0");
      apply(now);
    });
  };

  const stickyNav = () => {
    const nav = qs("nav");
    if (!nav) return;
    window.addEventListener("scroll", () => {
      if (window.scrollY > 8) nav.classList.add("nav-sticky-shadow");
      else nav.classList.remove("nav-sticky-shadow");
    });
  };

  const renderSession = () => {
    const s = window.SS.session;
    const el = qs("#userInfo");
    const signBtn = qs("#signBtn");
    const signOutBtn = qs("#signOutBtn");

    if (!el || !signBtn || !signOutBtn) return;
    if (s) {
      el.innerHTML = `
        <div class="flex items-center gap-3">
          <img src="${s.photo || ''}" class="w-8 h-8 rounded-full" alt="">
          <div class="text-sm">
            <div class="font-medium">${s.name || s.email}</div>
            <div class="text-gray-500 dark:text-gray-400">${s.role}</div>
          </div>
        </div>`;
      signBtn.classList.add("hidden");
      signOutBtn.classList.remove("hidden");
    } else {
      el.innerHTML = `<div class="text-sm text-gray-500">Guest</div>`;
      signBtn.classList.remove("hidden");
      signOutBtn.classList.add("hidden");
    }
  };

  const roleGate = () => {
    const role = window.SS.session?.role || "Guest";
    qsa("[data-role='Founder']").forEach(el => {
      el.classList.toggle("hidden", role !== "Founder");
    });
    qsa("[data-role='Manager']").forEach(el => {
      el.classList.toggle("hidden", !["Founder","Manager"].includes(role));
    });
  };

  const renderSponsors = () => {
    const container = qs("#sponsorGrid");
    if (!container) return;
    const sponsors = window.SS.sponsors;

    container.innerHTML = sponsors.map((s, i) => `
      <a href="${s.url || '#'}" target="_blank"
         class="group rounded-lg bg-white dark:bg-gray-800 p-4 shadow hover-scale-105 transition-all animate-fadeInUp"
         style="animation-delay:${i*60}ms"
         data-id="${s.id}">
        <div class="flex items-center justify-center">
          <img src="${s.logo}" alt="${s.name}" class="h-16 w-auto group-hover:animate-pulse" />
        </div>
        <div class="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">${s.name}</div>
        <div class="mt-1 text-center text-xs text-gray-400">
          Clicks: <span class="click-count" data-id="${s.id}">${getClicks(s.id)}</span>
        </div>
      </a>
    `).join("");

    // Click tracking
    qsa("#sponsorGrid a").forEach(a => {
      a.addEventListener("click", () => {
        const id = a.getAttribute("data-id");
        incrementClick(id);
        const countEl = container.querySelector(`.click-count[data-id="${id}"]`);
        if (countEl) {
          countEl.textContent = getClicks(id);
          countEl.classList.add("animate-bounce");
          setTimeout(() => countEl.classList.remove("animate-bounce"), 600);
        }
      });
    });
  };

  // Local click metrics
  const getClicks = (id) => {
    const raw = localStorage.getItem("SS_CLICKS");
    const obj = raw ? JSON.parse(raw) : {};
    return obj[id] || 0;
  };
  const incrementClick = (id) => {
    const raw = localStorage.getItem("SS_CLICKS");
    const obj = raw ? JSON.parse(raw) : {};
    obj[id] = (obj[id] || 0) + 1;
    localStorage.setItem("SS_CLICKS", JSON.stringify(obj));
  };

  const renderEvents = () => {
    const container = qs("#eventsList");
    if (!container) return;
    const events = window.SS.events;
    container.innerHTML = events.map(e => `
      <div class="card rounded-lg bg-white dark:bg-gray-800 p-4 shadow animate-slideUp">
        <div class="flex items-center justify-between">
          <div class="text-lg font-semibold">${e.title}</div>
          <div class="text-sm text-gray-500">${e.date}</div>
        </div>
        <p class="mt-2 text-gray-600 dark:text-gray-300">${e.description}</p>
        <div class="mt-2 text-sm text-gray-500">Fee: ${e.fee}</div>
      </div>
    `).join("");
  };

  const liveRefresh = () => {
    if (window.SS.refreshInterval) clearInterval(window.SS.refreshInterval);
    window.SS.refreshInterval = setInterval(async () => {
      const sponsors = await Sheets.get("sponsors");
      window.SS.sponsors = sponsors;
      renderSponsors();
    }, 8000);
  };

  const loadUsersRoleMap = async () => {
    try {
      const users = await Sheets.get("users");
      window.SS.usersRoleMap = {};
      users.forEach(u => { window.SS.usersRoleMap[u.email] = u.role; });
    } catch {}
  };

  const debugConsole = () => {
    console.log("SS ready:", window.SS);
  };

  return { setDarkToggle, stickyNav, renderSession, roleGate, renderSponsors, renderEvents, liveRefresh, loadUsersRoleMap, debugConsole };
})();
