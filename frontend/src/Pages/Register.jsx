// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Register.css';

const INSTITUTIONS = [
    { id: 1, name: 'IES Gran Vía' },
    { id: 2, name: 'IES Politécnico' },
    { id: 3, name: 'IES La Laboral' },
    { id: 4, name: 'IES Aguadulce' },
    { id: 5, name: 'CIFP Hespérides' },
];

const SHIFTS = [
    { id: 'morning', label: 'Mañana', icon: '🌅', time: '8:00 - 14:00' },
    { id: 'afternoon', label: 'Tarde', icon: '🌇', time: '14:00 - 20:00' },
    { id: 'night', label: 'Noche', icon: '🌙', time: '20:00 - 22:00' },
];

const ALLERGENS = [
    { id: 1, name: 'Gluten', icon: '🌾' },
    { id: 2, name: 'Crustáceos', icon: '🦐' },
    { id: 3, name: 'Huevos', icon: '🥚' },
    { id: 4, name: 'Pescado', icon: '🐟' },
    { id: 5, name: 'Cacahuetes', icon: '🥜' },
    { id: 6, name: 'Soja', icon: '🫘' },
    { id: 7, name: 'Lácteos', icon: '🥛' },
    { id: 8, name: 'Frutos secos', icon: '🌰' },
    { id: 9, name: 'Apio', icon: '🥬' },
    { id: 10, name: 'Mostaza', icon: '🟡' },
    { id: 11, name: 'Sésamo', icon: '🫓' },
    { id: 12, name: 'Sulfitos', icon: '🍷' },
    { id: 13, name: 'Altramuces', icon: '🌿' },
    { id: 14, name: 'Moluscos', icon: '🐚' },
];

const PROFILE_ICONS = [
    '☕', '🧑‍🍳', '🍰', '🎓', '🐱', '🐶',
    '🦊', '🐼', '🦁', '🐨', '🐸', '🦉',
    '🌸', '⭐', '🎵', '🎨', '🚀', '💎',
    '🔥', '🌊', '🍀', '🎯', '🧩', '🎮',
];

const Register = () => {
    const [step, setStep] = useState(1);
    const totalSteps = 3;

    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        confirmPassword: '',
        curso: '',
        institucion: '',
        turno: '',
        alergenos: [],
        profileIcon: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const toggleAllergen = (allergenId) => {
        setFormData(prev => ({
            ...prev,
            alergenos: prev.alergenos.includes(allergenId)
                ? prev.alergenos.filter(id => id !== allergenId)
                : [...prev.alergenos, allergenId]
        }));
    };

    const selectIcon = (icon) => {
        setFormData(prev => ({ ...prev, profileIcon: icon }));
    };

    const selectShift = (shiftId) => {
        setFormData(prev => ({ ...prev, turno: shiftId }));
    };

    // Validation per step
    const validateStep = (currentStep) => {
        const newErrors = {};

        if (currentStep === 1) {
            if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
            if (!formData.apellidos.trim()) newErrors.apellidos = 'Los apellidos son obligatorios';
            if (!formData.email.trim()) {
                newErrors.email = 'El email es obligatorio';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'El email no es válido';
            }
            if (!formData.password) {
                newErrors.password = 'La contraseña es obligatoria';
            } else if (formData.password.length < 6) {
                newErrors.password = 'Mínimo 6 caracteres';
            }
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Las contraseñas no coinciden';
            }
        }

        if (currentStep === 2) {
            if (!formData.curso.trim()) newErrors.curso = 'El curso es obligatorio';
            if (!formData.institucion) newErrors.institucion = 'Selecciona una institución';
            if (!formData.turno) newErrors.turno = 'Selecciona un turno';
        }

        if (currentStep === 3) {
            if (!formData.profileIcon) newErrors.profileIcon = 'Elige un icono de perfil';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(prev => Math.min(prev + 1, totalSteps));
        }
    };

    const prevStep = () => {
        setStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep(step)) return;

        setLoading(true);
        try {
            // Placeholder: will connect to backend later
            console.log('Register data:', formData);
            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            navigate('/');
        } catch (err) {
            console.error('Error en registro:', err);
            setErrors({ general: 'Error al registrar. Inténtalo de nuevo.' });
        } finally {
            setLoading(false);
        }
    };

    const renderProgressBar = () => (
        <div className="register-progress">
            {[1, 2, 3].map(s => (
                <div key={s} className="progress-step-wrapper">
                    <div
                        className={`progress-step ${s === step ? 'active' : ''} ${s < step ? 'completed' : ''}`}
                        onClick={() => s < step && setStep(s)}
                    >
                        {s < step ? '✓' : s}
                    </div>
                    <span className="progress-label">
                        {s === 1 ? 'Datos' : s === 2 ? 'Académico' : 'Perfil'}
                    </span>
                    {s < totalSteps && (
                        <div className={`progress-line ${s < step ? 'completed' : ''}`} />
                    )}
                </div>
            ))}
        </div>
    );

    const renderStep1 = () => (
        <div className="form-step">
            <h3 className="step-title">Datos personales</h3>
            <p className="step-subtitle">Introduce tu información básica</p>

            <div className="row g-3">
                <div className="col-12 col-md-6">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input
                        type="text"
                        className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                    />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                </div>

                <div className="col-12 col-md-6">
                    <label htmlFor="apellidos" className="form-label">Apellidos</label>
                    <input
                        type="text"
                        className={`form-control ${errors.apellidos ? 'is-invalid' : ''}`}
                        id="apellidos"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                        placeholder="Tus apellidos"
                    />
                    {errors.apellidos && <div className="invalid-feedback">{errors.apellidos}</div>}
                </div>
            </div>

            <div className="mt-3">
                <label htmlFor="email" className="form-label">Correo electrónico</label>
                <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="row g-3 mt-0">
                <div className="col-12 col-md-6">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Mínimo 6 caracteres"
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <div className="col-12 col-md-6">
                    <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
                    <input
                        type="password"
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repite la contraseña"
                    />
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="form-step">
            <h3 className="step-title">Información académica</h3>
            <p className="step-subtitle">Datos de tu centro y horario</p>

            <div className="mb-3">
                <label htmlFor="curso" className="form-label">Curso</label>
                <input
                    type="text"
                    className={`form-control ${errors.curso ? 'is-invalid' : ''}`}
                    id="curso"
                    name="curso"
                    value={formData.curso}
                    onChange={handleChange}
                    placeholder="Ej: 2º DAW, 1º DAM..."
                />
                {errors.curso && <div className="invalid-feedback">{errors.curso}</div>}
            </div>

            <div className="mb-3">
                <label htmlFor="institucion" className="form-label">Institución</label>
                <select
                    className={`form-select ${errors.institucion ? 'is-invalid' : ''}`}
                    id="institucion"
                    name="institucion"
                    value={formData.institucion}
                    onChange={handleChange}
                >
                    <option value="">Selecciona tu centro...</option>
                    {INSTITUTIONS.map(inst => (
                        <option key={inst.id} value={inst.id}>{inst.name}</option>
                    ))}
                </select>
                {errors.institucion && <div className="invalid-feedback">{errors.institucion}</div>}
            </div>

            <div className="mb-3">
                <label className="form-label">Turno {errors.turno && <span className="text-danger ms-1">— {errors.turno}</span>}</label>
                <div className="shift-selector">
                    {SHIFTS.map(shift => (
                        <div
                            key={shift.id}
                            className={`shift-card ${formData.turno === shift.id ? 'selected' : ''}`}
                            onClick={() => selectShift(shift.id)}
                        >
                            <span className="shift-icon">{shift.icon}</span>
                            <span className="shift-label">{shift.label}</span>
                            <span className="shift-time">{shift.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="form-step">
            <h3 className="step-title">Personaliza tu perfil</h3>
            <p className="step-subtitle">Elige tus alérgenos e icono</p>

            {/* Allergens */}
            <div className="mb-4">
                <label className="form-label">
                    Alérgenos <span className="text-muted">(opcional)</span>
                </label>
                <div className="allergens-grid">
                    {ALLERGENS.map(allergen => (
                        <div
                            key={allergen.id}
                            className={`allergen-chip ${formData.alergenos.includes(allergen.id) ? 'selected' : ''}`}
                            onClick={() => toggleAllergen(allergen.id)}
                        >
                            <span className="allergen-icon">{allergen.icon}</span>
                            <span className="allergen-name">{allergen.name}</span>
                        </div>
                    ))}
                </div>
                {formData.alergenos.length > 0 && (
                    <p className="selected-count mt-2">
                        {formData.alergenos.length} alérgeno{formData.alergenos.length > 1 ? 's' : ''} seleccionado{formData.alergenos.length > 1 ? 's' : ''}
                    </p>
                )}
            </div>

            {/* Profile Icon */}
            <div className="mb-3">
                <label className="form-label">
                    Icono de perfil {errors.profileIcon && <span className="text-danger ms-1">— {errors.profileIcon}</span>}
                </label>

                {formData.profileIcon && (
                    <div className="selected-icon-preview">
                        <span className="preview-icon">{formData.profileIcon}</span>
                    </div>
                )}

                <div className="icons-grid">
                    {PROFILE_ICONS.map((icon, idx) => (
                        <div
                            key={idx}
                            className={`icon-option ${formData.profileIcon === icon ? 'selected' : ''}`}
                            onClick={() => selectIcon(icon)}
                        >
                            {icon}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="register-wrapper">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-11 col-md-10 col-lg-8 col-xl-7">
                        <div className="register-card">
                            {/* Header */}
                            <div className="register-header text-center">
                                <h1>Crear cuenta</h1>
                                <p>Únete a CaffeApp</p>
                            </div>

                            {/* Progress */}
                            {renderProgressBar()}

                            {/* Error general */}
                            {errors.general && (
                                <div className="alert alert-danger d-flex align-items-center" role="alert">
                                    <span className="me-2">⚠️</span>
                                    <div>{errors.general}</div>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit}>
                                {step === 1 && renderStep1()}
                                {step === 2 && renderStep2()}
                                {step === 3 && renderStep3()}

                                {/* Navigation Buttons */}
                                <div className="form-navigation">
                                    {step > 1 && (
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary btn-nav"
                                            onClick={prevStep}
                                        >
                                            ← Anterior
                                        </button>
                                    )}
                                    <div className="nav-spacer" />
                                    {step < totalSteps ? (
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-nav"
                                            onClick={nextStep}
                                        >
                                            Siguiente →
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-nav btn-submit"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Registrando...
                                                </>
                                            ) : (
                                                '🚀 Crear cuenta'
                                            )}
                                        </button>
                                    )}
                                </div>
                            </form>

                            {/* Footer */}
                            <div className="register-footer text-center">
                                <p>¿Ya tienes cuenta? <Link to="/" className="login-link">Inicia sesión</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
