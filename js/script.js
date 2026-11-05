/* ==========================================================================
   TEDDY CABS VELLORE — Site interactions & Booking System
   Vanilla JavaScript. No dependencies.
   ========================================================================== */

const TEDDY = {
  name: "Teddy Cabs Vellore",
  domain: "https://teddycabsvellore.com",
  whatsappNumber: "", // <-- e.g. "919876543210" (country code + number, digits only)
  phoneNumber: "",    // <-- e.g. "+91 98765 43210"
  email: ""           // <-- e.g. "hello@teddycabsvellore.com"
};

/* Centralized Tariff Rates & Vehicle Specifications (Indicative Estimates) */
const TARIFF_CONFIG = {
  currency: "₹",
  sedan: {
    name: "Sedan (Swift Dzire, Toyota Etios)",
    oneWayRate: "₹14 – ₹15 / km",
    roundTripRate: "₹13 – ₹14 / km",
    driverBata: "₹300 – ₹400 / day",
    capacity: "4 Passengers",
    luggage: "2 Bags",
    minOneWayKm: 130,
    minRoundTripKmPerDay: 250
  },
  suv: {
    name: "SUV (Toyota Innova, Maruti Ertiga)",
    oneWayRate: "₹19 – ₹20 / km",
    roundTripRate: "₹18 – ₹19 / km",
    driverBata: "₹300 – ₹400 / day",
    capacity: "6 – 7 Passengers",
    luggage: "3 – 4 Bags",
    minOneWayKm: 130,
    minRoundTripKmPerDay: 250
  },
  premium: {
    name: "Premium / Prime SUV (Innova Crysta)",
    oneWayRate: "₹20 – ₹21 / km",
    roundTripRate: "₹18 – ₹19 / km",
    driverBata: "₹400 / day",
    capacity: "6 – 7 Passengers",
    luggage: "4+ Bags",
    minOneWayKm: 130,
    minRoundTripKmPerDay: 250
  },
  note: "Tolls, parking and interstate permits are extra as per actual highway receipts."
};

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. Sticky header ------------------------------------------------ */
  function initHeader() {
    const header = $(".site-header");
    if (!header) return;
    const update = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* 2. Mobile sheet ------------------------------------------------- */
  function initMobileNav() {
    const toggle = $(".nav__toggle");
    const sheet = $(".nav__sheet");
    if (!toggle || !sheet) return;
    const close = () => {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      sheet.setAttribute("aria-hidden", "true");
    };
    const open = () => {
      document.body.classList.add("nav-open");
      toggle.setAttribute("aria-expanded", "true");
      sheet.setAttribute("aria-hidden", "false");
      const first = $("a", sheet);
      if (first) first.focus({ preventScroll: true });
    };
    toggle.addEventListener("click", () => (document.body.classList.contains("nav-open") ? close() : open()));
    $$("a", sheet).forEach((a) => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) { close(); toggle.focus(); }
    });
    window.addEventListener("resize", () => { if (window.innerWidth > 1024) close(); });
  }

  /* 3. Scroll reveals ----------------------------------------------- */
  function initReveals() {
    const items = $$("[data-reveal]");
    if (!items.length) return;
    if (!("IntersectionObserver" in window) || reduced) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el.dataset.delay) el.style.setProperty("--d", el.dataset.delay + "ms");
        el.classList.add("is-visible");
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -7% 0px", threshold: 0.08 });
    items.forEach((el) => io.observe(el));
  }

  /* 4. Section parallax (subtle, transform only) --------------------- */
  function initParallax() {
    const layers = $$("[data-parallax]");
    if (!layers.length || reduced) return;
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      layers.forEach((layer) => {
        const rect = layer.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        const speed = parseFloat(layer.dataset.parallax) || 0.06;
        layer.style.transform = `translate3d(0, ${((rect.top - vh / 2) * speed).toFixed(1)}px, 0)`;
      });
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }

  /* 5. FAQ accordion ------------------------------------------------- */
  function initAccordions() {
    $$("[data-faq]").forEach((group) => {
      const items = $$(".faq-item", group);
      items.forEach((item) => {
        const btn = $(".faq-q", item);
        const panel = $(".faq-a", item);
        if (!btn || !panel) return;
        btn.addEventListener("click", () => {
          const isOpen = item.classList.contains("is-open");
          items.forEach((other) => {
            other.classList.remove("is-open");
            const b = $(".faq-q", other); const p = $(".faq-a", other);
            if (b) b.setAttribute("aria-expanded", "false");
            if (p) p.style.height = "0px";
          });
          if (!isOpen) {
            item.classList.add("is-open");
            btn.setAttribute("aria-expanded", "true");
            panel.style.height = panel.scrollHeight + "px";
          }
        });
      });
      window.addEventListener("resize", () => {
        const open = $(".faq-item.is-open .faq-a", group);
        if (open) open.style.height = open.scrollHeight + "px";
      });
    });
  }

  /* 6. Validation helpers -------------------------------------------- */
  const mobilePattern = /^[6-9]\d{9}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  function setError(field, message) {
    const wrap = field.closest(".field");
    if (!wrap) return;
    wrap.classList.add("has-error");
    const err = $(".field__error", wrap);
    if (err) err.textContent = message;
    field.setAttribute("aria-invalid", "true");
  }
  function clearError(field) {
    const wrap = field.closest(".field");
    if (!wrap) return;
    wrap.classList.remove("has-error");
    field.removeAttribute("aria-invalid");
  }
  function validate(field) {
    const value = (field.value || "").trim();
    const type = field.dataset.validate;
    if (field.required && !value) { setError(field, field.dataset.requiredMessage || "This field is required."); return false; }
    if (value && type === "mobile" && !mobilePattern.test(value.replace(/[\s-]/g, ""))) {
      setError(field, "Please enter a valid 10-digit mobile number."); return false;
    }
    if (value && type === "email" && field.required && !emailPattern.test(value)) {
      setError(field, "Please enter a valid email address."); return false;
    }
    if (value && type === "past-date") {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (new Date(value) < today) { setError(field, "Please choose today or a future date."); return false; }
    }
    clearError(field);
    return true;
  }
  function status(el, html, warn) {
    if (!el) return;
    el.innerHTML = html;
    el.classList.add("is-visible");
    el.classList.toggle("form-status--warn", !!warn);
  }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (e) {
      const t = document.createElement("textarea");
      t.value = text; t.setAttribute("readonly", ""); t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
      document.body.removeChild(t);
      return ok;
    }
  }
  function copyRow(text) {
    const row = document.createElement("div");
    row.className = "copy-row";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn--outline btn--sm";
    btn.textContent = "Copy enquiry details";
    btn.addEventListener("click", async () => {
      const ok = await copyText(text);
      btn.textContent = ok ? "Copied to clipboard" : "Press Ctrl / Cmd + C to copy";
      setTimeout(() => (btn.textContent = "Copy enquiry details"), 3000);
    });
    row.appendChild(btn);
    return row;
  }
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* 7. Booking form -------------------------------------------------- */
  function initBooking() {
    const form = $("#bookingForm");
    if (!form) return;
    const out = $("#bookingStatus");
    const fields = $$("[data-validate], [required]", form);
    fields.forEach((f) => {
      f.addEventListener("input", () => { if (f.closest(".field")?.classList.contains("has-error")) validate(f); });
      f.addEventListener("blur", () => { if ((f.value || "").trim()) validate(f); });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = fields.map((f) => validate(f)).every(Boolean);
      if (!ok) {
        const first = $(".has-error input, .has-error select, .has-error textarea", form);
        if (first) first.focus();
        status(out, "<strong>Almost there.</strong> A few fields need a quick check before we can prepare your enquiry.", true);
        return;
      }
      const data = new FormData(form);
      const g = (k) => (data.get(k) || "").toString().trim();
      const message = [
        `NEW CAB ENQUIRY — ${TEDDY.name}`,
        "",
        `Name: ${g("name")}`,
        `Mobile: ${g("mobile")}`,
        "",
        `Journey type: ${g("journeyType")}`,
        `Pickup location: ${g("pickup")}`,
        `Drop location: ${g("drop")}`,
        `Pickup date: ${g("date")}`,
        `Pickup time: ${g("time")}`,
        `Passengers: ${g("passengers")}`,
        `Preferred vehicle: ${g("vehicle")}`,
        "",
        `Website: ${TEDDY.domain}`
      ].join("\n");

      if (!TEDDY.whatsappNumber) {
        status(out,
          `<strong>Thank you for preparing your enquiry.</strong> Online WhatsApp dispatch is currently being connected to our local desk. We have compiled your journey summary below — you can copy it to share directly with our team for immediate fare confirmation.`,
          true);
        const old = $(".copy-row", out); if (old) old.remove();
        out.appendChild(copyRow(message));
        return;
      }
      const url = `https://wa.me/${TEDDY.whatsappNumber}?text=${encodeURIComponent(message)}`;
      status(out, `<strong>Opening WhatsApp with your enquiry.</strong> Press send in WhatsApp to reach ${esc(TEDDY.name)}.`);
      const row = document.createElement("div");
      row.className = "copy-row";
      const a = document.createElement("a");
      a.className = "btn btn--sm"; a.href = url; a.target = "_blank"; a.rel = "noopener"; a.textContent = "Open WhatsApp";
      row.appendChild(a);
      out.appendChild(row);
      out.appendChild(copyRow(message));
      window.open(url, "_blank", "noopener");
    });
  }

  /* 8. Route / vehicle prefill --------------------------------------- */
  function initPrefill() {
    $$("[data-prefill-drop]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const form = $("#bookingForm");
        if (!form) return;
        const drop = form.querySelector('[name="drop"]');
        const pickup = form.querySelector('[name="pickup"]');
        const vehicle = form.querySelector('[name="vehicle"]');
        if (drop && btn.dataset.prefillDrop) drop.value = btn.dataset.prefillDrop;
        if (pickup && !pickup.value) pickup.value = "Vellore";
        if (vehicle && btn.dataset.prefillVehicle) vehicle.value = btn.dataset.prefillVehicle;
        const target = $("#booking") || form;
        target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
        setTimeout(() => form.querySelector('[name="name"]')?.focus({ preventScroll: true }), reduced ? 0 : 700);
      });
    });
  }

  /* 9. Contact form --------------------------------------------------- */
  function initContact() {
    const form = $("#contactForm");
    if (!form) return;
    const out = $("#contactStatus");
    const fields = $$("[data-validate], [required]", form);
    fields.forEach((f) => f.addEventListener("input", () => {
      if (f.closest(".field")?.classList.contains("has-error")) validate(f);
    }));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = fields.map((f) => validate(f)).every(Boolean);
      if (!ok) {
        status(out, "<strong>Please check the highlighted fields.</strong> Mobile number and journey date need attention.", true);
        const first = $(".has-error input, .has-error textarea", form);
        if (first) first.focus();
        return;
      }
      const data = new FormData(form);
      const g = (k) => (data.get(k) || "").toString().trim();
      const summary = [
        `ENQUIRY — ${TEDDY.name}`, "",
        `Name: ${g("cname")}`, `Mobile: ${g("cmobile")}`, `Email: ${g("cemail") || "Not provided"}`,
        `Pickup: ${g("cpickup")}`, `Destination: ${g("cdestination")}`, `Journey date: ${g("cdate")}`,
        `Message: ${g("cmessage") || "—"}`
      ].join("\n");
      status(out,
        `<strong>This form is not connected to the business yet.</strong> Nothing has been delivered — a backend or WhatsApp link still has to be configured before launch. Your enquiry is prepared below so you can copy it and share it once contact details are published.`,
        true);
      const old = $(".copy-row", out); if (old) old.remove();
      out.appendChild(copyRow(summary));
    });
  }

  /* 10. Small utilities ---------------------------------------------- */
  function initMisc() {
    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
    const today = new Date().toISOString().split("T")[0];
    $$('input[type="date"]').forEach((i) => (i.min = today));
    $$('a[href^="#"]').forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      link.addEventListener("click", (e) => {
        e.preventDefault();
        target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      });
    });
    // duplicate ticker content for a seamless loop
    $$(".hero__ticker-track").forEach((track) => {
      if (track.dataset.cloned === "true") return;
      track.innerHTML += track.innerHTML;
      track.dataset.cloned = "true";
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initMobileNav();
    initReveals();
    initParallax();
    initAccordions();
    initBooking();
    initPrefill();
    initContact();
    initMisc();
  });
})();
