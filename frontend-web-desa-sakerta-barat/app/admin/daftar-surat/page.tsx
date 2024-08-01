'use client';
import React, { useState, useRef, useEffect, Suspense } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  fetchLetterCategory,
  createLetterCategory,
  updateLetterCategory,
  deleteLetterCategory,
} from '../../../lib/actions/list-letter.action';
import ListLetter from '../../../components/page/list-letter/ListLetter';
import { cn } from '../../../lib/utils';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import { Button } from '../../../components/ui/button';
import { ChevronRight, Filter, Plus, Settings } from 'lucide-react';
import { useToast } from '../../../components/ui/use-toast';
import {
  createLetterCategorySchema,
  updateLetterCategorySchema,
} from '../../../lib/settingUtils';
import { useUser } from '../../context/UserContext';

const ITEMS_PER_PAGE = 10;

// Lazy load EditPopup component
const EditPopup = React.lazy(
  () => import('../../../components/shared/EditPopup'),
);

const DaftarSurat = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [isAddEditPopupOpen, setIsAddEditPopupOpen] = useState(false);
  const [isSettingsPopupOpen, setIsSettingsPopupOpen] = useState(false);
  const [currentCategory, setCurrentCategory] =
    useState<LetterCategoryProps | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ['letterCategories'],
    queryFn: ({ pageParam = 1 }) =>
      fetchLetterCategory({ limit: ITEMS_PER_PAGE, page: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.length < ITEMS_PER_PAGE) return undefined;
      return pages.length + 1;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  useEffect(() => {
    if (
      data &&
      data.pages.length > 0 &&
      data.pages[0].data.length > 0 &&
      activeTab === null
    ) {
      setActiveTab(data.pages[0].data[0].id);
    }
  }, [data, activeTab]);

  const createMutation = useMutation({
    mutationFn: createLetterCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letterCategories'] });
      toast({
        title: 'Success',
        description: 'Kategori surat berhasil ditambahkan',
      });
      setIsAddEditPopupOpen(false);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create category',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateLetterCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letterCategories'] });
      toast({
        title: 'Success',
        description: 'Kategori surat berhasil diperbaharui',
      });
      setIsAddEditPopupOpen(false);
      setIsSettingsPopupOpen(false);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update category',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLetterCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letterCategories'] });
      toast({
        title: 'Success',
        description: 'Kategori surat berhasil dihapus',
      });
      setIsSettingsPopupOpen(false);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive',
      });
    },
  });

  const handleLoadMore = () => {
    if (hasNextPage) fetchNextPage();
  };

  const handleDelete = async () => {
    if (!activeTab) return;
    deleteMutation.mutate(activeTab);
  };

  const handleSettingsClick = () => {
    const category = data?.pages
      .flatMap((page) => page.data)
      .find((c) => c.id === activeTab);
    if (category) {
      setCurrentCategory(category);
      setIsSettingsPopupOpen(true);
    }
  };

  const handleAdd = () => {
    setCurrentCategory(null);
    setIsAddEditPopupOpen(true);
  };

  const handleSave = async (
    data: Record<string, string | File>,
    errors?: Record<string, string>,
  ) => {
    if (errors) return;
    if (currentCategory) {
      updateMutation.mutate({ ...data, id: currentCategory.id });
    } else {
      createMutation.mutate(data);
    }
  };

  if (status === 'loading') return <LoadingSpinner />;
  if (status === 'error')
    return (
      <div>
        Error loading categories:{' '}
        {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );

  const allCategories = data?.pages.flatMap((page) => page.data) || [];
  const tabs = allCategories.map((category) => ({
    id: category.id,
    label: category.name,
    component: <ListLetter categoryId={category.id} />,
  }));

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 relative">
        <nav className="flex justify-between space-x-4 border-b">
          <div
            ref={tabsRef}
            className="max-w-xl overflow-x-auto overflow-y-hidden h-10 flex thin-scrollbar"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'py-2 px-4 text-sm font-medium whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700',
                )}
              >
                {tab.label}
              </button>
            ))}
            {hasNextPage && (
              <Button
                onClick={handleLoadMore}
                className="ml-2 p-2 rounded-full"
                variant="ghost"
                disabled={isFetchingNextPage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex gap-2 text-gray-500">
            {user?.role !== 'WARGA' && (
              <Button
                className="bg-save hover:bg-gray-100 h-8 w-10 p-0 rounded-lg"
                title="Tambah"
                onClick={handleAdd}
              >
                <Plus className="h-4 w-4 " />
              </Button>
            )}

            <Button
              className="bg-save hover:bg-gray-100 h-8  px-2 rounded-lg"
              title="Filter"
            >
              <Filter className="h-4 w-4  mr-2" />
              Filter
            </Button>
            {user?.role !== 'WARGA' && (
              <Button
                className="bg-save hover:bg-gray-100 h-8 w-10 p-0 rounded-lg"
                title="Setting"
                onClick={handleSettingsClick}
              >
                <Settings className="h-4 w-4 " />
              </Button>
            )}
          </div>
        </nav>
      </div>

      <div className="mt-6">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <EditPopup
          title={
            currentCategory ? 'Edit Kategori Surat' : 'Tambah Kategori Surat'
          }
          fields={[
            {
              label: 'Name',
              name: 'name',
              value: currentCategory?.name || '',
              required: true,
            },
            {
              label: 'Description',
              name: 'description',
              value: currentCategory?.description || '',
              type: 'textarea',
            },
          ]}
          onSave={handleSave}
          validationSchema={
            currentCategory
              ? updateLetterCategorySchema
              : createLetterCategorySchema
          }
          isOpen={isAddEditPopupOpen}
          onClose={() => setIsAddEditPopupOpen(false)}
        />

        <EditPopup
          title={'Pengaturan Kategori Surat'}
          fields={[
            {
              label: 'Name',
              name: 'name',
              value: currentCategory?.name || '',
              required: true,
            },
            {
              label: 'Description',
              name: 'description',
              value: currentCategory?.description || '',
              type: 'textarea',
            },
          ]}
          onSave={handleSave}
          onDelete={handleDelete}
          validationSchema={updateLetterCategorySchema}
          isOpen={isSettingsPopupOpen}
          onClose={() => setIsSettingsPopupOpen(false)}
        />
      </Suspense>
    </div>
  );
};

export default DaftarSurat;
