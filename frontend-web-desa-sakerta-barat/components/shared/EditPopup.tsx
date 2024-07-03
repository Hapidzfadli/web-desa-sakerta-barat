import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface Field {
  label: string;
  name: string;
  value: string;
  type?: 'text' | 'textarea';
}

interface EditPopupProps {
  title: string;
  fields: Field[];
  onSave: (data: Record<string, string>) => void;
}

const EditPopup: React.FC<EditPopupProps> = ({ title, fields, onSave }) => {
  const [formData, setFormData] = React.useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="custom-dialog-content" style={{ width: 'auto', maxWidth: '100vw', minWidth: '65vw' }}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 py-4">
            {fields.map((field) => (
              <div key={field.name} className="flex flex-col items-start gap-4">
                <Label htmlFor={field.name} className="glassy-label  text-left">
                  {field.label}
                </Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    id={field.name}
                    name={field.name}
                    defaultValue={field.value}
                    onChange={handleInputChange}
                    className="flex-grow glassy-input"
                    rows={3}
                  />
                ) : (
                  <Input
                    id={field.name}
                    name={field.name}
                    defaultValue={field.value}
                    onChange={handleInputChange}
                    className="flex-grow glassy-input"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPopup;