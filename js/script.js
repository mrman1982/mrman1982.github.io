document.documentElement.classList.add("js-enabled");

// A small local index. Search queries and matches stay in the visitor's browser.
const siteSearchIndex = [
  {
    title: "Infrastructure and server setup",
    url: "/infrastructure-server-setup.html",
    text: "Set up business servers, shared files, workstations and access, with backup planning and a practical handover.",
    keywords: "server setup infrastructure shared storage backups virtual machines self hosted systems",
  },
  {
    title: "Websites and maintenance",
    url: "/website-maintenance.html",
    text: "Repair or update a business website, improve its structure and performance, and discuss ongoing maintenance.",
    keywords: "website websites hosting domain broken pages repairs maintenance",
  },
  {
    title: "Business email and IT support",
    url: "/business-email-it-support.html",
    text: "Help with domain email, mailbox and device setup, everyday business software and email migration planning.",
    keywords: "business email IT support DNS mail clients devices migration",
  },
  {
    title: "Online AI, integrations and automation",
    url: "/services.html#online-ai",
    text: "Put online AI tools to work on a useful business task, connect existing systems or plan an automation workflow.",
    keywords: "online AI cloud ChatGPT Copilot Gemini Claude integrations automation workflows",
  },
  {
    title: "Private and local AI assistants",
    url: "/services.html#offline-ai-setup",
    text: "Discuss a private AI assistant on your own hardware or controlled infrastructure, including offline and open-source options.",
    keywords: "private AI local AI offline AI ChatGPT style assistant open source self hosted setup",
  },
  {
    title: "Offline meeting transcription",
    url: "/services.html#offline-transcription",
    text: "Turn meeting recordings and voice notes into transcripts, summaries and action points in an agreed private workflow.",
    keywords: "offline meeting transcription recordings notes summaries interviews audio",
  },
  {
    title: "AI safety and staff training",
    url: "/services.html#training-governance",
    text: "Help staff choose suitable AI tasks, handle sensitive information, write clearer prompts and review the results.",
    keywords: "AI training staff workshop safety policies governance small business",
  },
  {
    title: "Private document assistants and fine-tuning explained",
    url: "/rag-fine-tuning-explained.html",
    text: "Understand private document search, source references, retrieval (RAG) and when fine-tuning may be useful. Includes a fictional example and human review.",
    keywords: "private document assistant search internal knowledge RAG retrieval fine tuning finetuning approved documents",
  },
  {
    title: "AI Privacy and Readiness Audit",
    url: "/ai-privacy-readiness-audit.html",
    text: "Review a possible AI use case, its data considerations and tool options, with a separately scoped audit and written action plan.",
    keywords: "AI privacy readiness audit assessment sensitive data risks plan",
  },
  {
    title: "AI tools and resources",
    url: "/ai-resources.html",
    text: "Choose a task before a tool. Explore online assistants, office productivity, integrations, automation and local AI through official resources.",
    keywords: "AI resources tools ChatGPT Claude Microsoft Copilot Google Gemini Power Automate n8n Ollama LM Studio learning",
  },
  {
    title: "IT services and AI in Kerry",
    url: "/kerry-generative-ai.html",
    text: "Discuss a practical IT or AI project with Gen AI Solutions in Tralee, Co. Kerry, working with businesses across Ireland.",
    keywords: "Kerry Tralee consultant local IT AI Ireland",
  },
  {
    title: "About Gen AI Solutions",
    url: "/about.html",
    text: "A direct working relationship for practical IT and AI projects, with clear scope, account ownership and handover.",
    keywords: "about Gen AI Solutions Tralee Kerry Ireland consultant",
  },
  {
    title: "Contact for IT and AI projects",
    url: "/contact.html",
    text: "Send a short enquiry about what you need to improve. You can also request a 20-minute call, arranged by email.",
    keywords: "contact enquiry consultation call email phone support",
  },
  {
    title: "Pricing and project scope guide",
    url: "/pricing.md",
    text: "Read how project scope, hardware, software, third-party costs and support affect a quote for IT or AI work.",
    keywords: "pricing price prices cost costs budget quote quotation project scope",
  },
  {
    title: "Privacy policy",
    url: "/privacy-policy.html",
    text: "How website enquiries and contact details are handled, including the contact form, external providers, local caching and privacy enquiries.",
    keywords: "privacy policy data protection personal information FormSubmit Zoho cookies caching",
  },
  {
    title: "Terms and engagement",
    url: "/terms.html",
    text: "Information about agreeing project scope, quotes, third-party costs, access, handover and support before paid work begins.",
    keywords: "terms engagement agreement scope payment project quote support",
  },
  {
    title: "IT and AI services",
    url: "/services.html",
    text: "Explore infrastructure, websites, business email, online and private AI, document assistants, transcription and staff training.",
    keywords: "all services business IT AI integrations automation open source self hosted",
  },
  {
    title: "Gen AI Solutions home",
    url: "/index.html",
    text: "Practical IT and AI for Irish businesses, based in Tralee, Co. Kerry and serving Ireland.",
    keywords: "home business servers websites email private online AI",
  },
];

function normaliseSiteSearch(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\bfine\s*tun(?:e|ed|es|ing)\b/g, "fine tuning")
    .trim();
}

function findSitePages(query) {
  const phrase = normaliseSiteSearch(query);
  if (!phrase) return [];
  const words = [...new Set(phrase.split(/\s+/))];

  return siteSearchIndex
    .map((item) => {
      const title = normaliseSiteSearch(item.title);
      const body = normaliseSiteSearch(`${item.text} ${item.keywords}`);
      const titleWords = new Set(title.split(/\s+/));
      const allWords = new Set(`${title} ${body}`.split(/\s+/));
      // All query words must match. A common word such as AI must not conceal
      // an unrelated second word, and "IT" must not match inside another word.
      if (!words.every((word) => allWords.has(word))) return null;
      const score =
        (title === phrase ? 40 : 0) +
        (` ${title} `.includes(` ${phrase} `) ? 20 : 0) +
        (` ${body} `.includes(` ${phrase} `) ? 8 : 0) +
        words.reduce((total, word) => total + (titleWords.has(word) ? 5 : 1), 0);
      return { ...item, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
}

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
    const closeMenu = (restoreFocus = false) => {
      mainNav.classList.remove("active");
      navToggle.classList.remove("is-active");
      document.body.classList.remove("no-scroll");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
      if (restoreFocus) {
        navToggle.focus();
      }
    };

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
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && mainNav.classList.contains("active")) {
        closeMenu(true);
      }
    });

    const desktopMenu = window.matchMedia("(min-width: 861px)");
    desktopMenu.addEventListener("change", (event) => {
      if (event.matches) {
        closeMenu();
      }
    });
  }

  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    if (!contactForm.hasAttribute("action")) {
      contactForm.setAttribute(
        "action",
        "https://formsubmit.co/support@gen-ai-solutions.com"
      );
    }

    // Return to the site visitors used, including Railway and a new domain.
    // Without JavaScript, FormSubmit supplies its own confirmation page.
    if (["https:", "http:"].includes(window.location.protocol)) {
      const nextInput = document.createElement("input");
      nextInput.type = "hidden";
      nextInput.name = "_next";
      nextInput.value = new URL("/thank-you.html", window.location.origin).href;
      contactForm.appendChild(nextInput);
    }

    try {
      const serviceLabels = {
        "infrastructure-server-setup": "Infrastructure and server setup",
        "website-maintenance": "Website work and maintenance",
        "business-email-it-support": "Business email and everyday IT",
        "online-ai": "Online AI, integrations and automation",
        "ai-privacy-readiness-audit": "AI Privacy and Readiness Audit",
        "offline-ai-starter-setup": "Offline AI Starter Setup",
        "private-document-assistant": "Private Document Assistant",
        "offline-meeting-intelligence": "Offline Meeting Intelligence",
        "ai-safety-training": "AI Safety and Staff Training",
        "open-source-ai-setup": "Open-Source AI Setup",
        "kerry-ai-consultant": "IT and AI project in Kerry",
      };
      const serviceFields = {
        "infrastructure-server-setup": "service-infrastructure",
        "website-maintenance": "service-website",
        "business-email-it-support": "service-business-email",
        "online-ai": "service-online-ai",
        "ai-privacy-readiness-audit": "service-ai-audit",
        "offline-ai-starter-setup": "service-local-ai",
        "private-document-assistant": "service-document-search",
        "offline-meeting-intelligence": "service-transcription",
        "ai-safety-training": "service-ai-training",
        "open-source-ai-setup": "service-open-source",
      };
      const params = new URLSearchParams(window.location.search);
      const serviceKey = params.get("service");
      if (Object.prototype.hasOwnProperty.call(serviceLabels, serviceKey)) {
        const selectedService = serviceLabels[serviceKey];
        const serviceField = serviceFields[serviceKey]
          ? contactForm.querySelector(`#${serviceFields[serviceKey]}`)
          : null;
        if (serviceField) {
          serviceField.checked = true;
          const optionalDetails = serviceField.closest("details");
          if (optionalDetails) optionalDetails.open = true;
        }
        const selectedContext = document.getElementById("selected-service-context");
        if (selectedContext) {
          selectedContext.textContent = `Your link selected ${selectedService}. You can add or change service choices in the optional project details.`;
          selectedContext.hidden = false;
        }
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
  }

  const searchForm = document.getElementById("site-search");
  const searchInput = document.getElementById("q");
  const searchResults = document.getElementById("results");
  if (searchForm && searchInput && searchResults) {
    const renderSearch = () => {
      const query = searchInput.value.trim();
      const matches = findSitePages(query);
      searchResults.replaceChildren();
      const status = document.createElement("p");
      status.className = "muted";
      if (!normaliseSiteSearch(query)) {
        status.textContent = "Try business email, online AI, fine-tuning, pricing or privacy policy. You can also browse the page links below.";
      } else if (!matches.length) {
        status.textContent = "No matching pages. Try fewer words or a different task, such as server setup or document search. Browse below, or contact me if you are unsure where to start.";
      } else {
        status.textContent = `${matches.length} matching ${matches.length === 1 ? "page" : "pages"}.`;
      }
      searchResults.appendChild(status);
      matches.forEach((match) => {
        const result = document.createElement("article");
        result.className = "result";
        const heading = document.createElement("h2");
        const link = document.createElement("a");
        link.href = match.url;
        link.textContent = match.title;
        heading.appendChild(link);
        const snippet = document.createElement("p");
        snippet.className = "muted";
        snippet.textContent = match.text;
        result.append(heading, snippet);
        searchResults.appendChild(result);
      });
    };

    const params = new URLSearchParams(window.location.search);
    searchInput.value = params.get("q") || "";
    renderSearch();
    searchInput.addEventListener("input", renderSearch);
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const url = new URL(window.location.href);
      if (searchInput.value.trim()) url.searchParams.set("q", searchInput.value.trim());
      else url.searchParams.delete("q");
      window.history.replaceState(null, "", url);
      renderSearch();
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
