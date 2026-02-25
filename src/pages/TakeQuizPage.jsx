import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizById, clearCurrent } from '../features/quizzes/quizSlice';

export default function TakeQuizPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: quiz, loading, error } = useSelector((state) => state.quizzes);

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    dispatch(fetchQuizById(id));
    return () => dispatch(clearCurrent());
  }, [dispatch, id]);

  const handleSelect = (questionId, optionIndex) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    if (!quiz) return;
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (answers[q._id] === q.correctAnswerIndex) correct++;
    });
    setScore(correct);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const getAnsweredCount = () => Object.keys(answers).length;
  const totalQuestions = quiz?.questions?.length || 0;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const getScoreColor = () => {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    return 'danger';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Quizzes</button>
      </div>
    );
  }

  if (!quiz) return null;

  return (
    <div className="container py-5" style={{ maxWidth: 780 }}>
      <button className="btn btn-outline-secondary btn-sm mb-4" onClick={() => navigate('/')}>
        <i className="bi bi-arrow-left me-2"></i>Back to Quizzes
      </button>

      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <h2 className="fw-bold mb-1">{quiz.title}</h2>
          {quiz.description && <p className="text-muted mb-3">{quiz.description}</p>}

          {!submitted ? (
            <div className="d-flex align-items-center gap-3">
              <div className="progress flex-grow-1" style={{ height: 8 }}>
                <div
                  className="progress-bar bg-primary"
                  style={{ width: `${totalQuestions > 0 ? (getAnsweredCount() / totalQuestions) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-muted small fw-semibold">
                {getAnsweredCount()} / {totalQuestions} answered
              </span>
            </div>
          ) : (
            <div className={`alert alert-${getScoreColor()} mb-0 d-flex align-items-center gap-3`}>
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center bg-${getScoreColor()} text-white flex-shrink-0`}
                style={{ width: 56, height: 56, fontSize: '1.4rem' }}
              >
                {percentage >= 80 ? '🎉' : percentage >= 50 ? '👍' : '😓'}
              </div>
              <div>
                <h5 className="mb-0 fw-bold">
                  Score: {score} / {totalQuestions} ({percentage}%)
                </h5>
                <small>
                  {percentage >= 80 ? 'Excellent work!' : percentage >= 50 ? 'Good effort!' : 'Keep practicing!'}
                </small>
              </div>
              <div className="ms-auto">
                <button className="btn btn-outline-secondary btn-sm me-2" onClick={handleRetry}>
                  <i className="bi bi-arrow-clockwise me-1"></i>Retry
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/')}>
                  <i className="bi bi-house me-1"></i>Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {quiz.questions.map((question, qIdx) => {
        const userAnswer = answers[question._id];
        const isAnswered = userAnswer !== undefined;
        const isCorrect = userAnswer === question.correctAnswerIndex;

        return (
          <div
            key={question._id}
            className={`card border-0 shadow-sm rounded-4 mb-3 ${
              submitted ? (isCorrect ? 'border-success border-2' : 'border-danger border-2') : ''
            }`}
            style={{ borderWidth: submitted ? '2px !important' : '' }}
          >
            <div className="card-body p-4">
              <div className="d-flex gap-3 mb-3">
                <span
                  className={`badge rounded-pill fs-6 px-3 ${
                    submitted
                      ? isCorrect
                        ? 'bg-success'
                        : 'bg-danger'
                      : isAnswered
                      ? 'bg-primary'
                      : 'bg-secondary'
                  }`}
                  style={{ minWidth: 36 }}
                >
                  {qIdx + 1}
                </span>
                <p className="fw-semibold mb-0 fs-5">{question.text}</p>
              </div>

              <div className="d-flex flex-column gap-2">
                {question.options.map((option, oIdx) => {
                  let btnClass = 'btn-outline-secondary';
                  if (!submitted && userAnswer === oIdx) btnClass = 'btn-primary';
                  if (submitted) {
                    if (oIdx === question.correctAnswerIndex) btnClass = 'btn-success';
                    else if (userAnswer === oIdx && !isCorrect) btnClass = 'btn-danger';
                    else btnClass = 'btn-outline-secondary';
                  }

                  return (
                    <button
                      key={oIdx}
                      className={`btn ${btnClass} text-start rounded-3 d-flex align-items-center gap-2`}
                      onClick={() => handleSelect(question._id, oIdx)}
                      disabled={submitted}
                    >
                      <span
                        className="rounded-circle border d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
                        style={{ width: 28, height: 28, fontSize: '0.8rem' }}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      {option}
                      {submitted && oIdx === question.correctAnswerIndex && (
                        <i className="bi bi-check-circle-fill ms-auto"></i>
                      )}
                      {submitted && userAnswer === oIdx && !isCorrect && (
                        <i className="bi bi-x-circle-fill ms-auto"></i>
                      )}
                    </button>
                  );
                })}
              </div>

              {question.keywords?.length > 0 && submitted && (
                <div className="mt-3">
                  {question.keywords.map((kw) => (
                    <span key={kw} className="badge bg-light text-secondary border me-1">{kw}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {!submitted && totalQuestions > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <span className="text-muted">
            {getAnsweredCount() < totalQuestions && (
              <><i className="bi bi-info-circle me-1"></i>You have {totalQuestions - getAnsweredCount()} unanswered question(s)</>
            )}
          </span>
          <button
            className="btn btn-primary btn-lg px-5 rounded-3"
            onClick={handleSubmit}
            disabled={getAnsweredCount() === 0}
          >
            <i className="bi bi-check2-circle me-2"></i>Submit Answers
          </button>
        </div>
      )}
    </div>
  );
}
