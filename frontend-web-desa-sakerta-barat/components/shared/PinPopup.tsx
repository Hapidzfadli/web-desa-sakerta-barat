import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PinPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pin: string;
  setPin: (pin: string) => void;
  action: 'sign' | 'reject';
}

const PinPopup: React.FC<PinPopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
  pin,
  setPin,
  action,
}) => {
  const actionText = action === 'sign' ? 'Tanda Tangani' : 'Tolak';
  const actionColor = action === 'sign' ? 'bg-blue-500' : 'bg-red-500';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="head-form">
            Masukkan PIN untuk {actionText} Surat
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            type="password"
            placeholder="Masukkan PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} variant="outline">
            Batal
          </Button>
          <Button onClick={onConfirm} className={`${actionColor} text-white`}>
            {actionText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PinPopup;
