import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface PreviewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  isLoading: boolean;
  progress: number;
}

const PreviewPopup: React.FC<PreviewPopupProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  isLoading,
  progress,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] bg-white">
        <DialogHeader>
          <DialogTitle>Preview Surat</DialogTitle>
        </DialogHeader>
        <div className="w-full h-[80vh] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Progress value={progress} className="w-[60%] mb-4" />
              <p>Memuat PDF... {progress.toFixed(0)}%</p>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              PDF tidak tersedia
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewPopup;
