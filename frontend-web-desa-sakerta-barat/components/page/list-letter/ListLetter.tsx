'use client';
import React, { useEffect, useState, useCallback } from 'react';
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
import { CirclePlus, Search, ArrowUpAZ, ArrowDownAZ } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPenToSquare,
  faTrashCan,
  faEye,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import LetterTypeForm from '../../shared/LetterTypeForm';
import { useToast } from '@/components/ui/use-toast';
import debounce from 'lodash/debounce';
import { useUser } from '../../../app/context/UserContext';

const ListLetter: React.FC<ListLetterProps> = ({ categoryId }) => {
  const { user } = useUser();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [letterTypeData, setLetterTypeData] = useState<LetterTypeProps[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLetterTypeId, setSelectedLetterTypeId] = useState<
    number | null
  >(null);
  const [currentLetterType, setCurrentLetterType] =
    useState<LetterTypeProps | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState(false);
  const { toast } = useToast();

  const loadLetterTypeData = useCallback(async () => {
    setIsContentLoading(true);
    setError(null);
    try {
      const data = await fetchLetterType({
        categoryId,
        search,
        sortBy,
        sortOrder,
      });
      setLetterTypeData(data);
    } catch (err) {
      setError('Failed to load letter type data');
      toast({
        title: 'Error',
        description: 'Failed to load letter types',
        variant: 'destructive',
      });
    } finally {
      setIsContentLoading(false);
      setIsInitialLoading(false);
    }
  }, [categoryId, search, sortBy, sortOrder, toast]);

  const debouncedLoadLetterTypeData = useCallback(
    debounce(loadLetterTypeData, 300),
    [loadLetterTypeData],
  );

  useEffect(() => {
    loadLetterTypeData();
  }, [categoryId, sortBy, sortOrder]);

  useEffect(() => {
    debouncedLoadLetterTypeData();
  }, [search]);

  useEffect(() => {
    if (selectedLetterTypeId !== null) {
      const selectedType = letterTypeData.find(
        (lt) => lt.id === selectedLetterTypeId,
      );

      setCurrentLetterType(selectedType || null);
      setIsFormOpen(true);
    }
  }, [selectedLetterTypeId, letterTypeData]);

  const handleAddEdit = async (data: any) => {
    data.categoryId = Number(categoryId);
    try {
      if (currentLetterType) {
        await updateLetterType(currentLetterType.id, data);
        toast({
          title: 'Berhasil',
          description: 'Tipe surat berhasil diperbaharui',
        });
      } else {
        await createLetterType(data);
        toast({
          title: 'Berhasil',
          description: 'Tipe surat berhasil ditambahkan',
        });
      }
      setIsFormOpen(false);
      setSelectedLetterTypeId(null);
      loadLetterTypeData();
    } catch (err) {
      toast({
        title: 'Gagal',
        description: 'Tipe surat gagal disimpan',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteLetterType(id);
      toast({
        title: 'Berhasil',
        description: 'Tipe surat berhasil dihapus',
      });
      loadLetterTypeData();
    } catch (err) {
      toast({
        title: 'Gagal',
        description: 'Tipe surat gagal dihapus',
        variant: 'destructive',
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSort = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const openEditForm = (letterType: LetterTypeProps) => {
    setSelectedLetterTypeId(letterType.id);
    setViewMode(false);
  };

  const openViewForm = (letterType: LetterTypeProps) => {
    setSelectedLetterTypeId(letterType.id);
    setViewMode(true);
  };

  const openAddForm = () => {
    setSelectedLetterTypeId(null);
    setCurrentLetterType(null);
    setIsFormOpen(true);
  };

  const renderLetterTypeCard = (letterType: LetterTypeProps) => (
    <Card
      key={letterType.id}
      className={`flex flex-col  relative  ${letterType.icon ? 'h-96' : 'h-44'}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm text-black-2">
          {letterType.name}
        </CardTitle>
      </CardHeader>
      <CardContent
        className={`relative ${letterType.icon ? 'grow ' : 'flex-none'}`}
      >
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
      <CardFooter className="flex justify-end gap-3 relative">
        {user?.role !== 'WARGA' ? (
          <>
            <Button
              className="bg-delete hover:bg-red-600 h-8 w-8 rounded-full p-0"
              title="Hapus"
              onClick={() => handleDelete(letterType.id)}
            >
              <FontAwesomeIcon
                className="h-4 w-4 text-white"
                icon={faTrashCan}
              />
            </Button>
            <Button
              className="bg-edit hover:bg-yellow-500 h-8 w-8 rounded-full p-0"
              title="Edit"
              onClick={() => openEditForm(letterType)}
            >
              <FontAwesomeIcon
                className="h-4 w-4 text-white"
                icon={faPenToSquare}
              />
            </Button>
            <Button
              className="bg-view hover:bg-blue-500 h-8 w-8 rounded-full p-0"
              title="Lihat"
              onClick={() => openViewForm(letterType)}
            >
              <FontAwesomeIcon className="h-4 w-4 text-white" icon={faEye} />
            </Button>
          </>
        ) : (
          <>
            <Button
              className="bg-view hover:bg-blue-500 h-8 w-8 rounded-full p-0"
              title="Lihat"
              onClick={() => openViewForm(letterType)}
            >
              <FontAwesomeIcon className="h-4 w-4 text-white" icon={faEye} />
            </Button>
            <Button
              className="bg-edit hover:bg-yellow-500 h-8 w-8 rounded-full p-0"
              title="Ajukan"
            >
              <FontAwesomeIcon
                className="h-4 w-4 text-white"
                icon={faPaperPlane}
              />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );

  if (isInitialLoading) return <LoadingSpinner />;

  return (
    <div>
      <div
        className={`flex items-center mb-4 ${user?.role !== 'WARGA' ? 'justify-between' : 'justify-end'}`}
      >
        {user?.role != 'WARGA' && (
          <Button
            className="bg-bank-gradient h-8 shadow-sm text-white"
            onClick={openAddForm}
          >
            Tambah <CirclePlus className="h-4 w-4 ml-2 text-white" />
          </Button>
        )}

        <div className=" shadow-card rounded-full">
          <div className="flex gap-2 items-center ">
            <div className="flex-grow max-w-md mx-2 md:block py-2 px-0 text-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8F9BBA] h-5" />
                <input
                  type="text"
                  placeholder="Cari disini..."
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 rounded-full h-8 text-[#8F9BBA] bg-[#F4F7FE] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mr-4">
              <Button onClick={handleSort} className="focus:outline-none">
                {sortOrder === 'asc' ? (
                  <ArrowUpAZ className="text-[#8F9BBA] cursor-pointer h-6" />
                ) : (
                  <ArrowDownAZ className="text-[#8F9BBA] cursor-pointer h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {isContentLoading ? (
        <div className="flex justify-center items-center h-64 relative">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          <div className="grid grid-cols-1 gap-6">
            {letterTypeData
              .slice(0, Math.ceil(letterTypeData.length / 2))
              .map(renderLetterTypeCard)}
          </div>
          <div className="grid grid-cols-1 gap-6">
            {letterTypeData
              .slice(Math.ceil(letterTypeData.length / 2))
              .map(renderLetterTypeCard)}
          </div>
        </div>
      )}
      <LetterTypeForm
        key={currentLetterType ? currentLetterType.id : 'new'}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedLetterTypeId(null);
          setCurrentLetterType(null);
          setViewMode(false);
        }}
        onSubmit={handleAddEdit}
        initialData={currentLetterType}
        viewMode={viewMode}
      />
    </div>
  );
};

export default ListLetter;
