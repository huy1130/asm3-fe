import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../features/auth/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ username: '', password: '' });

  useEffect(() => {
    if (user) navigate('/');
    return () => dispatch(clearError());
  }, [user, navigate, dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <i className="bi bi-patch-question-fill text-primary" style={{ fontSize: '3rem' }}></i>
                  <h2 className="fw-bold mt-2">QuizApp</h2>
                  <p className="text-muted">Sign in to your account</p>
                </div>

                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
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
                      placeholder="Enter username"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Password</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Signing in...</>
                    ) : (
                      <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>
                    )}
                  </button>
                </form>

                <p className="text-center mt-4 mb-0 text-muted">
                  Don&apos;t have an account?{' '}
                  <Link to="/register" className="text-primary fw-semibold text-decoration-none">
                    Register here
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
