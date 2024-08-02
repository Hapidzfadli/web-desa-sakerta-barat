import React, { useState, useRef, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { PlusCircle, FileIcon } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPenToSquare,
  faTrashCan,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import EditPopup from '../shared/EditPopup';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import { Document } from './types/profile.types';
import { addDocumentSchema } from './utils/profileUtils';
import {
  getDocumentTypeIndonesian,
  DocumentType,
} from '../../lib/documentTypeUtils';
import { useToast } from '../ui/use-toast';
import {
  deleteDocument,
  updateDocument,
  getDocumentFile,
} from '../../lib/actions/setting.actions';

interface DocumentCardProps {
  documents: Document[];
  onAddDocument: (data: Record<string, string | File>) => Promise<void>;
  isPopupOpen: boolean;
  setIsPopupOpen: (isOpen: boolean) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  documents,
  onAddDocument,
  isPopupOpen,
  setIsPopupOpen,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);
  const [editingDocumentId, setEditingDocumentId] = useState<number | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDeleteDocument = (documentId: number) => {
    setDocumentToDelete(documentId);
    setIsDeleteDialogOpen(true);
  };

  const handleEditDocument = (documentId: number) => {
    setEditingDocumentId(documentId);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file && editingDocumentId) {
      try {
        const documentToEdit = documents.find(
          (doc) => doc.id === editingDocumentId,
        );
        if (!documentToEdit) {
          throw new Error('Document not found');
        }
        await updateDocument(editingDocumentId, file, documentToEdit.type);
        toast({
          title: 'Berhasil',
          description: 'Dokumen berhasil diperbarui',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Kesalahan',
          description: 'Gagal memperbarui dokumen. Silakan coba lagi.',
        });
      } finally {
        setEditingDocumentId(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const confirmDeleteDocument = async () => {
    if (documentToDelete) {
      try {
        await deleteDocument(documentToDelete);
        toast({
          title: 'Berhasil',
          description: 'Dokumen berhasil dihapus',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Kesalahan',
          description: 'Gagal menghapus dokumen. Silakan coba lagi.',
        });
      } finally {
        setIsDeleteDialogOpen(false);
        setDocumentToDelete(null);
      }
    }
  };

  const handleViewDocument = async (documentId: number) => {
    try {
      const blob = await getDocumentFile(documentId);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Kesalahan',
        description: 'Gagal melihat dokumen. Silakan coba lagi.',
      });
    }
  };

  const documentTypeOptions = Object.values(DocumentType).map((type) => ({
    value: type,
    label: getDocumentTypeIndonesian(type),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="head-form">Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {documents?.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center p-2 input-form rounded-md"
            >
              <FileIcon className="mr-2 h-5 w-5 text-blue-500" />
              <span className="flex-grow">
                {getDocumentTypeIndonesian(doc.type as DocumentType)}
              </span>
              <div className="flex gap-2">
                <Button
                  className="bg-edit h-6 w-6 rounded-full p-0"
                  title="Edit"
                  onClick={() => handleEditDocument(doc.id)}
                >
                  <FontAwesomeIcon
                    className="h-3 w-3 text-white"
                    icon={faPenToSquare}
                  />
                </Button>
                <Button
                  className="bg-delete h-6 w-6 rounded-full p-0"
                  title="Delete"
                  onClick={() => handleDeleteDocument(doc.id)}
                >
                  <FontAwesomeIcon
                    className="h-3 w-3 text-white"
                    icon={faTrashCan}
                  />
                </Button>
                <Button
                  className="bg-view h-6 w-6 rounded-full p-0"
                  title="Lihat"
                  onClick={() => handleViewDocument(doc.id)}
                >
                  <FontAwesomeIcon
                    className="h-3 w-3 text-white"
                    icon={faEye}
                  />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button
          className="mt-4 ml-0 p-2 w-49 text-[#A3AED0] flex items-center justify-start"
          onClick={() => setIsPopupOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4 bg-blue-500 text-blue-100 rounded-full" />
          Tambah Dokumen
        </Button>
      </CardContent>
      <Suspense fallback={<div>Loading...</div>}>
        <EditPopup
          title="Tambah Dokumen"
          fields={[
            {
              label: 'Tipe Dokumen',
              name: 'type',
              value: '',
              type: 'select',
              options: documentTypeOptions,
              required: true,
            },
            {
              label: 'File',
              name: 'file',
              value: '',
              type: 'file',
              required: true,
              accept: '.pdf',
            },
          ]}
          onSave={onAddDocument}
          validationSchema={addDocumentSchema}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
        />
        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDeleteDocument}
          title="Konfirmasi Hapus"
          description="Apakah kamu yakin ingin menghapus dokumen ini?"
          confirmText="Hapus"
          cancelText="Kembali"
        />
      </Suspense>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept=".pdf"
      />
    </Card>
  );
};

export default DocumentCard;
