(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* 1. KramaIsland-Style Live Notch Toast */
  const notchToast = document.getElementById('notch-toast');
  const notchToastText = document.getElementById('notch-toast-text');
  let toastTimer = null;

  const showNotchToast = (message) => {
    if (!notchToast || !notchToastText) return;
    notchToastText.textContent = message;
    notchToast.classList.add('is-shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      notchToast.classList.remove('is-shown');
    }, 2800);
  };

  document.querySelectorAll('[data-download-track]').forEach((el) => {
    el.addEventListener('click', () => {
      showNotchToast('Downloading KramaIsland.dmg (v1.4.0 · 3.3 MB) — see Install below');
    });
  });

  /* 2. Reading Progress Bar, Floating Nav Elevation & Active Scroll-Spy */
  const progressBar = document.getElementById('scroll-progress-bar');
  const navPill = document.getElementById('nav-pill');
  const spyLinks = Array.from(document.querySelectorAll('.nav-links a[data-spy]'));
  const spySections = spyLinks
    .map((link) => ({ link, el: document.getElementById(link.dataset.spy) }))
    .filter((item) => item.el);

  const syncScrollUI = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar && docHeight > 0) {
      const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      progressBar.style.width = `${pct}%`;
    }
    if (navPill) navPill.classList.toggle('is-scrolled', scrollTop > 24);

    if (spySections.length) {
      const probe = scrollTop + 180;
      let current = null;
      for (const item of spySections) {
        if (item.el.offsetTop <= probe) current = item.link;
      }
      spyLinks.forEach((link) => link.classList.toggle('is-current', link === current));
    }
  };

  syncScrollUI();
  window.addEventListener('scroll', syncScrollUI, { passive: true });

  /* 3. Mobile Navigation Drawer */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    const closeMobileMenu = () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.hidden = true;
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      mobileMenu.hidden = isOpen;
    });

    mobileMenu.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        closeMobileMenu();
        menuToggle.focus();
      }
    });
  }

  /* 4. Cursor-Tracking Spotlight Rim Effect on Cards + Interactive Hero Headline Tilt/Sheen */
  if (finePointer && !prefersReducedMotion) {
    document.querySelectorAll('.spotlight-card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });
    });

    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
      heroTitle.addEventListener('pointermove', (e) => {
        const rect = heroTitle.getBoundingClientRect();
        const xPct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        heroTitle.classList.add('is-tracking');
        heroTitle.style.setProperty('--hx', `${xPct}%`);
      });
      heroTitle.addEventListener('pointerleave', () => {
        heroTitle.classList.remove('is-tracking');
      });
    }
  }

  /* 5. Progressive Subtle Scroll Reveal */
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-reveal');
    const targets = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    targets.forEach((el, idx) => {
      el.style.transitionDelay = `${(idx % 4) * 40}ms`;
      io.observe(el);
    });
  }

  /* 6. Live Menu Bar Clock in Hero Stage */
  const clockEl = document.getElementById('live-menubar-clock');
  if (clockEl) {
    const updateClock = () => {
      const now = new Date();
      const day = now.toLocaleDateString('en-US', { weekday: 'short' });
      const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      clockEl.textContent = `${day} ${time}`;
    };
    updateClock();
    setInterval(updateClock, 30000);
  }

  /* 7. Interactive Dynamic Island Stage: States + MacBook/External Display Mode + Wallpapers */
  const STATES = {
    shade: {
      img: 'assets/shade.png',
      alt: 'KramaIsland Full Shade: clock, quick toggles, running timer, calendar meeting with Join button, Now Playing, file shelf, and clipboard history',
      caption: '<strong>Full Shade</strong> — Quick toggles, Pomodoro timer, next meeting with Join button, Now Playing, File Shelf &amp; Clipboard History.'
    },
    hover: {
      img: 'assets/hover.png',
      alt: 'KramaIsland Hover Glance: clock, Focus pill, battery, unread bell, timer, upcoming calendar meeting, Now Playing, and latest message',
      caption: '<strong>Hover Glance</strong> — Instant 120 fps readout for clock, Focus, battery, unread count, active timer, next event, and media.'
    },
    compact: {
      img: 'assets/compact.png',
      alt: 'KramaIsland Compact Ears: album art on the left ear and animated level bars on the right ear',
      caption: '<strong>Compact Ears</strong> — Balanced 34 pt ears beside the notch display live album artwork, level bars, or countdown rings.'
    },
    volume: {
      img: null,
      alt: '',
      caption: '<strong>CoreAudio Volume HUD</strong> — Native macOS OSD replacement via CGEventTap. Drag the slider, switch outputs, or click mute.'
    },
    activity: {
      img: 'assets/activity.png',
      alt: 'KramaIsland Live Activity showing AirPods Pro connected with Left, Right, and Case battery levels',
      caption: '<strong>Live Activity</strong> — AirPods L/R/Case battery, charger plug/unplug, downloads progress rings, and Shortcuts custom activities.'
    },
    banner: {
      img: 'assets/banner.png',
      alt: 'KramaIsland Banner showing a Messages notification dropping out of the notch',
      caption: '<strong>Banner Takeover</strong> — Notifications drop cleanly from the notch with automatic 2FA OTP Copy and native banner takeover.'
    },
    launcher: {
      img: 'assets/launcher.png',
      alt: 'KramaIsland ⌥ Space Launcher converting 5 km to mi instantly',
      caption: '<strong>⌥ Space Launcher</strong> — Fuzzy app search, Spotlight files, recursive calculator, unit conversions, clipboard search, and quick actions.'
    }
  };

  const stateTabs = Array.from(document.querySelectorAll('.state-tab'));
  const islandMount = document.getElementById('island-mount');
  const imageFrame = document.getElementById('island-image-frame');
  const previewImg = document.getElementById('island-preview-img');
  const volumeDemo = document.getElementById('volume-hud-demo');
  const stageCaption = document.getElementById('stage-caption');
  const macbookBezel = document.getElementById('island-stage-panel');

  const activateState = (key) => {
    const config = STATES[key];
    if (!config || !islandMount) return;

    stateTabs.forEach((tab) => {
      const selected = tab.dataset.state === key;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });

    islandMount.className = `island-mount state-${key}`;

    if (key === 'volume') {
      if (imageFrame) imageFrame.hidden = true;
      if (volumeDemo) volumeDemo.hidden = false;
    } else {
      if (volumeDemo) volumeDemo.hidden = true;
      if (imageFrame) imageFrame.hidden = false;
      if (previewImg && config.img) {
        previewImg.src = config.img;
        previewImg.alt = config.alt;
      }
    }

    if (stageCaption) stageCaption.innerHTML = config.caption;
  };

  stateTabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => activateState(tab.dataset.state));
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const nextIdx = e.key === 'ArrowRight'
          ? (idx + 1) % stateTabs.length
          : (idx - 1 + stateTabs.length) % stateTabs.length;
        stateTabs[nextIdx].focus();
        activateState(stateTabs[nextIdx].dataset.state);
      }
    });
  });

  /* MacBook Notch vs External Display Mode Toggle */
  const modePills = Array.from(document.querySelectorAll('[data-display-mode]'));
  modePills.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.displayMode;
      modePills.forEach((b) => b.classList.toggle('is-active', b === btn));
      if (macbookBezel) {
        macbookBezel.classList.toggle('mode-external', mode === 'external');
      }
      showNotchToast(mode === 'external' ? 'Previewing External Display Floating Pill Mode' : 'Previewing Notched MacBook Flush Bezel Mode');
    });
  });

  /* Wallpaper Picker */
  const macbookScreen = document.getElementById('macbook-screen');
  const wpSwatches = Array.from(document.querySelectorAll('.wp-swatch'));
  wpSwatches.forEach((swatch) => {
    swatch.addEventListener('click', () => {
      const wp = swatch.dataset.wp;
      if (!macbookScreen || !wp) return;
      macbookScreen.classList.remove('wp-aurora', 'wp-sonoma', 'wp-titanium');
      macbookScreen.classList.add(`wp-${wp}`);
      wpSwatches.forEach((s) => s.classList.toggle('is-active', s === swatch));
    });
  });

  /* 8. Interactive CoreAudio Volume HUD Demo */
  const volumeRange = document.getElementById('volume-demo-range');
  const volumePercent = document.getElementById('volume-percent');
  const volumeMuteBtn = document.getElementById('volume-mute-btn');
  const volumeIconSvg = document.getElementById('volume-icon-svg');
  const volumeHudPill = document.getElementById('volume-hud-pill');
  const volumeDeviceName = document.getElementById('volume-device-name');
  const volDevChips = Array.from(document.querySelectorAll('.vol-dev-chip'));
  let lastNonZeroVolume = 68;

  const triggerBounce = () => {
    if (!volumeHudPill || prefersReducedMotion) return;
    volumeHudPill.classList.add('is-bouncing');
    setTimeout(() => volumeHudPill.classList.remove('is-bouncing'), 170);
  };

  const renderVolumeUI = (val) => {
    const clamped = Math.max(0, Math.min(100, Number(val)));
    if (volumeRange) {
      volumeRange.value = String(clamped);
      volumeRange.style.background = `linear-gradient(90deg, #ffffff ${clamped}%, rgba(255, 255, 255, 0.16) ${clamped}%)`;
    }
    if (volumePercent) volumePercent.textContent = clamped === 0 ? 'Muted' : `${clamped}%`;
    if (volumeMuteBtn) {
      volumeMuteBtn.classList.toggle('is-muted', clamped === 0);
      volumeMuteBtn.setAttribute('aria-pressed', String(clamped === 0));
    }
    if (volumeIconSvg) {
      if (clamped === 0) {
        volumeIconSvg.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>';
      } else if (clamped < 45) {
        volumeIconSvg.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>';
      } else {
        volumeIconSvg.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>';
      }
    }
    if (clamped === 0 || clamped === 100) triggerBounce();
  };

  if (volumeRange) {
    volumeRange.addEventListener('input', (e) => {
      const val = Number(e.target.value);
      if (val > 0) lastNonZeroVolume = val;
      renderVolumeUI(val);
    });
  }

  if (volumeMuteBtn) {
    volumeMuteBtn.addEventListener('click', () => {
      const current = volumeRange ? Number(volumeRange.value) : 0;
      if (current > 0) {
        lastNonZeroVolume = current;
        renderVolumeUI(0);
      } else {
        renderVolumeUI(lastNonZeroVolume || 65);
      }
    });
  }

  volDevChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      volDevChips.forEach((c) => c.classList.toggle('is-active', c === chip));
      if (volumeDeviceName && chip.dataset.device) {
        volumeDeviceName.textContent = chip.dataset.device;
      }
      triggerBounce();
    });
  });

  renderVolumeUI(68);

  /* Quiet Mode Mini Toggle Demo */
  const quietDemoToggle = document.getElementById('quiet-demo-toggle');
  if (quietDemoToggle) {
    quietDemoToggle.addEventListener('click', () => {
      const active = quietDemoToggle.getAttribute('aria-pressed') === 'true';
      quietDemoToggle.setAttribute('aria-pressed', String(!active));
      quietDemoToggle.textContent = !active ? 'Quiet: On' : 'Quiet: Off';
      showNotchToast(!active ? 'Quiet Mode ON — Popups silenced, alerts still collect in Shade' : 'Quiet Mode OFF — Live HUDs & banners active');
    });
  }

  /* 9. Interactive Custom Project Grid (Rows x Columns) */
  const snapScreen = document.getElementById('snap-screen');
  const snapBadge = document.getElementById('snap-grid-badge');
  const rowsVal = document.getElementById('rows-val');
  const colsVal = document.getElementById('cols-val');
  const rowsDec = document.getElementById('rows-dec');
  const rowsInc = document.getElementById('rows-inc');
  const colsDec = document.getElementById('cols-dec');
  const colsInc = document.getElementById('cols-inc');
  const presetBtns = Array.from(document.querySelectorAll('.preset-btn'));
  const gapBtns = Array.from(document.querySelectorAll('.gap-btn'));

  const SAMPLE_APPS = [
    'Xcode', 'Terminal', 'Safari', 'Notes',
    'Figma', 'Music', 'Finder', 'Simulator',
    'Calendar', 'Slack', 'Mail', 'Preview',
    'Linear', 'Docs', 'Activity', 'Console'
  ];

  let gridRows = 2;
  let gridCols = 2;
  let gridGap = 6;
  let selectedCell = 0;

  const renderSnapGrid = () => {
    if (!snapScreen) return;
    snapScreen.style.setProperty('--grid-rows', String(gridRows));
    snapScreen.style.setProperty('--grid-cols', String(gridCols));
    snapScreen.style.setProperty('--grid-gap', `${gridGap}px`);

    if (rowsVal) rowsVal.textContent = String(gridRows);
    if (colsVal) colsVal.textContent = String(gridCols);
    if (rowsDec) rowsDec.disabled = gridRows <= 1;
    if (rowsInc) rowsInc.disabled = gridRows >= 4;
    if (colsDec) colsDec.disabled = gridCols <= 1;
    if (colsInc) colsInc.disabled = gridCols >= 4;
    if (snapBadge) snapBadge.textContent = `${gridRows}×${gridCols} Grid · ${gridGap} pt gap · ⌃⌥G`;

    presetBtns.forEach((btn) => {
      const match = Number(btn.dataset.rows) === gridRows && Number(btn.dataset.cols) === gridCols;
      btn.classList.toggle('is-active', match);
    });

    const total = gridRows * gridCols;
    if (selectedCell >= total) selectedCell = 0;

    snapScreen.innerHTML = '';
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const idx = r * gridCols + c;
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = `snap-cell${idx === selectedCell ? ' is-selected' : ''}`;
        cell.setAttribute('aria-label', `Snap window to Row ${r + 1}, Column ${c + 1}`);
        const labelSpan = document.createElement('span');
        labelSpan.textContent = `R${r + 1}·C${c + 1}`;
        const appSmall = document.createElement('small');
        appSmall.textContent = SAMPLE_APPS[idx % SAMPLE_APPS.length];
        cell.append(labelSpan, appSmall);
        cell.addEventListener('click', () => {
          selectedCell = idx;
          renderSnapGrid();
        });
        snapScreen.appendChild(cell);
      }
    }
  };

  if (rowsDec) rowsDec.addEventListener('click', () => { if (gridRows > 1) { gridRows--; renderSnapGrid(); } });
  if (rowsInc) rowsInc.addEventListener('click', () => { if (gridRows < 4) { gridRows++; renderSnapGrid(); } });
  if (colsDec) colsDec.addEventListener('click', () => { if (gridCols > 1) { gridCols--; renderSnapGrid(); } });
  if (colsInc) colsInc.addEventListener('click', () => { if (gridCols < 4) { gridCols++; renderSnapGrid(); } });

  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      gridRows = Number(btn.dataset.rows);
      gridCols = Number(btn.dataset.cols);
      renderSnapGrid();
    });
  });

  gapBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      gridGap = Number(btn.dataset.gap);
      gapBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      renderSnapGrid();
    });
  });

  renderSnapGrid();

  /* 10. Filterable Keyboard Shortcuts */
  const scFilters = Array.from(document.querySelectorAll('[data-sc-filter]'));
  const scRows = Array.from(document.querySelectorAll('.shortcut-row[data-sc-cat]'));

  scFilters.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.scFilter;
      scFilters.forEach((b) => b.classList.toggle('is-active', b === btn));
      scRows.forEach((row) => {
        row.hidden = cat !== 'all' && row.dataset.scCat !== cat;
      });
    });
  });

  /* 11. Interactive Screenshot Lightbox Viewer */
  const LIGHTBOX_ITEMS = [
    { src: 'assets/compact.png', title: 'Compact Ears', desc: 'Balanced 34 pt notch ears with album artwork and live audio level bars.' },
    { src: 'assets/activity.png', title: 'Live Activity HUD', desc: 'AirPods Pro connection HUD showing Left, Right, and Case battery percentages.' },
    { src: 'assets/banner.png', title: 'Banner Takeover', desc: 'Messages banner dropping smoothly from the notch while dismissing duplicate system alerts.' },
    { src: 'assets/hover.png', title: '120 fps Hover Glance', desc: 'Instant hover view with clock, Focus pill, battery, unread bell, timer, calendar, and Now Playing.' },
    { src: 'assets/launcher.png', title: '⌥ Space Launcher', desc: 'Fuzzy app search, Spotlight files, recursive calculator, and unit conversion (5 km to mi).' }
  ];

  const lbBackdrop = document.getElementById('lightbox-backdrop');
  const lbImg = document.getElementById('lightbox-img');
  const lbTitle = document.getElementById('lightbox-title');
  const lbDesc = document.getElementById('lightbox-desc');
  const lbCounter = document.getElementById('lightbox-counter');
  const lbPrev = document.getElementById('lightbox-prev');
  const lbNext = document.getElementById('lightbox-next');
  const lbClose = document.getElementById('lightbox-close');
  let lbIndex = 0;
  let lbLastFocus = null;

  const renderLightbox = () => {
    const item = LIGHTBOX_ITEMS[lbIndex];
    if (!item) return;
    if (lbImg) { lbImg.src = item.src; lbImg.alt = `${item.title}: ${item.desc}`; }
    if (lbTitle) lbTitle.textContent = item.title;
    if (lbDesc) lbDesc.textContent = item.desc;
    if (lbCounter) lbCounter.textContent = `${lbIndex + 1} / ${LIGHTBOX_ITEMS.length}`;
  };

  const openLightbox = (idx) => {
    if (!lbBackdrop) return;
    lbLastFocus = document.activeElement;
    lbIndex = idx;
    renderLightbox();
    lbBackdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose?.focus();
  };

  const closeLightbox = () => {
    if (!lbBackdrop) return;
    lbBackdrop.hidden = true;
    document.body.style.overflow = '';
    if (lbLastFocus && typeof lbLastFocus.focus === 'function') lbLastFocus.focus();
  };

  document.querySelectorAll('[data-lightbox]').forEach((btn) => {
    btn.addEventListener('click', () => openLightbox(Number(btn.dataset.lightbox)));
  });

  if (lbPrev) lbPrev.addEventListener('click', () => { lbIndex = (lbIndex - 1 + LIGHTBOX_ITEMS.length) % LIGHTBOX_ITEMS.length; renderLightbox(); });
  if (lbNext) lbNext.addEventListener('click', () => { lbIndex = (lbIndex + 1) % LIGHTBOX_ITEMS.length; renderLightbox(); });
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbBackdrop) {
    lbBackdrop.addEventListener('click', (e) => { if (e.target === lbBackdrop) closeLightbox(); });
  }

  /* 12. Gatekeeper Version Tabs */
  const gkTabs = Array.from(document.querySelectorAll('.gk-tab'));
  const gkPanels = {
    sequoia: document.getElementById('gk-panel-sequoia'),
    sonoma: document.getElementById('gk-panel-sonoma'),
    terminal: document.getElementById('gk-panel-terminal')
  };

  gkTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.gk;
      gkTabs.forEach((t) => {
        const active = t.dataset.gk === target;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      Object.entries(gkPanels).forEach(([key, panel]) => {
        if (panel) panel.hidden = key !== target;
      });
    });
  });

  /* 13. Copy-to-Clipboard Utility + Buttons */
  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  };

  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      if (!text) return;
      await copyText(text);
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('is-copied');
      showNotchToast(btn.dataset.toast || 'Copied to clipboard');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('is-copied');
      }, 1800);
    });
  });

  /* 14. Interactive KramaIsland Mini-Launcher Modal (⌘K) with Live Math & Unit Engine */
  const cmdBackdrop = document.getElementById('cmd-backdrop');
  const cmdInput = document.getElementById('cmd-input');
  const cmdList = document.getElementById('cmd-list');
  const cmdClose = document.getElementById('cmd-close');
  const cmdOpenTriggers = [
    document.getElementById('cmd-trigger'),
    document.getElementById('hero-launcher-btn'),
    document.getElementById('mobile-cmd-trigger'),
    ...document.querySelectorAll('[data-open-cmd]')
  ].filter(Boolean);

  const BASE_COMMANDS = [
    {
      title: 'Download KramaIsland.dmg (v1.4.0 · 3.3 MB)',
      sub: 'Direct macOS Apple Silicon installer from GitHub',
      badge: 'Download',
      keywords: 'download dmg install mac app',
      run: () => {
        const link = document.getElementById('hero-download-btn');
        if (link) link.click();
      }
    },
    {
      title: 'Preview CoreAudio Volume HUD',
      sub: 'Switch the hero MacBook notch to the live interactive Volume HUD',
      badge: 'Preview',
      keywords: 'volume hud audio osd sound',
      run: () => {
        activateState('volume');
        document.getElementById('island-stage-panel')?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
      }
    },
    {
      title: 'Configure Custom Rows × Columns Snap Grid',
      sub: 'Test 1×2, 2×2, 2×3, and 3×3 window tiling layouts',
      badge: 'Jump',
      keywords: 'grid snap window layout tile rows columns',
      run: () => document.getElementById('snap-grid')?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    },
    {
      title: 'Inspect Privacy & Permissions Matrix',
      sub: 'See every macOS permission KramaIsland uses — 100% on-device',
      badge: 'Trust',
      keywords: 'privacy permissions security offline tcc',
      run: () => document.getElementById('privacy')?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    },
    {
      title: 'Copy SHA-256 Verification Command',
      sub: 'Verify KramaIsland.dmg integrity in Terminal',
      badge: 'Copy',
      keywords: 'sha256 checksum verify hash security',
      run: async () => {
        await copyText("echo 'eb91b7644debbc3743a85f6ea0f678667afc9be5699b524b09b7b0cceffaec18  KramaIsland.dmg' | shasum -a 256 -c");
        showNotchToast('Copied SHA-256 verification command');
      }
    },
    {
      title: 'Copy Gatekeeper Quarantine Command',
      sub: 'xattr -dr com.apple.quarantine /Applications/KramaIsland.app',
      badge: 'Copy',
      keywords: 'gatekeeper xattr quarantine terminal install',
      run: async () => {
        await copyText('xattr -dr com.apple.quarantine /Applications/KramaIsland.app');
        showNotchToast('Copied Gatekeeper quarantine command');
      }
    },
    {
      title: 'Open KramaIsland on GitHub',
      sub: 'github.com/Seavik2142/KramaIsland · MIT License',
      badge: 'GitHub',
      keywords: 'github source code repo open source',
      run: () => window.open('https://github.com/Seavik2142/KramaIsland', '_blank', 'noopener,noreferrer')
    }
  ];

  const evaluateLiveQuery = (raw) => {
    const q = raw.trim().toLowerCase();
    if (!q) return null;

    const unitMatch = q.match(/^(-?\d+(?:\.\d+)?)\s*([a-z]+)\s+(?:to|in)\s+([a-z]+)$/);
    if (unitMatch) {
      const val = parseFloat(unitMatch[1]);
      const from = unitMatch[2];
      const to = unitMatch[3];
      let out = null;
      if (from === 'km' && to === 'mi') out = `${(val * 0.62137119).toFixed(4).replace(/\.?0+$/, '')} mi`;
      else if (from === 'mi' && to === 'km') out = `${(val * 1.609344).toFixed(4).replace(/\.?0+$/, '')} km`;
      else if (from === 'm' && to === 'ft') out = `${(val * 3.28084).toFixed(3).replace(/\.?0+$/, '')} ft`;
      else if (from === 'ft' && to === 'm') out = `${(val * 0.3048).toFixed(3).replace(/\.?0+$/, '')} m`;
      else if (from === 'cm' && to === 'in') out = `${(val / 2.54).toFixed(3).replace(/\.?0+$/, '')} in`;
      else if (from === 'in' && to === 'cm') out = `${(val * 2.54).toFixed(3).replace(/\.?0+$/, '')} cm`;
      else if (from === 'kg' && to === 'lb') out = `${(val * 2.2046226).toFixed(3).replace(/\.?0+$/, '')} lb`;
      else if (from === 'lb' && to === 'kg') out = `${(val / 2.2046226).toFixed(3).replace(/\.?0+$/, '')} kg`;
      else if (from === 'f' && to === 'c') out = `${(((val - 32) * 5) / 9).toFixed(2).replace(/\.?0+$/, '')} °C`;
      else if (from === 'c' && to === 'f') out = `${((val * 9) / 5 + 32).toFixed(2).replace(/\.?0+$/, '')} °F`;
      else if (from === 'gb' && to === 'mb') out = `${(val * 1024).toFixed(2).replace(/\.?0+$/, '')} MB`;
      else if (from === 'mb' && to === 'gb') out = `${(val / 1024).toFixed(4).replace(/\.?0+$/, '')} GB`;
      if (out) {
        return {
          title: out,
          sub: `${raw.trim()} · Press Enter to copy result`,
          badge: 'Convert',
          isCalc: true,
          run: async () => { await copyText(out); showNotchToast(`Copied ${out}`); }
        };
      }
    }

    if (/^[0-9.+\-*/()\s]+$/.test(q) && /[+\-*/]/.test(q)) {
      const tokens = q.match(/\d+(?:\.\d+)?|[+\-*/()]/g);
      if (tokens) {
        let pos = 0;
        const parseExpr = () => {
          let left = parseTerm();
          while (tokens[pos] === '+' || tokens[pos] === '-') {
            const op = tokens[pos++];
            const right = parseTerm();
            left = op === '+' ? left + right : left - right;
          }
          return left;
        };
        const parseTerm = () => {
          let left = parseFactor();
          while (tokens[pos] === '*' || tokens[pos] === '/') {
            const op = tokens[pos++];
            const right = parseFactor();
            left = op === '*' ? left * right : left / right;
          }
          return left;
        };
        const parseFactor = () => {
          if (tokens[pos] === '-') { pos++; return -parseFactor(); }
          if (tokens[pos] === '(') {
            pos++;
            const v = parseExpr();
            if (tokens[pos] === ')') pos++;
            return v;
          }
          return parseFloat(tokens[pos++]);
        };
        const res = parseExpr();
        if (pos === tokens.length && Number.isFinite(res)) {
          const formatted = Number(res.toFixed(6)).toString();
          return {
            title: `= ${formatted}`,
            sub: `${raw.trim()} · Press Enter to copy result`,
            badge: 'Calculator',
            isCalc: true,
            run: async () => { await copyText(formatted); showNotchToast(`Copied result ${formatted}`); }
          };
        }
      }
    }
    return null;
  };

  let activeCmdIdx = 0;
  let currentItems = [];
  let lastFocusedEl = null;

  const closeCmd = () => {
    if (!cmdBackdrop) return;
    cmdBackdrop.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') lastFocusedEl.focus();
  };

  const renderCmdList = () => {
    if (!cmdList || !cmdInput) return;
    const query = cmdInput.value.trim();
    const qLower = query.toLowerCase();
    const calcItem = evaluateLiveQuery(query);

    const matched = BASE_COMMANDS.filter(
      (c) => !qLower || c.title.toLowerCase().includes(qLower) || c.sub.toLowerCase().includes(qLower) || c.keywords.includes(qLower)
    );
    currentItems = calcItem ? [calcItem, ...matched] : matched;
    if (activeCmdIdx >= currentItems.length) activeCmdIdx = 0;

    cmdList.innerHTML = '';
    if (!currentItems.length) {
      const empty = document.createElement('div');
      empty.className = 'cmd-item';
      const main = document.createElement('div');
      main.className = 'cmd-item-main';
      const t = document.createElement('span');
      t.className = 'cmd-item-title';
      t.textContent = 'No matching action';
      const s = document.createElement('span');
      s.className = 'cmd-item-sub';
      s.textContent = 'Try typing "5 km to mi", "100 f to c", "24 * 60", or "download"';
      main.append(t, s);
      empty.append(main);
      cmdList.appendChild(empty);
      return;
    }

    currentItems.forEach((item, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('role', 'option');
      btn.setAttribute('aria-selected', String(idx === activeCmdIdx));
      btn.className = `cmd-item${item.isCalc ? ' cmd-item--calc' : ''}${idx === activeCmdIdx ? ' is-active' : ''}`;

      const main = document.createElement('div');
      main.className = 'cmd-item-main';
      const titleSpan = document.createElement('span');
      titleSpan.className = 'cmd-item-title';
      titleSpan.textContent = item.title;
      const subSpan = document.createElement('span');
      subSpan.className = 'cmd-item-sub';
      subSpan.textContent = item.sub;
      main.append(titleSpan, subSpan);

      const badgeSpan = document.createElement('span');
      badgeSpan.className = 'cmd-item-badge';
      badgeSpan.textContent = item.badge;

      btn.append(main, badgeSpan);
      btn.addEventListener('mouseenter', () => {
        activeCmdIdx = idx;
        cmdList.querySelectorAll('.cmd-item').forEach((el, i) => el.classList.toggle('is-active', i === idx));
      });
      btn.addEventListener('click', () => {
        item.run();
        closeCmd();
      });
      cmdList.appendChild(btn);
    });
  };

  const openCmd = () => {
    if (!cmdBackdrop || !cmdInput) return;
    lastFocusedEl = document.activeElement;
    cmdBackdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    cmdInput.value = '';
    activeCmdIdx = 0;
    renderCmdList();
    cmdInput.focus();
  };

  cmdOpenTriggers.forEach((el) => el.addEventListener('click', openCmd));
  if (cmdClose) cmdClose.addEventListener('click', closeCmd);
  if (cmdBackdrop) {
    cmdBackdrop.addEventListener('click', (e) => { if (e.target === cmdBackdrop) closeCmd(); });
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', () => { activeCmdIdx = 0; renderCmdList(); });
    cmdInput.addEventListener('keydown', (e) => {
      if (e.isComposing) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentItems.length) { activeCmdIdx = (activeCmdIdx + 1) % currentItems.length; renderCmdList(); }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentItems.length) { activeCmdIdx = (activeCmdIdx - 1 + currentItems.length) % currentItems.length; renderCmdList(); }
      } else if (e.key === 'Enter' && currentItems[activeCmdIdx]) {
        e.preventDefault();
        currentItems[activeCmdIdx].run();
        closeCmd();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeCmd();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (lbBackdrop && !lbBackdrop.hidden) closeLightbox();
      if (cmdBackdrop && !cmdBackdrop.hidden) closeCmd();
      else openCmd();
    } else if (e.key === 'Escape') {
      if (cmdBackdrop && !cmdBackdrop.hidden) closeCmd();
      else if (lbBackdrop && !lbBackdrop.hidden) closeLightbox();
    } else if (lbBackdrop && !lbBackdrop.hidden) {
      if (e.key === 'ArrowLeft') { lbIndex = (lbIndex - 1 + LIGHTBOX_ITEMS.length) % LIGHTBOX_ITEMS.length; renderLightbox(); }
      else if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % LIGHTBOX_ITEMS.length; renderLightbox(); }
    }
  });
})();
