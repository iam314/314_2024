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
    const method = isDark ? 'add' : 'remove';
    document.documentElement.classList.toggle('is-dark', isDark);

    const targets = {
      '.body-light': 'is-dark',
      '.nav-links': 'nav-links-dark',
      '.logo': 'logo-dark',
      '.subtxt': 'subtxt-dark',
      '.subtxtgray': 'subtxtgray-dark',
      '.contact-link': 'contact-link-dark',
      '.p-link-tt': 'p-link-tt-dark',
      '.work-wrap': 'work-wrap-dark',
      '.projects-grid': 'projects-grid-dark',
      '.product-wrapper': 'product-wrapper-dark',
      '.product-links': 'product-links-dark',
      '.add-btn': 'add-btn-dark',
      '.buy-btn': 'buy-btn-dark',
      '.swiper-wrapper': 'swiper-wrapper-dark',
      '.formkit-submit': 'formkit-submit-dark',
      '.formkit-input': 'formkit-input-dark',
      '.flipped': 'flipped-dark'
    };

    Object.entries(targets).forEach(([selector, className]) => {
      document.querySelectorAll(selector).forEach(el => el.classList[method](className));
    });

    const btn = document.querySelector('.mode-switch');
    if (btn) btn.setAttribute('aria-pressed', isDark);
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
   * --- 5. EXECUTION ---
   */
  
  // A. Run Theme & Clock immediately
  applyTheme(getInitialTheme());
  updateSofiaClock();

  // B. Lifecycle Hooks
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme & Clock Re-sync
    applyTheme(getInitialTheme());
    updateSofiaClock();
    setInterval(updateSofiaClock, 60000);

    // 2. Load Lottie only if necessary
    loadLottieIfNeeded();

    // 3. Theme Toggle Click
    const themeSwitcher = document.querySelector('.mode-switch');
    if (themeSwitcher) {
      themeSwitcher.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('is-dark');
        const nextMode = !isDark;
        applyTheme(nextMode);
        localStorage.setItem(STORAGE_KEY, nextMode ? 'dark' : 'light');
      });
    }

    // 4. OS Preference Change
    prefersDark.addEventListener('change', e => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches);
      }
    });
  });
})();