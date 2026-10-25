
/* =========================================
   PRATIK ROY — CREATOR PORTFOLIO
   SCRIPT.JS — PART 1 OF 2
   Navigation, theme, projects and details
   ========================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- HELPER ---------- */

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function scrollToElement(element) {
    if (!element) return;

    element.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start"
    });
  }

  /* ---------- CURRENT YEAR ---------- */

  const yearElement = $("#current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* ---------- MOBILE NAVIGATION ---------- */

  const menuToggle = $("#menu-toggle");
  const primaryNav = $("#primary-nav");

  function closeMenu() {
    if (!menuToggle || !primaryNav) return;

    primaryNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }

  if (menuToggle && primaryNav) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-controls", "primary-nav");

    menuToggle.addEventListener("click", () => {
      const isOpen = primaryNav.classList.toggle("is-open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    $$("#primary-nav a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (
        primaryNav.classList.contains("is-open") &&
        !primaryNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  /* ---------- THEME SWITCH ---------- */

  const themeToggle = $("#theme-toggle");
  const root = document.documentElement;
  const themeStorageKey = "pr-portfolio-theme";

  function applyTheme(theme) {
    const validTheme = theme === "light" ? "light" : "dark";

    root.dataset.theme = validTheme;

    if (themeToggle) {
      const nextTheme = validTheme === "dark" ? "light" : "dark";

      themeToggle.setAttribute(
        "aria-label",
        `Switch to ${nextTheme} theme`
      );

      themeToggle.setAttribute("aria-pressed", String(validTheme === "light"));
      themeToggle.setAttribute("title", `Switch to ${nextTheme} theme`);
    }
  }

  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem(themeStorageKey);
  } catch {
    // The site still works if browser storage is unavailable.
  }

  applyTheme(savedTheme === "light" ? "light" : "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme =
        root.dataset.theme === "dark" ? "light" : "dark";

      applyTheme(nextTheme);

      try {
        localStorage.setItem(themeStorageKey, nextTheme);
      } catch {
        // Theme switching still works for the current page.
      }
    });
  }

  /* ---------- ACTIVE NAVIGATION LINK ---------- */

  const navigationLinks = $$("#primary-nav a[href^='#']");
  const pageSections = $$("[data-section]");

  if ("IntersectionObserver" in window && pageSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (!visibleSections.length) return;

        const currentId = visibleSections[0].target.id;

        navigationLinks.forEach((link) => {
          const isCurrent = link.hash === `#${currentId}`;

          if (isCurrent) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: [0, 0.15, 0.35, 0.6]
      }
    );

    pageSections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  /* ---------- PROJECT FILTERS ---------- */

  const filterButtons = $$("[data-filter]");
  const projectCards = $$(".project-card");

  function filterProjects(category) {
    projectCards.forEach((card) => {
      const cardCategory = card.dataset.category || "";
      const shouldShow =
        category === "all" || cardCategory === category;

      card.hidden = !shouldShow;
    });

    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === category;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  filterButtons.forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("active"))
    );

    button.addEventListener("click", () => {
      filterProjects(button.dataset.filter || "all");
    });
  });

  /* ---------- PROJECT DETAIL VIEW ---------- */

  const projectDetail = $("#project-detail");
  const workSection = $("#work");
  const detailBack = $("#detail-back");

  const detailFields = {
    category: $("#detail-category"),
    title: $("#detail-title"),
    intro: $("#detail-intro"),
    challenge: $("#detail-challenge"),
    approach: $("#detail-approach"),
    outcome: $("#detail-outcome"),
    focus: $("#detail-focus"),
    tools: $("#detail-tools")
  };

  /*
   * These are placeholder demo descriptions.
   * They are not claims about completed client work.
   * We will replace these with our own real demo projects.
   */

  const demoProjects = {

    visual: {
      category: "Visual design · Demo concept",
      title: "Creative Identity Study",
      intro:
        "A sample visual identity exploring typography, colour, composition and a consistent digital presentation.",
      challenge:
        "A creative brand needs a recognisable visual direction across different content formats.",
      approach:
        "The concept uses a focused palette, bold type, geometric shapes and reusable layout principles.",
      outcome:
        "This is an illustrative design concept, not a commissioned client identity.",
      focus: [
        "Visual hierarchy",
        "Typography",
        "Colour systems",
        "Brand consistency"
      ],
      tools: [
        "Design principles",
        "CSS",
        "Illustration"
      ]
    },

    game: {
      category: "Game design · Demo concept",
      title: "Mini Adventure Concept",
      intro:
        "A visual concept for a small game environment with platforms, a player character and a simple interface.",
      challenge:
        "A game scene should communicate its environment and points of interaction at a glance.",
      approach:
        "The concept explores layered scenery, contrasting shapes, simple character artwork and a compact HUD.",
      outcome:
        "This illustration is a concept only. It does not claim to be a completed or playable game.",
      focus: [
        "Environment design",
        "Gameplay concepts",
        "Visual storytelling",
        "Interface design"
      ],
      tools: [
        "Game design",
        "Illustration",
        "Prototyping"
      ]
    }
  };

  function fillList(element, items) {
    if (!element) return;

    element.replaceChildren();

    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      element.appendChild(li);
    });
  }

  function openProject(projectKey) {
    const project = demoProjects[projectKey];

    if (!project || !projectDetail) return;

    const values = {
      category: project.category,
      title: project.title,
      intro: project.intro,
      challenge: project.challenge,
      approach: project.approach,
      outcome: project.outcome
    };

    Object.entries(values).forEach(([key, value]) => {
      const element = detailFields[key];

      if (element) element.textContent = value;
    });

    fillList(detailFields.focus, project.focus);
    fillList(detailFields.tools, project.tools);

    if (workSection) workSection.hidden = true;

    projectDetail.hidden = false;
    scrollToElement(projectDetail);
  }

  $$("[data-project]").forEach((card) => {
    const projectKey = card.dataset.project;

    card.addEventListener("click", (event) => {
      // Allow normal clicks on links inside a project card.
      if (event.target.closest("a")) return;

      // Avoid triggering the card when a separate button
      // is meant to do something else.
      const separateButton = event.target.closest(
        "button:not(.icon-button)"
      );

      if (separateButton) return;

      openProject(projectKey);
    });

    card.addEventListener("keydown", (event) => {
      if (
        event.target === card &&
        (event.key === "Enter" || event.key === " ")
      ) {
        event.preventDefault();
        openProject(projectKey);
      }
    });
  });

  // Support project detail buttons inside cards.
  $$(".project-card [data-project-open]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      const card = button.closest("[data-project]");
      if (card) openProject(card.dataset.project);
    });
  });

  function closeProject() {
    if (!projectDetail) return;

    projectDetail.hidden = true;

    if (workSection) {
      workSection.hidden = false;
      scrollToElement(workSection);
    }
  }

  if (detailBack) {
    detailBack.addEventListener("click", closeProject);
  }

  /* ---------- SCRIPT PART 1 END ---------- */
});


/* =========================================
   PRATIK ROY — CREATOR PORTFOLIO
   SCRIPT.JS — PART 2 OF 2
   Articles, contact form and final polish
   Append below Part 1
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- ARTICLE SEARCH ---------- */

  const searchInput = $("#content-search");
  const contentCards = $$(".content-card");
  const searchCount = $("#search-count");
  const noResults = $("#no-results");

  function updateArticleSearch() {
    const query = (searchInput?.value || "")
      .trim()
      .toLocaleLowerCase();

    let visibleCount = 0;

    contentCards.forEach((card) => {
      const searchableText = [
        card.textContent || "",
        card.dataset.topics || ""
      ].join(" ").toLocaleLowerCase();

      const matches = searchableText.includes(query);

      card.hidden = !matches;

      if (matches) visibleCount += 1;
    });

    if (searchCount) {
      searchCount.textContent =
        `${visibleCount} ${visibleCount === 1 ? "article" : "articles"} found`;
    }

    if (noResults) {
      noResults.hidden = visibleCount !== 0;
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", updateArticleSearch);
    updateArticleSearch();
  } else {
    if (searchCount) {
      searchCount.textContent =
        `${contentCards.length} ${contentCards.length === 1 ? "article" : "articles"}`;
    }

    if (noResults) {
      noResults.hidden = contentCards.length !== 0;
    }
  }

  /* ---------- EXPANDABLE ARTICLES ---------- */

  $$(".article-expand").forEach((button) => {
    const article = button.closest(".content-card");
    const fullContent = article?.querySelector(".article-full");

    if (!fullContent) return;

    // Connect the button to its content accessibly.
    if (!fullContent.id) {
      fullContent.id =
        `article-details-${Math.random().toString(36).slice(2, 10)}`;
    }

    button.setAttribute("aria-controls", fullContent.id);

    const initiallyExpanded =
      button.getAttribute("aria-expanded") === "true";

    button.setAttribute(
      "aria-expanded",
      String(initiallyExpanded)
    );

    fullContent.hidden = !initiallyExpanded;

    function setExpanded(expanded) {
      button.setAttribute("aria-expanded", String(expanded));
      fullContent.hidden = !expanded;

      const label = button.querySelector("[data-expand-label]");

      if (label) {
        label.textContent = expanded ? "Show less" : "Read more";
      } else {
        const text = button.childNodes;

        // Preserve any decorative arrow or icon inside the button.
        const textNode = Array.from(text).find(
          (node) =>
            node.nodeType === Node.TEXT_NODE &&
            node.textContent.trim().length > 0
        );

        if (textNode) {
          textNode.textContent = expanded
            ? " Show less "
            : " Read more ";
        }
      }
    }

    button.addEventListener("click", () => {
      const currentlyExpanded =
        button.getAttribute("aria-expanded") === "true";

      setExpanded(!currentlyExpanded);
    });
  });

  // Native details/summary articles also work without extra controls.
  $$("details").forEach((details) => {
    details.addEventListener("toggle", () => {
      details.dataset.expanded = String(details.open);
    });
  });

  /* ---------- CONTACT FORM VALIDATION ---------- */

  const contactForm = $("#contact-form");
  const formStatus = $("#form-status");
  const submitButton = $("#contact-submit");

  function showFormStatus(message, type = "") {
    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.classList.remove("success", "error");

    if (type) {
      formStatus.classList.add(type);
    }

    formStatus.setAttribute("role", type === "error" ? "alert" : "status");
    formStatus.setAttribute("aria-live", "polite");
  }

  function setInvalid(field, invalid) {
    if (!field) return;

    if (invalid) {
      field.setAttribute("aria-invalid", "true");
    } else {
      field.removeAttribute("aria-invalid");
    }
  }

  function validateContactForm() {
    if (!contactForm) return false;

    const name = $("#contact-name", contactForm);
    const email = $("#contact-email", contactForm);
    const subject = $("#contact-subject", contactForm);
    const message = $("#contact-message", contactForm);

    const fields = [name, email, subject, message].filter(Boolean);

    fields.forEach((field) => setInvalid(field, false));

    let firstInvalid = null;

    function markInvalid(field, errorMessage) {
      if (!field) return;

      setInvalid(field, true);

      if (!firstInvalid) {
        firstInvalid = field;
        showFormStatus(errorMessage, "error");
      }
    }

    if (!name || !name.value.trim()) {
      markInvalid(name, "Please enter your name.");
    } else if (name.value.trim().length < 2) {
      markInvalid(name, "Please enter a name with at least 2 characters.");
    }

    const emailValue = email?.value.trim() || "";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValue) {
      markInvalid(email, "Please enter your email address.");
    } else if (!emailPattern.test(emailValue)) {
      markInvalid(email, "Please enter a valid email address.");
    }

    if (subject && !subject.value.trim()) {
      markInvalid(subject, "Please enter a subject.");
    }

    if (!message || !message.value.trim()) {
      markInvalid(message, "Please enter a message.");
    } else if (message.value.trim().length < 10) {
      markInvalid(message, "Please write a little more (at least 10 characters).");
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return false;
    }

    return true;
  }

  if (contactForm) {
    const fields = $$(
      "#contact-name, #contact-email, #contact-subject, #contact-message",
      contactForm
    );

    fields.forEach((field) => {
      field.addEventListener("input", () => {
        setInvalid(field, false);
      });
    });

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Honeypot: ignore submissions that fill the hidden field.
      const honeypot = $("#contact-website", contactForm);

      if (honeypot && honeypot.value.trim()) {
        showFormStatus(
          "Your message could not be processed. Please try again.",
          "error"
        );
        return;
      }

      if (!validateContactForm()) return;

      /*
       * Configure a real HTTPS form endpoint here when ready.
       * Example providers include Formspree or a custom backend.
       * Leave empty until you have created and tested the endpoint.
       */
      const FORM_ENDPOINT = "https://formspree.io/f/mzedqwrw";

      const formData = new FormData(contactForm);

      const payload = {
        name: String(formData.get("name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        subject: String(formData.get("subject") || "").trim(),
        message: String(formData.get("message") || "").trim()
      };

      if (!FORM_ENDPOINT) {
        showFormStatus(
          "Your details look valid, but this form is not connected to message delivery yet. Your message has NOT been sent. Please use one of the direct contact links on this page.",
          "error"
        );
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute("aria-busy", "true");
      }

      showFormStatus("Sending your message…");

      try {
        const response = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error("The service did not accept the message.");
        }

        showFormStatus(
          "Thanks! Your message was submitted successfully.",
          "success"
        );

        contactForm.reset();

        fields.forEach((field) => setInvalid(field, false));
      } catch (error) {
        showFormStatus(
          "We couldn't send your message. Please try again or use a direct contact link.",
          "error"
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.removeAttribute("aria-busy");
        }
      }
    });
  }

  /* ---------- BACK-TO-TOP LINKS ---------- */

  $$('a[href="#top"], a[href="#home"], .back-top').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetHash = link.getAttribute("href");

      if (targetHash !== "#top" && targetHash !== "#home") return;

      const target =
        document.querySelector(targetHash) ||
        document.querySelector("#home");

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });

      if (target.id) {
        history.replaceState(null, "", `#${target.id}`);
      }
    });
  });

  /* ---------- EXTERNAL LINKS ---------- */

  $$('a[target="_blank"]').forEach((link) => {
    const relValues = new Set(
      (link.getAttribute("rel") || "").split(/\s+/).filter(Boolean)
    );

    relValues.add("noopener");
    relValues.add("noreferrer");

    link.setAttribute("rel", Array.from(relValues).join(" "));
  });

  /* ---------- CURRENT NAVIGATION STATE ---------- */

  function markCurrentNavigation() {
    const currentHash = window.location.hash || "#home";

    $$("#primary-nav a[href^='#']").forEach((link) => {
      if (link.hash === currentHash) {
        link.setAttribute("aria-current", "location");
      }
    });
  }

  markCurrentNavigation();

  window.addEventListener("hashchange", markCurrentNavigation);

  /* ---------- FINAL SCRIPT PART ---------- */
});
