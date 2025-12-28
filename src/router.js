(function() {
  const container = document.getElementById("mainContent");
  const navLinks = document.querySelectorAll(".nav-link");

  function setActiveLink(page) {
    navLinks.forEach(link => {
      const hrefPage = link.getAttribute("href").slice(1);
      link.classList.remove("active"); // Remove 'active' from all links first
      if (hrefPage === page) {
        link.classList.add("active"); // Add 'active' to the matching link
      }
    });
  }

  async function loadPage() {
    if (!container) {
      console.error("#mainContent not found");
      return;
    }

    const page = window.location.hash.slice(1) || "home";
    setActiveLink(page);

    try {
      const module = await import(`./pages/${page}.js`);

      // Prioritize module.default, then try init or render
      let handler = module.default;
      if (!handler) {
        handler = module.init;
      } else if (!handler) {
        handler = module.render;
      }

      if (typeof handler !== "function") {
        throw new Error(`No render function (default, init, or render) found in ${page}.js`);
      }

      container.innerHTML = "";
      handler(container);

    } catch (err) {
      container.innerHTML = `
        <h1 class="page-title">404</h1>
        <p>Page "<strong>${window.location.hash.slice(1)}</strong>" not found.</p>
      `;
      console.error(err);
    }
  }

  window.addEventListener("hashchange", loadPage);
  document.addEventListener("DOMContentLoaded", loadPage);
})();