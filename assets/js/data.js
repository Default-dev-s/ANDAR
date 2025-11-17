(function () {
    const STORAGE_KEY = "andarProducts";
    const AUTH_KEY = "andarAuth";
    const AUTH_USER = "admin@andar.com";
    const AUTH_PASS = "andar2025";
    const WHATSAPP_NUMBER = "573001234567";

    const defaultProducts = [
        {
            id: "aurora",
            name: "Camiseta Aurora",
            heroTag: "Colección cápsula 2025",
            heroDescription: "Pigmentos cálidos que se fusionan con un patrón minimalista inspirado en el amanecer. Aurora es suavidad y contraste, diseñada para acompañar cada movimiento.",
            highlightTitle: "Estilo radiante para días largos",
            price: 89900,
            sizes: ["S", "M", "L"],
            badges: ["Algodón orgánico", "Edición limitada", "Hecho en Medellín"],
            details: [
                "Confeccionada en algodón premium de 180 g con acabado peinado para una suavidad superior. Aurora tiene un corte relajado y cuello reforzado, ideal para combinar con denim o prendas athleisure.",
                "Recomendamos lavar al revés en ciclo suave con agua fría para preservar la intensidad del color."
            ],
            images: {
                cover: "https://res.cloudinary.com/dwzt9toco/image/upload/v1763389226/PHOTO-2025-08-03-11-30-15_ai72bl.jpg",
                main: "https://res.cloudinary.com/dwzt9toco/image/upload/v1763389226/PHOTO-2025-08-03-11-30-15_ai72bl.jpg",
                gallery: [
                    "https://res.cloudinary.com/dwzt9toco/image/upload/v1763389226/PHOTO-2025-07-27-13-57-06_1_rlobcy.jpg",
                    "https://res.cloudinary.com/dwzt9toco/image/upload/v1763389226/PHOTO-2025-07-27-13-57-06_arucsv.jpg",
                    "https://res.cloudinary.com/dwzt9toco/image/upload/v1763389226/PHOTO-2025-07-27-13-57-06_2_eo4jmo.jpg"
                ]
            },
            whatsappMessage: "Hola ANDAR, quiero comprar la camiseta Aurora"
        },
        {
            id: "minimal",
            name: "Camiseta Minimal",
            heroTag: "Colección cápsula 2025",
            heroDescription: "Una silueta limpia y versátil que juega con bloques de color neutros. Minimal combina tecnología anti-arrugas con un tacto ligero para movimientos fluidos.",
            highlightTitle: "Esencia pura para combinar sin límites",
            price: 94900,
            sizes: ["XS", "S", "M", "L"],
            badges: ["Anti-arrugas", "Secado rápido", "Unisex"],
            details: [
                "Estructura relajada en mezcla de algodón + modal, con costuras termo-selladas para mayor durabilidad. La camiseta Minimal está pensada para capas livianas y looks monocromáticos.",
                "Mantén su forma lavando en agua fría y secándola extendida. No requiere planchado."
            ],
            images: {
                cover: "https://res.cloudinary.com/dwzt9toco/image/upload/v1763389226/PHOTO-2025-07-27-13-57-06_1_rlobcy.jpg",
                main: "https://res.cloudinary.com/dwzt9toco/image/upload/v1763389226/PHOTO-2025-07-27-13-57-06_1_rlobcy.jpg",
                gallery: [
                    "https://res.cloudinary.com/dwzt9toco/image/upload/v1763389226/PHOTO-2025-08-03-11-30-15_ai72bl.jpg",
                    "https://res.cloudinary.com/dwzt9toco/image/upload/v1763389226/PHOTO-2025-07-27-13-57-06_arucsv.jpg",
                    "https://res.cloudinary.com/dwzt9toco/image/upload/v1763389226/PHOTO-2025-07-27-13-57-06_2_eo4jmo.jpg"
                ]
            },
            whatsappMessage: "Hola ANDAR, quiero comprar la camiseta Minimal"
        },
        {
            id: "urban",
            name: "Camiseta Urban",
            heroTag: "Colección cápsula 2025",
            heroDescription: "Inspirada en grafismos nocturnos y líneas arquitectónicas. Urban combina contrastes intensos con acabados técnicos para dominar la ciudad.",
            highlightTitle: "Carácter nocturno para moverte con libertad",
            price: 99900,
            sizes: ["M", "L", "XL"],
            badges: ["Tecnología anti-humedad", "Reflectivo ligero", "Hecho en Colombia"],
            details: [
                "Urban mezcla fibras técnicas con elastano para una caída ligera y adaptable. Cuenta con paneles de ventilación en los laterales y detalles reflectivos discretos para moverte en la noche.",
                "Lavar con colores similares y evitar secadora para mantener su elasticidad y brillo."
            ],
            images: {
                cover: "https://res.cloudinary.com/dwzt9toco/image/upload/v1763389226/PHOTO-2025-07-27-13-57-06_arucsv.jpg",
                main: "https://res.cloudinary.com/dwzt9toco/image/upload/v1763389226/PHOTO-2025-07-27-13-57-06_arucsv.jpg",
                gallery: [
                    "https://res.cloudinary.com/dwzt9toco/image/upload/v1763389226/PHOTO-2025-08-03-11-30-15_ai72bl.jpg",
                    "https://res.cloudinary.com/dwzt9toco/image/upload/v1763389226/PHOTO-2025-07-27-13-57-06_1_rlobcy.jpg",
                    "https://res.cloudinary.com/dwzt9toco/image/upload/v1763389226/PHOTO-2025-07-27-13-57-06_2_eo4jmo.jpg"
                ]
            },
            whatsappMessage: "Hola ANDAR, quiero comprar la camiseta Urban"
        }
    ];

    function getStoredProducts() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return null;
            }
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.every(validateProductShape)) {
                return parsed;
            }
        } catch (error) {
            console.warn("No se pudieron cargar los productos guardados:", error);
        }
        return null;
    }

    function validateProductShape(product) {
        return (
            product &&
            typeof product.id === "string" &&
            typeof product.name === "string" &&
            typeof product.price === "number" &&
            Array.isArray(product.sizes) &&
            Array.isArray(product.badges) &&
            product.images &&
            typeof product.images.cover === "string" &&
            typeof product.images.main === "string" &&
            Array.isArray(product.images.gallery)
        );
    }

    function saveProducts(products) {
        if (!Array.isArray(products)) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }

    function getProducts() {
        return getStoredProducts() || defaultProducts;
    }

    function findProductById(id) {
        return getProducts().find((product) => product.id === id) || null;
    }

    function formatPrice(value) {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }).format(value);
    }

    function login({ email, password }) {
        if (email === AUTH_USER && password === AUTH_PASS) {
            localStorage.setItem(AUTH_KEY, "true");
            return { success: true };
        }
        return { success: false, message: "Credenciales inválidas" };
    }

    function logout() {
        localStorage.removeItem(AUTH_KEY);
    }

    function isAuthenticated() {
        return localStorage.getItem(AUTH_KEY) === "true";
    }

    function clearProducts() {
        localStorage.removeItem(STORAGE_KEY);
    }

    function getWhatsappLink(message) {
        const text = encodeURIComponent(message || "Hola ANDAR, quiero conocer más del catálogo");
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    }

    window.ANDAR = Object.assign({}, window.ANDAR, {
        getProducts,
        saveProducts,
        findProductById,
        formatPrice,
        defaultProducts,
        clearProducts,
        login,
        logout,
        isAuthenticated,
        authUser: AUTH_USER,
        whatsappNumber: WHATSAPP_NUMBER,
        getWhatsappLink
    });
})();
