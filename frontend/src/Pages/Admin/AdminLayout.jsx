// src/Pages/Admin/AdminLayout.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/AdminLayout.css';

export const MOCK_INSTITUTIONS = [
    { id: 1, name: 'IES Gran Vía' },
    { id: 2, name: 'IES Politécnico' },
    { id: 3, name: 'IES La Laboral' },
    { id: 4, name: 'IES Aguadulce' },
    { id: 5, name: 'CIFP Hespérides' },
];

const NAV_ITEMS = [
    { path: '/admin',            icon: '🏛️', label: 'Instituciones' },
    { path: '/admin/employees',  icon: '👥', label: 'Empleados'     },
    { path: '/admin/products',   icon: '🍽️', label: 'Menú & Stock'  },
];

const AdminLayout = ({ children, activeInstitution, onInstitutionChange }) => {
    const navigate  = useNavigate();
    const location  = useLocation();
    const [showInstPicker, setShowInstPicker] = useState(false);
    const [navOpen, setNavOpen] = useState(false);

    return (
        <div className="al-wrapper">

            {/* Top Bar */}
            <header className="al-topbar">
                {/* Hamburger (mobile) */}
                <button className="al-hamburger" onClick={() => setNavOpen(p => !p)}>☰</button>

                <div className="al-brand-block">
                    <span className="al-logo">☕</span>
                    <span className="al-brand">CaffeApp</span>
                    <span className="al-role-tag">Admin</span>
                </div>

                {/* Institution Switcher */}
                <div className="al-inst-wrap">
                    <button className="al-inst-btn" onClick={() => setShowInstPicker(p => !p)}>
                        <span>🏫</span>
                        <span className="al-inst-name">{activeInstitution?.name || 'Todas'}</span>
                        <span className="al-arrow">{showInstPicker ? '▲' : '▼'}</span>
                    </button>

                    {showInstPicker && (
                        <>
                            <div className="al-inst-backdrop" onClick={() => setShowInstPicker(false)} />
                            <div className="al-inst-dropdown">
                                <div
                                    className={`al-inst-opt ${!activeInstitution ? 'active' : ''}`}
                                    onClick={() => { onInstitutionChange(null); setShowInstPicker(false); }}
                                >
                                    🌐 Todas las instituciones
                                </div>
                                {MOCK_INSTITUTIONS.map(inst => (
                                    <div
                                        key={inst.id}
                                        className={`al-inst-opt ${activeInstitution?.id === inst.id ? 'active' : ''}`}
                                        onClick={() => { onInstitutionChange(inst); setShowInstPicker(false); }}
                                    >
                                        🏫 {inst.name}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <button className="al-logout" onClick={() => navigate('/')}>Salir</button>
            </header>

            <div className="al-body">

                {/* Mobile Nav Overlay */}
                {navOpen && <div className="al-nav-backdrop" onClick={() => setNavOpen(false)} />}

                {/* Sidebar */}
                <nav className={`al-sidebar ${navOpen ? 'open' : ''}`}>
                    <div className="al-sidebar-user">
                        <span className="al-sidebar-avatar">👤</span>
                        <div>
                            <span className="al-sidebar-uname">Severina</span>
                            <span className="al-sidebar-role">Administradora</span>
                        </div>
                    </div>
                    {NAV_ITEMS.map(item => (
                        <button
                            key={item.path}
                            className={`al-sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => { navigate(item.path); setNavOpen(false); }}
                        >
                            <span className="al-sidebar-icon">{item.icon}</span>
                            <span className="al-sidebar-label">{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Main */}
                <main className="al-main">
                    {activeInstitution && (
                        <div className="al-inst-banner">
                            🏫 Filtrando por: <strong>{activeInstitution.name}</strong>
                            <button onClick={() => onInstitutionChange(null)}>✕ Ver todas</button>
                        </div>
                    )}
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Nav */}
            <nav className="al-bottom-nav">
                {NAV_ITEMS.map(item => (
                    <button
                        key={item.path}
                        className={`al-bottom-btn ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <span className="al-bottom-icon">{item.icon}</span>
                        <span className="al-bottom-label">{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default AdminLayout;
