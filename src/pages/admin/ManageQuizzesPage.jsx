import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} from '../../features/quizzes/quizSlice';
import { fetchQuestions } from '../../features/questions/questionSlice';
import SuccessModal from '../../components/SuccessModal';

const emptyForm = { title: '', description: '', questions: [] };

export default function ManageQuizzesPage() {
  const dispatch = useDispatch();
  const { list: quizzes, loading, error } = useSelector((state) => state.quizzes);
  const { list: questions } = useSelector((state) => state.questions);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    dispatch(fetchQuizzes());
    dispatch(fetchQuestions());
  }, [dispatch]);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (quiz) => {
    setEditId(quiz._id);
    setForm({
      title: quiz.title,
      description: quiz.description || '',
      questions: quiz.questions?.map((q) => (typeof q === 'object' ? q._id : q)) || [],
    });
    setFormError('');
    setShowModal(true);
  };

  const toggleQuestion = (qId) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.includes(qId)
        ? prev.questions.filter((id) => id !== qId)
        : [...prev.questions, qId],
    }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setFormError('Title is required'); return; }

    setSaving(true);
    const data = {
      title: form.title.trim(),
      description: form.description.trim(),
      questions: form.questions,
    };

    const action = editId
      ? await dispatch(updateQuiz({ id: editId, data }))
      : await dispatch(createQuiz(data));

    setSaving(false);
    if (!action.error) {
      setShowModal(false);
      dispatch(fetchQuizzes());
      setSuccessMessage(editId ? 'Quiz updated successfully.' : 'Quiz created successfully.');
    } else {
      setFormError(action.payload || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    const action = await dispatch(deleteQuiz(id));
    setDeleteConfirm(null);
    if (!action.error) {
      setSuccessMessage('Quiz deleted successfully.');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Manage Quizzes</h2>
          <p className="text-muted mb-0">{quizzes.length} quiz(zes) total</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={openCreate}>
          <i className="bi bi-plus-circle me-2"></i>Add Quiz
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-inbox text-muted" style={{ fontSize: '4rem' }}></i>
          <p className="text-muted mt-3">No quizzes yet. Create your first one!</p>
        </div>
      ) : (
        <div className="row g-4">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm rounded-4">
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #0d6efd, #6610f2)' }}
                    >
                      <i className="bi bi-journals text-white"></i>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm rounded-3"
                        onClick={() => openEdit(quiz)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm rounded-3"
                        onClick={() => setDeleteConfirm(quiz._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>

                  <h5 className="fw-bold mb-1">{quiz.title}</h5>
                  {quiz.description && (
                    <p className="text-muted small mb-3">{quiz.description}</p>
                  )}

                  <div className="mt-auto">
                    <span className="badge bg-light text-secondary border rounded-pill">
                      <i className="bi bi-question-circle me-1"></i>
                      {quiz.questions?.length || 0} question(s)
                    </span>
                  </div>

                  {quiz.questions?.length > 0 && (
                    <div className="mt-3 pt-3 border-top">
                      <p className="text-muted small mb-2 fw-semibold">Questions included:</p>
                      <div className="d-flex flex-column gap-1">
                        {quiz.questions.slice(0, 3).map((q, idx) => (
                          <span key={typeof q === 'object' ? q._id : q} className="text-muted small">
                            <span className="badge bg-secondary me-1 rounded-pill">{idx + 1}</span>
                            {typeof q === 'object' ? q.text : q}
                          </span>
                        ))}
                        {quiz.questions.length > 3 && (
                          <span className="text-muted small">
                            +{quiz.questions.length - 3} more...
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {editId ? 'Edit Quiz' : 'Create New Quiz'}
                </h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body pt-3">
                {formError && (
                  <div className="alert alert-danger py-2">
                    <i className="bi bi-exclamation-triangle me-2"></i>{formError}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label fw-semibold">Quiz Title <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. JavaScript Fundamentals"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Brief description of this quiz..."
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Select Questions
                    <span className="badge bg-primary ms-2 rounded-pill">{form.questions.length} selected</span>
                  </label>

                  {questions.length === 0 ? (
                    <div className="alert alert-warning py-2">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      No questions available. Create questions first.
                    </div>
                  ) : (
                    <div
                      className="border rounded-3 p-2"
                      style={{ maxHeight: 300, overflowY: 'auto' }}
                    >
                      {questions.map((q, idx) => {
                        const selected = form.questions.includes(q._id);
                        return (
                          <div
                            key={q._id}
                            className={`rounded-3 p-3 mb-2 cursor-pointer d-flex align-items-start gap-3 ${
                              selected ? 'bg-primary bg-opacity-10 border border-primary' : 'bg-light'
                            }`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => toggleQuestion(q._id)}
                          >
                            <input
                              type="checkbox"
                              className="form-check-input flex-shrink-0 mt-1"
                              checked={selected}
                              onChange={() => toggleQuestion(q._id)}
                            />
                            <div className="flex-grow-1">
                              <p className="mb-1 fw-semibold small">
                                <span className="badge bg-secondary me-2 rounded-pill">{idx + 1}</span>
                                {q.text}
                              </p>
                              <div className="d-flex gap-1 flex-wrap">
                                {q.options.map((opt, oIdx) => (
                                  <span
                                    key={oIdx}
                                    className={`badge rounded-pill ${
                                      oIdx === q.correctAnswerIndex
                                        ? 'bg-success'
                                        : 'bg-light text-dark border'
                                    }`}
                                  >
                                    {String.fromCharCode(65 + oIdx)}. {opt}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-light rounded-3" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary rounded-3" onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
                  ) : (
                    <><i className="bi bi-check2 me-2"></i>{editId ? 'Save Changes' : 'Create Quiz'}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <SuccessModal
        show={!!successMessage}
        message={successMessage}
        onClose={() => setSuccessMessage(null)}
      />

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-body p-4 text-center">
                <i className="bi bi-trash3-fill text-danger mb-3" style={{ fontSize: '3rem' }}></i>
                <h5 className="fw-bold">Delete Quiz?</h5>
                <p className="text-muted">This will delete the quiz but not the questions.</p>
                <div className="d-flex gap-2 justify-content-center mt-3">
                  <button className="btn btn-light rounded-3 px-4" onClick={() => setDeleteConfirm(null)}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger rounded-3 px-4"
                    onClick={() => handleDelete(deleteConfirm)}
                  >
                    <i className="bi bi-trash me-2"></i>Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
