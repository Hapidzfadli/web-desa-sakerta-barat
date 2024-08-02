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
        duration: 5000,
      });
    },
    onError: () => {
      toast({
        title: 'Gagal',
        description: 'Tipe surat gagal disimpan',
        variant: 'destructive',
        duration: 5000,
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
        duration: 5000,
      });
    },
    onError: () => {
      toast({
        title: 'Gagal',
        description: 'Tipe surat gagal disimpan',
        variant: 'destructive',
        duration: 5000,
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
        duration: 5000,
      });
    },
    onError: () => {
      toast({
        title: 'Gagal',
        description: 'Tipe surat gagal dihapus',
        variant: 'destructive',
        duration: 5000,
      });
    },
  });

  const applyMutation = useMutation({
    mutationFn: applyLetter,
    onSuccess: () => {
      toast({
        title: 'Berhasil',
        description: 'Pengajuan surat berhasil dikirim',
        duration: 5000,
      });
    },
    onError: () => {
      toast({
        title: 'Gagal',
        description: 'Pengajuan surat gagal. Silakan coba lagi.',
        variant: 'destructive',
        duration: 5000,
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
    applyMutation.mutate({ letterTypeId, notes, attachments });
  };

  return { handleAddEdit, handleDelete, handleApplyLetter };
};
