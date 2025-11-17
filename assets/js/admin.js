(function () {
    const loginView = document.getElementById("login-view");
    const dashboardView = document.getElementById("dashboard-view");
    const loginForm = document.getElementById("login-form");
    const loginError = document.getElementById("login-error");
    const adminEmailLabel = document.getElementById("admin-email");
    const logoutBtn = document.getElementById("logout-btn");
    const restoreBtn = document.getElementById("restore-btn");
    const flashBanner = document.getElementById("dashboard-flash");
    const productForm = document.getElementById("product-form");
    const saveBtn = document.getElementById("save-product-btn");
    const cancelEditBtn = document.getElementById("cancel-edit-btn");
    const formTitle = document.getElementById("form-title");
    const productCount = document.getElementById("product-count");
    const productsWrapper = document.getElementById("products-wrapper");
    const productsEmpty = document.getElementById("products-empty");
    const productsTableBody = document.querySelector("#products-table tbody");

    let editingId = null;

    function toggleViews(isAuthenticated) {
        if (isAuthenticated) {
            loginView.classList.add("hidden");
            dashboardView.classList.remove("hidden");
            adminEmailLabel.textContent = ANDAR.authUser;
            renderProducts();
        } else {
            dashboardView.classList.add("hidden");
            loginView.classList.remove("hidden");
            loginForm.reset();
        }
    }

    function showError(message) {
        if (!loginError) return;
        loginError.textContent = message;
        loginError.classList.remove("hidden");
    }

    function hideError() {
        if (!loginError) return;
        loginError.textContent = "";
        loginError.classList.add("hidden");
    }

    function showFlash(message, timeout = 3200) {
        if (!flashBanner) return;
        flashBanner.textContent = message;
        flashBanner.classList.remove("hidden");
        if (timeout) {
            setTimeout(() => flashBanner.classList.add("hidden"), timeout);
        }
    }

    function parseListValue(value) {
        if (!value) return [];
        return value
            .split(/[\n,]/)
            .map((item) => item.trim())
            .filter(Boolean);
    }

    function getProductFormData() {
        const formData = new FormData(productForm);
        const id = (formData.get("id") || "").trim().toLowerCase();
        const name = (formData.get("name") || "").trim();
        const price = Number(formData.get("price"));
        const heroTag = (formData.get("heroTag") || "").trim();
        const highlightTitle = (formData.get("highlightTitle") || "").trim();
        const heroDescription = (formData.get("heroDescription") || "").trim();
        const sizes = parseListValue(formData.get("sizes"));
        const badges = parseListValue(formData.get("badges"));
        const details = parseListValue(formData.get("details"));
        const whatsappMessage = (formData.get("whatsappMessage") || "").trim();
        const coverImage = (formData.get("coverImage") || "").trim();
        const mainImage = (formData.get("mainImage") || "").trim();
        const gallery = parseListValue(formData.get("gallery"));

        if (!id || !name || !Number.isFinite(price)) {
            throw new Error("Debes completar identificador, nombre y precio válido.");
        }

        return {
            id,
            name,
            heroTag,
            heroDescription,
            highlightTitle,
            price,
            sizes,
            badges,
            details,
            whatsappMessage,
            images: {
                cover: coverImage || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
                main: mainImage || coverImage || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
                gallery: gallery.length ? gallery : [coverImage || mainImage].filter(Boolean)
            }
        };
    }

    function resetForm() {
        editingId = null;
        productForm.reset();
        formTitle.textContent = "Registrar nueva camiseta";
        saveBtn.textContent = "Guardar camiseta";
        cancelEditBtn.classList.add("hidden");
        productForm.querySelector("#product-id").disabled = false;
    }

    function fillForm(product) {
        editingId = product.id;
        formTitle.textContent = `Editando ${product.name}`;
        saveBtn.textContent = "Actualizar camiseta";
        cancelEditBtn.classList.remove("hidden");

        productForm.querySelector("#product-id").value = product.id;
        productForm.querySelector("#product-id").disabled = true;
        productForm.querySelector("#product-name").value = product.name;
        productForm.querySelector("#product-price").value = product.price;
        productForm.querySelector("#product-hero-tag").value = product.heroTag || "";
        productForm.querySelector("#product-highlight-title").value = product.highlightTitle || "";
        productForm.querySelector("#product-hero-description").value = product.heroDescription || "";
        productForm.querySelector("#product-sizes").value = (product.sizes || []).join(", ");
        productForm.querySelector("#product-badges").value = (product.badges || []).join(", ");
        productForm.querySelector("#product-details").value = (product.details || []).join("\n");
        productForm.querySelector("#product-whatsapp").value = product.whatsappMessage || "";
        productForm.querySelector("#product-cover").value = product.images?.cover || "";
        productForm.querySelector("#product-main").value = product.images?.main || "";
        productForm.querySelector("#product-gallery").value = (product.images?.gallery || []).join("\n");
    }

    function renderProducts() {
        const products = ANDAR.getProducts();
        productCount.textContent = products.length;

        if (!products.length) {
            productsWrapper.classList.add("hidden");
            productsEmpty.classList.remove("hidden");
            productsTableBody.innerHTML = "";
            return;
        }

        productsWrapper.classList.remove("hidden");
        productsEmpty.classList.add("hidden");

        productsTableBody.innerHTML = products
            .map((product) => {
                const price = ANDAR.formatPrice(product.price);
                const sizes = (product.sizes || []).join(", ");
                const badgeCount = (product.badges || []).length;
                const detailLink = `product.html?id=${encodeURIComponent(product.id)}`;
                return `
                    <tr data-id="${product.id}">
                        <td>
                            <div><strong>${product.name}</strong></div>
                            <div class="muted">${product.id}</div>
                        </td>
                        <td>${price}</td>
                        <td>${sizes || "-"}</td>
                        <td>
                            ${badgeCount ? `<span class="badge-pill">${badgeCount}</span>` : "-"}
                        </td>
                        <td>
                            <div class="table-actions">
                                <button type="button" class="btn-link" data-action="view">Ver</button>
                                <button type="button" class="btn-link" data-action="edit">Editar</button>
                                <button type="button" class="btn-danger" data-action="delete">Eliminar</button>
                            </div>
                        </td>
                    </tr>
                `;
            })
            .join("");
    }

    function handleTableClick(event) {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const row = button.closest("tr[data-id]");
        if (!row) return;

        const productId = row.getAttribute("data-id");
        const product = ANDAR.findProductById(productId);
        const action = button.getAttribute("data-action");

        if (!product) {
            showFlash("No se encontró el producto seleccionado", 2800);
            return;
        }

        switch (action) {
            case "view":
                window.open(`product.html?id=${encodeURIComponent(product.id)}`, "_blank");
                break;
            case "edit":
                fillForm(product);
                break;
            case "delete":
                confirmDelete(product);
                break;
            default:
                break;
        }
    }

    function confirmDelete(product) {
        const confirmed = window.confirm(
            `¿Eliminar la camiseta "${product.name}" del catálogo? Esta acción no se puede deshacer.`
        );
        if (!confirmed) return;

        const products = ANDAR.getProducts().filter((item) => item.id !== product.id);
        ANDAR.saveProducts(products);
        showFlash(`Se eliminó ${product.name} del catálogo.`);
        if (editingId === product.id) {
            resetForm();
        }
        renderProducts();
    }

    function handleProductSubmit(event) {
        event.preventDefault();
        try {
            const data = getProductFormData();
            const products = ANDAR.getProducts();
            const exists = products.some((product) => product.id === data.id);

            let nextProducts;
            if (editingId) {
                nextProducts = products.map((product) => (product.id === editingId ? data : product));
            } else {
                if (exists) {
                    throw new Error("Ya existe un producto con este identificador.");
                }
                nextProducts = products.concat(data);
            }

            ANDAR.saveProducts(nextProducts);
            renderProducts();
            showFlash(editingId ? "Producto actualizado con éxito." : "Producto creado y publicado.");
            resetForm();
        } catch (error) {
            showFlash(error.message || "No pudimos guardar la información.", 3600);
        }
    }

    function handleLogin(event) {
        event.preventDefault();
        hideError();
        const data = {
            email: loginForm.querySelector("#login-email").value.trim(),
            password: loginForm.querySelector("#login-password").value.trim()
        };
        const result = ANDAR.login(data);
        if (!result.success) {
            showError(result.message || "No pudimos iniciar sesión.");
            return;
        }
        toggleViews(true);
        showFlash("Bienvenido al panel de ANDAR", 2800);
    }

    function handleLogout() {
        ANDAR.logout();
        toggleViews(false);
    }

    function handleRestore() {
        const confirmed = window.confirm(
            "¿Restaurar el catálogo original? Se perderán los cambios y productos personalizados."
        );
        if (!confirmed) return;
        ANDAR.clearProducts();
        ANDAR.saveProducts(ANDAR.defaultProducts);
        renderProducts();
        showFlash("Catálogo restaurado a la colección base.");
        if (editingId) {
            resetForm();
        }
    }

    function init() {
        if (loginForm) {
            loginForm.addEventListener("submit", handleLogin);
        }
        if (logoutBtn) {
            logoutBtn.addEventListener("click", handleLogout);
        }
        if (restoreBtn) {
            restoreBtn.addEventListener("click", handleRestore);
        }
        if (productsTableBody) {
            productsTableBody.addEventListener("click", handleTableClick);
        }
        if (productForm) {
            productForm.addEventListener("submit", handleProductSubmit);
        }
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener("click", resetForm);
        }

        toggleViews(ANDAR.isAuthenticated());
    }

    document.addEventListener("DOMContentLoaded", init);
})();
