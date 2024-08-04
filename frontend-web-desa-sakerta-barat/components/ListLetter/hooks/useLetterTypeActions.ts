import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createLetterType,
  updateLetterType,
  deleteLetterType,
} from '../../../lib/actions/list-letter.action';
import { applyLetter } from '../../../lib/actions/letterRequest.action';
import { useToast } from '../../ui/use-toast';

export const useLetterTypeActions = (categoryId: number) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: createLetterType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letterTypes', categoryId] });
      toast({
        title: 'Berhasil',
        description: 'Tipe surat berhasil ditambahkan',
        duration: 1000,
      });
    },
    onError: () => {
      toast({
        title: 'Gagal',
        description: 'Tipe surat gagal disimpan',
        variant: 'destructive',
        duration: 1000,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; [key: string]: any }) =>
      updateLetterType(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letterTypes', categoryId] });
      toast({
        title: 'Berhasil',
        description: 'Tipe surat berhasil diperbaharui',
        duration: 1000,
      });
    },
    onError: () => {
      toast({
        title: 'Gagal',
        description: 'Tipe surat gagal disimpan',
        variant: 'destructive',
        duration: 1000,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLetterType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letterTypes', categoryId] });
      toast({
        title: 'Berhasil',
        description: 'Tipe surat berhasil dihapus',
        duration: 1000,
      });
    },
    onError: () => {
      toast({
        title: 'Gagal',
        description: 'Tipe surat gagal dihapus',
        variant: 'destructive',
        duration: 1000,
      });
    },
  });

  const applyMutation = useMutation({
    mutationFn: (data: {
      letterTypeId: number;
      notes: string;
      attachments: File[];
    }) => {
      if (typeof data.letterTypeId !== 'number' || isNaN(data.letterTypeId)) {
        throw new Error('Invalid letterTypeId');
      }
      return applyLetter(data.letterTypeId, data.notes, data.attachments);
    },
    onSuccess: () => {
      toast({
        title: 'Berhasil',
        description: 'Pengajuan surat berhasil dikirim',
        duration: 1000,
      });
    },
    onError: (error) => {
      console.error('Error in applyMutation:', error);
      toast({
        title: 'Gagal',
        description: 'Pengajuan surat gagal. Silakan coba lagi.',
        variant: 'destructive',
        duration: 1000,
      });
    },
  });
  const handleAddEdit = async (data: any) => {
    data.categoryId = Number(categoryId);
    if (data.id) {
      updateMutation.mutate({ id: data.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = async (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleApplyLetter = async (
    letterTypeId: number,
    notes: string,
    attachments: File[],
  ) => {
    console.log('Applying letter with:', { letterTypeId, notes, attachments });
    if (typeof letterTypeId !== 'number' || isNaN(letterTypeId)) {
      console.error('Invalid letterTypeId:', letterTypeId);
      throw new Error('Invalid letterTypeId');
    }
    try {
      await applyMutation.mutateAsync({ letterTypeId, notes, attachments });
    } catch (error) {
      console.error('Error in handleApplyLetter:', error);
      throw error;
    }
  };

  return { handleAddEdit, handleDelete, handleApplyLetter };
};
