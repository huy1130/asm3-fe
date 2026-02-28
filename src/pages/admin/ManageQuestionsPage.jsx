import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../../features/questions/questionSlice';
import SuccessModal from '../../components/SuccessModal';

const emptyForm = {
  text: '',
  options: ['', '', '', ''],
  correctAnswerIndex: 0,
  keywords: '',
};

export default function ManageQuestionsPage() {
  const dispatch = useDispatch();
  const { list: questions, loading, error } = useSelector((state) => state.questions);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (q) => {
    setEditId(q._id);
    setForm({
      text: q.text,
      options: [...q.options],
      correctAnswerIndex: q.correctAnswerIndex,
      keywords: q.keywords?.join(', ') || '',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleOptionChange = (idx, value) => {
    const opts = [...form.options];
    opts[idx] = value;
    setForm({ ...form, options: opts });
  };

  const addOption = () => {
    if (form.options.length < 6) {
      setForm({ ...form, options: [...form.options, ''] });
    }
  };

  const removeOption = (idx) => {
    if (form.options.length <= 2) return;
    const opts = form.options.filter((_, i) => i !== idx);
    setForm({
      ...form,
      options: opts,
      correctAnswerIndex: Math.min(form.correctAnswerIndex, opts.length - 1),
    });
  };

  const validate = () => {
    if (!form.text.trim()) return 'Question text is required';
    const filled = form.options.filter((o) => o.trim());
    if (filled.length < 2) return 'At least 2 options are required';
    if (!form.options[form.correctAnswerIndex]?.trim()) return 'Correct answer option must not be empty';
    return '';
  };

  const handleSave = async () => {
    const err = validate();
    if (err) { setFormError(err); return; }

    setSaving(true);
    const data = {
      text: form.text.trim(),
      options: form.options.filter((o) => o.trim()),
      correctAnswerIndex: Number(form.correctAnswerIndex),
      keywords: form.keywords
        ? form.keywords.split(',').map((k) => k.trim()).filter(Boolean)
        : [],
    };

    const action = editId
      ? await dispatch(updateQuestion({ id: editId, data }))
      : await dispatch(createQuestion(data));

    setSaving(false);
    if (!action.error) {
      setShowModal(false);
      setSuccessMessage(editId ? 'Question updated successfully.' : 'Question created successfully.');
    } else {
      setFormError(action.payload || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    const action = await dispatch(deleteQuestion(id));
    setDeleteConfirm(null);
    if (!action.error) {
      setSuccessMessage('Question deleted successfully.');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Manage Questions</h2>
          <p className="text-muted mb-0">{questions.length} question(s) in the bank</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={openCreate}>
          <i className="bi bi-plus-circle me-2"></i>Add Question
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-inbox text-muted" style={{ fontSize: '4rem' }}></i>
          <p className="text-muted mt-3">No questions yet. Create your first one!</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {questions.map((q, idx) => (
            <div key={q._id} className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="badge bg-primary rounded-pill">{idx + 1}</span>
                      <p className="mb-0 fw-semibold">{q.text}</p>
                    </div>
                    <div className="row g-2 mb-2">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="col-md-6">
                          <span
                            className={`badge rounded-3 px-3 py-2 w-100 text-start ${
                              oIdx === q.correctAnswerIndex
                                ? 'bg-success'
                                : 'bg-light text-dark border'
                            }`}
                          >
                            <span className="fw-bold me-2">{String.fromCharCode(65 + oIdx)}.</span>
                            {opt}
                            {oIdx === q.correctAnswerIndex && (
                              <i className="bi bi-check-circle-fill ms-2"></i>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                    {q.keywords?.length > 0 && (
                      <div>
                        {q.keywords.map((kw) => (
                          <span key={kw} className="badge bg-light text-secondary border me-1 rounded-pill">{kw}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="d-flex gap-2 flex-shrink-0">
                    <button
                      className="btn btn-outline-primary btn-sm rounded-3"
                      onClick={() => openEdit(q)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm rounded-3"
                      onClick={() => setDeleteConfirm(q._id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
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
                  {editId ? 'Edit Question' : 'Add New Question'}
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
                  <label className="form-label fw-semibold">Question Text <span className="text-danger">*</span></label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={form.text}
                    onChange={(e) => setForm({ ...form, text: e.target.value })}
                    placeholder="Enter the question..."
                  />
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label fw-semibold mb-0">
                      Answer Options <span className="text-danger">*</span>
                    </label>
                    {form.options.length < 6 && (
                      <button className="btn btn-outline-primary btn-sm" onClick={addOption}>
                        <i className="bi bi-plus me-1"></i>Add Option
                      </button>
                    )}
                  </div>
                  <div className="d-flex flex-column gap-2">
                    {form.options.map((opt, idx) => (
                      <div key={idx} className="input-group">
                        <div className="input-group-text">
                          <input
                            type="radio"
                            name="correctAnswer"
                            className="form-check-input mt-0"
                            checked={form.correctAnswerIndex === idx}
                            onChange={() => setForm({ ...form, correctAnswerIndex: idx })}
                            title="Mark as correct answer"
                          />
                        </div>
                        <span className="input-group-text fw-bold" style={{ minWidth: 40 }}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <input
                          type="text"
                          className={`form-control ${form.correctAnswerIndex === idx ? 'border-success' : ''}`}
                          value={opt}
                          onChange={(e) => handleOptionChange(idx, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                        />
                        {form.options.length > 2 && (
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => removeOption(idx)}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <small className="text-muted mt-1 d-block">
                    <i className="bi bi-info-circle me-1"></i>
                    Select the radio button to mark the correct answer
                  </small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Keywords</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.keywords}
                    onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                    placeholder="e.g. javascript, nodejs, backend (comma separated)"
                  />
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
                    <><i className="bi bi-check2 me-2"></i>{editId ? 'Save Changes' : 'Create Question'}</>
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

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-body p-4 text-center">
                <i className="bi bi-trash3-fill text-danger mb-3" style={{ fontSize: '3rem' }}></i>
                <h5 className="fw-bold">Delete Question?</h5>
                <p className="text-muted">This action cannot be undone.</p>
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
