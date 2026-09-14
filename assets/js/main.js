/**
 * Aryan Goud — Editor · Developer
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

  /* Dock / section active */
  const dockLinks = select("#dock .scrollto", true);
  const sectionIds = [
    "hero",
    "about",
    "skills",
    "summary",
    "education",
    "experience",
    "portfolio",
    "contact",
  ];

  const setDockActive = () => {
    const position = window.scrollY + window.innerHeight * 0.35;
    let current = "hero";
    sectionIds.forEach((id) => {
      const section = select("#" + id);
      if (!section) return;
      if (position >= section.offsetTop) current = id;
    });
    /* Map nested sections onto dock tabs */
    if (current === "skills") current = "about";
    if (current === "summary" || current === "education" || current === "experience") {
      current = "resume";
    }
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

  /* Skills board reveal */
  const skillsBoard = select(".skills-board");
  if (skillsBoard) {
    const reveal = () => skillsBoard.classList.add("is-in");
    if (prefersReducedMotion) reveal();
    else if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reveal();
              obs.disconnect();
            }
          });
        },
        { threshold: 0.22 }
      );
      obs.observe(skillsBoard);
    } else reveal();
  }

  /* Work: lazy-load + one at a time + scroll reveal */
  const workCards = select(".work-card", true);
  const workVideos = select("#portfolio video", true);

  const loadWorkVideo = (video) => {
    if (!video || !video.dataset.src) return;
    video.src = video.dataset.src;
    video.removeAttribute("data-src");
    video.preload = "metadata";
  };

  if (prefersReducedMotion) {
    workCards.forEach((card) => card.classList.add("is-in"));
  }

  if ("IntersectionObserver" in window) {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const card = entry.target;
          card.classList.add("is-in");
          loadWorkVideo(card.querySelector("video"));
          revealObs.unobserve(card);
        });
      },
      { rootMargin: "280px 0px", threshold: 0.08 }
    );
    workCards.forEach((card) => revealObs.observe(card));

    const pauseObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && !entry.target.paused) entry.target.pause();
        });
      },
      { threshold: 0.2 }
    );
    workVideos.forEach((video) => pauseObs.observe(video));
  } else {
    workCards.forEach((card) => {
      card.classList.add("is-in");
      loadWorkVideo(card.querySelector("video"));
    });
  }

  workVideos.forEach((video) => {
    const card = video.closest(".work-card");
    const playBtn = card?.querySelector(".work-play");
    const start = () => {
      loadWorkVideo(video);
      const play = () => video.play().catch(() => {});
      if (video.readyState >= 2) play();
      else video.addEventListener("loadeddata", play, { once: true });
    };
    playBtn?.addEventListener("click", start);
    video.addEventListener("play", () => {
      card?.classList.add("is-playing");
      workVideos.forEach((other) => {
        if (other !== video && !other.paused) other.pause();
      });
    });
    video.addEventListener("ended", () => card?.classList.remove("is-playing"));
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

  /* Chapter sections — reveal watermark + soft scroll drift */
  const chapters = select(".chapter", true);
  if (chapters.length && "IntersectionObserver" in window) {
    const chapterObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.2 }
    );
    chapters.forEach((ch) => chapterObs.observe(ch));

    if (!prefersReducedMotion) {
      const driftWatermarks = () => {
        const mid = window.scrollY + window.innerHeight * 0.5;
        chapters.forEach((ch) => {
          const wm = ch.querySelector(".chapter-watermark");
          if (!wm || !ch.classList.contains("is-visible")) return;
          const rect = ch.getBoundingClientRect();
          const center = window.scrollY + rect.top + rect.height * 0.5;
          const offset = (mid - center) * 0.06;
          wm.style.transform = `translateY(calc(-50% + ${offset}px))`;
        });
      };
      onscroll(document, driftWatermarks);
      window.addEventListener("load", driftWatermarks);
    }
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

  /* Hero entrance after first paint */
  if (!prefersReducedMotion) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.add("fx-ready");
      });
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
