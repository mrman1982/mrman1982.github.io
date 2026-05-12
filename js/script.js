(() => {
  try {
    const savedTheme = localStorage.getItem("genai-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      document.documentElement.dataset.theme = savedTheme;
    }
  } catch (e) {
    console.warn("Theme preference unavailable", e);
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");
  const header = document.querySelector(".main-header");

  const getActiveTheme = () => {
    const explicitTheme = document.documentElement.dataset.theme;
    if (explicitTheme === "light" || explicitTheme === "dark") {
      return explicitTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const setTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("genai-theme", theme);
    } catch (e) {
      console.warn("Theme preference could not be saved", e);
    }
  };

  const updateThemeButton = (button) => {
    const activeTheme = getActiveTheme();
    const nextTheme = activeTheme === "dark" ? "light" : "dark";
    button.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
    button.setAttribute("title", `Switch to ${nextTheme} mode`);
    button.textContent = activeTheme === "dark" ? "Light" : "Dark";
  };

  if (header && !header.querySelector(".theme-toggle")) {
    const themeToggle = document.createElement("button");
    themeToggle.type = "button";
    themeToggle.className = "theme-toggle";
    updateThemeButton(themeToggle);
    themeToggle.addEventListener("click", () => {
      setTheme(getActiveTheme() === "dark" ? "light" : "dark");
      updateThemeButton(themeToggle);
    });
    header.insertBefore(themeToggle, navToggle || null);
  }

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

    try {
      const serviceLabels = {
        "ai-privacy-readiness-audit": "AI Privacy and Readiness Audit",
        "offline-ai-starter-setup": "Offline AI Starter Setup",
        "private-document-assistant": "Private Document Assistant",
        "offline-meeting-intelligence": "Offline Meeting Intelligence",
        "ai-safety-training": "AI Safety and Staff Training",
        "open-source-ai-setup": "Open-Source AI Setup",
        "kerry-ai-consultant": "AI Consultant Kerry",
      };
      const params = new URLSearchParams(window.location.search);
      const selectedService = serviceLabels[params.get("service")];
      if (selectedService) {
        const existingServiceInput = contactForm.querySelector(
          'input[name="Selected service"]'
        );
        const serviceInput =
          existingServiceInput || document.createElement("input");
        serviceInput.type = "hidden";
        serviceInput.name = "Selected service";
        serviceInput.value = selectedService;
        if (!existingServiceInput) {
          contactForm.appendChild(serviceInput);
        }
      }
    } catch (e) {
      console.warn("Service context could not be applied", e);
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
