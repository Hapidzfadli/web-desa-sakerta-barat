import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Image from 'next/image';
import EditImageDialog from '../shared/EditImageDialog';

interface SignatureCardProps {
  signatureUrl: string | null;
  onUploadSignature: (file: File) => Promise<void>;
}

const SignatureCard: React.FC<SignatureCardProps> = ({
  signatureUrl,
  onUploadSignature,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="head-form">Tanda Tangan Digital</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <EditImageDialog
          currentAvatar={signatureUrl || '/placeholder-signature.png'}
          username="Signature"
          label="Tanda Tangan Digital"
          onSave={onUploadSignature}
        >
          <div className="relative w-64 h-32 cursor-pointer">
            {signatureUrl ? (
              <Image
                src={signatureUrl}
                alt="Tanda Tangan Digital"
                layout="fill"
                objectFit="contain"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">
                  Klik untuk menambahkan tanda tangan
                </p>
              </div>
            )}
          </div>
        </EditImageDialog>
      </CardContent>
    </Card>
  );
};

export default SignatureCard;
