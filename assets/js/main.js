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
})();
