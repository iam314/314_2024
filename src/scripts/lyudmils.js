// ==============================
// THEME HANDLING
// ==============================
(() => {
  /**
   * --- 1. CONFIGURATION ---
   */
  const STORAGE_KEY = 'iam314_theme_preference';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  /**
   * --- 2. THEME SWITCHER LOGIC ---
   */
  const applyTheme = (isDark) => {
    // All dark styling hangs off html.is-dark (see lyudmils.css), so a single
    // class flips the whole site — no per-element class bookkeeping needed. The
    // same class is set before first paint by the inline script in BaseLayout.
    document.documentElement.classList.toggle('is-dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute('content', isDark ? '#000000' : '#ffffff');

    const btn = document.querySelector('.mode-switch');
    if (btn) btn.setAttribute('aria-pressed', String(isDark));
  };

  const getInitialTheme = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? stored === 'dark' : prefersDark.matches;
  };

  /**
   * --- 3. SOFIA CLOCK LOGIC ---
   */
  const updateSofiaClock = () => {
    const clockElement = document.getElementById('sofia-clock');
    const hoursSpan = document.getElementById('hours');
    const minutesSpan = document.getElementById('minutes');

    if (!clockElement || !hoursSpan || !minutesSpan) return;

    const sofiaTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Sofia',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).formatToParts(new Date());

    const hh = sofiaTime.find(p => p.type === 'hour').value;
    const mm = sofiaTime.find(p => p.type === 'minute').value;

    hoursSpan.textContent = hh;
    minutesSpan.textContent = mm;
    clockElement.setAttribute('datetime', `${hh}:${mm}`);
  };

  /**
   * --- 4. LOTTIE SMART-LOADER (Industrial Version) ---
   */
  const loadLottieIfNeeded = () => {
    const player = document.querySelector('lottie-player');
    
    if (player) {
      if (!document.getElementById('lottie-script')) {
        const script = document.createElement('script');
        script.id = 'lottie-script';
        script.src = "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";
        
        // When the script finishes loading, force the player to play
        script.onload = () => {
          if (player.play) {
            player.play();
          }
        };
        
        document.head.appendChild(script);
      }
    }
  };

  /**
   * --- 5. NAV SCROLL REVEAL ---
   * Hides the fixed nav while scrolling down, brings it back on scroll up.
   * The animation itself is CSS: .nav-content[data-nav='hidden'] in lyudmils.css.
   */
  let navRevealInitialized = false;
  const initNavScrollReveal = () => {
    if (navRevealInitialized) return;
    navRevealInitialized = true;

    const ALWAYS_VISIBLE_ABOVE = 120; // px: never hide while near the top of the page
    const DIRECTION_THRESHOLD = 6;    // px: ignore trackpad jitter / micro-scrolls
    const IDLE_REVEAL_DELAY = 1200;   // ms of no scrolling before the nav comes back
    const BOTTOM_REVEAL_WITHIN = 24;  // px from the end of the page where the nav stays put
    let lastY = window.scrollY;
    let isHidden = false;
    let idleTimer;

    const setHidden = (next) => {
      if (next === isHidden) return;
      isHidden = next;
      // Re-query: client-side navigation replaces the nav element.
      const nav = document.querySelector('.nav-content');
      if (!nav) return;
      if (next) nav.setAttribute('data-nav', 'hidden');
      else nav.removeAttribute('data-nav');
    };

    // Bring the nav back once the page has settled, so it is never gone for good.
    const scheduleIdleReveal = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setHidden(false), IDLE_REVEAL_DELAY);
    };

    // At the end of the page you are looking for a way out, so keep the nav around.
    const isNearBottom = () =>
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - BOTTOM_REVEAL_WITHIN;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;

      scheduleIdleReveal();

      // Bail out without updating lastY so small movements can accumulate.
      if (Math.abs(delta) < DIRECTION_THRESHOLD) return;
      lastY = y;

      // Ordered so the (reflow-flushing) scrollHeight read only happens when we
      // are otherwise about to hide the nav.
      setHidden(delta > 0 && y > ALWAYS_VISIBLE_ABOVE && !isNearBottom());
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // The nav is persisted across client-side navigations, so a hidden state
    // would carry over to the next page. Bring it back on every page load.
    document.addEventListener('astro:page-load', () => {
      isHidden = false;
      const nav = document.querySelector('.nav-content');
      if (nav) nav.removeAttribute('data-nav');
    });
  };

  /**
   * --- 6. EXECUTION ---
   */
  const init = () => {
    // 1. Theme & Clock Re-sync
    applyTheme(getInitialTheme());
    updateSofiaClock();
    setInterval(updateSofiaClock, 60000);

    // 2. Load Lottie only if necessary
    loadLottieIfNeeded();

    // 3. Theme Toggle Click. Delegated to document because the nav is replaced
    // on every client-side navigation, so a listener bound to the button would
    // be lost (and would not exist for the button on later pages).
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!target || !target.closest || !target.closest('.mode-switch')) return;
      const isDark = document.documentElement.classList.contains('is-dark');
      const nextMode = !isDark;
      applyTheme(nextMode);
      localStorage.setItem(STORAGE_KEY, nextMode ? 'dark' : 'light');
    });

    // 4. "Buy" buttons. Delegated for the same reason as the theme toggle, so
    // each product page no longer needs its own copy of this wiring. The chosen
    // variant is read from the page's own <select>, if it has one.
    document.addEventListener('click', (e) => {
      const target = e.target;
      const btn = target && target.closest && target.closest('.buy-now-btn');
      if (!btn || !window.Payhip) return;
      const scope = btn.closest('.productdecription-grid');
      const select = scope ? scope.querySelector('select') : null;
      window.Payhip.Checkout.open({
        product: btn.dataset.product,
        method: 'overlay',
        message: btn.dataset.message,
        title: btn.dataset.title,
        successUrl: 'https://iam314.com/thanks/',
        ...(select ? { targetVariant: select.value } : {}),
      });
    });

    // 5. OS Preference Change
    prefersDark.addEventListener('change', e => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches);
      }
    });

    // 6. Nav hide-on-scroll-down
    initNavScrollReveal();
  };

  /**
   * Client-side navigation (Astro view transitions). This file only executes
   * once, so re-sync the per-page state here. `astro:after-swap` runs right
   * after the new DOM is in place; `astro:page-load` fires once the transition
   * has settled (and on the initial hard load).
   */
  document.addEventListener('astro:after-swap', () => {
    // Swapping <html> attributes drops is-dark, so restore it before paint.
    applyTheme(getInitialTheme());
  });

  document.addEventListener('astro:page-load', () => {
    applyTheme(getInitialTheme());
    updateSofiaClock();
    loadLottieIfNeeded();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();