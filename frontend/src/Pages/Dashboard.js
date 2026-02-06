// src/pages/Dashboard.js
import { useState } from 'react';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [cartCount, setCartCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState({});

    const products = [
        { id: 1, name: 'Café Espresso', price: 3.50, icon: '☕', category: 'beverages' },
        { id: 2, name: 'Latte', price: 4.50, icon: '🥛', category: 'beverages' },
        { id: 3, name: 'Cappuccino', price: 4.50, icon: '☕', category: 'beverages' },
        { id: 4, name: 'Muffin', price: 2.50, icon: '🧁', category: 'food' },
        { id: 5, name: 'Sándwich', price: 5.00, icon: '🥪', category: 'food' },
        { id: 6, name: 'Croissant', price: 2.75, icon: '🥐', category: 'food' },
        { id: 7, name: 'Brownie', price: 3.00, icon: '🍫', category: 'food' },
        { id: 8, name: 'Agua', price: 1.50, icon: '💧', category: 'beverages' },
    ];

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddToCart = (product) => {
        setCart(prev => ({
            ...prev,
            [product.id]: (prev[product.id] || 0) + 1
        }));
        setCartCount(cartCount + 1);
    };

    const totalPrice = Object.entries(cart).reduce((sum, [productId, quantity]) => {
        const product = products.find(p => p.id === parseInt(productId));
        return sum + (product.price * quantity);
    }, 0);

    return (
        <div className="dashboard-wrapper">
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-left">
                    <h1 className="app-title">CaffeApp</h1>
                </div>
                <div className="header-right">
                    <div className="balance">
                        <span className="balance-label">Saldo</span>
                        <span className="balance-amount">${totalPrice.toFixed(2)}</span>
                    </div>
                    <button className="cart-btn">
                        <span className="cart-icon">🛒</span>
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="search-icon">🔍</span>
            </div>

            {/* Main Content */}
            <div className="dashboard-content">
                <h2 className="section-title">Menú</h2>
                
                {filteredProducts.length > 0 ? (
                    <div className="products-grid">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="product-card">
                                <div className="product-icon">{product.icon}</div>
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-price">${product.price.toFixed(2)}</p>
                                <button 
                                    className="btn-add"
                                    onClick={() => handleAddToCart(product)}
                                >
                                    Agregar
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-products">
                        <p>No se encontraron productos</p>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <div className="bottom-nav">
                <button className="nav-btn active" title="Inicio">
                    <span className="nav-icon">🏠</span>
                </button>
                <button className="nav-btn" title="Notificaciones">
                    <span className="nav-icon">🔔</span>
                </button>
                <button className="nav-btn center-btn" title="Nueva orden">
                    <span className="nav-icon">➕</span>
                </button>
                <button className="nav-btn" title="Órdenes">
                    <span className="nav-icon">📋</span>
                </button>
                <button className="nav-btn" title="Perfil">
                    <span className="nav-icon">👤</span>
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
