// src/Pages/OrderManagement.jsx
import { useState } from 'react';
import '../styles/OrderManagement.css';

const MOCK_ORDERS = [
    {
        id: 'CAF-1041', date: '2025-06-10T09:15:00', status: 'ordered',
        student: 'Alejandro G.', curso: '2º DAW', total: 8.90,
        items: [
            { name: 'Café Latte',  image: '☕', qty: 2, extras: ['Shot extra de café', 'Sirope de vainilla'], removed: [] },
            { name: 'Croissant',   image: '🥐', qty: 1, extras: ['Relleno de chocolate'], removed: [] },
        ],
    },
    {
        id: 'CAF-1040', date: '2025-06-10T09:12:00', status: 'preparing',
        student: 'María L.', curso: '1º ASIR', total: 5.75,
        items: [
            { name: 'Cappuccino',          image: '☕', qty: 1, extras: [], removed: ['Espuma densa de leche'] },
            { name: 'Muffin de Arándanos', image: '🧁', qty: 1, extras: [], removed: [] },
        ],
    },
    {
        id: 'CAF-1039', date: '2025-06-10T09:08:00', status: 'prepared',
        student: 'Carlos R.', curso: '2º SMR', total: 7.25,
        items: [
            { name: 'Tostada con Tomate', image: '🍞', qty: 1, extras: [], removed: [] },
            { name: 'Zumo de Naranja',    image: '🍊', qty: 2, extras: [], removed: [] },
        ],
    },
    {
        id: 'CAF-1038', date: '2025-06-10T08:55:00', status: 'ordered',
        student: 'Lucía M.', curso: '1º DAW', total: 12.50,
        items: [
            { name: 'Ensalada César',  image: '🥗', qty: 1, extras: ['Aguacate', 'Bacon crujiente'], removed: ['Croutons'] },
            { name: 'Agua Mineral',    image: '💧', qty: 2, extras: [], removed: [] },
            { name: 'Brownie',         image: '🍫', qty: 1, extras: ['Helado de vainilla'], removed: ['Nueces'] },
        ],
    },
    {
        id: 'CAF-1037', date: '2025-06-10T08:47:00', status: 'preparing',
        student: 'Tomás F.', curso: 'Profesor', total: 4.00,
        items: [
            { name: 'Café Espresso', image: '☕', qty: 2, extras: [], removed: [] },
        ],
    },
    {
        id: 'CAF-1036', date: '2025-06-10T08:30:00', status: 'prepared',
        student: 'Ana S.', curso: '2º DAM', total: 6.75,
        items: [
            { name: 'Sándwich Mixto', image: '🥪', qty: 1, extras: ['Bacon', 'Tomate natural'], removed: [] },
            { name: 'Té Verde',       image: '🍵', qty: 1, extras: [], removed: [] },
        ],
    },
];

const STATUS_CONFIG = {
    ordered:   { label: 'Pedido',         icon: '🕐', color: '#B7770D', bg: '#FEF3CD', next: 'preparing', nextLabel: 'Empezar preparación' },
    preparing: { label: 'En preparación', icon: '👨‍🍳', color: '#2E86C1', bg: '#D6EAF8', next: 'prepared',  nextLabel: 'Marcar como listo'    },
    prepared:  { label: 'Preparado',      icon: '✅', color: '#1E8449', bg: '#D5F5E3', next: null,         nextLabel: null                   },
};

const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

const OrderManagement = () => {
    const [orders, setOrders]           = useState(MOCK_ORDERS);
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const counts = {
        all:       orders.length,
        ordered:   orders.filter(o => o.status === 'ordered').length,
        preparing: orders.filter(o => o.status === 'preparing').length,
        prepared:  orders.filter(o => o.status === 'prepared').length,
    };

    const FILTERS = [
        { id: 'all',       label: 'Todos' },
        { id: 'ordered',   label: 'Pedido' },
        { id: 'preparing', label: 'Preparando' },
        { id: 'prepared',  label: 'Listo' },
    ];

    const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

    const advanceStatus = (orderId) => {
        setOrders(prev => prev.map(o => {
            if (o.id !== orderId) return o;
            const next = STATUS_CONFIG[o.status].next;
            return next ? { ...o, status: next } : o;
        }));
        // Also update the modal if it's open on that order
        if (selectedOrder?.id === orderId) {
            const current = orders.find(o => o.id === orderId);
            if (current) {
                const next = STATUS_CONFIG[current.status].next;
                if (next) setSelectedOrder(prev => ({ ...prev, status: next }));
                else setSelectedOrder(null);
            }
        }
    };

    return (
        <div className="mgmt-wrapper">

            {/* Header */}
            <div className="mgmt-header">
                <div className="mgmt-header-top">
                    <h1 className="mgmt-brand">☕ CaffeApp</h1>
                    <span className="mgmt-role-tag">Empleado</span>
                </div>
                <p className="mgmt-subtitle">Pedidos — IES Gran Vía</p>
            </div>

            {/* Tabs */}
            <div className="mgmt-tabs">
                {FILTERS.map(f => (
                    <button
                        key={f.id}
                        className={`mgmt-tab ${filterStatus === f.id ? 'active' : ''}`}
                        onClick={() => setFilterStatus(f.id)}
                    >
                        {f.label}
                        <span className="mgmt-tab-count">{counts[f.id]}</span>
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="mgmt-content">
                {filtered.length === 0 ? (
                    <div className="mgmt-empty">
                        <span>📭</span>
                        <p>No hay pedidos con este estado</p>
                    </div>
                ) : (
                    filtered.map(order => {
                        const status = STATUS_CONFIG[order.status];
                        const totalItems = order.items.reduce((s, i) => s + i.qty, 0);
                        return (
                            <div key={order.id} className="mgmt-row">
                                <div className="mgmt-row-main">
                                    <div className="mgmt-row-left">
                                        <span className="mgmt-row-id">#{order.id}</span>
                                        <span className="mgmt-row-time">{formatTime(order.date)}</span>
                                        <span className="mgmt-row-student">{order.student} · {order.curso}</span>
                                        <div className="mgmt-row-preview">
                                            {order.items.map(i => i.image).join(' ')}
                                            <span className="mgmt-item-count">{totalItems} artículo{totalItems !== 1 ? 's' : ''}</span>
                                        </div>
                                    </div>
                                    <div className="mgmt-row-right">
                                        <span className="mgmt-status-badge" style={{ color: status.color, background: status.bg }}>
                                            {status.icon} {status.label}
                                        </span>
                                        <span className="mgmt-row-total">{order.total.toFixed(2)} €</span>
                                    </div>
                                </div>
                                <div className="mgmt-row-actions">
                                    <button className="mgmt-btn-detail" onClick={() => setSelectedOrder(order)}>
                                        Ver detalle
                                    </button>
                                    {status.next && (
                                        <button className="mgmt-btn-advance" onClick={() => advanceStatus(order.id)}>
                                            {status.nextLabel}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <OrderPreparationModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onAdvance={() => advanceStatus(selectedOrder.id)}
                />
            )}
        </div>
    );
};

/* =====================
   ORDER PREPARATION MODAL
   ===================== */
const OrderPreparationModal = ({ order, onClose, onAdvance }) => {
    const status = STATUS_CONFIG[order.status];
    return (
        <div className="mgmt-modal-overlay" onClick={onClose}>
            <div className="mgmt-modal" onClick={e => e.stopPropagation()}>

                <div className="mgmt-modal-header">
                    <div>
                        <h3 className="mgmt-modal-id">#{order.id}</h3>
                        <span className="mgmt-modal-student">{order.student} · {order.curso}</span>
                    </div>
                    <button className="mgmt-modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="mgmt-modal-status" style={{ color: status.color, background: status.bg }}>
                    {status.icon} Estado: <strong>{status.label}</strong>
                </div>

                <div className="mgmt-modal-items">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="mgmt-modal-item">
                            <div className="mgmt-item-top">
                                <span className="mgmt-item-emoji">{item.image}</span>
                                <span className="mgmt-item-name">{item.name}</span>
                                <span className="mgmt-item-qty">×{item.qty}</span>
                            </div>
                            {item.removed.length > 0 && (
                                <div className="mgmt-mods">
                                    <span className="mgmt-mod-tag removed-tag">✕ Sin:</span>
                                    {item.removed.map((r, i) => <span key={i} className="mgmt-chip removed-chip">{r}</span>)}
                                </div>
                            )}
                            {item.extras.length > 0 && (
                                <div className="mgmt-mods">
                                    <span className="mgmt-mod-tag extra-tag">+ Extra:</span>
                                    {item.extras.map((e, i) => <span key={i} className="mgmt-chip extra-chip">{e}</span>)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mgmt-modal-total">
                    <span>Total del pedido</span>
                    <span className="mgmt-total-amount">{order.total.toFixed(2)} €</span>
                </div>

                <div className="mgmt-modal-btns">
                    <button className="mgmt-btn-close-modal" onClick={onClose}>Cerrar</button>
                    {status.next && (
                        <button className="mgmt-btn-advance-modal" onClick={() => { onAdvance(); onClose(); }}>
                            {status.nextLabel}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderManagement;
