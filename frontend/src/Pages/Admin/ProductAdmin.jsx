// src/Pages/Admin/ProductAdmin.jsx
import { useState } from 'react';
import '../../styles/AdminShared.css';

const ALLERGEN_LIST = [
    { id: 1,  name: 'Gluten',       icon: '🌾' }, { id: 2,  name: 'Crustáceos',   icon: '🦐' },
    { id: 3,  name: 'Huevos',       icon: '🥚' }, { id: 4,  name: 'Pescado',      icon: '🐟' },
    { id: 5,  name: 'Cacahuetes',   icon: '🥜' }, { id: 6,  name: 'Soja',         icon: '🫘' },
    { id: 7,  name: 'Lácteos',      icon: '🥛' }, { id: 8,  name: 'Frutos secos', icon: '🌰' },
    { id: 9,  name: 'Apio',         icon: '🥬' }, { id: 10, name: 'Mostaza',      icon: '🟡' },
    { id: 11, name: 'Sésamo',       icon: '🫓' }, { id: 12, name: 'Sulfitos',     icon: '🍷' },
    { id: 13, name: 'Altramuces',   icon: '🌿' }, { id: 14, name: 'Moluscos',     icon: '🐚' },
];

const CATEGORIES = [
    { id: 'bebidas-calientes', label: 'Bebidas Calientes', icon: '☕' },
    { id: 'bebidas-frias',     label: 'Bebidas Frías',     icon: '🧊' },
    { id: 'bolleria',          label: 'Bollería',          icon: '🥐' },
    { id: 'comida',            label: 'Comida',            icon: '🥪' },
    { id: 'postres',           label: 'Postres',           icon: '🍰' },
];

const EMOJIS = ['☕','🥛','🍫','🍵','🍊','🧁','🥐','🍞','🥪','🥗','🌯','🍪','💧','🍓','🍦','🥚'];

const MOCK_PRODUCTS = [
    { id: 1, name: 'Café Espresso',  price: 2.50, image: '☕', category: 'bebidas-calientes', allergens: [],      stock: 50, active: true,  ingredients: 'Café arábica, agua filtrada' },
    { id: 2, name: 'Café Latte',     price: 3.50, image: '☕', category: 'bebidas-calientes', allergens: [7],     stock: 40, active: true,  ingredients: 'Café, leche entera, espuma de leche' },
    { id: 3, name: 'Croissant',      price: 2.25, image: '🥐', category: 'bolleria',          allergens: [1,3,7], stock: 20, active: true,  ingredients: 'Harina, mantequilla, huevo, levadura' },
    { id: 4, name: 'Sándwich Mixto', price: 4.50, image: '🥪', category: 'comida',            allergens: [1,7],   stock: 15, active: false, ingredients: 'Pan de molde, jamón, queso, mantequilla' },
    { id: 5, name: 'Brownie',        price: 3.00, image: '🍫', category: 'postres',           allergens: [1,3,7,8], stock: 12, active: true, ingredients: 'Chocolate, harina, huevo, nueces' },
];

const EMPTY_FORM = { name: '', price: '', image: '☕', category: '', allergens: [], stock: '', active: true, ingredients: '' };

const ProductAdmin = () => {
    const [products, setProducts]         = useState(MOCK_PRODUCTS);
    const [showForm, setShowForm]         = useState(false);
    const [editTarget, setEditTarget]     = useState(null);
    const [form, setForm]                 = useState(EMPTY_FORM);
    const [errors, setErrors]             = useState({});
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [filterCat, setFilterCat]       = useState('all');
    const [search, setSearch]             = useState('');

    const openCreate = () => { setEditTarget(null); setForm(EMPTY_FORM); setErrors({}); setShowForm(true); };
    const openEdit   = (p) => {
        setEditTarget(p);
        setForm({ name: p.name, price: String(p.price), image: p.image, category: p.category,
                  allergens: [...p.allergens], stock: String(p.stock), active: p.active, ingredients: p.ingredients });
        setErrors({}); setShowForm(true);
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim())          e.name        = 'Requerido';
        if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Precio inválido';
        if (!form.category)             e.category    = 'Selecciona categoría';
        if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) e.stock  = 'Stock inválido';
        if (!form.ingredients.trim())   e.ingredients = 'Requerido';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        const parsed = { ...form, price: Number(form.price), stock: Number(form.stock) };
        if (!editTarget) {
            setProducts(prev => [...prev, { id: Date.now(), ...parsed }]);
        } else {
            setProducts(prev => prev.map(p => p.id === editTarget.id ? { ...p, ...parsed } : p));
        }
        setShowForm(false);
    };

    const handleDelete    = (id) => { setProducts(prev => prev.filter(p => p.id !== id)); setDeleteConfirm(null); };
    const toggleActive    = (id) => { setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p)); };
    const toggleAllergen  = (id) => {
        setForm(prev => ({
            ...prev,
            allergens: prev.allergens.includes(id) ? prev.allergens.filter(a => a !== id) : [...prev.allergens, id]
        }));
    };

    const alInfo   = (id) => ALLERGEN_LIST.find(a => a.id === id);
    const catLabel = (id) => CATEGORIES.find(c => c.id === id)?.label || id;

    const filtered = products
        .filter(p => filterCat === 'all' || p.category === filterCat)
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="admin-view">
            <div className="view-header">
                <div>
                    <h2 className="view-title">🍽️ Menú & Stock</h2>
                    <p className="view-subtitle">Productos, alérgenos y stock diario</p>
                </div>
                <button className="btn-admin-primary" onClick={openCreate}>+ Nuevo</button>
            </div>

            <div className="stats-row">
                <div className="stat-card"><span className="stat-num">{products.length}</span><span className="stat-label">Productos</span></div>
                <div className="stat-card"><span className="stat-num">{products.filter(p => p.active).length}</span><span className="stat-label">Disponibles</span></div>
                <div className="stat-card"><span className="stat-num">{products.reduce((s, p) => s + p.stock, 0)}</span><span className="stat-label">Unidades</span></div>
            </div>

            <div className="admin-search-wrap">
                <span className="search-icon-admin">🔍</span>
                <input type="text" className="admin-search" placeholder="Buscar producto..."
                    value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="cat-filter-row">
                <button className={`cat-pill ${filterCat === 'all' ? 'active' : ''}`} onClick={() => setFilterCat('all')}>Todos</button>
                {CATEGORIES.map(c => (
                    <button key={c.id} className={`cat-pill ${filterCat === c.id ? 'active' : ''}`} onClick={() => setFilterCat(c.id)}>
                        {c.icon} {c.label}
                    </button>
                ))}
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Alérgenos</th><th>Estado</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                        {filtered.map(p => (
                            <tr key={p.id} className={!p.active ? 'row-inactive' : ''}>
                                <td><span className="table-icon">{p.image}</span><strong>{p.name}</strong></td>
                                <td className="text-muted">{catLabel(p.category)}</td>
                                <td><strong>{p.price.toFixed(2)} €</strong></td>
                                <td>
                                    <span className={`stock-badge ${p.stock <= 5 ? 'stock-low' : ''}`}>
                                        {p.stock <= 5 ? '⚠️ ' : ''}{p.stock}
                                    </span>
                                </td>
                                <td>
                                    <div className="allergen-icons">
                                        {p.allergens.length === 0
                                            ? <span className="no-al">—</span>
                                            : p.allergens.map(id => (
                                                <span key={id} title={alInfo(id)?.name}>{alInfo(id)?.icon}</span>
                                              ))
                                        }
                                    </div>
                                </td>
                                <td>
                                    <span className={`table-badge ${p.active ? 'badge-active' : 'badge-inactive'}`}>
                                        {p.active ? '✅ Activo' : '⏸️ Inactivo'}
                                    </span>
                                </td>
                                <td>
                                    <div className="table-actions">
                                        <button className="btn-table-edit"   onClick={() => openEdit(p)}>Editar</button>
                                        <button className="btn-table-toggle" onClick={() => toggleActive(p.id)}>
                                            {p.active ? 'Pausar' : 'Activar'}
                                        </button>
                                        <button className="btn-table-delete" onClick={() => setDeleteConfirm(p)}>Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && <div className="table-empty">No hay productos.</div>}
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="admin-modal admin-modal-lg" onClick={e => e.stopPropagation()}>
                        <h3 className="modal-title">{editTarget ? 'Editar producto' : 'Nuevo producto'}</h3>

                        <div className="form-row-2">
                            <div className="form-group">
                                <label className="form-lbl">Nombre</label>
                                <input className={`admin-input ${errors.name ? 'input-error' : ''}`}
                                    value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="Ej: Café Espresso" />
                                {errors.name && <span className="input-error-msg">{errors.name}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-lbl">Categoría</label>
                                <select className={`admin-select ${errors.category ? 'input-error' : ''}`}
                                    value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))}>
                                    <option value="">Seleccionar...</option>
                                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                                </select>
                                {errors.category && <span className="input-error-msg">{errors.category}</span>}
                            </div>
                        </div>

                        <div className="form-row-3">
                            <div className="form-group">
                                <label className="form-lbl">Precio (€)</label>
                                <input type="number" min="0" step="0.01" className={`admin-input ${errors.price ? 'input-error' : ''}`}
                                    value={form.price} onChange={e => setForm(p => ({...p, price: e.target.value}))} placeholder="0.00" />
                                {errors.price && <span className="input-error-msg">{errors.price}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-lbl">Stock diario</label>
                                <input type="number" min="0" className={`admin-input ${errors.stock ? 'input-error' : ''}`}
                                    value={form.stock} onChange={e => setForm(p => ({...p, stock: e.target.value}))} placeholder="50" />
                                {errors.stock && <span className="input-error-msg">{errors.stock}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-lbl">Emoji</label>
                                <select className="admin-select" value={form.image} onChange={e => setForm(p => ({...p, image: e.target.value}))}>
                                    {EMOJIS.map((em, i) => <option key={i} value={em}>{em}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-lbl">Ingredientes</label>
                            <textarea className={`admin-textarea ${errors.ingredients ? 'input-error' : ''}`}
                                rows={2} value={form.ingredients}
                                onChange={e => setForm(p => ({...p, ingredients: e.target.value}))}
                                placeholder="Ej: Café arábica, leche entera, azúcar..." />
                            {errors.ingredients && <span className="input-error-msg">{errors.ingredients}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-lbl">Alérgenos</label>
                            <div className="allergen-selector">
                                {ALLERGEN_LIST.map(al => (
                                    <div
                                        key={al.id}
                                        className={`al-chip ${form.allergens.includes(al.id) ? 'selected' : ''}`}
                                        onClick={() => toggleAllergen(al.id)}
                                    >
                                        {al.icon} {al.name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-lbl toggle-label">
                                <span>Disponible</span>
                                <div className={`toggle-switch ${form.active ? 'on' : ''}`} onClick={() => setForm(p => ({...p, active: !p.active}))}>
                                    <div className="toggle-knob" />
                                </div>
                            </label>
                        </div>

                        <div className="modal-footer-btns">
                            <button className="btn-modal-cancel" onClick={() => setShowForm(false)}>Cancelar</button>
                            <button className="btn-modal-save"   onClick={handleSave}>
                                {editTarget ? 'Guardar cambios' : 'Crear producto'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="admin-modal admin-modal-sm" onClick={e => e.stopPropagation()}>
                        <h3 className="modal-title">¿Eliminar producto?</h3>
                        <p className="modal-hint">Se eliminará <strong>{deleteConfirm.name}</strong> del catálogo.</p>
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

export default ProductAdmin;
