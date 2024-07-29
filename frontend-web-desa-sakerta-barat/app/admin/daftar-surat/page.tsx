'use client';
import React, { useEffect, useState, useRef } from 'react';
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
import { ChevronRight } from 'lucide-react';
import EditPopup from '../../../components/shared/EditPopup';
import { useToast } from '../../../components/ui/use-toast';
import {
  createLetterCategorySchema,
  updateLetterCategorySchema,
} from '../../../lib/settingUtils';

const DaftarSurat = () => {
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [letterCategoryData, setLetterCategoryData] = useState<
    LetterCategoryProps[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentCategory, setCurrentCategory] =
    useState<LetterCategoryProps | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadCategoryData();
  }, []);

  const loadCategoryData = async (loadMore = false) => {
    try {
      setIsLoading(true);
      const newPage = loadMore ? page + 1 : 1;
      const { data, pagination } = await fetchLetterCategory({
        limit: ITEMS_PER_PAGE,
        page: newPage,
      });

      if (loadMore) {
        setLetterCategoryData((prev) => [...prev, ...data]);
      } else {
        setLetterCategoryData(data);
      }

      setPage(newPage);
      setHasMore(data.length === ITEMS_PER_PAGE);

      if (data.length > 0) {
        const newTabs = data.map((category) => ({
          id: category.id,
          label: category.name,
          component: <ListLetter categoryId={category.id} />,
        }));
        setTabs(loadMore ? [...tabs, ...newTabs] : newTabs);
        if (!loadMore) setActiveTab(newTabs[0].id);
      }
    } catch (err) {
      setError('Failed to load category data');
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore) {
      loadCategoryData(true);
    }
  };

  const handleDelete = async () => {
    if (!activeTab) return;
    try {
      await deleteLetterCategory(activeTab);
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
      loadCategoryData();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = () => {
    const category = letterCategoryData.find((c) => c.id === activeTab);
    if (category) {
      setCurrentCategory(category);
      setIsPopupOpen(true);
    }
  };

  const handleAdd = () => {
    setCurrentCategory(null);
    setIsPopupOpen(true);
  };

  const handleSave = async (
    data: Record<string, string>,
    errors?: Record<string, string>,
  ) => {
    if (errors) {
      // Handle validation errors if needed
      return;
    }
    try {
      if (currentCategory) {
        await updateLetterCategory({ ...data, id: currentCategory.id });
        toast({
          title: 'Success',
          description: 'Category updated successfully',
        });
      } else {
        await createLetterCategory(data);
        toast({
          title: 'Success',
          description: 'Category created successfully',
        });
      }
      setIsPopupOpen(false);
      loadCategoryData();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to save category',
        variant: 'destructive',
      });
    }
  };

  if (isLoading && page === 1) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

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
            {hasMore && (
              <Button
                onClick={handleLoadMore}
                className="ml-2 p-2 rounded-full"
                variant="ghost"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Button
              className="bg-red-500 hover:bg-red-600 h-8 rounded-lg px-2 py-1 text-white"
              title="Hapus"
              onClick={handleDelete}
            >
              Hapus
            </Button>
            <Button
              className="bg-edit hover:bg-[#fe3c01] h-8 rounded-lg px-2 py-1 text-white"
              title="Edit"
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button
              className="bg-bank-gradient hover:bg-blue-500 h-8 rounded-lg px-2 py-1 text-white"
              title="Tambah"
              onClick={handleAdd}
            >
              Tambah
            </Button>
          </div>
        </nav>
      </div>

      <div className="mt-6">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>

      <EditPopup
        title={currentCategory ? 'Edit Category' : 'Add Category'}
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
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </div>
  );
};

export default DaftarSurat;
