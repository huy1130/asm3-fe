import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-patch-question-fill me-2"></i>QuizApp
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  <i className="bi bi-collection-play me-1"></i>Quizzes
                </Link>
              </li>
            )}
            {user?.admin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/questions">
                    <i className="bi bi-question-circle me-1"></i>Manage Questions
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/quizzes">
                    <i className="bi bi-journals me-1"></i>Manage Quizzes
                  </Link>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav ms-auto align-items-center">
            {user ? (
              <>
                <li className="nav-item me-2">
                  <span className="navbar-text text-white">
                    <i className="bi bi-person-circle me-1"></i>
                    {user.username}
                    {user.admin && (
                      <span className="badge bg-warning text-dark ms-2">Admin</span>
                    )}
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light btn-sm ms-2" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
