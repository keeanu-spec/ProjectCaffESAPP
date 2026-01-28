Proyecto_keeanu_Yunai/
│
├── 📄 .gitignore           (Para ignorar node_modules y .env en ambos lados)
│
├── 📂 backend/             (Tu Servidor Node.js + Express)
│   ├── 📄 .env             (Tus claves de Supabase y Puerto - ¡NO SUBIR A GITHUB!)
│   ├── 📄 index.js         (Punto de entrada: Configuración del servidor)
│   ├── 📄 package.json
│   │
│   └── 📂 src/
│       ├── 📂 Supabase/
│       │   └── 📄 client.js      (Conexión única a la DB)
│       │
│       ├── 📂 controllers/       (Lógica: Qué hacer cuando piden datos)
│       │   ├── 📄 productsController.js
│       │   ├── 📄 usersController.js
│       │   └── 📄 ordersController.js
│       │
│       └── 📂 routes/            (Rutas: /api/productos, /api/usuarios...)
│           ├── 📄 productsRoutes.js
│           └── 📄 usersRoutes.js
│
└── 📂 frontend/            (Tu Aplicación React)
    ├── 📄 package.json
    ├── 📂 public/          (Iconos, index.html)
    │
    └── 📂 src/
        ├── 📄 index.js     (Punto de entrada de React)
        ├── 📄 App.js       (Configuración de Rutas y Estructura base)
        ├── 📄 App.css      (Estilos globales)
        │
        ├── 📂 constants/   (Textos fijos y Códigos)
        │   └── 📄 errorCodes.js  (Diccionario de errores: "CART_EMPTY", etc.)
        │
        ├── 📂 utils/       (Funciones de ayuda)
        │   └── 📄 errorHandler.js (Tu traductor de errores Backend -> Frontend)
        │
        ├── 📂 services/    (Llamadas a la API - Fetchs limpios)
        │   └── 📄 api.js   (Funciones: getProducts(), loginUser()...)
        │
        ├── 📂 context/     (Estados Globales - El "cerebro" de la app)
        │   ├── 📄 AuthContext.js  (Datos del usuario logueado)
        │   └── 📄 CartContext.js  (Carrito de compras y totales)
        │
        ├── 📂 pages/       (Vistas completas / Pantallas)
        │   ├── 📄 HomePage.js
        │   ├── 📄 MenuPage.js     (Catálogo de productos)
        │   ├── 📄 CartPage.js     (Resumen de pedido y pago)
        │   ├── 📄 ProfilePage.js  (Historial y Datos)
        │   └── 📄 LoginPage.js
        │
        └── 📂 components/  (Piezas de LEGO reutilizables)
            ├── 📂 common/         (Botones, Inputs, LoadingSpinner)
            ├── 📂 layout/         (Navbar, Footer, Sidebar)
            │
            ├── 📂 products/       (Relacionado con tablas 'productos')
            │   ├── 📄 ProductCard.js
            │   └── 📄 CategoryFilter.js
            │
            ├── 📂 cart/           (Relacionado con 'pedidos'/'detalles')
            │   ├── 📄 CartItem.js
            │   └── 📄 CartSummary.js
            │
            └── 📂 user/           (Relacionado con 'usuarios'/'tarjetas')
                └── 📄 PaymentMethods.js