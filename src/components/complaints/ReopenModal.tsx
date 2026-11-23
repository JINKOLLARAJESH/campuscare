import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';
import { RotateCcw, AlertTriangle } from 'lucide-react';

export interface ReopenModalProps {
  isOpen: boolean;
  onClose: () => void;
  referenceId: string;
  onConfirmReopen: (reason: string) => void;
}

export const ReopenModal: React.FC<ReopenModalProps> = ({
  isOpen,
  onClose,
  referenceId,
  onConfirmReopen,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleReopen = () => {
    if (!reason.trim() || reason.trim().length < 15) {
      setError('Please provide a specific explanation of at least 15 characters why the resolution was incomplete.');
      return;
    }
    setError('');
    onConfirmReopen(reason.trim());
    setReason('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reopen Grievance"
      description={`Case Reference: ${referenceId}`}
      size="md"
    >
      <div className="space-y-4">
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            Reopening this grievance will set the status back to <strong>Reopened</strong>, notify the department head, and trigger Level 2 monitoring.
          </div>
        </div>

        <Textarea
          label="Reason for Reopening"
          placeholder="Explain what aspects remain unresolved or why the previous action was unsatisfactory..."
          rows={4}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (error) setError('');
          }}
          error={error}
          helperText="Include any additional dates, locations, or lingering issues."
        />

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleReopen}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Reopen Grievance
          </Button>
        </div>
      </div>
    </Modal>
  );
};
