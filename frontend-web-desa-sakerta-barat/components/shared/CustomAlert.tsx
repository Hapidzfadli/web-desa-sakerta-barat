import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomAlertProps {
  title: string;
  description: string;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  title,
  description,
  onClose,
}) => {
  return (
    <Alert variant="default" className="bg-blue-50 border-blue-200">
      <AlertCircle className="h-4 w-4 text-blue-500" />
      <AlertTitle className="text-blue-700">{title}</AlertTitle>
      <AlertDescription className="text-blue-600">
        <p className="mb-2">{description}</p>
        <Button onClick={onClose} variant="outline" className="mt-2">
          Tutup
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default CustomAlert;
