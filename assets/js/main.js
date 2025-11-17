(function () {
    function createProductCard(product) {
        const price = ANDAR.formatPrice(product.price);
        const sizes = product.sizes.join(", ");
        const detailUrl = `product.html?id=${encodeURIComponent(product.id)}`;

        return `
            <article class="product-card" data-product-id="${product.id}">
                <a href="${detailUrl}" class="product-link">
                    <div class="product-image">
                        <img src="${product.images.cover}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="product-price">${price}</p>
                        <p class="product-sizes">Tallas: ${sizes}</p>
                    </div>
                </a>
            </article>
        `;
    }

    function renderCatalog() {
        const container = document.getElementById("catalog-grid");
        if (!container) return;

        const products = ANDAR.getProducts();

        if (!products.length) {
            container.innerHTML = `
                <div class="catalog-empty">
                    <p>Aún no hay productos en el catálogo. Inicia sesión como administrador para agregar tus primeras camisetas.</p>
                    <a class="btn btn-primary" href="admin.html">Ir al panel</a>
                </div>
            `;
            return;
        }

        container.innerHTML = products.map(createProductCard).join("");
    }

    document.addEventListener("DOMContentLoaded", renderCatalog);
})();
