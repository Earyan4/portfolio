/**
 * E. Aryan Goud — Editor · Developer
 */
(function () {
  "use strict";

  const select = (el, all = false) => {
    el = el.trim();
    if (all) return [...document.querySelectorAll(el)];
    return document.querySelector(el);
  };

  const on = (type, el, listener, all = false) => {
    const selectEl = select(el, all);
    if (!selectEl) return;
    if (all) selectEl.forEach((e) => e.addEventListener(type, listener));
    else selectEl.addEventListener(type, listener);
  };

  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener, { passive: true });
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  const getTheme = () => document.documentElement.getAttribute("data-theme") || "light";

  const getAccentRgb = () => {
    const dark = getTheme() === "dark";
    const secret = document.body.classList.contains("secret-mode");
    if (secret) return "26, 95, 180";
    return dark ? "214, 40, 57" : "196, 30, 58";
  };

  /* Theme toggle */
  const themeToggle = select("#themeToggle");
  const themeIcon = select("#themeIcon");

  const applyThemeIcon = () => {
    if (!themeIcon) return;
    const dark = getTheme() === "dark";
    themeIcon.className = dark ? "bi bi-sun" : "bi bi-moon-stars";
  };

  applyThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = getTheme() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("ag-theme", next);
      } catch (_) {}
      applyThemeIcon();
      showToast(next === "dark" ? "Dark mode" : "Light mode");
    });
  }

  /* Dock / section active */
  const dockLinks = select("#dock .scrollto", true);
  const sectionIds = ["hero", "about", "skills", "resume", "portfolio", "contact"];

  const setDockActive = () => {
    const position = window.scrollY + window.innerHeight * 0.35;
    let current = "hero";
    sectionIds.forEach((id) => {
      const section = select("#" + id);
      if (!section) return;
      if (position >= section.offsetTop) current = id;
    });
    /* Map skills into about for dock (no skills tab) */
    if (current === "skills") current = "about";
    dockLinks.forEach((link) => {
      const sec = link.getAttribute("data-section");
      link.classList.toggle("active", sec === current);
    });
  };
  window.addEventListener("load", setDockActive);
  onscroll(document, setDockActive);

  const scrollto = (el) => {
    const target = select(el);
    if (!target) return;
    window.scrollTo({
      top: target.offsetTop - 8,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  on(
    "click",
    ".scrollto",
    function (e) {
      if (this.hash && select(this.hash)) {
        e.preventDefault();
        scrollto(this.hash);
      }
    },
    true
  );

  window.addEventListener("load", () => {
    if (window.location.hash && select(window.location.hash)) {
      scrollto(window.location.hash);
    }
  });

  /* Scroll progress */
  const progressBar = select("#scrollProgress");
  const updateScrollProgress = () => {
    if (!progressBar) return;
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    progressBar.style.width = (scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0) + "%";
  };
  onscroll(document, updateScrollProgress);
  window.addEventListener("load", updateScrollProgress);

  /* Back to top */
  const backtotop = select(".back-to-top");
  if (backtotop) {
    const toggle = () => {
      backtotop.classList.toggle("active", window.scrollY > 120);
    };
    window.addEventListener("load", toggle);
    onscroll(document, toggle);
  }

  /* Preloader */
  const preloader = select("#preloader");
  if (preloader) {
    window.addEventListener("load", () => preloader.remove());
  }

  const yearEl = select("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Typed */
  const typed = select(".typed");
  if (typed && typeof Typed !== "undefined") {
    const strings = typed.getAttribute("data-typed-items").split(",");
    new Typed(".typed", {
      strings,
      loop: true,
      typeSpeed: prefersReducedMotion ? 0 : 65,
      backSpeed: prefersReducedMotion ? 0 : 35,
      backDelay: 1800,
      showCursor: !prefersReducedMotion,
    });
  }

  /* Skill bars */
  const skillsContent = select(".skills-content");
  if (skillsContent) {
    const fillBars = () => {
      select(".progress .progress-bar", true).forEach((el) => {
        el.style.width = el.getAttribute("aria-valuenow") + "%";
      });
    };
    if (prefersReducedMotion) fillBars();
    else if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              fillBars();
              obs.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );
      obs.observe(skillsContent);
    } else fillBars();
  }

  /* Videos: one at a time */
  const videos = select("#portfolio video", true);
  videos.forEach((video) => {
    video.addEventListener("play", () => {
      videos.forEach((other) => {
        if (other !== video && !other.paused) other.pause();
      });
    });
  });

  /* Contact mailto */
  const contactForm = select("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = select("#name")?.value?.trim() || "";
      const email = select("#email")?.value?.trim() || "";
      const message = select("#message")?.value?.trim() || "";
      const subject = encodeURIComponent("Portfolio message from " + name);
      const body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\n" + message);
      window.location.href = "mailto:e.aryangoud22@gmail.com?subject=" + subject + "&body=" + body;
    });
  }

  /* AOS */
  window.addEventListener("load", () => {
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: prefersReducedMotion ? 0 : 800,
        easing: "ease-out-cubic",
        once: true,
        mirror: false,
        disable: prefersReducedMotion,
      });
    }
  });

  if (typeof PureCounter !== "undefined") {
    new PureCounter({
      selector: ".purecounter",
      duration: prefersReducedMotion ? 0 : 2,
      once: true,
    });
  }

  /* ========== FX ========== */
  const toastEl = select("#fxToast");
  let toastTimer;
  const showToast = (msg, ms = 2600) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), ms);
  };

  const unlockMission = (id) => {
    const badge = select(`.mission-badge[data-mission="${id}"]`);
    if (!badge || !badge.classList.contains("locked")) return;
    badge.classList.remove("locked");
    badge.classList.add("unlocked");
    showToast("Found: " + badge.textContent);
  };
  unlockMission("arrive");

  let audioOn = false;
  let audioCtx = null;
  const audioToggle = select("#audioToggle");

  const playThwip = () => {
    if (!audioOn || prefersReducedMotion) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const t = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(380, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.16);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.06, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    } catch (_) {}
  };

  if (audioToggle) {
    audioToggle.addEventListener("click", () => {
      audioOn = !audioOn;
      audioToggle.setAttribute("aria-pressed", String(audioOn));
      const icon = audioToggle.querySelector("i");
      if (icon) icon.className = audioOn ? "bi bi-volume-up" : "bi bi-volume-mute";
      if (audioOn) {
        playThwip();
        showToast("Sound on");
      } else showToast("Sound off");
    });
  }

  /* Cursor */
  const cursor = select("#spiderCursor");
  if (cursor && isFinePointer && !prefersReducedMotion) {
    document.body.classList.add("has-spider-cursor");
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let tx = cx;
    let ty = cy;
    window.addEventListener("mousemove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
    }, { passive: true });
    const tick = () => {
      cx += (tx - cx) * 0.3;
      cy += (ty - cy) * 0.3;
      cursor.style.left = cx + "px";
      cursor.style.top = cy + "px";
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest("a, button, .btn, input, textarea, video, .portfolio-item, .identity-flip, .dock-item")) {
        document.body.classList.add("cursor-hover");
      }
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest("a, button, .btn, input, textarea, video, .portfolio-item, .identity-flip, .dock-item")) {
        document.body.classList.remove("cursor-hover");
      }
    });
  }

  /* Web canvas */
  const canvas = select("#webCanvas");
  const webs = [];
  let webShotCount = 0;

  const resizeCanvas = () => {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const shootWeb = (x, y) => {
    if (!canvas || prefersReducedMotion) return;
    const anchors = [
      { x: 0, y: 0 },
      { x: canvas.width, y: 0 },
      { x: canvas.width * 0.5, y: 0 },
      { x: 0, y: canvas.height * 0.15 },
      { x: canvas.width, y: canvas.height * 0.12 },
    ];
    const a = anchors[Math.floor(Math.random() * anchors.length)];
    webs.push({ x1: a.x, y1: a.y, x2: x, y2: y, life: 1, width: 1.1 + Math.random() });
    playThwip();
    webShotCount += 1;
    if (webShotCount === 1) unlockMission("thwip");
  };

  const drawWebs = () => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rgb = getAccentRgb();
    for (let i = webs.length - 1; i >= 0; i--) {
      const w = webs[i];
      ctx.beginPath();
      ctx.moveTo(w.x1, w.y1);
      const mx = (w.x1 + w.x2) / 2 + Math.sin((1 - w.life) * 5) * 14;
      const my = (w.y1 + w.y2) / 2 + 16;
      ctx.quadraticCurveTo(mx, my, w.x2, w.y2);
      ctx.strokeStyle = "rgba(" + rgb + ", " + 0.75 * w.life + ")";
      ctx.lineWidth = w.width;
      ctx.stroke();
      w.life -= 0.014;
      if (w.life <= 0) webs.splice(i, 1);
    }
    requestAnimationFrame(drawWebs);
  };
  if (canvas && !prefersReducedMotion) requestAnimationFrame(drawWebs);

  document.addEventListener("click", (e) => {
    if (e.target.closest("a, button, input, textarea, video, .fx-audio-toggle, .web-tip, .bottom-dock")) return;
    shootWeb(e.clientX, e.clientY);
  });

  const tip = select("#webTip");
  const tipClose = select("#webTipClose");
  if (tip && !prefersReducedMotion) {
    setTimeout(() => {
      if (!sessionStorage.getItem("webTipDismissed")) tip.hidden = false;
    }, 2000);
    tipClose?.addEventListener("click", () => {
      tip.hidden = true;
      sessionStorage.setItem("webTipDismissed", "1");
    });
  }

  /* Triple-click name */
  const heroName = select("#heroName");
  if (heroName) {
    let clicks = 0;
    let clickReset;
    heroName.addEventListener("click", (e) => {
      e.stopPropagation();
      clicks += 1;
      clearTimeout(clickReset);
      clickReset = setTimeout(() => { clicks = 0; }, 600);
      if (clicks >= 3) {
        clicks = 0;
        document.body.classList.remove("spider-sense");
        void document.body.offsetWidth;
        document.body.classList.add("spider-sense");
        unlockMission("sense");
        showToast("Yeah… that tingled.");
        setTimeout(() => document.body.classList.remove("spider-sense"), 1600);
      }
    });
  }

  /* Identity flip */
  const flip = select("#identityFlip");
  if (flip) {
    const toggleFlip = () => {
      flip.classList.toggle("is-flipped");
      showToast(flip.classList.contains("is-flipped") ? "Editor side" : "Photo side");
    };
    flip.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFlip();
    });
    flip.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleFlip();
      }
    });
  }

  /* Magnetic CTAs */
  if (isFinePointer && !prefersReducedMotion) {
    select(".btn-spider, .btn-ghost", true).forEach((btn) => {
      btn.classList.add("magnetic");
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + x * 0.18 + "px, " + y * 0.22 + "px)";
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* Portfolio tilt */
  if (isFinePointer && !prefersReducedMotion) {
    select(".portfolio-item", true).forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.classList.add("tilt-active");
        card.style.setProperty("--rx", (0.5 - py) * 8 + "deg");
        card.style.setProperty("--ry", (px - 0.5) * 10 + "deg");
      });
      card.addEventListener("mouseleave", () => {
        card.classList.remove("tilt-active");
        card.style.removeProperty("--rx");
        card.style.removeProperty("--ry");
      });
    });
  }

  const portfolio = select("#portfolio");
  if (portfolio && "IntersectionObserver" in window) {
    const po = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            unlockMission("reels");
            po.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    po.observe(portfolio);
  }

  select(".section-title h2", true).forEach((h) => h.classList.add("glitch"));

  /* Secret: type thwip */
  let buffer = "";
  window.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea")) return;
    buffer = (buffer + e.key.toLowerCase()).slice(-5);
    if (buffer !== "thwip") return;
    buffer = "";
    document.body.classList.add("secret-mode");
    unlockMission("secret");
    showToast("Secret mode — 12 seconds");
    for (let i = 0; i < 24; i++) {
      const drop = document.createElement("span");
      drop.className = "web-rain";
      drop.style.left = Math.random() * 100 + "vw";
      drop.style.animationDelay = Math.random() * 0.45 + "s";
      drop.style.height = 18 + Math.random() * 40 + "px";
      document.body.appendChild(drop);
      setTimeout(() => drop.remove(), 1300);
    }
    setTimeout(() => document.body.classList.remove("secret-mode"), 12000);
  });
})();
