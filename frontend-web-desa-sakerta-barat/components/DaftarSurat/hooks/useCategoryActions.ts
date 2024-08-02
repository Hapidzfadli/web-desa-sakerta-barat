import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createLetterCategory,
  updateLetterCategory,
  deleteLetterCategory,
} from '../../../lib/actions/list-letter.action';
import { useToast } from '../../ui/use-toast';
import { CategoryFormData, LetterCategory } from '../types/category.types';

export const useCategoryActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: createLetterCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letterCategories'] });
      toast({
        title: 'Success',
        description: 'Kategori surat berhasil ditambahkan',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create category',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateLetterCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letterCategories'] });
      toast({
        title: 'Success',
        description: 'Kategori surat berhasil diperbaharui',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update category',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLetterCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letterCategories'] });
      toast({
        title: 'Success',
        description: 'Kategori surat berhasil dihapus',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive',
      });
    },
  });

  const handleSave = async (
    data: CategoryFormData,
    currentCategory: LetterCategory | null,
  ) => {
    if (currentCategory) {
      updateMutation.mutate({ ...data, id: currentCategory.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = async (id: number) => {
    deleteMutation.mutate(id);
  };

  return { handleSave, handleDelete };
};
