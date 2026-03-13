// src/pages/MenuCatalog.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MenuCatalog.css';

// Mock data — se reemplazará con datos del backend
const PRODUCTS = [
    {
        id: 1, name: 'Café Espresso', price: 2.50, image: '☕',
        category: 'bebidas-calientes',
        description: 'Café espresso intenso y cremoso',
        allergens: []
    },
    {
        id: 2, name: 'Café Latte', price: 3.50, image: '☕',
        category: 'bebidas-calientes',
        description: 'Café con leche espumosa',
        allergens: [7] // Lácteos
    },
    {
        id: 3, name: 'Cappuccino', price: 3.50, image: '☕',
        category: 'bebidas-calientes',
        description: 'Espresso con espuma de leche',
        allergens: [7] // Lácteos
    },
    {
        id: 4, name: 'Chocolate Caliente', price: 3.00, image: '🍫',
        category: 'bebidas-calientes',
        description: 'Chocolate fundido con leche',
        allergens: [7, 1] // Lácteos, Gluten
    },
    {
        id: 5, name: 'Té Verde', price: 2.00, image: '🍵',
        category: 'bebidas-calientes',
        description: 'Té verde japonés orgánico',
        allergens: []
    },
    {
        id: 6, name: 'Zumo de Naranja', price: 2.75, image: '🍊',
        category: 'bebidas-frias',
        description: 'Zumo natural recién exprimido',
        allergens: []
    },
    {
        id: 7, name: 'Smoothie de Fresa', price: 4.00, image: '🍓',
        category: 'bebidas-frias',
        description: 'Smoothie cremoso con fresas frescas',
        allergens: [7] // Lácteos
    },
    {
        id: 8, name: 'Agua Mineral', price: 1.50, image: '💧',
        category: 'bebidas-frias',
        description: 'Agua mineral natural',
        allergens: []
    },
    {
        id: 9, name: 'Croissant', price: 2.25, image: '🥐',
        category: 'bolleria',
        description: 'Croissant de mantequilla francés',
        allergens: [1, 3, 7] // Gluten, Huevos, Lácteos
    },
    {
        id: 10, name: 'Muffin de Arándanos', price: 2.75, image: '🧁',
        category: 'bolleria',
        description: 'Muffin esponjoso con arándanos',
        allergens: [1, 3, 7] // Gluten, Huevos, Lácteos
    },
    {
        id: 11, name: 'Tostada con Tomate', price: 3.00, image: '🍞',
        category: 'comida',
        description: 'Pan tostado con tomate y AOVE',
        allergens: [1] // Gluten
    },
    {
        id: 12, name: 'Sándwich Mixto', price: 4.50, image: '🥪',
        category: 'comida',
        description: 'Jamón y queso a la plancha',
        allergens: [1, 7] // Gluten, Lácteos
    },
    {
        id: 13, name: 'Ensalada César', price: 5.50, image: '🥗',
        category: 'comida',
        description: 'Lechuga, pollo, parmesano y croutons',
        allergens: [1, 3, 4, 7] // Gluten, Huevos, Pescado, Lácteos
    },
    {
        id: 14, name: 'Wrap Vegetal', price: 4.75, image: '🌯',
        category: 'comida',
        description: 'Tortilla con hummus y verduras',
        allergens: [1, 11] // Gluten, Sésamo
    },
    {
        id: 15, name: 'Brownie', price: 3.00, image: '🍫',
        category: 'postres',
        description: 'Brownie de chocolate intenso',
        allergens: [1, 3, 7, 8] // Gluten, Huevos, Lácteos, Frutos secos
    },
    {
        id: 16, name: 'Galletas de Avena', price: 2.00, image: '🍪',
        category: 'postres',
        description: 'Galletas artesanas con chips de chocolate',
        allergens: [1, 3, 7] // Gluten, Huevos, Lácteos
    },
];

const CATEGORIES = [
    { id: 'all', label: 'Todos', icon: '🍽️' },
    { id: 'bebidas-calientes', label: 'Bebidas Calientes', icon: '☕' },
    { id: 'bebidas-frias', label: 'Bebidas Frías', icon: '🧊' },
    { id: 'bolleria', label: 'Bollería', icon: '🥐' },
    { id: 'comida', label: 'Comida', icon: '🥪' },
    { id: 'postres', label: 'Postres', icon: '🍰' },
];

const ALLERGEN_MAP = {
    1: { name: 'Gluten', icon: '🌾', color: '#D4A017' },
    2: { name: 'Crustáceos', icon: '🦐', color: '#E74C3C' },
    3: { name: 'Huevos', icon: '🥚', color: '#F39C12' },
    4: { name: 'Pescado', icon: '🐟', color: '#3498DB' },
    5: { name: 'Cacahuetes', icon: '🥜', color: '#C0793A' },
    6: { name: 'Soja', icon: '🫘', color: '#8BC34A' },
    7: { name: 'Lácteos', icon: '🥛', color: '#E8E8E8' },
    8: { name: 'Frutos secos', icon: '🌰', color: '#795548' },
    9: { name: 'Apio', icon: '🥬', color: '#4CAF50' },
    10: { name: 'Mostaza', icon: '🟡', color: '#FFEB3B' },
    11: { name: 'Sésamo', icon: '🫓', color: '#D7CCC8' },
    12: { name: 'Sulfitos', icon: '🍷', color: '#9C27B0' },
    13: { name: 'Altramuces', icon: '🌿', color: '#66BB6A' },
    14: { name: 'Moluscos', icon: '🐚', color: '#FF7043' },
};

const MenuCatalog = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [allergenFilter, setAllergenFilter] = useState([]);
    const [showAllergenFilter, setShowAllergenFilter] = useState(false);
    const navigate = useNavigate();

    const filteredProducts = useMemo(() => {
        return PRODUCTS.filter(product => {
            const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase());
            // If allergen filter is active, HIDE products containing those allergens
            const matchesAllergen = allergenFilter.length === 0 ||
                !product.allergens.some(a => allergenFilter.includes(a));
            return matchesCategory && matchesSearch && matchesAllergen;
        });
    }, [selectedCategory, searchTerm, allergenFilter]);

    const toggleAllergenFilter = (allergenId) => {
        setAllergenFilter(prev =>
            prev.includes(allergenId)
                ? prev.filter(id => id !== allergenId)
                : [...prev, allergenId]
        );
    };

    const renderAllergenBadges = (allergenIds) => {
        if (allergenIds.length === 0) {
            return <span className="no-allergens-badge">Sin alérgenos</span>;
        }
        return (
            <div className="allergen-badges">
                {allergenIds.map(id => {
                    const allergen = ALLERGEN_MAP[id];
                    return (
                        <span
                            key={id}
                            className="allergen-badge"
                            title={allergen.name}
                        >
                            {allergen.icon}
                        </span>
                    );
                })}
            </div>
        );
    };

    const renderProductCard = (product) => (
        <div key={product.id} className={`menu-product-card ${viewMode}`} onClick={() => navigate(`/product/${product.id}`)}>
            <div className="product-visual">
                <span className="product-emoji">{product.image}</span>
            </div>
            <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-desc">{product.description}</p>
                {renderAllergenBadges(product.allergens)}
                <div className="product-footer">
                    <span className="product-cost">{product.price.toFixed(2)} €</span>
                    <button className="btn-add-cart" title="Añadir al carrito" onClick={(e) => e.stopPropagation()}>
                        <span>+</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="menu-wrapper">
            {/* Header */}
            <div className="menu-header">
                <div className="header-top">
                    <h1 className="menu-title">☕ CaffeApp</h1>
                    <h2 className="menu-subtitle">Menú</h2>
                    <button
                        className={`filter-toggle-btn ${showAllergenFilter ? 'active' : ''}`}
                        onClick={() => setShowAllergenFilter(!showAllergenFilter)}
                        title="Filtrar alérgenos"
                    >
                        ⚠️
                        {allergenFilter.length > 0 && (
                            <span className="filter-count">{allergenFilter.length}</span>
                        )}
                    </button>
                </div>

                {/* Search */}
                <div className="menu-search">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        className="search-field"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="clear-search" onClick={() => setSearchTerm('')}>✕</button>
                    )}
                </div>
            </div>

            {/* Allergen Filter Panel */}
            {showAllergenFilter && (
                <div className="allergen-filter-panel">
                    <div className="filter-panel-header">
                        <h4>Ocultar productos con:</h4>
                        {allergenFilter.length > 0 && (
                            <button className="clear-filters" onClick={() => setAllergenFilter([])}>
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                    <div className="filter-allergens-list">
                        {Object.entries(ALLERGEN_MAP).map(([id, allergen]) => (
                            <div
                                key={id}
                                className={`filter-allergen-chip ${allergenFilter.includes(Number(id)) ? 'active' : ''}`}
                                onClick={() => toggleAllergenFilter(Number(id))}
                            >
                                <span>{allergen.icon}</span>
                                <span>{allergen.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Categories */}
            <div className="categories-bar">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat.id)}
                    >
                        <span className="cat-icon">{cat.icon}</span>
                        <span className="cat-label">{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* View Toggle + Count */}
            <div className="menu-toolbar">
                <span className="product-count">
                    {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
                </span>
                <div className="view-toggle">
                    <button
                        className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                        title="Vista cuadrícula"
                    >
                        ▦
                    </button>
                    <button
                        className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                        title="Vista lista"
                    >
                        ☰
                    </button>
                </div>
            </div>

            {/* Products */}
            <div className="menu-content">
                {filteredProducts.length > 0 ? (
                    <div className={`products-container ${viewMode}`}>
                        {filteredProducts.map(product => renderProductCard(product))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <span className="empty-icon">🔍</span>
                        <h3>No se encontraron productos</h3>
                        <p>Prueba con otra búsqueda o categoría</p>
                        {allergenFilter.length > 0 && (
                            <button className="btn-clear-all" onClick={() => {
                                setAllergenFilter([]);
                                setSearchTerm('');
                                setSelectedCategory('all');
                            }}>
                                Limpiar todos los filtros
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Allergen Legend */}
            <div className="allergen-legend">
                <h4 className="legend-title">Leyenda de alérgenos</h4>
                <div className="legend-items">
                    {Object.entries(ALLERGEN_MAP).map(([id, allergen]) => (
                        <div key={id} className="legend-item">
                            <span className="legend-icon">{allergen.icon}</span>
                            <span className="legend-name">{allergen.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="bottom-nav">
                <button className="nav-btn active" title="Inicio">
                    <span className="nav-icon">🏠</span>
                    <span className="nav-label">Inicio</span>
                </button>
                <button className="nav-btn" title="Notificaciones">
                    <span className="nav-icon">🔔</span>
                    <span className="nav-label">Avisos</span>
                </button>
                <button className="nav-btn center-btn" title="Nueva orden">
                    <span className="nav-icon">➕</span>
                </button>
                <button className="nav-btn" title="Órdenes" onClick={() => navigate('/checkout')}>
                    <span className="nav-icon">📋</span>
                    <span className="nav-label">Pedidos</span>
                </button>
                <button className="nav-btn" title="Perfil">
                    <span className="nav-icon">👤</span>
                    <span className="nav-label">Perfil</span>
                </button>
            </div>
        </div>
    );
};

export default MenuCatalog;
