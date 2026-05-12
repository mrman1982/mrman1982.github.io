document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (mainNav) {
    mainNav.classList.remove("active");
    mainNav.style.display = "";
  }
  if (navToggle) {
    navToggle.classList.remove("is-active");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }
  document.body.classList.remove("no-scroll");

  if (navToggle && mainNav) {
    const toggleMenu = () => {
      const open = !mainNav.classList.contains("active");
      mainNav.classList.toggle("active", open);
      navToggle.classList.toggle("is-active", open);
      document.body.classList.toggle("no-scroll", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    navToggle.addEventListener("click", toggleMenu);

    mainNav.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (link && mainNav.classList.contains("active")) {
        mainNav.classList.remove("active");
        navToggle.classList.remove("is-active");
        document.body.classList.remove("no-scroll");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      }
    });
  }

  const trackConversion = (eventName, details = {}) => {
    if (!eventName) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...details,
    });

    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, details);
    }
  };

  document.querySelectorAll("[data-track]").forEach((element) => {
    element.addEventListener("click", () => {
      trackConversion(element.dataset.track, {
        link_text: element.textContent.trim(),
        link_url: element.href || "",
      });
    });
  });

  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    if (!contactForm.hasAttribute("action")) {
      contactForm.setAttribute(
        "action",
        "https://formsubmit.co/david.mcelligott@hotmail.com"
      );
    }
    contactForm.addEventListener("submit", () => {
      trackConversion("form_submit", {
        form_id: contactForm.id,
        form_name: "Private AI assessment",
      });
    });
  }

  if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      try {
        const params = new URLSearchParams(location.search);
        if (params.has("no-sw")) {
          navigator.serviceWorker
            .getRegistrations()
            .then((regs) => Promise.all(regs.map((r) => r.unregister())))
            .then(() => caches.keys())
            .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
            .finally(() => {
              const url = new URL(location.href);
              url.searchParams.delete("no-sw");
              location.replace(url.toString());
            });
          return;
        }
      } catch (e) {
        console.warn("No-SW toggle failed", e);
      }
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.warn("SW registration failed", err));
    });
  }

  const copyrightYear = document.querySelector(".copyright");
  if (copyrightYear) {
    copyrightYear.innerHTML = `&copy; ${new Date().getFullYear()} Gen AI Solutions. All Rights Reserved.`;
  }
});
