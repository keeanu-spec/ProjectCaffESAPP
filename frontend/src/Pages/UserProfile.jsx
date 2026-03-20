// src/Pages/UserProfile.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UserProfile.css';

const MOCK_USER = {
    nombre: 'Alejandro',
    apellidos: 'García Ruiz',
    email: 'alex.garcia@ies.edu',
    curso: '2º DAW',
    institucion: 'IES Gran Vía',
    turno: 'morning',
    profileIcon: '🎮',
    role: 'alumno',
    alergenos: [1, 7],
    lastShiftChange: null,
};

const ALLERGEN_MAP = {
    1: { name: 'Gluten',       icon: '🌾' },
    2: { name: 'Crustáceos',   icon: '🦐' },
    3: { name: 'Huevos',       icon: '🥚' },
    4: { name: 'Pescado',      icon: '🐟' },
    5: { name: 'Cacahuetes',   icon: '🥜' },
    6: { name: 'Soja',         icon: '🫘' },
    7: { name: 'Lácteos',      icon: '🥛' },
    8: { name: 'Frutos secos', icon: '🌰' },
    9: { name: 'Apio',         icon: '🥬' },
    10: { name: 'Mostaza',     icon: '🟡' },
    11: { name: 'Sésamo',      icon: '🫓' },
    12: { name: 'Sulfitos',    icon: '🍷' },
    13: { name: 'Altramuces',  icon: '🌿' },
    14: { name: 'Moluscos',    icon: '🐚' },
};

const SHIFTS = {
    morning:   { label: 'Mañana', icon: '🌅', time: '8:00 - 14:00' },
    afternoon: { label: 'Tarde',  icon: '🌇', time: '14:00 - 20:00' },
    night:     { label: 'Noche',  icon: '🌙', time: '20:00 - 22:00' },
};

const ROLE_CONFIG = {
    alumno:   { label: 'Alumno',       icon: '🎓', color: '#2E86C1', bg: '#D6EAF8' },
    profesor: { label: 'Profesor/PAS', icon: '👨‍🏫', color: '#1E8449', bg: '#D5F5E3' },
};

const canChangeShift = (lastChange) => {
    if (!lastChange) return true;
    return Date.now() - new Date(lastChange).getTime() >= 24 * 3600 * 1000;
};

const cooldownLeft = (lastChange) => {
    if (!lastChange) return null;
    const diff = 24 * 3600 * 1000 - (Date.now() - new Date(lastChange).getTime());
    if (diff <= 0) return null;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
};

const UserProfile = () => {
    const navigate = useNavigate();
    const [user, setUser]               = useState(MOCK_USER);
    const [showShiftModal, setShowShiftModal] = useState(false);
    const [selectedShift, setSelectedShift]   = useState(MOCK_USER.turno);
    const [roleCode, setRoleCode]       = useState('');
    const [codeError, setCodeError]     = useState('');
    const [codeSuccess, setCodeSuccess] = useState('');
    const [codeLoading, setCodeLoading] = useState(false);
    const [shiftSuccess, setShiftSuccess] = useState('');

    const canChange  = canChangeShift(user.lastShiftChange);
    const remaining  = cooldownLeft(user.lastShiftChange);
    const roleInfo   = ROLE_CONFIG[user.role] || ROLE_CONFIG.alumno;

    const handleShiftConfirm = () => {
        if (selectedShift === user.turno) { setShowShiftModal(false); return; }
        setUser(prev => ({ ...prev, turno: selectedShift, lastShiftChange: new Date().toISOString() }));
        setShiftSuccess(`Turno cambiado a ${SHIFTS[selectedShift].label} correctamente`);
        setShowShiftModal(false);
        setTimeout(() => setShiftSuccess(''), 3500);
    };

    const handleCodeRedeem = async () => {
        setCodeError(''); setCodeSuccess('');
        if (!roleCode.trim()) { setCodeError('Introduce un código.'); return; }
        setCodeLoading(true);
        await new Promise(r => setTimeout(r, 1200));
        setCodeLoading(false);
        if (roleCode.trim().toUpperCase() === 'PROF2025') {
            setUser(prev => ({ ...prev, role: 'profesor' }));
            setCodeSuccess('¡Rol actualizado a Profesor/PAS!');
            setRoleCode('');
        } else {
            setCodeError('Código inválido o ya utilizado.');
        }
    };

    return (
        <div className="profile-wrapper">

            {/* Header */}
            <div className="profile-header">
                <button className="pf-back-btn" onClick={() => navigate('/menu')}>←</button>
                <h1 className="profile-title">👤 Mi Perfil</h1>
                <div className="pf-spacer" />
            </div>

            <div className="profile-content">

                {/* Hero */}
                <div className="profile-hero">
                    <div className="pf-avatar">{user.profileIcon}</div>
                    <h2 className="pf-name">{user.nombre} {user.apellidos}</h2>
                    <span className="pf-role-badge" style={{ color: roleInfo.color, background: roleInfo.bg }}>
                        {roleInfo.icon} {roleInfo.label}
                    </span>
                </div>

                {/* Info */}
                <div className="pf-section">
                    <h3 className="pf-section-title">📋 Información personal</h3>
                    <div className="pf-info-grid">
                        {[
                            { label: 'Email',       value: user.email },
                            { label: 'Curso',       value: user.curso },
                            { label: 'Institución', value: user.institucion },
                            { label: 'Turno',       value: `${SHIFTS[user.turno].icon} ${SHIFTS[user.turno].label} — ${SHIFTS[user.turno].time}` },
                        ].map(row => (
                            <div key={row.label} className="pf-info-row">
                                <span className="pf-info-label">{row.label}</span>
                                <span className="pf-info-value">{row.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Allergens */}
                <div className="pf-section">
                    <h3 className="pf-section-title">⚠️ Mis alérgenos</h3>
                    {user.alergenos.length === 0
                        ? <p className="pf-no-al">No tienes alérgenos registrados.</p>
                        : (
                            <div className="pf-al-chips">
                                {user.alergenos.map(id => (
                                    <span key={id} className="pf-al-chip">
                                        {ALLERGEN_MAP[id]?.icon} {ALLERGEN_MAP[id]?.name}
                                    </span>
                                ))}
                            </div>
                        )
                    }
                </div>

                {/* Shift Change */}
                <div className="pf-section">
                    <h3 className="pf-section-title">🔄 Cambio de turno</h3>
                    <p className="pf-hint">Puedes solicitar un cambio de turno una vez cada 24 horas.</p>
                    {shiftSuccess && <div className="pf-alert pf-alert-success">{shiftSuccess}</div>}
                    {!canChange && (
                        <div className="pf-cooldown">
                            ⏳ Próximo cambio disponible en <strong>{remaining}</strong>
                        </div>
                    )}
                    <button
                        className={`pf-btn-shift ${!canChange ? 'disabled' : ''}`}
                        disabled={!canChange}
                        onClick={() => { setSelectedShift(user.turno); setShowShiftModal(true); }}
                    >
                        Solicitar cambio de turno
                    </button>
                </div>

                {/* Code Redeem */}
                {user.role === 'alumno' && (
                    <div className="pf-section">
                        <h3 className="pf-section-title">🔑 Canjear código de rol</h3>
                        <p className="pf-hint">Si eres Profesor o PAS, introduce el código que te han facilitado.</p>
                        <div className="pf-code-wrap">
                            <input
                                type="text"
                                className={`pf-code-input ${codeError ? 'input-err' : ''} ${codeSuccess ? 'input-ok' : ''}`}
                                placeholder="Introduce el código..."
                                value={roleCode}
                                onChange={e => { setRoleCode(e.target.value); setCodeError(''); setCodeSuccess(''); }}
                            />
                            <button className="pf-btn-redeem" onClick={handleCodeRedeem} disabled={codeLoading}>
                                {codeLoading ? <span className="pf-spinner" /> : 'Canjear'}
                            </button>
                        </div>
                        {codeError   && <span className="pf-field-error">{codeError}</span>}
                        {codeSuccess && <span className="pf-field-success">{codeSuccess}</span>}
                    </div>
                )}

                {/* Logout */}
                <button className="pf-btn-logout" onClick={() => navigate('/')}>
                    Cerrar sesión
                </button>
            </div>

            {/* Shift Modal */}
            {showShiftModal && (
                <div className="pf-modal-overlay" onClick={() => setShowShiftModal(false)}>
                    <div className="pf-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="pf-modal-title">Cambiar turno</h3>
                        <p className="pf-modal-hint">Selecciona tu nuevo turno</p>
                        <div className="pf-shift-options">
                            {Object.entries(SHIFTS).map(([id, s]) => (
                                <div
                                    key={id}
                                    className={`pf-shift-opt ${selectedShift === id ? 'selected' : ''} ${user.turno === id ? 'current' : ''}`}
                                    onClick={() => setSelectedShift(id)}
                                >
                                    <span className="pf-shift-icon">{s.icon}</span>
                                    <div>
                                        <span className="pf-shift-label">{s.label}{user.turno === id ? ' (actual)' : ''}</span>
                                        <span className="pf-shift-time">{s.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pf-modal-btns">
                            <button className="pf-btn-cancel"  onClick={() => setShowShiftModal(false)}>Cancelar</button>
                            <button className="pf-btn-confirm" onClick={handleShiftConfirm} disabled={selectedShift === user.turno}>
                                Confirmar cambio
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                <button className="nav-btn" onClick={() => navigate('/orders')}>
                    <span className="nav-icon">📋</span>
                    <span className="nav-label">Pedidos</span>
                </button>
                <button className="nav-btn active">
                    <span className="nav-icon">👤</span>
                    <span className="nav-label">Perfil</span>
                </button>
            </div>
        </div>
    );
};

export default UserProfile;
