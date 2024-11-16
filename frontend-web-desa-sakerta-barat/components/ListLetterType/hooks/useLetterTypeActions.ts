import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createLetterType,
  updateLetterType,
  deleteLetterType,
} from '../../../lib/actions/list-letter.action';
import { applyLetter } from '../../../lib/actions/letterRequest.action';
import { useToast } from '../../ui/use-toast';
import { SecondaryPartyData } from '../types/letterType.types';

export const useLetterTypeActions = (categoryId: number) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Create Letter Type Mutation
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

  // Update Letter Type Mutation
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

  // Delete Letter Type Mutation
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

  // Apply Letter Mutation
  const applyMutation = useMutation({
    mutationFn: async ({
      letterTypeId,
      notes,
      attachments,
      additionalResidents,
    }: {
      letterTypeId: number;
      notes: string;
      attachments: File[];
      additionalResidents?: SecondaryPartyData;
    }) => {
      const formData = new FormData();
      formData.append('letterTypeId', letterTypeId.toString());
      formData.append('notes', notes);

      attachments.forEach((file) => {
        formData.append('attachments', file);
      });

      if (additionalResidents) {
        const additionalResidentsString = JSON.stringify({
          ...additionalResidents,
          tanggal_lahir2: additionalResidents.tanggal_lahir2
            ? new Date(additionalResidents.tanggal_lahir2)
                .toISOString()
                .split('T')[0]
            : undefined,
        });
        formData.append('additionalResidents', additionalResidentsString);
      }

      return applyLetter(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letterRequests'] });
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

  // Handler for adding/editing letter types
  const handleAddEdit = async (data: any) => {
    data.categoryId = Number(categoryId);
    if (data.id) {
      updateMutation.mutate({ id: data.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Handler for deleting letter types
  const handleDelete = async (id: number) => {
    deleteMutation.mutate(id);
  };

  // Handler for applying for letters
  const handleApplyLetter = async (
    letterTypeId: number,
    notes: string,
    attachments: File[],
    additionalResidents?: SecondaryPartyData,
  ) => {
    if (typeof letterTypeId !== 'number' || isNaN(letterTypeId)) {
      console.error('Invalid letterTypeId:', letterTypeId);
      throw new Error('Invalid letterTypeId');
    }

    try {
      await applyMutation.mutateAsync({
        letterTypeId,
        notes,
        attachments,
        additionalResidents,
      });
    } catch (error) {
      console.error('Error in handleApplyLetter:', error);
      throw error;
    }
  };

  // Return all handlers and mutation states
  return {
    handleAddEdit,
    handleDelete,
    handleApplyLetter,
  };
};

export default useLetterTypeActions;
