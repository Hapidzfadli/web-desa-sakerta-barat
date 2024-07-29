export enum DocumentType {
  ID_CARD = 'ID_CARD',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
  FAMILY_CARD = 'FAMILY_CARD',
}

const documentTypeIndonesian: Record<DocumentType, string> = {
  [DocumentType.ID_CARD]: 'KTP',
  [DocumentType.DRIVING_LICENSE]: 'SIM',
  [DocumentType.FAMILY_CARD]: 'Kartu Keluarga',
};

export function getDocumentTypeIndonesian(type: DocumentType): string {
  return documentTypeIndonesian[type] || type;
}
