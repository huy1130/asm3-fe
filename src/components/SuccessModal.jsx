export default function SuccessModal({ show, message, onClose }) {
  if (!show) return null;
  return (
    <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow">
          <div className="modal-body p-4 text-center">
            <div
              className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: 64, height: 64 }}
            >
              <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '2.5rem' }}></i>
            </div>
            <h5 className="fw-bold mb-2">Success</h5>
            <p className="text-muted mb-4">{message}</p>
            <button className="btn btn-primary rounded-3 px-4" onClick={onClose}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
