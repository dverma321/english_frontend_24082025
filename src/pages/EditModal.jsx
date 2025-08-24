import React from 'react';
import './EditModal.css';

const EditModal = ({ isOpen, onClose, onSubmit, sentence, reset }) => {
  const [newValue, setNewValue] = React.useState(sentence?.hindi || '');

  React.useEffect(() => {
    setNewValue(sentence?.hindi || '');
  }, [sentence, reset]); // Add reset to dependencies


  const handleSubmit = () => {
    onSubmit(newValue);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h4>Edit Hindi Translation</h4>
        <p><strong>Original:</strong> {sentence.original}</p>
        <textarea value={newValue} onChange={(e) => setNewValue(e.target.value)} />
        <div className="modal-actions">
          <button onClick={handleSubmit}>Update</button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
