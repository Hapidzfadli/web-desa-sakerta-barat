import React from 'react';
import { Button } from '../../../components/ui/button';
import EditPopup from '../../../components/shared/EditPopup';

interface RejectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  rejectionReason: string;
  onReasonChange: (value: string) => void;
  onConfirm: () => void;
}

const RejectionPopup: React.FC<RejectionPopupProps> = ({
  isOpen,
  onClose,
  rejectionReason,
  onReasonChange,
  onConfirm,
}) => {
  return (
    <EditPopup
      title="Alasan Penolakan"
      fields={[
        {
          label: 'Alasan Penolakan',
          name: 'rejectionReason',
          value: rejectionReason,
          type: 'textarea',
          onChange: onReasonChange,
        },
      ]}
      grid={'1'}
      isOpen={isOpen}
      onClose={onClose}
      viewMode={false}
      customButtons={
        <>
          <Button onClick={onClose} className="bg-gray-500 text-white">
            Batal
          </Button>
          <Button onClick={onConfirm} className="bg-red-500 text-white">
            Konfirmasi Penolakan
          </Button>
        </>
      }
    />
  );
};

export default RejectionPopup;
