import React, { useState, useEffect } from 'react';
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
  grid?: string;
  name: string;
  value: string;
  type?: 'text' | 'textarea' | 'date' | 'file' | 'select' | 'custom';
  required?: boolean;
  options?: { value: string; label: string }[];
  multiple?: boolean;
  accept?: string;
  render?: () => React.ReactNode;
  onChange?: (value: string) => void;
}

interface EditPopupProps {
  title: string;
  grid?: string;
  labelSubmit?: string;
  fields: Field[];
  onSave?: (
    data: Record<string, string | File>,
    errors?: Record<string, string>,
  ) => void | Promise<void>;
  validationSchema?: z.ZodSchema<any>;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: () => void;
  onChange?: () => void;
  viewMode?: boolean;
  onFileChange?: (files: FileList | null) => void;
  additionalContent?: React.ReactNode;
  customButtons?: React.ReactNode;
}

const EditPopup: React.FC<EditPopupProps> = ({
  title,
  grid,
  fields,
  onSave,
  validationSchema,
  isOpen,
  onClose,
  onDelete,
  viewMode = false,
  onFileChange,
  additionalContent,
  labelSubmit,
  customButtons,
  onChange,
}) => {
  const [formData, setFormData] = useState<Record<string, string | File>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
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
    if (viewMode) return;
    const { name, value, type } = e.target;
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      const files = fileInput.files;
      if (files && files.length > 0) {
        if (onFileChange) {
          onFileChange(files);
        } else {
          setFormData({ ...formData, [name]: files[0] });
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }

    const field = fields.find((f) => f.name === name);
    if (field && field.onChange) {
      field.onChange(value);
    }
  };

  const handleSelectChange = (value: string, name: string) => {
    if (viewMode) return;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    const field = fields.find((f) => f.name === name);
    if (field && field.onChange) {
      field.onChange(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (viewMode || !onSave) return;
    try {
      if (validationSchema) {
        validationSchema.parse(formData);
      }
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

  const renderField = (field: Field) => {
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            id={field.name}
            name={field.name}
            value={(formData[field.name] as string) || ''}
            onChange={handleInputChange}
            className="flex-grow input-form"
            rows={3}
            required={field.required}
            disabled={viewMode}
          />
        );
      case 'select':
        return (
          <Select
            onValueChange={(value) => handleSelectChange(value, field.name)}
            value={formData[field.name] as string}
            disabled={viewMode}
          >
            <SelectTrigger className="w-full input-form">
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
        );
      case 'file':
        return (
          <Input
            id={field.name}
            name={field.name}
            type="file"
            onChange={handleInputChange}
            className="flex-grow input-form"
            required={field.required}
            disabled={viewMode}
            multiple={field.multiple}
            accept={field.accept}
          />
        );
      case 'custom':
        return field.render ? field.render() : null;
      default:
        return (
          <Input
            id={field.name}
            name={field.name}
            type={field.type || 'text'}
            value={(formData[field.name] as string) || ''}
            onChange={handleInputChange}
            className="flex-grow input-form"
            required={field.required}
            disabled={viewMode}
          />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white sm:max-w-[425px] md:max-w-[700px] lg:max-w-[800px] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="head-form text-lg sm:text-xl md:text-2xl">
            {title}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className={`grid grid-cols-1 ${grid ? '' : 'sm:grid-cols-2'} gap-4`}
          >
            {fields.map((field) => (
              <div key={field.name} className="flex flex-col items-start gap-2">
                <Label
                  htmlFor={field.name}
                  className="glassy-label text-left text-sm sm:text-base"
                >
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </Label>
                {renderField(field)}
                {errors[field.name] && (
                  <p className="text-red-500 text-xs sm:text-sm">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}
          </div>
          {additionalContent}
          <div className="flex flex-col sm:flex-row justify-end mt-4 space-y-2 sm:space-y-0 sm:space-x-2">
            {!viewMode && onSave && (
              <Button className="bg-save w-full sm:w-auto" type="submit">
                {labelSubmit ?? 'Simpan'}
              </Button>
            )}
            {onDelete && (
              <Button
                className="bg-red-500 text-white w-full sm:w-auto"
                onClick={onDelete}
                type="button"
              >
                Delete
              </Button>
            )}
            {customButtons}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPopup;
