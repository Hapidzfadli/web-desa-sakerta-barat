import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CustomAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

const CustomAlertDialog: React.FC<CustomAlertDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-white"
        style={{ width: 'auto', maxWidth: '100vw', minWidth: '40vw' }}
      >
        <DialogHeader>
          <DialogTitle className="head-form">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button className="bg-save" onClick={onClose}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomAlertDialog;
