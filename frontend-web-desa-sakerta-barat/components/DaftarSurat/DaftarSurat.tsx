'use client';
import React, { useState, Suspense } from 'react';
import { useCategoryData } from './hooks/useCategoryData';
import { useCategoryActions } from './hooks/useCategoryActions';
import CategoryTabs from './components/CategoryTabs';
import ActionButtons from './components/ActionButtons';
import CategoryForm from './components/CategoryForm';
import ListLetter from '../ListLetter/components/ListLetter';
import LoadingSpinner from '../shared/LoadingSpinner';
import { useUser } from '../../app/context/UserContext';
import { LetterCategory } from './types/category.types';

const DaftarSurat: React.FC = () => {
  const { user } = useUser();
  const {
    categories,
    status,
    error,
    activeTab,
    setActiveTab,
    fetchNextPage,
    hasNextPage,
  } = useCategoryData();
  const { handleSave, handleDelete } = useCategoryActions();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<LetterCategory | null>(
    null,
  );

  if (status === 'loading') return <LoadingSpinner />;
  if (status === 'error')
    return (
      <div>
        Error loading categories:{' '}
        {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );

  const handleAddCategory = () => {
    setCurrentCategory(null);
    setIsFormOpen(true);
  };

  const handleEditCategory = (category: LetterCategory) => {
    setCurrentCategory(category);
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 relative flex justify-between">
        <CategoryTabs
          categories={categories}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasNextPage={hasNextPage}
          onLoadMore={fetchNextPage}
        />
        <ActionButtons
          userRole={user?.role}
          onAdd={handleAddCategory}
          onSettings={() => {
            const category = categories.find((c) => c.id === activeTab);
            if (category) {
              handleEditCategory(category);
            }
          }}
        />
      </div>

      <div className="mt-6">
        {activeTab && <ListLetter categoryId={activeTab} />}
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <CategoryForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          category={currentCategory}
          onSave={(data) => {
            handleSave(data, currentCategory);
            setIsFormOpen(false);
          }}
          onDelete={(id) => {
            handleDelete(id);
            setIsFormOpen(false);
          }}
        />
      </Suspense>
    </div>
  );
};

export default DaftarSurat;
