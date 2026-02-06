// src/pages/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import '../styles/Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login(formData.email, formData.password);

            if (response.success) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Error en login:', err);
            setError(
                err.response?.data?.error || 
                'Error al iniciar sesión. Verifica tus credenciales.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper d-flex align-items-center justify-content-center min-vh-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
                        <div className="login-card shadow-lg rounded-4 p-4 p-md-5 bg-white">
                            {/* Header */}
                            <div className="login-header text-center mb-4 mb-md-5">
                                <h1 className="h2 fw-bold text-dark mb-2">Bienvenido a CaffeApp</h1>
                                <p className="text-muted small">Inicia sesión en tu cuenta</p>
                            </div>

                            {/* Error Alert */}
                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center" role="alert">
                                    <span className="me-2">⚠️</span>
                                    <div>{error}</div>
                                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit}>
                                {/* Email */}
                                <div className="mb-3 mb-md-4">
                                    <label htmlFor="email" className="form-label fw-600 text-uppercase small">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg rounded-3"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="tu@email.com"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                {/* Password */}
                                <div className="mb-4 mb-md-5">
                                    <label htmlFor="password" className="form-label fw-600 text-uppercase small">
                                        Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg rounded-3"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                {/* Submit Button */}
                                <button 
                                    type="submit" 
                                    className="btn btn-primary btn-lg w-100 fw-bold rounded-3 mb-3"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Iniciando sesión...
                                        </>
                                    ) : (
                                        'Iniciar Sesión'
                                    )}
                                </button>
                            </form>

                            {/* Footer */}
                            <div className="login-footer text-center pt-3 border-top">
                                <a href="#" className="text-decoration-none small">
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
