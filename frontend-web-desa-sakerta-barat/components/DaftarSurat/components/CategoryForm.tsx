import React from 'react';
import EditPopup from '../../shared/EditPopup';
import {
  createLetterCategorySchema,
  updateLetterCategorySchema,
} from '../../../lib/settingUtils';
import { LetterCategory, CategoryFormData } from '../types/category.types';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category: LetterCategory | null;
  onSave: (
    data: CategoryFormData,
    currentCategory: LetterCategory | null,
  ) => void;
  onDelete: (id: number) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  isOpen,
  onClose,
  category,
  onSave,
  onDelete,
}) => {
  const fields = [
    {
      label: 'Name',
      name: 'name',
      value: category?.name || '',
      required: true,
    },
    {
      label: 'Description',
      name: 'description',
      value: category?.description || '',
      type: 'textarea',
    },
  ];
  return (
    <EditPopup
      title={category ? 'Edit Kategori Surat' : 'Tambah Kategori Surat'}
      fields={fields}
      grid="1"
      onSave={(data) => onSave(data as CategoryFormData, category)}
      onDelete={category ? () => onDelete(category.id) : undefined}
      validationSchema={
        category ? updateLetterCategorySchema : createLetterCategorySchema
      }
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};

export default CategoryForm;
