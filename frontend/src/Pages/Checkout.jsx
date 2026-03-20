// src/pages/Checkout.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Checkout.css';

// Mock cart data — se reemplazará con contexto global del carrito
const MOCK_CART = [
    {
        id: 'cart-1',
        productId: 2,
        name: 'Café Latte',
        image: '☕',
        basePrice: 3.50,
        quantity: 2,
        removedIngredients: ['Espuma de leche'],
        extras: [
            { name: 'Shot extra de café', price: 0.50, qty: 1 },
            { name: 'Sirope de vainilla', price: 0.40, qty: 1 },
        ],
    },
    {
        id: 'cart-2',
        productId: 9,
        name: 'Croissant',
        image: '🥐',
        basePrice: 2.25,
        quantity: 1,
        removedIngredients: [],
        extras: [
            { name: 'Relleno de chocolate', price: 0.75, qty: 1 },
        ],
    },
    {
        id: 'cart-3',
        productId: 1,
        name: 'Café Espresso',
        image: '☕',
        basePrice: 2.50,
        quantity: 1,
        removedIngredients: [],
        extras: [],
    },
    {
        id: 'cart-4',
        productId: 15,
        name: 'Brownie',
        image: '🍫',
        basePrice: 3.00,
        quantity: 1,
        removedIngredients: ['Nueces'],
        extras: [
            { name: 'Helado de vainilla', price: 1.00, qty: 1 },
        ],
    },
];

const Checkout = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState(MOCK_CART);
    const [paymentStep, setPaymentStep] = useState('cart'); // 'cart' | 'payment' | 'success'

    // Card form state
    const [cardData, setCardData] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: '',
    });
    const [cardErrors, setCardErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    const getItemTotal = (item) => {
        const extrasSum = item.extras.reduce((s, e) => s + e.price * e.qty, 0);
        return (item.basePrice + extrasSum) * item.quantity;
    };

    const subtotal = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + getItemTotal(item), 0);
    }, [cartItems]);

    const serviceFee = 0.00;
    const total = subtotal + serviceFee;

    const removeItem = (itemId) => {
        setCartItems(prev => prev.filter(i => i.id !== itemId));
    };

    const updateQuantity = (itemId, delta) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === itemId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    // Card formatting
    const formatCardNumber = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 16);
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    const formatExpiry = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 4);
        if (digits.length >= 3) {
            return digits.slice(0, 2) + '/' + digits.slice(2);
        }
        return digits;
    };

    const handleCardChange = (field, value) => {
        let formatted = value;
        if (field === 'number') formatted = formatCardNumber(value);
        if (field === 'expiry') formatted = formatExpiry(value);
        if (field === 'cvv') formatted = value.replace(/\D/g, '').slice(0, 3);
        if (field === 'name') formatted = value.toUpperCase();

        setCardData(prev => ({ ...prev, [field]: formatted }));
        if (cardErrors[field]) {
            setCardErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const getCardBrand = () => {
        const num = cardData.number.replace(/\s/g, '');
        if (num.startsWith('4')) return { brand: 'Visa', icon: '💳', color: '#1A1F71' };
        if (/^5[1-5]/.test(num)) return { brand: 'Mastercard', icon: '💳', color: '#EB001B' };
        if (num.startsWith('3')) return { brand: 'Amex', icon: '💳', color: '#006FCF' };
        return { brand: '', icon: '💳', color: '#A0826D' };
    };

    const validateCard = () => {
        const errors = {};
        const num = cardData.number.replace(/\s/g, '');

        if (num.length < 15) errors.number = 'Número de tarjeta inválido';
        if (!cardData.name.trim()) errors.name = 'Nombre requerido';
        if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
            errors.expiry = 'Formato MM/YY';
        } else {
            const [m, y] = cardData.expiry.split('/').map(Number);
            if (m < 1 || m > 12) errors.expiry = 'Mes inválido';
        }
        if (cardData.cvv.length < 3) errors.cvv = 'CVV inválido';

        setCardErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePayment = async () => {
        if (!validateCard()) return;

        setIsProcessing(true);
        // Placeholder — will connect to backend
        await new Promise(resolve => setTimeout(resolve, 2500));
        setIsProcessing(false);
        setPaymentStep('success');
    };

    // ========== SUCCESS VIEW ==========
    if (paymentStep === 'success') {
        return (
            <div className="checkout-wrapper">
                <div className="success-screen">
                    <div className="success-animation">
                        <span className="success-check">✓</span>
                    </div>
                    <h2 className="success-title">¡Pago completado!</h2>
                    <p className="success-msg">Tu pedido ha sido procesado correctamente</p>
                    <div className="success-details">
                        <div className="success-row">
                            <span>Total pagado</span>
                            <span className="success-amount">{total.toFixed(2)} €</span>
                        </div>
                        <div className="success-row">
                            <span>Nº de pedido</span>
                            <span className="success-order">#CAF-{Math.floor(Math.random() * 9000 + 1000)}</span>
                        </div>
                    </div>
                    <p className="success-eta">
                        ⏱️ Tiempo estimado: <strong>5-10 minutos</strong>
                    </p>
                    <button className="btn-back-home" onClick={() => navigate('/menu')}>
                        Volver al menú
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-wrapper">
            {/* Header */}
            <div className="checkout-header">
                <button className="back-btn" onClick={() => paymentStep === 'payment' ? setPaymentStep('cart') : navigate('/menu')}>
                    ←
                </button>
                <h1 className="checkout-title">
                    {paymentStep === 'cart' ? '🛒 Mi Carrito' : '💳 Pago'}
                </h1>
                <div className="header-spacer" />
            </div>

            {/* Step Indicator */}
            <div className="step-indicator">
                <div className={`step ${paymentStep === 'cart' ? 'active' : 'done'}`}>
                    <span className="step-num">1</span>
                    <span className="step-label">Resumen</span>
                </div>
                <div className="step-line" />
                <div className={`step ${paymentStep === 'payment' ? 'active' : ''}`}>
                    <span className="step-num">2</span>
                    <span className="step-label">Pago</span>
                </div>
            </div>

            {/* ========== CART VIEW ========== */}
            {paymentStep === 'cart' && (
                <div className="cart-view">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <span className="empty-cart-icon">🛒</span>
                            <h3>Tu carrito está vacío</h3>
                            <p>Añade productos desde el menú</p>
                            <button className="btn-go-menu" onClick={() => navigate('/menu')}>
                                Ir al menú
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Cart Items */}
                            <div className="cart-items">
                                {cartItems.map(item => (
                                    <div key={item.id} className="cart-item">
                                        <div className="cart-item-header">
                                            <div className="cart-item-left">
                                                <span className="cart-item-emoji">{item.image}</span>
                                                <div className="cart-item-main">
                                                    <h4 className="cart-item-name">{item.name}</h4>
                                                    <span className="cart-item-base">{item.basePrice.toFixed(2)} € / ud</span>
                                                </div>
                                            </div>
                                            <button className="remove-item" onClick={() => removeItem(item.id)} title="Eliminar">
                                                🗑️
                                            </button>
                                        </div>

                                        {/* Customizations */}
                                        {item.removedIngredients.length > 0 && (
                                            <div className="customization removed-list">
                                                <span className="custom-label">Sin:</span>
                                                {item.removedIngredients.map((ing, i) => (
                                                    <span key={i} className="custom-chip removed">{ing}</span>
                                                ))}
                                            </div>
                                        )}
                                        {item.extras.length > 0 && (
                                            <div className="customization extras-list">
                                                <span className="custom-label">Extras:</span>
                                                {item.extras.map((ext, i) => (
                                                    <span key={i} className="custom-chip extra">
                                                        {ext.name} {ext.qty > 1 ? `×${ext.qty}` : ''} (+{(ext.price * ext.qty).toFixed(2)} €)
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Quantity + Line Total */}
                                        <div className="cart-item-footer">
                                            <div className="item-qty-controls">
                                                <button className="qty-sm-btn" onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1}>−</button>
                                                <span className="qty-sm-value">{item.quantity}</span>
                                                <button className="qty-sm-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                                            </div>
                                            <span className="item-line-total">{getItemTotal(item).toFixed(2)} €</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="order-summary">
                                <h3 className="summary-heading">Resumen del pedido</h3>
                                <div className="summary-row">
                                    <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} artículos)</span>
                                    <span>{subtotal.toFixed(2)} €</span>
                                </div>
                                <div className="summary-row">
                                    <span>Gastos de servicio</span>
                                    <span className="free-label">Gratis</span>
                                </div>
                                <div className="summary-divider" />
                                <div className="summary-row total-row">
                                    <span>Total</span>
                                    <span>{total.toFixed(2)} €</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ========== PAYMENT VIEW ========== */}
            {paymentStep === 'payment' && (
                <div className="payment-view">
                    {/* Payment Summary Mini */}
                    <div className="payment-summary-mini">
                        <span className="mini-items">{cartItems.reduce((s, i) => s + i.quantity, 0)} artículos</span>
                        <span className="mini-total">{total.toFixed(2)} €</span>
                    </div>

                    {/* Card Form */}
                    <div className="card-form-section">
                        <h3 className="form-heading">
                            <span>💳</span> Datos de tarjeta
                        </h3>

                        {/* Card Visual */}
                        <div className="card-visual" style={{ borderColor: getCardBrand().color }}>
                            <div className="card-visual-top">
                                <span className="card-chip">🔲</span>
                                <span className="card-brand-label" style={{ color: getCardBrand().color }}>
                                    {getCardBrand().brand || 'Tarjeta'}
                                </span>
                            </div>
                            <div className="card-visual-number">
                                {cardData.number || '•••• •••• •••• ••••'}
                            </div>
                            <div className="card-visual-bottom">
                                <div>
                                    <span className="cv-label">TITULAR</span>
                                    <span className="cv-value">{cardData.name || 'NOMBRE APELLIDOS'}</span>
                                </div>
                                <div>
                                    <span className="cv-label">EXPIRA</span>
                                    <span className="cv-value">{cardData.expiry || 'MM/YY'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="card-fields">
                            <div className="field-group">
                                <label className="field-label">Número de tarjeta</label>
                                <div className={`field-input-wrap ${cardErrors.number ? 'error' : ''}`}>
                                    <input
                                        type="text"
                                        className="field-input"
                                        placeholder="1234 5678 9012 3456"
                                        value={cardData.number}
                                        onChange={(e) => handleCardChange('number', e.target.value)}
                                        inputMode="numeric"
                                    />
                                </div>
                                {cardErrors.number && <span className="field-error">{cardErrors.number}</span>}
                            </div>

                            <div className="field-group">
                                <label className="field-label">Nombre del titular</label>
                                <div className={`field-input-wrap ${cardErrors.name ? 'error' : ''}`}>
                                    <input
                                        type="text"
                                        className="field-input"
                                        placeholder="NOMBRE APELLIDOS"
                                        value={cardData.name}
                                        onChange={(e) => handleCardChange('name', e.target.value)}
                                    />
                                </div>
                                {cardErrors.name && <span className="field-error">{cardErrors.name}</span>}
                            </div>

                            <div className="field-row">
                                <div className="field-group">
                                    <label className="field-label">Fecha de expiración</label>
                                    <div className={`field-input-wrap ${cardErrors.expiry ? 'error' : ''}`}>
                                        <input
                                            type="text"
                                            className="field-input"
                                            placeholder="MM/YY"
                                            value={cardData.expiry}
                                            onChange={(e) => handleCardChange('expiry', e.target.value)}
                                            inputMode="numeric"
                                        />
                                    </div>
                                    {cardErrors.expiry && <span className="field-error">{cardErrors.expiry}</span>}
                                </div>
                                <div className="field-group">
                                    <label className="field-label">CVV</label>
                                    <div className={`field-input-wrap ${cardErrors.cvv ? 'error' : ''}`}>
                                        <input
                                            type="password"
                                            className="field-input"
                                            placeholder="•••"
                                            value={cardData.cvv}
                                            onChange={(e) => handleCardChange('cvv', e.target.value)}
                                            inputMode="numeric"
                                        />
                                    </div>
                                    {cardErrors.cvv && <span className="field-error">{cardErrors.cvv}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="security-note">
                            <span>🔒</span> Pago seguro. Tus datos están protegidos.
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Action Bar */}
            {cartItems.length > 0 && paymentStep !== 'success' && (
                <div className="checkout-action-bar">
                    {paymentStep === 'cart' ? (
                        <button className="btn-checkout" onClick={() => setPaymentStep('payment')}>
                            <span>Continuar al pago</span>
                            <span className="btn-total">{total.toFixed(2)} €</span>
                        </button>
                    ) : (
                        <button
                            className={`btn-pay ${isProcessing ? 'processing' : ''}`}
                            onClick={handlePayment}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <span className="pay-loading">
                                    <span className="spinner" />
                                    Procesando pago...
                                </span>
                            ) : (
                                <>
                                    <span>💳 Pagar ahora</span>
                                    <span className="btn-total">{total.toFixed(2)} €</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Checkout;
