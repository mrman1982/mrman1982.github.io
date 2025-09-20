document.addEventListener("DOMContentLoaded", () => {
  // FORCE RESET mobile navigation on every page load
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  // Immediately reset everything - no conditions
  if (mainNav) {
    mainNav.classList.remove("active");
    mainNav.style.display = ""; // Reset inline styles
  }
  if (navToggle) {
    navToggle.classList.remove("is-active");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }
  document.body.classList.remove("no-scroll");

  // Mobile Navigation Toggle
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

    // Close menu when a nav link is clicked
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

  // Contact Form Submission
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    if (!contactForm.hasAttribute("action")) {
      contactForm.setAttribute(
        "action",
        "https://formsubmit.co/david.mcelligott@hotmail.com"
      );
    }
    contactForm.addEventListener("submit", (e) => {
      if (contactForm.hasAttribute("action")) {
        return;
      }
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = formData.get("name");
      const email = formData.get("email");
      const subject = formData.get("subject");
      const message = formData.get("message");

      console.log("Form Submitted!");
      console.log(`Name: ${name}`);
      console.log(`Email: ${email}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);

      alert("Thank you for your message! I will get back to you soon.");
      contactForm.reset();
    });
  }

  // Register Service Worker
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

  // Update copyright year
  const copyrightYear = document.querySelector(".copyright");
  if (copyrightYear) {
    copyrightYear.innerHTML = `&copy; ${new Date().getFullYear()} Gen AI Solutions. All Rights Reserved.`;
  }
});
