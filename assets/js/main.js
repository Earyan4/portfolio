/**
 * E. Aryan Goud — Code & Cuts
 * MCU cinematic portfolio interactions
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

  /* Navbar active on scroll */
  const navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    const position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      const section = select(navbarlink.hash);
      if (!section) return;
      if (position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  const scrollto = (el) => {
    const elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  /* Scroll progress bar */
  const progressBar = select("#scrollProgress");
  const updateScrollProgress = () => {
    if (!progressBar) return;
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = pct + "%";
  };
  onscroll(document, updateScrollProgress);
  window.addEventListener("load", updateScrollProgress);

  /* Back to top */
  const backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) backtotop.classList.add("active");
      else backtotop.classList.remove("active");
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /* Mobile nav */
  on("click", ".mobile-nav-toggle", function () {
    select("body").classList.toggle("mobile-nav-active");
    const icon = this.querySelector("i");
    if (icon) {
      icon.classList.toggle("bi-list");
      icon.classList.toggle("bi-x");
    }
  });

  on(
    "click",
    ".scrollto",
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();
        const body = select("body");
        if (body.classList.contains("mobile-nav-active")) {
          body.classList.remove("mobile-nav-active");
          const navbarToggle = select(".mobile-nav-toggle");
          const icon = navbarToggle && navbarToggle.querySelector("i");
          if (icon) {
            icon.classList.toggle("bi-list");
            icon.classList.toggle("bi-x");
          }
        }
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

  /* Preloader */
  const preloader = select("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /* Footer year */
  const yearEl = select("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Typed.js */
  const typed = select(".typed");
  if (typed && typeof Typed !== "undefined") {
    let typedStrings = typed.getAttribute("data-typed-items");
    typedStrings = typedStrings.split(",");
    new Typed(".typed", {
      strings: typedStrings,
      loop: true,
      typeSpeed: prefersReducedMotion ? 0 : 70,
      backSpeed: prefersReducedMotion ? 0 : 40,
      backDelay: 2000,
      showCursor: !prefersReducedMotion,
    });
  }

  /* Skill bars via IntersectionObserver */
  const skillsContent = select(".skills-content");
  if (skillsContent) {
    const fillBars = () => {
      select(".progress .progress-bar", true).forEach((el) => {
        el.style.width = el.getAttribute("aria-valuenow") + "%";
      });
    };

    if (prefersReducedMotion) {
      fillBars();
    } else if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              fillBars();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.25 }
      );
      observer.observe(skillsContent);
    } else {
      fillBars();
    }
  }

  /* Hero web parallax */
  const heroWeb = select(".hero-web");
  if (heroWeb && !prefersReducedMotion) {
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          heroWeb.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
        }
      },
      { passive: true }
    );
  }

  /* Portfolio: only one video playing; pause others */
  const videos = select("#portfolio video", true);
  videos.forEach((video) => {
    video.addEventListener("play", () => {
      videos.forEach((other) => {
        if (other !== video && !other.paused) {
          other.pause();
        }
      });
    });
  });

  /* Contact form → mailto with composed body */
  const contactForm = select("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = select("#name")?.value?.trim() || "";
      const email = select("#email")?.value?.trim() || "";
      const message = select("#message")?.value?.trim() || "";
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:e.aryangoud22@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  /* AOS */
  window.addEventListener("load", () => {
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: prefersReducedMotion ? 0 : 900,
        easing: "ease-out-cubic",
        once: true,
        mirror: false,
        disable: prefersReducedMotion,
      });
    }
  });

  /* PureCounter */
  if (typeof PureCounter !== "undefined") {
    new PureCounter({
      selector: ".purecounter",
      duration: prefersReducedMotion ? 0 : 2,
      once: true,
    });
  }

  /* ========== Wow features ========== */
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;
  const toastEl = select("#fxToast");
  let toastTimer;

  const showToast = (msg, ms = 2800) => {
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
    showToast(`Mission unlocked: ${badge.textContent}`);
  };

  unlockMission("arrive");

  /* Soft thwip via Web Audio (off by default) */
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
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(420, t);
      osc.frequency.exponentialRampToValueAtTime(90, t + 0.18);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.08, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.22);
    } catch (_) {
      /* ignore */
    }
  };

  if (audioToggle) {
    audioToggle.addEventListener("click", () => {
      audioOn = !audioOn;
      audioToggle.setAttribute("aria-pressed", String(audioOn));
      const icon = audioToggle.querySelector("i");
      if (icon) {
        icon.className = audioOn ? "bi bi-volume-up" : "bi bi-volume-mute";
      }
      if (audioOn) {
        playThwip();
        showToast("Web sound on — click to thwip");
      } else {
        showToast("Web sound off");
      }
    });
  }

  /* Custom cursor */
  const cursor = select("#spiderCursor");
  if (cursor && isFinePointer && !prefersReducedMotion) {
    document.body.classList.add("has-spider-cursor");
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let tx = cx;
    let ty = cy;

    window.addEventListener(
      "mousemove",
      (e) => {
        tx = e.clientX;
        ty = e.clientY;
      },
      { passive: true }
    );

    const tickCursor = () => {
      cx += (tx - cx) * 0.28;
      cy += (ty - cy) * 0.28;
      cursor.style.left = cx + "px";
      cursor.style.top = cy + "px";
      requestAnimationFrame(tickCursor);
    };
    requestAnimationFrame(tickCursor);

    document.addEventListener("mouseover", (e) => {
      if (e.target.closest("a, button, .btn, input, textarea, video, .portfolio-item, .identity-flip")) {
        document.body.classList.add("cursor-hover");
      }
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest("a, button, .btn, input, textarea, video, .portfolio-item, .identity-flip")) {
        document.body.classList.remove("cursor-hover");
      }
    });
  }

  /* Hero spotlight follow */
  const hero = select("#hero");
  if (hero && !prefersReducedMotion) {
    const spot = document.createElement("div");
    spot.className = "hero-spotlight";
    hero.prepend(spot);
    hero.addEventListener(
      "mousemove",
      (e) => {
        const r = hero.getBoundingClientRect();
        spot.style.left = e.clientX - r.left + "px";
        spot.style.top = e.clientY - r.top + "px";
      },
      { passive: true }
    );
  }

  /* Click → shoot web strands */
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
      { x: 0, y: canvas.height * 0.2 },
      { x: canvas.width, y: canvas.height * 0.15 },
    ];
    const anchor = anchors[Math.floor(Math.random() * anchors.length)];
    webs.push({
      x1: anchor.x,
      y1: anchor.y,
      x2: x,
      y2: y,
      life: 1,
      width: 1.2 + Math.random(),
    });
    playThwip();
    webShotCount += 1;
    if (webShotCount === 1) unlockMission("thwip");
    if (webShotCount === 12) showToast("Neighborhood friendly web-slinger detected");
  };

  const drawWebs = () => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = webs.length - 1; i >= 0; i--) {
      const w = webs[i];
      ctx.beginPath();
      ctx.moveTo(w.x1, w.y1);
      const mx = (w.x1 + w.x2) / 2 + Math.sin((1 - w.life) * 6) * 18;
      const my = (w.y1 + w.y2) / 2 + 20;
      ctx.quadraticCurveTo(mx, my, w.x2, w.y2);
      ctx.strokeStyle = `rgba(225, 6, 0, ${0.85 * w.life})`;
      if (document.body.classList.contains("secret-mode")) {
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.85 * w.life})`;
      }
      ctx.lineWidth = w.width;
      ctx.stroke();
      w.life -= 0.012;
      if (w.life <= 0) webs.splice(i, 1);
    }
    requestAnimationFrame(drawWebs);
  };
  if (canvas && !prefersReducedMotion) requestAnimationFrame(drawWebs);

  document.addEventListener("click", (e) => {
    if (e.target.closest("a, button, input, textarea, video, .mobile-nav-toggle, .fx-audio-toggle, .web-tip")) return;
    shootWeb(e.clientX, e.clientY);
  });

  /* Tip banner */
  const tip = select("#webTip");
  const tipClose = select("#webTipClose");
  if (tip && !prefersReducedMotion) {
    setTimeout(() => {
      if (!sessionStorage.getItem("webTipDismissed")) tip.hidden = false;
    }, 2200);
    tipClose?.addEventListener("click", () => {
      tip.hidden = true;
      sessionStorage.setItem("webTipDismissed", "1");
    });
  }

  /* Triple-click name → Spider-Sense */
  const heroName = select("#heroName");
  if (heroName) {
    let clicks = 0;
    let clickReset;
    heroName.addEventListener("click", (e) => {
      e.stopPropagation();
      clicks += 1;
      clearTimeout(clickReset);
      clickReset = setTimeout(() => {
        clicks = 0;
      }, 600);
      if (clicks >= 3) {
        clicks = 0;
        document.body.style.setProperty("--sense-x", "50%");
        document.body.style.setProperty("--sense-y", "35%");
        document.body.classList.remove("spider-sense");
        void document.body.offsetWidth;
        document.body.classList.add("spider-sense");
        unlockMission("sense");
        showToast("Spider-Sense tingling… danger nearby? Nah — just talent.");
        setTimeout(() => document.body.classList.remove("spider-sense"), 1800);
      }
    });
  }

  /* Identity flip */
  const flip = select("#identityFlip");
  if (flip) {
    const toggleFlip = () => {
      flip.classList.toggle("is-flipped");
      showToast(flip.classList.contains("is-flipped") ? "Identity: Cuts" : "Identity: Code");
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

  /* Magnetic buttons */
  if (isFinePointer && !prefersReducedMotion) {
    select(".btn-spider, .btn-ghost", true).forEach((btn) => {
      btn.classList.add("magnetic");
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.22}px, ${y * 0.28}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* Portfolio 3D tilt */
  if (isFinePointer && !prefersReducedMotion) {
    select(".portfolio-item", true).forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const ry = (px - 0.5) * 14;
        const rx = (0.5 - py) * 10;
        card.classList.add("tilt-active");
        card.style.setProperty("--rx", rx + "deg");
        card.style.setProperty("--ry", ry + "deg");
      });
      card.addEventListener("mouseleave", () => {
        card.classList.remove("tilt-active");
        card.style.removeProperty("--rx");
        card.style.removeProperty("--ry");
      });
    });
  }

  /* Portfolio mission */
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
      { threshold: 0.2 }
    );
    po.observe(portfolio);
  }

  /* Section title glitch class */
  select(".section-title h2", true).forEach((h) => h.classList.add("glitch"));

  /* Secret code: type thwip */
  let buffer = "";
  window.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea")) return;
    buffer = (buffer + e.key.toLowerCase()).slice(-5);
    if (buffer !== "thwip") return;
    buffer = "";
    document.body.classList.add("secret-mode");
    unlockMission("secret");
    showToast("Secret Swing unlocked — Miles energy mode");
    for (let i = 0; i < 28; i++) {
      const drop = document.createElement("span");
      drop.className = "web-rain";
      drop.style.left = Math.random() * 100 + "vw";
      drop.style.animationDelay = Math.random() * 0.5 + "s";
      drop.style.height = 20 + Math.random() * 50 + "px";
      document.body.appendChild(drop);
      setTimeout(() => drop.remove(), 1400);
    }
    setTimeout(() => document.body.classList.remove("secret-mode"), 12000);
  });
})();
