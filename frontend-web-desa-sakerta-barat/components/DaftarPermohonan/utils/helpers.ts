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

export const buildQueryString = (
  filters: Record<string, any>,
  prefix = 'filter',
): string => {
  return Object.entries(filters).reduce((acc, [key, value]) => {
    const fullKey = prefix ? `${prefix}[${key}]` : key;

    if (value === null) {
      return `${acc}&${fullKey}=`;
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      return `${acc}${buildQueryString(value, fullKey)}`;
    }

    if (Array.isArray(value)) {
      return `${acc}${value.map((item) => `&${fullKey}[]=${encodeURIComponent(item)}`).join('')}`;
    }

    return `${acc}&${fullKey}=${encodeURIComponent(value)}`;
  }, '');
};
