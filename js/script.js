
(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  document.addEventListener("DOMContentLoaded", () => {
    initYear();
    initMobileMenu();
    initStickyNavbar();
    initActiveNav();
    initPhoneRotator();
    initScrollProgress();
    initHeroParallax();
    initTextSplit();
    initRevealOnScroll();
    initStagger();
    initFAQ();
    initCarousel();
    initStatCounters();
    initFAB();
    initChatWidget();
    initForm();
    initCopyButtons();
    initMagneticButtons();
    initTilt();
    initSmoothAnchors();
    initHeroSpotlight();
    initLiveBookingDate();
    initConfettiOnFormSuccess();
    initHeroSlider();
    initPackageSlider();
  });

  
  function initPhoneRotator() {
    const rotators = $$("[data-phone-rotator]");
    if (!rotators.length) return;

    rotators.forEach((rotator) => {
      const slides = $$(".phone-slide", rotator);
      if (slides.length < 2) return;

      let i = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
      const go = () => {
        i = (i + 1) % slides.length;
        slides.forEach((slide, idx) => {
          const active = idx === i;
          slide.classList.toggle("is-active", active);
          slide.setAttribute("aria-hidden", String(!active));
          if (active) {
            slide.removeAttribute("tabindex");
          } else {
            slide.setAttribute("tabindex", "-1");
          }
        });
      };

      if (!prefersReduced) setInterval(go, 3600);
    });
  }

  
  function initHeroSlider() {
    const slider = $("[data-hero-slider]");
    if (!slider) return;

    const slides = $$(".home-hero-slide", slider);
    const dots = $$(".home-hero-dot", slider);
    const prev = $("[data-hero-prev]", slider);
    const next = $("[data-hero-next]", slider);
    const cardImage = $("[data-hero-card-image]", slider);
    if (!slides.length) return;

    let i = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
    let timer = null;
    const INTERVAL = 6500;

    const go = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((slide, idx) => {
        const active = idx === i;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
      });
      dots.forEach((dot, idx) => {
        const active = idx === i;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-selected", String(active));
      });
      if (cardImage) {
        const image = slides[i].getAttribute("data-card-image");
        if (image && cardImage.getAttribute("src") !== image) cardImage.setAttribute("src", image);
      }
    };

    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
    const start = () => {
      if (prefersReduced) return;
      stop();
      timer = setInterval(() => go(i + 1), INTERVAL);
    };

    prev?.addEventListener("click", () => { go(i - 1); start(); });
    next?.addEventListener("click", () => { go(i + 1); start(); });
    dots.forEach((dot, idx) => dot.addEventListener("click", () => { go(idx); start(); }));
    slider.addEventListener("focusin", stop);
    slider.addEventListener("focusout", start);

    go(i);
    start();
  }

  
  function initPackageSlider() {
    const slider = $("[data-pkg-slider]");
    if (!slider) return;

    const slides = $$(".pkg-slide", slider);
    const dots   = $$(".pkg-dot", slider);
    const prev   = $("[data-pkg-prev]", slider);
    const next   = $("[data-pkg-next]", slider);
    if (!slides.length) return;

    let i = 0;
    let timer = null;
    const INTERVAL = 5500;

    const go = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, idx) => {
        const active = idx === i;
        s.classList.toggle("is-active", active);
        s.setAttribute("aria-hidden", String(!active));
      });
      dots.forEach((d, idx) => {
        const active = idx === i;
        d.classList.toggle("is-active", active);
        d.setAttribute("aria-selected", String(active));
      });
    };

    const start = () => {
      if (prefersReduced) return;
      stop();
      timer = setInterval(() => go(i + 1), INTERVAL);
    };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

    prev?.addEventListener("click", () => { go(i - 1); start(); });
    next?.addEventListener("click", () => { go(i + 1); start(); });
    dots.forEach((d, idx) => d.addEventListener("click", () => { go(idx); start(); }));

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    slider.addEventListener("focusin",  stop);
    slider.addEventListener("focusout", start);

    start();
  }

  
  function initYear() {
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
  }

  
  function initMobileMenu() {
    const toggle = $(".menu-toggle");
    const links  = $(".nav-links");
    if (!toggle || !links) return;

    const close = () => {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };

    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    $$("a", links).forEach(a => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && links.classList.contains("open")) close();
    });
  }

  
  function initStickyNavbar() {
    const header = $(".site-header");
    if (!header) return;
    const update = () => header.classList.toggle("scrolled", window.scrollY > 10);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  
  function initActiveNav() {
    const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    $$(".nav-links a").forEach(a => {
      const href = ((a.getAttribute("href") || "").split("/").pop() || "").toLowerCase();
      if (href && href === path) a.classList.add("active");
    });
  }

  
  function initScrollProgress() {
    const bar = $(".scroll-progress");
    if (!bar) return;
    const update = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      bar.style.width = (isFinite(pct) ? pct : 0) + "%";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  
  function initHeroParallax() {
    if (prefersReduced) return;
    const bg = $(".hero-bg");
    if (!bg) return;
    let ticking = false;
    const update = () => {
      const offset = Math.min(window.scrollY * 0.25, 120);
      bg.style.setProperty("--parallax", String(offset));
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  
  function initRevealOnScroll() {
    const items = $$(".reveal");
    if (!items.length) return;
    if (prefersReduced || !("IntersectionObserver" in window)) {
      items.forEach(el => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(el => io.observe(el));
  }

  
  function initFAQ() {
    $$(".faq-item").forEach(item => {
      const q = $(".faq-q", item);
      const a = $(".faq-a", item);
      if (!q || !a) return;
      q.setAttribute("aria-expanded", "false");
      q.addEventListener("click", () => {
        const open = item.classList.toggle("open");
        q.setAttribute("aria-expanded", String(open));
        a.style.maxHeight = open ? a.scrollHeight + "px" : "0";
      });
    });
  }

  
  function initCarousel() {
    const carousel = $(".carousel");
    if (!carousel) return;
    const track = $(".carousel-track", carousel);
    const slides = $$(".carousel-slide", track);
    const dotsHost = $(".carousel-dots", carousel);
    const arrows = $$(".carousel-arrow", carousel);
    if (!track || !slides.length) return;
    const dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.className = "carousel-dot";
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", `Go to review ${i + 1}`);
      b.addEventListener("click", () => goTo(i));
      dotsHost && dotsHost.appendChild(b);
      return b;
    });

    let current = 0;
    let timer = null;
    const AUTOPLAY_MS = 5500;

    const slideWidth = () => slides[0].getBoundingClientRect().width + 24;

    function goTo(i, smooth = true) {
      current = (i + slides.length) % slides.length;
      track.scrollTo({
        left: slides[current].offsetLeft - track.offsetLeft,
        behavior: smooth ? "smooth" : "auto",
      });
      updateUI();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function updateUI() {
      dots.forEach((d, i) => d.classList.toggle("active", i === current));
    }
    let scrollDebounce = null;
    track.addEventListener("scroll", () => {
      clearTimeout(scrollDebounce);
      scrollDebounce = setTimeout(() => {
        const sw = slideWidth();
        const idx = Math.round(track.scrollLeft / sw);
        if (idx !== current && idx >= 0 && idx < slides.length) {
          current = idx;
          updateUI();
        }
      }, 80);
    }, { passive: true });
    arrows.forEach(btn => {
      btn.addEventListener("click", () => {
        if (btn.dataset.dir === "next") next(); else prev();
        restart();
      });
    });
    function start() {
      if (prefersReduced) return;
      stop();
      timer = setInterval(next, AUTOPLAY_MS);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin",  stop);
    carousel.addEventListener("focusout", start);
    document.addEventListener("visibilitychange", () => {
      document.hidden ? stop() : start();
    });
    window.addEventListener("resize", () => goTo(current, false));

    updateUI();
    setTimeout(start, 800);
  }

  
  function initStatCounters() {
    const nums = $$(".stat-num[data-target]");
    if (!nums.length) return;

    const animate = (el) => {
      const target = parseFloat(el.dataset.target) || 0;
      const suffixEl = $(".suffix", el);
      const suffix = suffixEl ? suffixEl.outerHTML : "";
      const duration = 1600;
      const start = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 3);

      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        const value = Math.floor(target * ease(t));
        el.innerHTML = value.toLocaleString() + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else el.innerHTML = target.toLocaleString() + suffix;
      }

      if (prefersReduced) {
        el.innerHTML = target.toLocaleString() + suffix;
        return;
      }
      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      nums.forEach(animate);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    nums.forEach(el => io.observe(el));
  }

  
  function initFAB() {
    const fab = $(".fab");
    if (!fab) return;
    const footer = $(".site-footer");
    const update = () => {
      const showAfter = window.scrollY > 480;
      let nearFooter = false;
      if (footer) {
        const rect = footer.getBoundingClientRect();
        nearFooter = rect.top < window.innerHeight - 40;
      }
      fab.classList.toggle("show", showAfter && !nearFooter);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  
  function initChatWidget() {
    const widget = $(".chat-widget");
    if (!widget) return;
    const toggle = $(".chat-toggle", widget);
    if (!toggle) return;

    const close = () => {
      widget.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = widget.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (e) => {
      if (!widget.contains(e.target) && widget.classList.contains("open")) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && widget.classList.contains("open")) close();
    });
  }

  
  function initForm() {
    const form = $(".form");
    if (!form) return;
    const note = $(".form-note", form) || $(".form-success", form);

    const setError = (field, msg) => {
      field.classList.toggle("invalid", !!msg);
      let err = $(".field-error", field);
      if (msg) {
        if (!err) {
          err = document.createElement("span");
          err.className = "field-error";
          field.appendChild(err);
        }
        err.textContent = msg;
      } else if (err) {
        err.remove();
      }
    };

    const validateField = (input) => {
      const field = input.closest(".field");
      if (!field) return true;
      const v = (input.value || "").trim();
      if (input.required && !v) {
        setError(field, "This field is required.");
        return false;
      }
      if (input.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        setError(field, "Please enter a valid email.");
        return false;
      }
      if (input.type === "tel" && v && !/^[\d\s()+\-.]{7,}$/.test(v)) {
        setError(field, "Please enter a valid phone number.");
        return false;
      }
      setError(field, "");
      return true;
    };

    const inputs = $$("input, select, textarea", form);
    inputs.forEach(input => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => {
        const f = input.closest(".field");
        if (f && f.classList.contains("invalid")) validateField(input);
      });
    });

    form.addEventListener("submit", (e) => {
      const allValid = inputs.map(validateField).every(Boolean);
      if (!allValid) {
        e.preventDefault();
        const firstInvalid = $(".field.invalid input, .field.invalid select, .field.invalid textarea", form);
        if (firstInvalid) firstInvalid.focus();
        if (note) {
          note.textContent = "Please fix the highlighted fields and try again.";
          note.style.color = "var(--accent-dark)";
        }
        return;
      }
      const action = form.getAttribute("action");
      if (action && /^https?:/i.test(action)) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.dataset.original = submitBtn.textContent;
          submitBtn.textContent = "Sending…";
        }
        if (note) {
          note.textContent = "Sending your message…";
          note.style.color = "var(--primary-dark)";
        }
        return;
      }
      const mailto = form.getAttribute("data-mailto");
      if (mailto) {
        e.preventDefault();
        const data = new FormData(form);
        const labels = {
          name: "Name", date_of_birth: "Date of birth", gender: "Gender",
          full_address: "Full address", email: "Email", phone: "Phone",
          package: "Package", message: "Message"
        };
        const lines = [];
        for (const [k, v] of data.entries()) {
          if (!String(v).trim()) continue;
          lines.push(`${labels[k] || k}: ${v}`);
        }
        const studentName = data.get("name") || "new student";
        const subject = encodeURIComponent(`New lesson booking — ${studentName}`);
        const body = encodeURIComponent(lines.join("\n") + "\n\n— Sent from gumspringdriving.com");
        window.location.href = `mailto:${mailto}?subject=${subject}&body=${body}`;

        const success = $(".form-success", form);
        if (success) {
          success.textContent = "Thanks! Your message is opening in your email app.";
          success.classList.add("show");
        } else if (note) {
          note.textContent = "Thanks! Your message is opening in your email app.";
          note.style.color = "var(--primary)";
        }
        form.reset();
      }
    });
  }

  
  function initTextSplit() {
    if (prefersReduced) return;
    $$("[data-split]").forEach(el => {
      const walk = (node) => {
        const out = document.createDocumentFragment();
        node.childNodes.forEach(child => {
          if (child.nodeType === Node.TEXT_NODE) {
            const words = child.textContent.split(/(\s+)/);
            words.forEach(w => {
              if (/^\s+$/.test(w)) {
                out.appendChild(document.createTextNode(w));
              } else if (w.length) {
                const span = document.createElement("span");
                span.className = "split-word";
                span.textContent = w;
                out.appendChild(span);
              }
            });
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            const wrap = child.cloneNode(false);
            wrap.appendChild(walk(child));
            wrap.classList && wrap.classList.add("split-word");
            out.appendChild(wrap);
          }
        });
        return out;
      };
      const frag = walk(el);
      el.innerHTML = "";
      el.appendChild(frag);
      $$(".split-word", el).forEach((w, i) => {
        w.style.animationDelay = (0.25 + i * 0.06) + "s";
      });
    });
  }

  
  function initStagger() {
    const containers = $$(".stagger");
    if (!containers.length) return;
    if (prefersReduced || !("IntersectionObserver" in window)) {
      containers.forEach(c => {
        c.classList.add("in");
        $$(":scope > *", c).forEach(el => { el.style.transitionDelay = "0s"; });
      });
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const c = entry.target;
          $$(":scope > *", c).forEach((el, i) => {
            el.style.transitionDelay = (i * 0.08) + "s";
          });
          c.classList.add("in");
          io.unobserve(c);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    containers.forEach(c => io.observe(c));
  }

  
  function initMagneticButtons() {
    if (prefersReduced) return;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return; // Skip on touch devices
    const STRENGTH = 0.25;
    $$(".magnetic").forEach(btn => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${x * STRENGTH}px, ${y * STRENGTH}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  
  function initTilt() {
    if (prefersReduced) return;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return;
    const MAX = 6;
    $$(".tilt").forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (py - 0.5) * -MAX * 2;
        const ry = (px - 0.5) *  MAX * 2;
        card.style.setProperty("--rx", ry.toFixed(2) + "deg");
        card.style.setProperty("--ry", rx.toFixed(2) + "deg");
        card.classList.add("is-tilting");
      });
      card.addEventListener("mouseleave", () => {
        card.classList.remove("is-tilting");
        card.style.removeProperty("--rx");
        card.style.removeProperty("--ry");
      });
    });
  }

  
  function initSmoothAnchors() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
    });
  }

  
  function initCopyButtons() {
    $$(".copy-btn[data-copy]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const value = btn.getAttribute("data-copy") || "";
        try {
          await navigator.clipboard.writeText(value);
        } catch {
          const ta = document.createElement("textarea");
          ta.value = value;
          ta.style.position = "fixed"; ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand("copy"); } catch (_) {}
          document.body.removeChild(ta);
        }
        const original = btn.textContent;
        btn.textContent = "Copied ✓";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove("copied");
        }, 1600);
      });
    });
  }

  
  function initHeroSpotlight() {
    if (prefersReduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const hero = $(".hero");
    if (!hero) return;
    let raf = null;
    hero.addEventListener("mouseenter", () => hero.classList.add("spotlight-on"));
    hero.addEventListener("mouseleave", () => hero.classList.remove("spotlight-on"));
    hero.addEventListener("mousemove", (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width)  * 100;
        const y = ((e.clientY - r.top)  / r.height) * 100;
        hero.style.setProperty("--mx", x + "%");
        hero.style.setProperty("--my", y + "%");
        raf = null;
      });
    });
  }

  
  function initLiveBookingDate() {
    const el = $("[data-live-date]");
    if (!el) return;
    const now = new Date();
    const hour = now.getHours();
    let target = new Date(now);
    if (hour >= 19) {
      target.setDate(now.getDate() + 1);
    }
    const fmt = target.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    el.textContent = fmt;
    el.setAttribute("datetime", target.toISOString().slice(0, 10));
  }

  
  function fireConfetti(count = 90) {
    if (prefersReduced) return;
    const host = document.createElement("div");
    host.className = "confetti-host";
    document.body.appendChild(host);
    const colors = ["#4d9a8e", "#f0a868", "#2f7a6f", "#cf8141", "#dcefec", "#fbe6d0"];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      const startX = Math.random() * 100;
      const dx = (Math.random() - 0.5) * 600;
      const dy = window.innerHeight + 40;
      const rot = (Math.random() * 1440 - 720) + "deg";
      const dur = 1.6 + Math.random() * 1.6;
      const delay = Math.random() * 0.25;
      piece.style.left  = startX + "vw";
      piece.style.background = colors[i % colors.length];
      piece.style.setProperty("--dx", dx + "px");
      piece.style.setProperty("--dy", dy + "px");
      piece.style.setProperty("--rot", rot);
      piece.style.setProperty("--dur", dur + "s");
      piece.style.animationDelay = delay + "s";
      piece.style.transform = `scale(${0.7 + Math.random() * 0.7})`;
      host.appendChild(piece);
    }
    setTimeout(() => host.remove(), 4200);
  }

  
  function initConfettiOnFormSuccess() {
    if (location.pathname.toLowerCase().endsWith("thanks.html")) {
      setTimeout(() => fireConfetti(120), 250);
    }
    document.addEventListener("form-success", () => fireConfetti(90));
  }

})();

