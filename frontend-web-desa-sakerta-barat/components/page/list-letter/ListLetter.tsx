'use client';
import React, { useEffect, useState } from 'react';
import {
  fetchLetterType,
  createLetterType,
  updateLetterType,
  deleteLetterType,
} from '../../../lib/actions/list-letter.action';
import LoadingSpinner from '../../shared/LoadingSpinner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { CirclePlus, EyeIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import LetterTypeForm from '../../shared/LetterTypeForm';
import { useToast } from '@/components/ui/use-toast';

const ListLetter: React.FC<ListLetterProps> = ({ categoryId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [letterTypeData, setLetterTypeData] = useState<LetterTypeProps[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLetterTypeId, setSelectedLetterTypeId] = useState<
    number | null
  >(null);
  const [currentLetterType, setCurrentLetterType] =
    useState<LetterTypeProps | null>(null);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadLetterTypeData();
  }, [categoryId]);

  useEffect(() => {
    if (selectedLetterTypeId !== null) {
      const selectedType = letterTypeData.find(
        (lt) => lt.id === selectedLetterTypeId
      );

      setCurrentLetterType(selectedType || null);
      setIsFormOpen(true);
    }
  }, [selectedLetterTypeId]);

  const loadLetterTypeData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchLetterType({ categoryId });
      setLetterTypeData(data);
    } catch (err) {
      setError('Failed to load letter type data');
      toast({
        title: 'Error',
        description: 'Failed to load letter types',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEdit = async (data: any) => {
    data.categoryId = Number(categoryId);
    try {
      if (currentLetterType) {
        await updateLetterType(currentLetterType.id, data);
        toast({
          title: 'Success',
          description: 'Letter type updated successfully',
        });
      } else {
        await createLetterType(data);
        toast({
          title: 'Success',
          description: 'New letter type created successfully',
        });
      }
      setIsFormOpen(false);
      setSelectedLetterTypeId(null);
      loadLetterTypeData();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to save letter type',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteLetterType(id);
      toast({
        title: 'Success',
        description: 'Letter type deleted successfully',
      });
      loadLetterTypeData();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete letter type',
        variant: 'destructive',
      });
    }
  };

  const openEditForm = (letterType: LetterTypeProps) => {
    setSelectedLetterTypeId(letterType.id);
  };

  const openAddForm = () => {
    setSelectedLetterTypeId(null);
    setIsFormOpen(true);
  };

  const renderLetterTypeCard = (letterType: LetterTypeProps) => (
    <Card
      key={letterType.id}
      className="flex flex-col shadow-creditCard border-0"
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm text-black-2">
          {letterType.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {letterType.icon && (
          <div className="h-40 mb-4 rounded-lg overflow-hidden">
            <div className="relative w-full h-full">
              <Image
                src={`http://localhost:3001${letterType.icon}`}
                layout="fill"
                objectFit="cover"
                alt={letterType.name}
                className="rounded-lg"
              />
            </div>
          </div>
        )}
        <CardDescription className="text-[#A3AED0]">
          {letterType.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-end gap-3">
        <Button
          className="bg-red-500 hover:bg-red-600 h-8 w-8 rounded-full p-0"
          title="Hapus"
          onClick={() => handleDelete(letterType.id)}
        >
          <Trash2Icon className="h-4 w-4 text-white" />
        </Button>
        <Button
          className="bg-edit h-8 w-8 rounded-full p-0"
          title="Edit"
          onClick={() => openEditForm(letterType)}
        >
          <PencilIcon className="h-4 w-4 text-white" />
        </Button>
        <Button
          className="bg-bank-gradient hover:bg-blue-500 h-8 w-8 rounded-full p-0"
          title="Lihat"
        >
          <EyeIcon className="h-4 w-4 text-white" />
        </Button>
      </CardFooter>
    </Card>
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  const midpoint = Math.ceil(letterTypeData.length / 2);
  const firstHalf = letterTypeData.slice(0, midpoint);
  const secondHalf = letterTypeData.slice(midpoint);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Button
          className="bg-bank-gradient shadow-sm text-white"
          onClick={() => openAddForm()}
        >
          Tambah <CirclePlus className="h-4 w-4 ml-2 text-white" />
        </Button>
       
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="grid grid-cols-1 gap-6">
          {firstHalf.map(renderLetterTypeCard)}
        </div>
        <div className="grid grid-cols-1 gap-6">
          {secondHalf.map(renderLetterTypeCard)}
        </div>
      </div>
      <LetterTypeForm
        key={currentLetterType ? currentLetterType.id : 'new'}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedLetterTypeId(null);
          setCurrentLetterType(null);
        }}
        onSubmit={handleAddEdit}
        initialData={currentLetterType}
      />
    </div>
  );
};

export default ListLetter;
