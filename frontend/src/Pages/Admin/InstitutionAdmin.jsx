// src/Pages/Admin/InstitutionAdmin.jsx
import { useState } from 'react';
import { MOCK_INSTITUTIONS } from './AdminLayout';
import '../../styles/AdminShared.css';

const InstitutionAdmin = ({ activeInstitution }) => {
    const [institutions, setInstitutions] = useState(
        MOCK_INSTITUTIONS.map((i, idx) => ({
            ...i,
            active: true,
            employeeCount: [3, 2, 4, 1, 2][idx] ?? 1,
            createdAt: '2024-09-01',
        }))
    );
    const [showForm, setShowForm]         = useState(false);
    const [editTarget, setEditTarget]     = useState(null);
    const [formName, setFormName]         = useState('');
    const [formError, setFormError]       = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const openCreate = () => { setEditTarget(null); setFormName(''); setFormError(''); setShowForm(true); };
    const openEdit   = (inst) => { setEditTarget(inst); setFormName(inst.name); setFormError(''); setShowForm(true); };

    const handleSave = () => {
        if (!formName.trim()) { setFormError('El nombre es obligatorio'); return; }
        if (!editTarget) {
            setInstitutions(prev => [...prev, {
                id: Date.now(), name: formName.trim(),
                active: true, employeeCount: 0, createdAt: new Date().toISOString().slice(0, 10),
            }]);
        } else {
            setInstitutions(prev => prev.map(i => i.id === editTarget.id ? { ...i, name: formName.trim() } : i));
        }
        setShowForm(false);
    };

    const handleDelete  = (id) => { setInstitutions(prev => prev.filter(i => i.id !== id)); setDeleteConfirm(null); };
    const toggleActive  = (id) => { setInstitutions(prev => prev.map(i => i.id === id ? { ...i, active: !i.active } : i)); };

    const display = activeInstitution ? institutions.filter(i => i.id === activeInstitution.id) : institutions;

    return (
        <div className="admin-view">
            <div className="view-header">
                <div>
                    <h2 className="view-title">🏛️ Instituciones</h2>
                    <p className="view-subtitle">Centros educativos del sistema</p>
                </div>
                <button className="btn-admin-primary" onClick={openCreate}>+ Nueva</button>
            </div>

            {/* Stats */}
            <div className="stats-row">
                <div className="stat-card">
                    <span className="stat-num">{institutions.length}</span>
                    <span className="stat-label">Total</span>
                </div>
                <div className="stat-card">
                    <span className="stat-num">{institutions.filter(i => i.active).length}</span>
                    <span className="stat-label">Activas</span>
                </div>
                <div className="stat-card">
                    <span className="stat-num">{institutions.reduce((s, i) => s + i.employeeCount, 0)}</span>
                    <span className="stat-label">Empleados</span>
                </div>
            </div>

            {/* Table */}
            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Centro</th>
                            <th>Empleados</th>
                            <th>Alta</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {display.map(inst => (
                            <tr key={inst.id}>
                                <td><span className="table-icon">🏫</span><strong>{inst.name}</strong></td>
                                <td><span className="employee-count">{inst.employeeCount}</span></td>
                                <td className="text-muted">{inst.createdAt}</td>
                                <td>
                                    <span className={`table-badge ${inst.active ? 'badge-active' : 'badge-inactive'}`}>
                                        {inst.active ? '✅ Activo' : '⏸️ Inactivo'}
                                    </span>
                                </td>
                                <td>
                                    <div className="table-actions">
                                        <button className="btn-table-edit"   onClick={() => openEdit(inst)}>Editar</button>
                                        <button className="btn-table-toggle" onClick={() => toggleActive(inst.id)}>
                                            {inst.active ? 'Pausar' : 'Activar'}
                                        </button>
                                        <button className="btn-table-delete" onClick={() => setDeleteConfirm(inst)}>Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {display.length === 0 && <div className="table-empty">No hay instituciones.</div>}
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="admin-modal admin-modal-sm" onClick={e => e.stopPropagation()}>
                        <h3 className="modal-title">{editTarget ? 'Editar institución' : 'Nueva institución'}</h3>
                        <div className="form-group">
                            <label className="form-lbl">Nombre del centro</label>
                            <input
                                className={`admin-input ${formError ? 'input-error' : ''}`}
                                placeholder="Ej: IES Gran Vía"
                                value={formName}
                                onChange={e => { setFormName(e.target.value); setFormError(''); }}
                                autoFocus
                            />
                            {formError && <span className="input-error-msg">{formError}</span>}
                        </div>
                        <div className="modal-footer-btns">
                            <button className="btn-modal-cancel" onClick={() => setShowForm(false)}>Cancelar</button>
                            <button className="btn-modal-save"   onClick={handleSave}>
                                {editTarget ? 'Guardar' : 'Crear'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="admin-modal admin-modal-sm" onClick={e => e.stopPropagation()}>
                        <h3 className="modal-title">¿Eliminar institución?</h3>
                        <p className="modal-hint">Se eliminará <strong>{deleteConfirm.name}</strong> del sistema.</p>
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

export default InstitutionAdmin;
