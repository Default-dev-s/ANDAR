(function () {
    function getQueryParam(key) {
        const params = new URLSearchParams(window.location.search);
        return params.get(key);
    }

    function renderHero(product) {
        const hero = document.getElementById("product-hero");
        const heroContent = document.getElementById("product-hero-content");
        const heroTag = document.getElementById("product-hero-tag");
        const heroName = document.getElementById("product-name");
        const heroDescription = document.getElementById("product-hero-description");

        if (!hero || !heroContent) return;

        hero.style.background = `linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(15, 23, 42, 0.75)), url(${product.images.main})`;
        hero.style.backgroundSize = "cover";
        hero.style.backgroundPosition = "center";

        heroTag.textContent = product.heroTag || "Colección cápsula";
        heroName.textContent = product.name;
        heroDescription.textContent = product.heroDescription || "";
    }

    function renderGallery(product) {
        const gallery = document.getElementById("product-gallery");
        if (!gallery) return;

        const mainImage = product.images.main;
        const thumbs = product.images.gallery || [];

        gallery.innerHTML = `
            <div class="main-image">
                <img id="product-main-image" src="${mainImage}" alt="${product.name}">
            </div>
            <div class="thumbs">
                ${thumbs
                    .map(
                        (src, index) => `
                        <img
                            src="${src}"
                            alt="Vista ${index + 1} de ${product.name}"
                            data-full="${src}"
                            class="product-thumb"
                        >`
                    )
                    .join("")}
            </div>
        `;

        const mainImageNode = document.getElementById("product-main-image");
        const thumbNodes = Array.from(gallery.querySelectorAll(".product-thumb"));

        thumbNodes.forEach((thumb) => {
            thumb.addEventListener("click", () => {
                const full = thumb.getAttribute("data-full");
                if (full) {
                    mainImageNode.setAttribute("src", full);
                }
                thumbNodes.forEach((node) => node.classList.remove("is-active"));
                thumb.classList.add("is-active");
            });
        });

        if (thumbNodes.length) {
            thumbNodes[0].classList.add("is-active");
        }
    }

    function renderSummary(product) {
        const summary = document.getElementById("product-summary");
        if (!summary) return;

        const price = ANDAR.formatPrice(product.price);
        const sizes = product.sizes || [];
        const badges = product.badges || [];
        const details = product.details || [];
        const whatsappLink = ANDAR.getWhatsappLink(product.whatsappMessage);

        summary.innerHTML = `
            <div>
                <h2>${product.highlightTitle || product.name}</h2>
                <p class="price-display">${price}</p>
            </div>
            <div class="badges">
                ${badges.map((badge) => `<span class="badge">${badge}</span>`).join("")}
            </div>
            <div>
                <h3>Tallas disponibles</h3>
                <div class="size-grid">
                    ${sizes.map((size) => `<span class="size-pill">${size}</span>`).join("")}
                </div>
            </div>
            <div>
                <h3>Descripción</h3>
                <div class="detail-description">
                    ${details.map((paragraph) => `<p>${paragraph}</p>`).join("")}
                </div>
            </div>
            <a class="btn btn-primary" href="${whatsappLink}" target="_blank" rel="noopener">Comprar por WhatsApp</a>
            <a class="back-link" href="index.html#catalogo">← Volver al catálogo</a>
        `;
    }

    function showFallback() {
        const section = document.getElementById("product-section");
        const fallback = document.getElementById("product-fallback");
        if (section) section.classList.add("hidden");
        if (fallback) fallback.classList.remove("hidden");
    }

    function init() {
        const productId = getQueryParam("id");
        if (!productId) {
            showFallback();
            return;
        }

        const product = ANDAR.findProductById(productId);
        if (!product) {
            showFallback();
            return;
        }

        renderHero(product);
        renderGallery(product);
        renderSummary(product);
    }

    document.addEventListener("DOMContentLoaded", init);
})();
