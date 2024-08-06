export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const translateStatus = (status: string): string => {
  const statusTranslations: { [key: string]: string } = {
    SUBMITTED: 'Diajukan',
    APPROVED: 'Disetujui',
    REJECTED: 'Ditolak',
    SIGNED: 'Ditandatangani',
    COMPLETED: 'Selesai',
    ARCHIVED: 'Diarsipkan',
  };
  return statusTranslations[status] || status;
};
