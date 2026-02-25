import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError, clearRegisterSuccess } from '../features/auth/authSlice';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, registerSuccess } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' });
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (registerSuccess) {
      dispatch(clearRegisterSuccess());
      navigate('/login');
    }
    return () => dispatch(clearError());
  }, [registerSuccess, navigate, dispatch]);

  const handleChange = (e) => {
    setLocalError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    dispatch(register({ username: form.username, password: form.password }));
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <i className="bi bi-person-plus-fill text-primary" style={{ fontSize: '3rem' }}></i>
                  <h2 className="fw-bold mt-2">Create Account</h2>
                  <p className="text-muted">Join QuizApp today</p>
                </div>

                {(error || localError) && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {localError || error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Username</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="Choose a username"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Creating account...</>
                    ) : (
                      <><i className="bi bi-person-check me-2"></i>Create Account</>
                    )}
                  </button>
                </form>

                <p className="text-center mt-4 mb-0 text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
