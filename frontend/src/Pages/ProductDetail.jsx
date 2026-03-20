// src/pages/ProductDetail.jsx
import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ProductDetail.css';

// Extended product data with ingredients and extras
const PRODUCTS_DETAIL = {
    1: {
        id: 1, name: 'Café Espresso', price: 2.50, image: '☕',
        category: 'bebidas-calientes',
        description: 'Café espresso intenso y cremoso, preparado con granos selectos tostados artesanalmente.',
        allergens: [],
        ingredients: [
            { id: 'i1', name: 'Café arábica molido', removable: false },
            { id: 'i2', name: 'Agua filtrada', removable: false },
        ],
        extras: [
            { id: 'e1', name: 'Shot extra de café', price: 0.50, icon: '☕' },
            { id: 'e2', name: 'Leche espumada', price: 0.60, icon: '🥛' },
            { id: 'e3', name: 'Sirope de vainilla', price: 0.40, icon: '🍶' },
            { id: 'e4', name: 'Sirope de caramelo', price: 0.40, icon: '🍯' },
            { id: 'e5', name: 'Nata montada', price: 0.50, icon: '🍦' },
        ]
    },
    2: {
        id: 2, name: 'Café Latte', price: 3.50, image: '☕',
        category: 'bebidas-calientes',
        description: 'Suave café latte con leche espumosa y un toque cremoso irresistible.',
        allergens: [7],
        ingredients: [
            { id: 'i1', name: 'Café arábica molido', removable: false },
            { id: 'i2', name: 'Leche entera', removable: true },
            { id: 'i3', name: 'Espuma de leche', removable: true },
        ],
        extras: [
            { id: 'e1', name: 'Shot extra de café', price: 0.50, icon: '☕' },
            { id: 'e2', name: 'Leche de avena', price: 0.40, icon: '🌾' },
            { id: 'e3', name: 'Sirope de vainilla', price: 0.40, icon: '🍶' },
            { id: 'e4', name: 'Canela', price: 0.20, icon: '🫚' },
            { id: 'e5', name: 'Nata montada', price: 0.50, icon: '🍦' },
        ]
    },
    3: {
        id: 3, name: 'Cappuccino', price: 3.50, image: '☕',
        category: 'bebidas-calientes',
        description: 'Espresso clásico con espuma de leche densa y cremosa.',
        allergens: [7],
        ingredients: [
            { id: 'i1', name: 'Café arábica molido', removable: false },
            { id: 'i2', name: 'Leche entera', removable: true },
            { id: 'i3', name: 'Espuma densa de leche', removable: true },
            { id: 'i4', name: 'Cacao en polvo', removable: true },
        ],
        extras: [
            { id: 'e1', name: 'Shot extra de café', price: 0.50, icon: '☕' },
            { id: 'e2', name: 'Sirope de chocolate', price: 0.50, icon: '🍫' },
            { id: 'e3', name: 'Canela', price: 0.20, icon: '🫚' },
            { id: 'e4', name: 'Nata montada', price: 0.50, icon: '🍦' },
        ]
    },
    4: {
        id: 4, name: 'Chocolate Caliente', price: 3.00, image: '🍫',
        category: 'bebidas-calientes',
        description: 'Chocolate fundido con leche caliente, intenso y reconfortante.',
        allergens: [7, 1],
        ingredients: [
            { id: 'i1', name: 'Chocolate negro', removable: false },
            { id: 'i2', name: 'Leche entera', removable: true },
            { id: 'i3', name: 'Azúcar', removable: true },
        ],
        extras: [
            { id: 'e1', name: 'Nata montada', price: 0.50, icon: '🍦' },
            { id: 'e2', name: 'Marshmallows', price: 0.40, icon: '🍡' },
            { id: 'e3', name: 'Canela', price: 0.20, icon: '🫚' },
            { id: 'e4', name: 'Leche de avena', price: 0.40, icon: '🌾' },
        ]
    },
    9: {
        id: 9, name: 'Croissant', price: 2.25, image: '🥐',
        category: 'bolleria',
        description: 'Croissant de mantequilla francés, hojaldrado y dorado al horno.',
        allergens: [1, 3, 7],
        ingredients: [
            { id: 'i1', name: 'Harina de trigo', removable: false },
            { id: 'i2', name: 'Mantequilla', removable: false },
            { id: 'i3', name: 'Huevo', removable: false },
            { id: 'i4', name: 'Azúcar', removable: false },
            { id: 'i5', name: 'Levadura', removable: false },
        ],
        extras: [
            { id: 'e1', name: 'Relleno de chocolate', price: 0.75, icon: '🍫' },
            { id: 'e2', name: 'Relleno de jamón y queso', price: 1.00, icon: '🧀' },
            { id: 'e3', name: 'Mermelada', price: 0.40, icon: '🍓' },
            { id: 'e4', name: 'Mantequilla extra', price: 0.30, icon: '🧈' },
        ]
    },
    12: {
        id: 12, name: 'Sándwich Mixto', price: 4.50, image: '🥪',
        category: 'comida',
        description: 'Sándwich clásico de jamón cocido y queso fundido a la plancha.',
        allergens: [1, 7],
        ingredients: [
            { id: 'i1', name: 'Pan de molde', removable: false },
            { id: 'i2', name: 'Jamón cocido', removable: true },
            { id: 'i3', name: 'Queso fundido', removable: true },
            { id: 'i4', name: 'Mantequilla', removable: true },
        ],
        extras: [
            { id: 'e1', name: 'Huevo frito', price: 0.75, icon: '🍳' },
            { id: 'e2', name: 'Tomate natural', price: 0.30, icon: '🍅' },
            { id: 'e3', name: 'Lechuga', price: 0.20, icon: '🥬' },
            { id: 'e4', name: 'Bacon', price: 0.80, icon: '🥓' },
            { id: 'e5', name: 'Queso extra', price: 0.50, icon: '🧀' },
        ]
    },
    13: {
        id: 13, name: 'Ensalada César', price: 5.50, image: '🥗',
        category: 'comida',
        description: 'Ensalada fresca con lechuga, pollo a la plancha, parmesano y croutons crujientes.',
        allergens: [1, 3, 4, 7],
        ingredients: [
            { id: 'i1', name: 'Lechuga romana', removable: false },
            { id: 'i2', name: 'Pechuga de pollo', removable: true },
            { id: 'i3', name: 'Queso parmesano', removable: true },
            { id: 'i4', name: 'Croutons', removable: true },
            { id: 'i5', name: 'Salsa César', removable: true },
        ],
        extras: [
            { id: 'e1', name: 'Huevo duro', price: 0.50, icon: '🥚' },
            { id: 'e2', name: 'Aguacate', price: 0.80, icon: '🥑' },
            { id: 'e3', name: 'Bacon crujiente', price: 0.80, icon: '🥓' },
            { id: 'e4', name: 'Tomates cherry', price: 0.40, icon: '🍅' },
        ]
    },
    15: {
        id: 15, name: 'Brownie', price: 3.00, image: '🍫',
        category: 'postres',
        description: 'Brownie de chocolate intenso, denso y jugoso con trozos de nuez.',
        allergens: [1, 3, 7, 8],
        ingredients: [
            { id: 'i1', name: 'Chocolate negro', removable: false },
            { id: 'i2', name: 'Harina de trigo', removable: false },
            { id: 'i3', name: 'Huevo', removable: false },
            { id: 'i4', name: 'Mantequilla', removable: false },
            { id: 'i5', name: 'Nueces', removable: true },
            { id: 'i6', name: 'Azúcar moreno', removable: false },
        ],
        extras: [
            { id: 'e1', name: 'Helado de vainilla', price: 1.00, icon: '🍦' },
            { id: 'e2', name: 'Nata montada', price: 0.50, icon: '🍨' },
            { id: 'e3', name: 'Sirope de chocolate', price: 0.40, icon: '🍫' },
            { id: 'e4', name: 'Frutos rojos', price: 0.70, icon: '🍓' },
        ]
    },
};

const ALLERGEN_MAP = {
    1: { name: 'Gluten', icon: '🌾' },
    2: { name: 'Crustáceos', icon: '🦐' },
    3: { name: 'Huevos', icon: '🥚' },
    4: { name: 'Pescado', icon: '🐟' },
    5: { name: 'Cacahuetes', icon: '🥜' },
    6: { name: 'Soja', icon: '🫘' },
    7: { name: 'Lácteos', icon: '🥛' },
    8: { name: 'Frutos secos', icon: '🌰' },
    9: { name: 'Apio', icon: '🥬' },
    10: { name: 'Mostaza', icon: '🟡' },
    11: { name: 'Sésamo', icon: '🫓' },
    12: { name: 'Sulfitos', icon: '🍷' },
    13: { name: 'Altramuces', icon: '🌿' },
    14: { name: 'Moluscos', icon: '🐚' },
};

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = PRODUCTS_DETAIL[id];

    const [removedIngredients, setRemovedIngredients] = useState([]);
    const [addedExtras, setAddedExtras] = useState({}); // { extraId: quantity }
    const [quantity, setQuantity] = useState(1);
    const [showAddedFeedback, setShowAddedFeedback] = useState(false);

    if (!product) {
        return (
            <div className="detail-wrapper">
                <div className="detail-not-found">
                    <span className="nf-icon">🔍</span>
                    <h2>Producto no encontrado</h2>
                    <p>Este producto no tiene vista de detalle todavía.</p>
                    <button className="btn-back-menu" onClick={() => navigate('/menu')}>
                        ← Volver al menú
                    </button>
                </div>
            </div>
        );
    }

    const toggleIngredient = (ingredientId) => {
        setRemovedIngredients(prev =>
            prev.includes(ingredientId)
                ? prev.filter(i => i !== ingredientId)
                : [...prev, ingredientId]
        );
    };

    const addExtra = (extraId) => {
        setAddedExtras(prev => ({
            ...prev,
            [extraId]: (prev[extraId] || 0) + 1
        }));
    };

    const removeExtra = (extraId) => {
        setAddedExtras(prev => {
            const current = prev[extraId] || 0;
            if (current <= 1) {
                const { [extraId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [extraId]: current - 1 };
        });
    };

    const extrasTotal = useMemo(() => {
        return Object.entries(addedExtras).reduce((sum, [extraId, qty]) => {
            const extra = product.extras.find(e => e.id === extraId);
            return sum + (extra ? extra.price * qty : 0);
        }, 0);
    }, [addedExtras, product.extras]);

    const unitPrice = product.price + extrasTotal;
    const totalPrice = unitPrice * quantity;

    const totalExtrasCount = Object.values(addedExtras).reduce((s, q) => s + q, 0);

    const handleAddToCart = () => {
        setShowAddedFeedback(true);
        // Simulate adding to cart, then navigate to checkout
        setTimeout(() => {
            setShowAddedFeedback(false);
            navigate('/checkout');
        }, 1500);

        console.log('Added to cart:', {
            product: product.name,
            removedIngredients,
            addedExtras,
            quantity,
            unitPrice,
            totalPrice,
        });
    };

    return (
        <div className="detail-wrapper">
            {/* Header */}
            <div className="detail-header">
                <button className="back-btn" onClick={() => navigate('/menu')}>
                    ←
                </button>
                <h1 className="detail-header-title">Detalle</h1>
                <div className="header-spacer" />
            </div>

            {/* Product Hero */}
            <div className="product-hero">
                <div className="hero-emoji">{product.image}</div>
                <div className="hero-info">
                    <h2 className="hero-name">{product.name}</h2>
                    <p className="hero-desc">{product.description}</p>
                    {product.allergens.length > 0 && (
                        <div className="hero-allergens">
                            {product.allergens.map(aId => (
                                <span key={aId} className="hero-allergen-badge" title={ALLERGEN_MAP[aId]?.name}>
                                    {ALLERGEN_MAP[aId]?.icon} {ALLERGEN_MAP[aId]?.name}
                                </span>
                            ))}
                        </div>
                    )}
                    <div className="hero-price">
                        <span className="base-price">{product.price.toFixed(2)} €</span>
                        <span className="price-label">Precio base</span>
                    </div>
                </div>
            </div>

            {/* Ingredients Section */}
            <div className="detail-section">
                <h3 className="section-heading">
                    <span className="heading-icon">📋</span>
                    Ingredientes
                </h3>
                <p className="section-hint">Puedes quitar ingredientes sin coste adicional</p>
                <div className="ingredients-list">
                    {product.ingredients.map(ing => {
                        const isRemoved = removedIngredients.includes(ing.id);
                        return (
                            <div
                                key={ing.id}
                                className={`ingredient-item ${isRemoved ? 'removed' : ''} ${!ing.removable ? 'fixed' : ''}`}
                            >
                                <div className="ingredient-info">
                                    <span className={`ingredient-name ${isRemoved ? 'line-through' : ''}`}>
                                        {ing.name}
                                    </span>
                                    {!ing.removable && (
                                        <span className="ingredient-tag">Base</span>
                                    )}
                                </div>
                                {ing.removable && (
                                    <button
                                        className={`ingredient-toggle ${isRemoved ? 'is-removed' : ''}`}
                                        onClick={() => toggleIngredient(ing.id)}
                                    >
                                        {isRemoved ? '+ Añadir' : '✕ Quitar'}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
                {removedIngredients.length > 0 && (
                    <p className="removed-note">
                        {removedIngredients.length} ingrediente{removedIngredients.length > 1 ? 's' : ''} quitado{removedIngredients.length > 1 ? 's' : ''} — sin coste
                    </p>
                )}
            </div>

            {/* Extras Section */}
            <div className="detail-section">
                <h3 className="section-heading">
                    <span className="heading-icon">✨</span>
                    Extras
                </h3>
                <p className="section-hint">Personaliza tu pedido con ingredientes adicionales</p>
                <div className="extras-list">
                    {product.extras.map(extra => {
                        const qty = addedExtras[extra.id] || 0;
                        return (
                            <div key={extra.id} className={`extra-item ${qty > 0 ? 'active' : ''}`}>
                                <div className="extra-left">
                                    <span className="extra-icon">{extra.icon}</span>
                                    <div className="extra-info">
                                        <span className="extra-name">{extra.name}</span>
                                        <span className="extra-price">+{extra.price.toFixed(2)} €</span>
                                    </div>
                                </div>
                                <div className="extra-controls">
                                    {qty > 0 && (
                                        <button className="qty-btn minus" onClick={() => removeExtra(extra.id)}>−</button>
                                    )}
                                    {qty > 0 && (
                                        <span className="qty-value">{qty}</span>
                                    )}
                                    <button className="qty-btn plus" onClick={() => addExtra(extra.id)}>+</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {totalExtrasCount > 0 && (
                    <div className="extras-summary">
                        <span>{totalExtrasCount} extra{totalExtrasCount > 1 ? 's' : ''}</span>
                        <span className="extras-total">+{extrasTotal.toFixed(2)} €</span>
                    </div>
                )}
            </div>

            {/* Bottom Action Bar */}
            <div className="detail-action-bar">
                <div className="quantity-selector">
                    <button
                        className="qty-action-btn"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                    >
                        −
                    </button>
                    <span className="qty-display">{quantity}</span>
                    <button
                        className="qty-action-btn"
                        onClick={() => setQuantity(q => q + 1)}
                    >
                        +
                    </button>
                </div>
                <button
                    className={`btn-add-to-cart ${showAddedFeedback ? 'added' : ''}`}
                    onClick={handleAddToCart}
                >
                    {showAddedFeedback ? (
                        <span>✓ Añadido</span>
                    ) : (
                        <>
                            <span>Añadir al carrito</span>
                            <span className="cart-total">{totalPrice.toFixed(2)} €</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;
