import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { API_URL } from '../../constants';
import { getTemplateFile } from '../../lib/actions/list-letter.action';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '@/components/ui/use-toast';
interface LetterTypeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  initialData?: any;
  onDelete?: () => void;
  viewMode?: boolean;
}

const LetterTypeForm: React.FC<LetterTypeFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  onDelete,
  viewMode = false,
}) => {
  const [formData, setFormData] = useState(initialData || {});
  const [iconPreview, setIconPreview] = useState(
    initialData?.icon ? API_URL + initialData?.icon : initialData?.icon || '',
  );
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState('');
  const [templateFileName, setTemplateFileName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {});

      setIconPreview(
        initialData?.icon
          ? API_URL + initialData?.icon
          : initialData?.icon || '',
      );
      try {
        const parsedRequirements = initialData?.requirements
          ? JSON.parse(initialData.requirements)
          : [];
        setRequirements(
          Array.isArray(parsedRequirements) ? parsedRequirements : [],
        );
      } catch (error) {
        console.error('Error parsing requirements:', error);
        setRequirements([]);
      }
      setTemplateFileName(
        initialData?.template ? initialData.template.split('/').pop() : '',
      );
    }
  }, [isOpen, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (viewMode) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (viewMode) return;
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, [e.target.name]: file });
      if (e.target.name === 'icon') {
        const reader = new FileReader();
        reader.onload = (e) => setIconPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else if (e.target.name === 'template') {
        setTemplateFileName(file.name);
      }
    }
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim() && !viewMode) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const handleRemoveRequirement = (index: number) => {
    if (viewMode) return;
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (viewMode) return;

    if (!formData.name || !formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Nama tipe surat harus diisi.',
        variant: 'destructive',
        duration: 1000,
      });
      return;
    }

    if (!formData.template && !initialData?.template) {
      toast({
        title: 'Error',
        description: 'Template surat harus diunggah.',
        variant: 'destructive',
        duration: 1000,
      });
      return;
    }

    onSubmit({ ...formData, requirements: JSON.stringify(requirements) });
  };

  const handleViewTemplate = async () => {
    if (templateFileName) {
      const blob = await getTemplateFile(templateFileName);
      if (blob) {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-white"
        style={{ width: 'auto', maxWidth: '100vw', minWidth: '65vw' }}
      >
        <DialogHeader>
          <DialogTitle className="head-form">
            {viewMode ? 'Lihat' : initialData ? 'Edit' : 'Tambah'} Tipe Surat
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-left">
                Nama<span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="col-span-3 input-form"
                disabled={viewMode}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-left">
                Deskripsi
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                className="col-span-3 input-form"
                disabled={viewMode}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4 ">
              <Label className="text-left">Persyaratan</Label>
              <div className="space-y-2 col-span-3 ">
                <div className="grid grid-cols-3 gap-4">
                  {requirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input value={req} disabled className="flex-grow " />
                      {!viewMode && (
                        <Button
                          type="button"
                          onClick={() => handleRemoveRequirement(index)}
                          className="bg-red-500 h-8 text-white"
                        >
                          -
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {!viewMode && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Input
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      placeholder="Tambahkan Persyaratan"
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      onClick={handleAddRequirement}
                      className="bg-blue-500 text-white"
                    >
                      +
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-left">
                Icon
              </Label>
              {viewMode ? (
                <div className="col-span-3">
                  {iconPreview ? (
                    <Image
                      src={iconPreview}
                      alt="Icon preview"
                      width={100}
                      height={100}
                    />
                  ) : (
                    <span>Tidak ada icon</span>
                  )}
                </div>
              ) : (
                <Input
                  id="icon"
                  name="icon"
                  type="file"
                  onChange={handleFileChange}
                  className="col-span-3 cursor-pointer input-form"
                  accept="image/*"
                />
              )}
            </div>
            {!viewMode && iconPreview && (
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-start-2 col-span-3">
                  <Image
                    src={iconPreview}
                    alt="Icon preview"
                    width={100}
                    height={100}
                  />
                </div>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="template" className="text-left">
                Template <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                {viewMode ? (
                  <>
                    <span>{templateFileName || 'Tidak ada template'}</span>
                    {templateFileName && (
                      <Button
                        type="button"
                        onClick={handleViewTemplate}
                        className="bg-view h-8 w-8 rounded-full p-0"
                        title="Lihat Template"
                      >
                        <FontAwesomeIcon
                          className="h-4 w-4 text-white"
                          icon={faEye}
                        />
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Input
                      id="template"
                      name="template"
                      type="file"
                      onChange={handleFileChange}
                      className="cursor-pointer input-form"
                      accept=".docx"
                      required={!initialData?.template}
                    />
                    {templateFileName && (
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                          {templateFileName}
                        </span>
                        <Button
                          type="button"
                          onClick={handleViewTemplate}
                          className="bg-view h-6 w-6 rounded-full p-0"
                          title="Lihat Template"
                        >
                          <FontAwesomeIcon
                            className="h-3 w-3 text-white"
                            icon={faEye}
                          />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          {!viewMode && (
            <div className="flex justify-end space-x-2">
              {onDelete && initialData && (
                <Button className="bg-red-500" onClick={onDelete} type="button">
                  Hapus
                </Button>
              )}
              <Button className="bg-save" type="submit">
                Simpan
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LetterTypeForm;
