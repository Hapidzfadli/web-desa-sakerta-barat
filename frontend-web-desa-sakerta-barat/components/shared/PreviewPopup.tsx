import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface PreviewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  isLoading: boolean;
  progress: number;
  onPrint: () => void;
  onSign: () => void;
  onReject: () => void;
  showSignButton: boolean;
}

const PreviewPopup: React.FC<PreviewPopupProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  isLoading,
  progress,
  onPrint,
  onSign,
  onReject,
  showSignButton,
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
            <>
              <div className="flex-col flex h-full">
                <iframe
                  src={pdfUrl}
                  width="100%"
                  height="100%"
                  className="min-h-32 rounded-lg shadow-card"
                  style={{ border: 'none' }}
                />
                <div className="mt-4 flex justify-end space-x-2">
                  {showSignButton && (
                    <>
                      <Button
                        onClick={onSign}
                        className="bg-green-500 text-white"
                      >
                        Tanda Tangani Surat
                      </Button>
                      <Button
                        onClick={onReject}
                        className="bg-red-500 text-white"
                      >
                        Tolak Surat
                      </Button>
                    </>
                  )}
                  <Button onClick={onPrint} className="bg-blue-500 text-white">
                    Cetak Surat
                  </Button>
                </div>
              </div>
            </>
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
