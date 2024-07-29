import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { z } from 'zod';

interface Field {
  label: string;
  name: string;
  value: string;
  type?: 'text' | 'textarea' | 'date' | 'file' | 'select';
  required?: boolean;
  options?: { value: string; label: string }[];
}

interface EditPopupProps {
  title: string;
  fields: Field[];
  onSave: (
    data: Record<string, string | File>,
    errors?: Record<string, string>,
  ) => void;
  validationSchema: z.ZodSchema<any>;
  isOpen: boolean;
  onClose: () => void;
}

const EditPopup: React.FC<EditPopupProps> = ({
  title,
  fields,
  onSave,
  validationSchema,
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<Record<string, string | File>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (isOpen) {
      setFormData(
        fields.reduce(
          (acc, field) => ({ ...acc, [field.name]: field.value }),
          {},
        ),
      );
      setErrors({});
    }
  }, [isOpen, fields]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0];
      if (file) {
        setFormData({ ...formData, [name]: file });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      validationSchema.parse(formData);
      onSave(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.reduce(
          (acc, curr) => {
            acc[curr.path[0]] = curr.message;
            return acc;
          },
          {} as Record<string, string>,
        );
        setErrors(errorMessages);
        onSave(formData, errorMessages);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-white"
        style={{ width: 'auto', maxWidth: '100vw', minWidth: '65vw' }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 py-4">
            {fields.map((field) => (
              <div key={field.name} className="flex flex-col items-start gap-2">
                <Label htmlFor={field.name} className="glassy-label text-left">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={(formData[field.name] as string) || ''}
                    onChange={handleInputChange}
                    className="flex-grow input-form"
                    rows={3}
                    required={field.required}
                  />
                ) : field.type === 'select' ? (
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange(value, field.name)
                    }
                    value={formData[field.name] as string}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === 'file' ? (
                  <Input
                    id={field.name}
                    name={field.name}
                    type="file"
                    onChange={handleInputChange}
                    className="flex-grow input-form"
                    required={field.required}
                    accept=".pdf"
                  />
                ) : (
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type || 'text'}
                    value={(formData[field.name] as string) || ''}
                    onChange={handleInputChange}
                    className="flex-grow input-form"
                    required={field.required}
                  />
                )}
                {errors[field.name] && (
                  <p className="text-red-500 text-sm">{errors[field.name]}</p>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button className="bg-save" type="submit">
              Save changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPopup;
