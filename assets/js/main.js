
      // Gunakan nomor WhatsApp aktif dengan format internasional tanpa +, spasi, atau tanda hubung.
      // Contoh format Indonesia: 6281234567890
      const WHATSAPP_NUMBER = "6281553333632";
      const themeToggle = document.getElementById("themeToggle");
      const themeIcon = themeToggle.querySelector("span");
      const themeColor = document.querySelector('meta[name="theme-color"]');
      const savedTheme = localStorage.getItem("ngopi-web-theme");
      const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      function applyTheme(theme) {
        const isDark = theme === "dark";
        document.documentElement.dataset.theme = theme;
        themeToggle.setAttribute("aria-pressed", String(isDark));
        themeToggle.setAttribute(
          "aria-label",
          isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap",
        );
        themeToggle.title = isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap";
        themeIcon.textContent = isDark ? "☀" : "☾";
        themeColor.setAttribute("content", isDark ? "#10151f" : "#111827");
      }
      applyTheme(savedTheme === "dark" || savedTheme === "light" ? savedTheme : preferredTheme);
      themeToggle.addEventListener("click", () => {
        const nextTheme =
          document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        localStorage.setItem("ngopi-web-theme", nextTheme);
        applyTheme(nextTheme);
      });
      const filters = document.querySelectorAll(".filter");
      const products = [...document.querySelectorAll(".product")];
      const searchInput = document.getElementById("searchInput");
      let activeFilter = "all";
      function filterProducts() {
        const query = searchInput.value.trim().toLowerCase();
        let visible = 0;
        products.forEach((card) => {
          const categoryOk =
            activeFilter === "all" || card.dataset.category === activeFilter;
          const searchOk = (card.dataset.search + " " + card.innerText)
            .toLowerCase()
            .includes(query);
          const show = categoryOk && searchOk;
          card.hidden = !show;
          if (show) visible++;
        });
        document.getElementById("noResults").hidden = visible !== 0;
      }
      filters.forEach((btn) =>
        btn.addEventListener("click", () => {
          filters.forEach((item) =>
            item.classList.toggle("active", item === btn),
          );
          activeFilter = btn.dataset.filter;
          filterProducts();
        }),
      );
      searchInput.addEventListener("input", filterProducts);
      function normalizeWhatsappNumber(rawNumber) {
        const digits = String(rawNumber || "").replace(/\D/g, "");
        if (!digits) return "";
        return digits.startsWith("62") ? digits : digits.startsWith("0") ? "62" + digits.slice(1) : "62" + digits;
      }
      function waLink(message) {
        const normalizedNumber = normalizeWhatsappNumber(WHATSAPP_NUMBER);
        if (!/^62\d{8,15}$/.test(normalizedNumber)) {
          alert(
            "Nomor WhatsApp belum diatur. Buka index.html lalu ganti WHATSAPP_NUMBER dengan nomor aktif berformat 62, misalnya 6281234567890.",
          );
          return null;
        }
        return (
          "https://wa.me/" +
          normalizedNumber +
          "?text=" +
          encodeURIComponent(message)
        );
      }
      document.querySelectorAll(".buy-btn").forEach((btn) =>
        btn.addEventListener("click", () => {
          const url = waLink(
            "Halo Ngopi Web, saya tertarik membeli " +
              btn.dataset.product +
              ". Harga yang tertera: " +
              btn.dataset.price +
              ". Bisa minta detail produk, demo, dan cara pembeliannya?",
          );
          if (url) window.open(url, "_blank", "noopener,noreferrer");
        }),
      );
      document.querySelectorAll(".service-btn").forEach((link) =>
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const url = waLink(
            "Halo Ngopi Web, saya ingin konsultasi tentang " +
              link.dataset.service +
              ". Bisa dibantu info layanan dan estimasi biayanya?",
          );
          if (url) window.open(url, "_blank", "noopener,noreferrer");
        }),
      );
      document.querySelectorAll("[data-demo]").forEach((link) =>
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const url = waLink(
            "Halo Ngopi Web, saya ingin melihat demo atau detail " +
              link.dataset.demo +
              ".",
          );
          if (url) window.open(url, "_blank", "noopener,noreferrer");
        }),
      );
      function openGeneralWA(e) {
        e.preventDefault();
        const url = waLink(
          "Halo Ngopi Web, saya ingin bertanya tentang produk digital dan jasa pembuatan website.",
        );
        if (url) window.open(url, "_blank", "noopener,noreferrer");
      }
      const revealTargets = document.querySelectorAll(
        ".hero-grid, .trust-item, .product, .service, .step, .cta, .section-head",
      );
      revealTargets.forEach((element, index) => {
        element.classList.add("reveal");
        element.style.transitionDelay = `${index * 80}ms`;
      });
      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          (entries, observerInstance) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observerInstance.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.15 },
        );
        revealTargets.forEach((element) => observer.observe(element));
      } else {
        revealTargets.forEach((element) => element.classList.add("is-visible"));
      }
      const heroVisual = document.querySelector(".hero-visual");
      if (heroVisual && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
        window.addEventListener("pointermove", (event) => {
          const { innerWidth, innerHeight } = window;
          const rotateY = ((event.clientX / innerWidth) - 0.5) * 8;
          const rotateX = (0.5 - event.clientY / innerHeight) * 8;
          heroVisual.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        window.addEventListener("pointerleave", () => {
          heroVisual.style.transform = "";
        });
      }
      document
        .getElementById("contactBtn")
        .addEventListener("click", openGeneralWA);
      document
        .getElementById("floatWa")
        .addEventListener("click", openGeneralWA);
      document.getElementById("year").textContent = new Date().getFullYear();
    