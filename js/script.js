document.addEventListener("DOMContentLoaded", () => {
  // Mobile Navigation Toggle
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (navToggle && mainNav) {
    const toggleMenu = () => {
      const open = !mainNav.classList.contains("active");
      mainNav.classList.toggle("active", open);
      navToggle.classList.toggle("is-active", open);
      document.body.classList.toggle("no-scroll", open);
    };

    navToggle.addEventListener("click", toggleMenu);

    // Close menu when a nav link is clicked (for single-page navigation)
    mainNav.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (link && mainNav.classList.contains("active")) {
        mainNav.classList.remove("active");
        navToggle.classList.remove("is-active");
        document.body.classList.remove("no-scroll");
      }
    });
  }

  // Contact Form Submission
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    // Set FormSubmit action at runtime so email is not exposed in page source
    if (!contactForm.hasAttribute("action")) {
      contactForm.setAttribute(
        "action",
        "https://formsubmit.co/david.mcelligott@hotmail.com"
      );
    }
    contactForm.addEventListener("submit", (e) => {
      // If the form has an action (handled by backend like FormSubmit), let it submit normally
      if (contactForm.hasAttribute("action")) {
        return; // allow native submission
      }
      e.preventDefault();

      // Get form data
      const formData = new FormData(contactForm);
      const name = formData.get("name");
      const email = formData.get("email");
      const subject = formData.get("subject");
      const message = formData.get("message");

      // For demonstration purposes, we'll just log it to the console
      // In a real-world scenario, you would send this to a server.
      console.log("Form Submitted!");
      console.log(`Name: ${name}`);
      console.log(`Email: ${email}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);

      // Provide feedback to the user
      alert("Thank you for your message! I will get back to you soon.");

      // Clear the form
      contactForm.reset();
    });
  }

  // Register Service Worker for offline caching
  if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      // Optional: allow disabling SW + clearing caches via ?no-sw=1
      try {
        const params = new URLSearchParams(location.search);
        if (params.has("no-sw")) {
          navigator.serviceWorker
            .getRegistrations()
            .then((regs) => Promise.all(regs.map((r) => r.unregister())))
            .then(() => caches.keys())
            .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
            .finally(() => {
              // Reload without query to avoid loops
              const url = new URL(location.href);
              url.searchParams.delete("no-sw");
              location.replace(url.toString());
            });
          return; // skip normal registration when disabling
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
