import React, { useState, ChangeEvent } from 'react';
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

interface EditAvatarDialogProps {
  currentAvatar: string;
  username: string;
  label: string;
  onSave: (file: File) => Promise<void>;
}

const EditAvatarDialog: React.FC<EditAvatarDialogProps> = ({
  currentAvatar,
  username,
  onSave,
  label,
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
        <Avatar className="h-16 w-16 cursor-pointer">
          <AvatarImage src={currentAvatar} alt={username} />
          <AvatarFallback>{username[0]}</AvatarFallback>
        </Avatar>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Edit {label}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={previewUrl || currentAvatar} alt={username} />
              <AvatarFallback>{username[0]}</AvatarFallback>
            </Avatar>
          </div>
          <Input
            className="cursor-pointer input-form"
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Button className="bg-save" onClick={handleSave} disabled={!file}>
            Save Avatar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditAvatarDialog;
