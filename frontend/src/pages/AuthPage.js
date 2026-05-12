import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AuthPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getErrorMessage = (requestError) => {
    if (!requestError.response) {
      return 'Cannot connect to server. Please start backend on localhost:8082.';
    }

    const responseData = requestError.response.data;

    if (responseData?.message) {
      return responseData.message;
    }

    if (responseData?.errors) {
      const firstValidationError = Object.values(responseData.errors)[0];
      if (firstValidationError) {
        return String(firstValidationError);
      }
    }

    if (requestError.response.status === 401) {
      return 'Invalid email or password.';
    }

    return 'Authentication failed. Please try again.';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = mode === 'signup'
        ? { name: formData.name, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };

      const endpoint = mode === 'signup' ? '/auth/signup' : '/auth/login';
      const response = await api.post(endpoint, payload);

      localStorage.setItem('libraryUser', JSON.stringify(response.data));
      navigate('/');
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-panel">
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          {mode === 'login' ? 'Login to continue managing your library.' : 'Sign up to start using LibraryManager.'}
        </p>

        {error && (
          <div className="auth-error">{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'signup' && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Name</label>
              <input
                type="text"
                className="input-field"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email</label>
            <input
              type="email"
              className="input-field"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Password</label>
            <input
              type="password"
              className="input-field"
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <button
          type="button"
          className="auth-switch-btn"
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setError('');
          }}
        >
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
