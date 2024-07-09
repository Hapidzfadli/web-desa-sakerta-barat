import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from 'next/image';
import { API_URL } from '../../constants';



const LetterTypeForm: React.FC<LetterTypeFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData || {});
  const [iconPreview, setIconPreview] = useState(initialData?.icon ? API_URL + initialData?.icon :  initialData?.icon || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, [e.target.name]: file });
      if (e.target.name === 'icon') {
        const reader = new FileReader();
        reader.onload = (e) => setIconPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='custom-dialog-content '>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit' : 'Add'} Letter Type</DialogTitle>
        </DialogHeader> 
        
        <form onSubmit={handleSubmit} className='max-h-[80vh] overflow-y-auto'>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-left">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-left">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-left">
                Icon
              </Label>
              <Input
                id="icon"
                name="icon"
                type="file"
                onChange={handleFileChange}
                className="col-span-3 cursor-pointer"
              />
            </div>
            {iconPreview && (
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-start-2 col-span-3">
                  <Image src={iconPreview} alt="Icon preview" width={100} height={100} />
                </div>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="template" className="text-left">
                Template
              </Label>
              <Input
                id="template"
                name="template"
                type="file"
                onChange={handleFileChange}
                className="col-span-3 cursor-pointer"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LetterTypeForm;