// src/Pages/MyOrders.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MyOrders.css';

const MOCK_ORDERS = [
    {
        id: 'CAF-1041',
        date: '2025-06-10T09:15:00',
        status: 'prepared',
        total: 8.90,
        items: [
            { name: 'Café Latte',   image: '☕', qty: 2, extras: ['Shot extra de café', 'Sirope de vainilla'], removed: [] },
            { name: 'Croissant',    image: '🥐', qty: 1, extras: ['Relleno de chocolate'], removed: [] },
        ],
    },
    {
        id: 'CAF-1038',
        date: '2025-06-10T08:47:00',
        status: 'preparing',
        total: 5.75,
        items: [
            { name: 'Cappuccino',          image: '☕', qty: 1, extras: [], removed: ['Espuma densa de leche'] },
            { name: 'Muffin de Arándanos', image: '🧁', qty: 1, extras: [], removed: [] },
        ],
    },
    {
        id: 'CAF-1031',
        date: '2025-06-09T14:22:00',
        status: 'ordered',
        total: 12.50,
        items: [
            { name: 'Ensalada César',  image: '🥗', qty: 1, extras: ['Aguacate', 'Bacon crujiente'], removed: ['Croutons'] },
            { name: 'Zumo de Naranja', image: '🍊', qty: 2, extras: [], removed: [] },
        ],
    },
    {
        id: 'CAF-1020',
        date: '2025-06-09T09:05:00',
        status: 'prepared',
        total: 6.25,
        items: [
            { name: 'Tostada con Tomate', image: '🍞', qty: 1, extras: [], removed: [] },
            { name: 'Café Espresso',      image: '☕', qty: 1, extras: [], removed: [] },
            { name: 'Agua Mineral',       image: '💧', qty: 1, extras: [], removed: [] },
        ],
    },
    {
        id: 'CAF-1011',
        date: '2025-06-08T11:30:00',
        status: 'prepared',
        total: 9.00,
        items: [
            { name: 'Brownie',    image: '🍫', qty: 1, extras: ['Helado de vainilla'], removed: ['Nueces'] },
            { name: 'Café Latte', image: '☕', qty: 1, extras: ['Sirope de vainilla'], removed: [] },
        ],
    },
];

const STATUS_CONFIG = {
    ordered:   { label: 'Pedido',         icon: '🕐', color: '#B7770D', bg: '#FEF3CD', step: 1 },
    preparing: { label: 'En preparación', icon: '👨‍🍳', color: '#2E86C1', bg: '#D6EAF8', step: 2 },
    prepared:  { label: 'Preparado',      icon: '✅', color: '#1E8449', bg: '#D5F5E3', step: 3 },
};

const formatDate = (isoString) => {
    const d = new Date(isoString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const time = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    if (d.toDateString() === today.toDateString())     return `Hoy, ${time}`;
    if (d.toDateString() === yesterday.toDateString()) return `Ayer, ${time}`;
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) + `, ${time}`;
};

const MyOrders = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState(null);

    const FILTERS = [
        { id: 'all',       label: 'Todos' },
        { id: 'ordered',   label: 'Pedido' },
        { id: 'preparing', label: 'Preparando' },
        { id: 'prepared',  label: 'Listo' },
    ];

    const filtered = activeFilter === 'all'
        ? MOCK_ORDERS
        : MOCK_ORDERS.filter(o => o.status === activeFilter);

    const toggleExpand = (id) => setExpandedOrder(prev => prev === id ? null : id);

    return (
        <div className="myorders-wrapper">

            {/* Header */}
            <div className="myorders-header">
                <button className="mo-back-btn" onClick={() => navigate('/menu')}>←</button>
                <h1 className="myorders-title">📋 Mis Pedidos</h1>
                <div className="mo-spacer" />
            </div>

            {/* Filter Pills */}
            <div className="mo-filters">
                {FILTERS.map(f => (
                    <button
                        key={f.id}
                        className={`mo-filter-pill ${activeFilter === f.id ? 'active' : ''}`}
                        onClick={() => setActiveFilter(f.id)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="mo-content">
                {filtered.length === 0 ? (
                    <div className="mo-empty">
                        <span>📭</span>
                        <h3>Sin pedidos</h3>
                        <p>No tienes pedidos con este estado</p>
                    </div>
                ) : (
                    filtered.map(order => {
                        const status = STATUS_CONFIG[order.status];
                        const isExpanded = expandedOrder === order.id;
                        const totalItems = order.items.reduce((s, i) => s + i.qty, 0);

                        return (
                            <div key={order.id} className="mo-card">

                                {/* Card top row */}
                                <div className="mo-card-top" onClick={() => toggleExpand(order.id)}>
                                    <div className="mo-card-left">
                                        <span className="mo-order-id">#{order.id}</span>
                                        <span className="mo-order-date">{formatDate(order.date)}</span>
                                    </div>
                                    <div className="mo-card-right">
                                        <span className="mo-status-badge" style={{ color: status.color, background: status.bg }}>
                                            {status.icon} {status.label}
                                        </span>
                                        <span className="mo-expand-icon">{isExpanded ? '▲' : '▼'}</span>
                                    </div>
                                </div>

                                {/* Progress */}
                                <div className="mo-progress-bar">
                                    {[1, 2, 3].map(step => (
                                        <div key={step} className={`mo-progress-step ${step <= status.step ? 'done' : ''}`}>
                                            <div className="mo-dot" />
                                            {step < 3 && <div className="mo-line" />}
                                        </div>
                                    ))}
                                </div>
                                <div className="mo-progress-labels">
                                    <span>Pedido</span><span>Preparando</span><span>Listo</span>
                                </div>

                                {/* Summary */}
                                <div className="mo-summary-row">
                                    <span className="mo-items-preview">
                                        {order.items.map(i => i.image).join(' ')} · {totalItems} artículo{totalItems !== 1 ? 's' : ''}
                                    </span>
                                    <span className="mo-total">{order.total.toFixed(2)} €</span>
                                </div>

                                {/* Expanded detail */}
                                {isExpanded && (
                                    <div className="mo-detail">
                                        <div className="mo-detail-divider" />
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="mo-detail-item">
                                                <div className="mo-detail-top">
                                                    <span className="mo-d-emoji">{item.image}</span>
                                                    <span className="mo-d-name">{item.name}</span>
                                                    <span className="mo-d-qty">×{item.qty}</span>
                                                </div>
                                                {item.removed.length > 0 && (
                                                    <div className="mo-mods">
                                                        <span className="mo-mod-label removed-label">Sin:</span>
                                                        {item.removed.map((r, i) => <span key={i} className="mo-chip removed-chip">{r}</span>)}
                                                    </div>
                                                )}
                                                {item.extras.length > 0 && (
                                                    <div className="mo-mods">
                                                        <span className="mo-mod-label extra-label">+ Extras:</span>
                                                        {item.extras.map((e, i) => <span key={i} className="mo-chip extra-chip">{e}</span>)}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Bottom Nav */}
            <div className="bottom-nav">
                <button className="nav-btn" onClick={() => navigate('/menu')}>
                    <span className="nav-icon">🏠</span>
                    <span className="nav-label">Inicio</span>
                </button>
                <button className="nav-btn">
                    <span className="nav-icon">🔔</span>
                    <span className="nav-label">Avisos</span>
                </button>
                <button className="nav-btn center-btn">
                    <span className="nav-icon">➕</span>
                </button>
                <button className="nav-btn active">
                    <span className="nav-icon">📋</span>
                    <span className="nav-label">Pedidos</span>
                </button>
                <button className="nav-btn" onClick={() => navigate('/profile')}>
                    <span className="nav-icon">👤</span>
                    <span className="nav-label">Perfil</span>
                </button>
            </div>
        </div>
    );
};

export default MyOrders;
