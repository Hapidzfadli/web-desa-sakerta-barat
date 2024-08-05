import React, { useState, ChangeEvent, ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Input } from '../ui/input';
import Image from 'next/image';

interface EditImageDialogProps {
  currentAvatar: string;
  username: string;
  label: string;
  onSave: (file: File) => Promise<void>;
  children?: ReactNode;
}

const EditImageDialog: React.FC<EditImageDialogProps> = ({
  currentAvatar,
  username,
  onSave,
  label,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = async () => {
    if (file) {
      await onSave(file);
      setOpen(false);
      setPreviewUrl(null);
      setFile(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Avatar className="h-16 w-16 cursor-pointer">
            <AvatarImage src={currentAvatar} alt={username} />
            <AvatarFallback>{username[0]}</AvatarFallback>
          </Avatar>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Edit {label}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center">
            {label === 'Tanda Tangan Digital' ? (
              <div className="relative w-64 h-32">
                <img
                  src={previewUrl || currentAvatar}
                  alt={label}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
            ) : (
              <Avatar className="h-32 w-32">
                <AvatarImage src={previewUrl || currentAvatar} alt={username} />
                <AvatarFallback>{username[0]}</AvatarFallback>
              </Avatar>
            )}
          </div>
          <Input
            className="cursor-pointer input-form"
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Button className="bg-save" onClick={handleSave} disabled={!file}>
            Simpan {label}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditImageDialog;
