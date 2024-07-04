import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { toInputDateValue } from '../../lib/utils';
import { z } from 'zod';

interface Field {
  label: string;
  name: string;
  value: string;
  type?: 'text' | 'textarea' | 'date';
  required?: boolean;
}

interface EditPopupProps {
  title: string;
  fields: Field[];
  onSave: (data: Record<string, string>, errors?: Record<string, string>) => void;
  validationSchema: z.ZodSchema<any>;
}

const EditPopup: React.FC<EditPopupProps> = ({ title, fields, onSave, validationSchema }) => {
  const [formData, setFormData] = React.useState<Record<string, string>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      validationSchema.parse(formData);
      onSave(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {} as Record<string, string>);
        setErrors(errorMessages);
        onSave(formData, errorMessages); // Pass errors back to parent component
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="custom-dialog-content max-h-[80vh] overflow-y-auto" style={{ width: 'auto', maxWidth: '100vw', minWidth: '65vw' }}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 py-4">
            {fields.map((field) => (
              <div key={field.name} className="flex flex-col items-start gap-2">
                <Label htmlFor={field.name} className="glassy-label text-left">
                  {field.label}{field.required && <span className="text-red-500">*</span>}
                </Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    id={field.name}
                    name={field.name}
                    defaultValue={field.value}
                    onChange={handleInputChange}
                    className="flex-grow glassy-input"
                    rows={3}
                    required={field.required}
                  />
                ) : (
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type || 'text'}
                    defaultValue={field.value}
                    onChange={handleInputChange}
                    className="flex-grow glassy-input"
                    required={field.required}
                  />
                )}
                {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name]}</p>}
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPopup;