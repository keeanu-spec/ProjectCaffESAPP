// src/Pages/Admin/EmployeeAdmin.jsx
import { useState } from 'react';
import { MOCK_INSTITUTIONS } from './AdminLayout';
import '../../styles/AdminShared.css';

const MOCK_EMPLOYEES = [
    { id: 1, nombre: 'Rosa',     apellidos: 'Martínez López',  email: 'rosa@caffe.es',   institution: 1, active: true  },
    { id: 2, nombre: 'Diego',    apellidos: 'Pérez Sánchez',   email: 'diego@caffe.es',  institution: 1, active: true  },
    { id: 3, nombre: 'Carmen',   apellidos: 'Ruiz Jiménez',    email: 'carmen@caffe.es', institution: 2, active: false },
    { id: 4, nombre: 'Marcos',   apellidos: 'Torres Gil',      email: 'marcos@caffe.es', institution: 3, active: true  },
    { id: 5, nombre: 'Patricia', apellidos: 'Gómez Herrera',   email: 'patri@caffe.es',  institution: 2, active: true  },
];

const EMPTY_FORM = { nombre: '', apellidos: '', email: '', institution: '', password: '' };

const EmployeeAdmin = ({ activeInstitution }) => {
    const [employees, setEmployees]       = useState(MOCK_EMPLOYEES);
    const [showForm, setShowForm]         = useState(false);
    const [editTarget, setEditTarget]     = useState(null);
    const [form, setForm]                 = useState(EMPTY_FORM);
    const [errors, setErrors]             = useState({});
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [search, setSearch]             = useState('');

    const openCreate = () => { setEditTarget(null); setForm(EMPTY_FORM); setErrors({}); setShowForm(true); };
    const openEdit   = (emp) => {
        setEditTarget(emp);
        setForm({ nombre: emp.nombre, apellidos: emp.apellidos, email: emp.email, institution: emp.institution, password: '' });
        setErrors({}); setShowForm(true);
    };

    const validate = () => {
        const e = {};
        if (!form.nombre.trim())    e.nombre      = 'Requerido';
        if (!form.apellidos.trim()) e.apellidos   = 'Requerido';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido';
        if (!form.institution)      e.institution = 'Selecciona institución';
        if (!editTarget && !form.password.trim()) e.password = 'Requerido';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        if (!editTarget) {
            setEmployees(prev => [...prev, { id: Date.now(), ...form, institution: Number(form.institution), active: true }]);
        } else {
            setEmployees(prev => prev.map(emp =>
                emp.id === editTarget.id ? { ...emp, ...form, institution: Number(form.institution) } : emp
            ));
        }
        setShowForm(false);
    };

    const handleDelete = (id) => { setEmployees(prev => prev.filter(e => e.id !== id)); setDeleteConfirm(null); };
    const toggleActive = (id) => { setEmployees(prev => prev.map(e => e.id === id ? { ...e, active: !e.active } : e)); };

    const instName = (id) => MOCK_INSTITUTIONS.find(i => i.id === id)?.name || '—';

    const filtered = employees
        .filter(e => !activeInstitution || e.institution === activeInstitution.id)
        .filter(e => `${e.nombre} ${e.apellidos} ${e.email}`.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="admin-view">
            <div className="view-header">
                <div>
                    <h2 className="view-title">👥 Empleados</h2>
                    <p className="view-subtitle">{activeInstitution ? activeInstitution.name : 'Todos los centros'}</p>
                </div>
                <button className="btn-admin-primary" onClick={openCreate}>+ Nuevo</button>
            </div>

            <div className="stats-row">
                <div className="stat-card"><span className="stat-num">{filtered.length}</span><span className="stat-label">Total</span></div>
                <div className="stat-card"><span className="stat-num">{filtered.filter(e => e.active).length}</span><span className="stat-label">Activos</span></div>
                <div className="stat-card"><span className="stat-num">{filtered.filter(e => !e.active).length}</span><span className="stat-label">Inactivos</span></div>
            </div>

            <div className="admin-search-wrap">
                <span className="search-icon-admin">🔍</span>
                <input
                    type="text" className="admin-search"
                    placeholder="Buscar por nombre o email..."
                    value={search} onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr><th>Empleado</th><th>Email</th><th>Institución</th><th>Estado</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                        {filtered.map(emp => (
                            <tr key={emp.id}>
                                <td><span className="emp-avatar">👤</span><strong>{emp.nombre}</strong> {emp.apellidos}</td>
                                <td className="text-muted">{emp.email}</td>
                                <td className="text-muted">{instName(emp.institution)}</td>
                                <td>
                                    <span className={`table-badge ${emp.active ? 'badge-active' : 'badge-inactive'}`}>
                                        {emp.active ? '✅ Activo' : '⏸️ Inactivo'}
                                    </span>
                                </td>
                                <td>
                                    <div className="table-actions">
                                        <button className="btn-table-edit"   onClick={() => openEdit(emp)}>Editar</button>
                                        <button className="btn-table-toggle" onClick={() => toggleActive(emp.id)}>
                                            {emp.active ? 'Pausar' : 'Activar'}
                                        </button>
                                        <button className="btn-table-delete" onClick={() => setDeleteConfirm(emp)}>Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && <div className="table-empty">No se encontraron empleados.</div>}
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="modal-title">{editTarget ? 'Editar empleado' : 'Nuevo empleado'}</h3>

                        <div className="form-row-2">
                            <div className="form-group">
                                <label className="form-lbl">Nombre</label>
                                <input className={`admin-input ${errors.nombre ? 'input-error' : ''}`}
                                    value={form.nombre} onChange={e => setForm(p => ({...p, nombre: e.target.value}))} placeholder="Nombre" />
                                {errors.nombre && <span className="input-error-msg">{errors.nombre}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-lbl">Apellidos</label>
                                <input className={`admin-input ${errors.apellidos ? 'input-error' : ''}`}
                                    value={form.apellidos} onChange={e => setForm(p => ({...p, apellidos: e.target.value}))} placeholder="Apellidos" />
                                {errors.apellidos && <span className="input-error-msg">{errors.apellidos}</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-lbl">Email</label>
                            <input type="email" className={`admin-input ${errors.email ? 'input-error' : ''}`}
                                value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} placeholder="empleado@caffe.es" />
                            {errors.email && <span className="input-error-msg">{errors.email}</span>}
                        </div>

                        <div className="form-row-2">
                            <div className="form-group">
                                <label className="form-lbl">Institución</label>
                                <select className={`admin-select ${errors.institution ? 'input-error' : ''}`}
                                    value={form.institution} onChange={e => setForm(p => ({...p, institution: e.target.value}))}>
                                    <option value="">Seleccionar...</option>
                                    {MOCK_INSTITUTIONS.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                </select>
                                {errors.institution && <span className="input-error-msg">{errors.institution}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-lbl">
                                    Contraseña
                                    {editTarget && <span className="optional">vacío = sin cambios</span>}
                                </label>
                                <input type="password" className={`admin-input ${errors.password ? 'input-error' : ''}`}
                                    value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} placeholder="••••••••" />
                                {errors.password && <span className="input-error-msg">{errors.password}</span>}
                            </div>
                        </div>

                        <div className="modal-footer-btns">
                            <button className="btn-modal-cancel" onClick={() => setShowForm(false)}>Cancelar</button>
                            <button className="btn-modal-save"   onClick={handleSave}>
                                {editTarget ? 'Guardar cambios' : 'Crear empleado'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="admin-modal admin-modal-sm" onClick={e => e.stopPropagation()}>
                        <h3 className="modal-title">¿Eliminar empleado?</h3>
                        <p className="modal-hint">Se eliminará a <strong>{deleteConfirm.nombre} {deleteConfirm.apellidos}</strong>.</p>
                        <div className="modal-footer-btns">
                            <button className="btn-modal-cancel" onClick={() => setDeleteConfirm(null)}>Cancelar</button>
                            <button className="btn-modal-delete" onClick={() => handleDelete(deleteConfirm.id)}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeAdmin;
