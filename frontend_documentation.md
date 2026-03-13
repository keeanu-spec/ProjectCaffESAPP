# Documentación del Frontend - CaffeApp ☕

Este documento detalla las vistas y funcionalidades implementadas en el frontend de CaffeApp para servir de guía en la posterior integración con el backend.

## Arquitectura y Tecnologías
- **Framework**: React (creado con Vite)
- **Rutas**: manejadas por `react-router-dom`
- **Estilos**: Vanilla CSS puro, temático de cafetería cálida ("Coffee Theme") basado en paleta de dorados, marrones y beige.
- **Ruta Base API (Pendiente)**: Las peticiones al backend están actualmente mockeadas o comentadas preparadas para Axios o Fetch.

---

## 1. Vista de Inicio de Sesión (LoginView)
**Ruta**: `/` (Archivo: `Login.jsx`)

Es la página de aterrizaje de la aplicación.
- **Funcionalidad**: Formulario simple que solicita `Email` y `Contraseña`.
- **Integración**: Actualmente hay un delay simulado (`setTimeout` de 1.5s). Deberá conectarse al endpoint de Login del backend para validar credenciales y obtener un Token (JWT).
- **Flujo**: Al hacer inicio de sesión con éxito, la app redirige a `/menu`.
- **Enlaces**: Posee un enlace en la parte inferior "¿No tienes cuenta? Regístrate" que lleva a `/register`.

---

## 2. Vista de Registro (RegisterView)
**Ruta**: `/register` (Archivo: `Register.jsx`)

Formulario complejo multipaso/largo para nuevos usuarios de la institución.
- **Campos Recopilados**:
  - Datos personales: `Nombre`, `Apellidos`, `Email`, `Contraseña`.
  - Académicos: `Institución` (selector), `Curso` (input texto), `Turno` (selector: mañana/tarde/noche).
  - Alergias: Múltiple selección de alérgenos basada en 14 categorías europeas estándar (Gluten, Lácteos, Soja, etc.).
  - Avatar: Selección visual de un icono de perfil (ej. 👨‍🎓, 👩‍💻, ☕, etc.).
- **Integración**: Tras validar los campos (manejado en el frontend visualmente), envía un objeto con todos los datos. El backend deberá proveer un endpoint para crear usuarios.
- **Flujo**: Tras registrar, redirige a `/`.

---

## 3. Catálogo de Productos (MenuCatalogView) - *Vista Principal*
**Ruta**: `/menu` (Archivo: `MenuCatalog.jsx`)

Es la vista principal post-login. Sustituye al antiguo "Dashboard".
- **Funcionalidad**: Muestra la lista de productos disponibles en la cafetería.
- **Componentes**:
  - **Buscador (Search)**: Búsqueda por texto (nombre/descripción).
  - **Filtro de Categorías**: Píldoras para filtrar por "Bebidas Calientes", "Comida", "Postres", etc.
  - **Filtro de Alérgenos (Inverso)**: Permite seleccionar qué alérgenos ocultar (ej. si marcas "Lácteos", oculta todo lo que tenga lácteos).
  - **Toggle de Vista**: Alternar entre formato Cuadrícula (grid) y Lista (list).
  - **Barra de Navegación Inferior (Fija)**: 5 botones (Inicio, Avisos, [+] Nueva orden, Pedidos, Perfil). El botón de "Pedidos" dirige a `/checkout`.
  - **Tarjetas de Producto**: Muestran nombre, descripción, precio, y las insignias (badges) de los alérgenos que contienen.
- **Interacción**: Al tocar la tarjeta de un producto, la app navega a `/product/:id`.
- **Integración backend**: Deberá consumir un endpoint `GET /products` que devuelva el catálogo.

---

## 4. Detalle y Personalización del Producto (ProductDetailView)
**Ruta**: `/product/:id` (Archivo: `ProductDetail.jsx`)

Vista detallada que muestra información extensa del producto y opciones de personalización.
- **Funcionalidad**:
  - Muestra la información "Hero" (nombre, descripción, alérgenos).
  - **Ingredientes Base**: Lista de ingredientes. Hay ingredientes "fijos" y otros "quitables" (ej. "Sin lechuga"). Quitar ingredientes **no afecta al precio base**.
  - **Extras**: Lista de añadidos opcionales (ej. "+ Shot de café", "+ Sirope", "+ Huevo frito"). Cada extra tiene un precio asignado y se puede incrementar/reducir la cantidad.
  - **Selector de Cantidad**: Para pedir X unidades del mismo producto personalizado.
  - **Barra fija inferior**: Botón "Añadir al carrito" que calcula en vivo el **Precio Total = (Precio Base + Sumatoria Extras) x Cantidad**.
- **Integración backend**: Deberá consumir `GET /products/:id` para traer no solo el producto sino su array de `ingredients` (con flag `removable`) y su array de `extras`.
- **Flujo**: Al añadir al carrito simula guardarlo en un contexto, y a los 1.5s navega a `/checkout`.

---

## 5. Carrito y Pasarela de Pago (CheckoutView)
**Ruta**: `/checkout` (Archivo: `Checkout.jsx`)

Gestión final del pedido antes de la facturación. Se divide en dos pasos visuales: "Resumen (Carrito)" y "Pago".
- **Paso 1: Resumen (Carrito)**
  - Lista los artículos añadidos. Para cada artículo muestra: las notas (`"Sin: X"`, `"Extras: Y"`), el precio base y la cantidad.
  - Permite modificar las cantidades directo en el carrito o eliminar la línea.
  - Muestra el subtotal desglosado.
- **Paso 2: Formulario de Pago**
  - Solicita tarjeta de crédito (único método de pago aceptado visualmente porque no hay monedero, según requirimientos).
  - Renderiza una tarjeta virtual que se pinta según el tipo de tarjeta (Visa, Mastercard, Amex, etc.) dependiendo del número ingresado.
  - Validaciones de longitud, fecha (MM/YY) y CVV en el frontend.
- **Paso 3: Éxito**
  - Tras procesar, muestra vista de éxito animada y genera un Nº de Pedido ficticio (#CAF-XXXX) estimando "5-10 minutos" de recogida.
- **Integración backend**: El backend deberá recibir el objeto del pedido (items, customizaciones y datos de pago tokenizados idealmente) en un endpoint tipo `POST /orders/checkout`.

---
*Generado automáticamente por Antigravity AI - Marzo 2026*
