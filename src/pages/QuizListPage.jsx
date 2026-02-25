import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizzes } from '../features/quizzes/quizSlice';

export default function QuizListPage() {
  const dispatch = useDispatch();
  const { list: quizzes, loading, error } = useSelector((state) => state.quizzes);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Available Quizzes</h2>
          <p className="text-muted mb-0">
            Welcome back, <strong>{user?.username}</strong>! Choose a quiz to get started.
          </p>
        </div>
        <span className="badge bg-primary fs-6 px-3 py-2">
          {quizzes.length} Quiz{quizzes.length !== 1 ? 'zes' : ''}
        </span>
      </div>

      {error && (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>{error}
        </div>
      )}

      {quizzes.length === 0 && !loading && (
        <div className="text-center py-5">
          <i className="bi bi-inbox text-muted" style={{ fontSize: '4rem' }}></i>
          <p className="text-muted mt-3 fs-5">No quizzes available yet.</p>
          {user?.admin && (
            <Link to="/admin/quizzes" className="btn btn-primary mt-2">
              <i className="bi bi-plus-circle me-2"></i>Create First Quiz
            </Link>
          )}
        </div>
      )}

      <div className="row g-4">
        {quizzes.map((quiz) => (
          <div key={quiz._id} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0 rounded-4 quiz-card">
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex align-items-start mb-3">
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                    style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #0d6efd, #6610f2)' }}
                  >
                    <i className="bi bi-journal-bookmark-fill text-white fs-5"></i>
                  </div>
                  <div>
                    <h5 className="card-title fw-bold mb-1">{quiz.title}</h5>
                    <span className="badge bg-light text-secondary border">
                      <i className="bi bi-question-circle me-1"></i>
                      {quiz.questions?.length || 0} question{quiz.questions?.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {quiz.description && (
                  <p className="card-text text-muted flex-grow-1 mb-3">{quiz.description}</p>
                )}

                <div className="mt-auto">
                  {quiz.questions?.length > 0 ? (
                    <Link
                      to={`/quiz/${quiz._id}`}
                      className="btn btn-primary w-100 rounded-3"
                    >
                      <i className="bi bi-play-fill me-2"></i>Start Quiz
                    </Link>
                  ) : (
                    <button className="btn btn-outline-secondary w-100 rounded-3" disabled>
                      <i className="bi bi-slash-circle me-2"></i>No questions yet
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
