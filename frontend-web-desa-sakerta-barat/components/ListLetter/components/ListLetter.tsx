import React, { useState, Suspense } from 'react';
import { useLetterTypeData } from '../hooks/useLetterTypeData';
import { useLetterTypeActions } from '../hooks/useLetterTypeActions';
import LetterTypeCard from './LetterTypeCard';
import SearchSortBar from './SearchSortBar';
import ApplicationForm from './ApplicationForm';
import { Button } from '../../ui/button';
import { CirclePlus } from 'lucide-react';
import LoadingSpinner from '../../shared/LoadingSpinner';
import { useUser } from '../../../app/context/UserContext';
import CustomAlertDialog from '../../shared/CustomAlertDialog';
import { parseRequirements } from '../utils/letterTypeUtils';

const LetterTypeForm = React.lazy(() => import('../../shared/LetterTypeForm'));

const ListLetter: React.FC<{ categoryId: number }> = ({ categoryId }) => {
  const { user } = useUser();
  const {
    letterTypeData,
    isLoading,
    isError,
    search,
    setSearch,
    sortOrder,
    setSortOrder,
  } = useLetterTypeData(categoryId);
  const { handleAddEdit, handleDelete, handleApplyLetter } =
    useLetterTypeActions(categoryId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentLetterType, setCurrentLetterType] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertData, setAlertData] = useState({ title: '', description: '' });

  if (isError) return <div>Error loading letter types</div>;

  return (
    <div>
      <SearchSortBar
        search={search}
        setSearch={setSearch}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        showAddButton={user?.role !== 'WARGA'}
        onAddClick={() => {
          setCurrentLetterType(null);
          setIsFormOpen(true);
        }}
      />

      <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
        <div className="grid grid-cols-1 gap-6">
          {letterTypeData
            ?.slice(0, Math.ceil(letterTypeData.length / 2))
            .map((letterType) => (
              <LetterTypeCard
                key={letterType.id}
                letterType={letterType}
                userRole={user?.role}
                onEdit={() => {
                  setCurrentLetterType(letterType);
                  setViewMode(false);
                  setIsFormOpen(true);
                }}
                isLoading={isLoading}
                onDelete={() => handleDelete(letterType.id)}
                onView={() => {
                  if (user?.role === 'WARGA') {
                    setAlertData({
                      title: 'Informasi Persyaratan',
                      description: `Untuk membuat ${letterType.name}, Anda perlu menyiapkan: ${parseRequirements(letterType.requirements)}.`,
                    });
                    setIsAlertOpen(true);
                  } else {
                    setCurrentLetterType(letterType);
                    setViewMode(true);
                    setIsFormOpen(true);
                  }
                }}
                onApply={() => {
                  setCurrentLetterType(letterType);
                  setIsApplicationFormOpen(true);
                }}
              />
            ))}
        </div>
        <div className="grid grid-cols-1 gap-6">
          {letterTypeData
            ?.slice(Math.ceil(letterTypeData.length / 2))
            .map((letterType) => (
              <LetterTypeCard
                key={letterType.id}
                letterType={letterType}
                userRole={user?.role}
                onEdit={() => {
                  setCurrentLetterType(letterType);
                  setViewMode(false);
                  setIsFormOpen(true);
                }}
                isLoading={isLoading}
                onDelete={() => handleDelete(letterType.id)}
                onView={() => {
                  if (user?.role === 'WARGA') {
                    setAlertData({
                      title: 'Informasi Persyaratan',
                      description: `Untuk membuat ${letterType.name}, Anda perlu menyiapkan: ${parseRequirements(letterType.requirements)}.`,
                    });
                    setIsAlertOpen(true);
                  } else {
                    setCurrentLetterType(letterType);
                    setViewMode(true);
                    setIsFormOpen(true);
                  }
                }}
                onApply={() => {
                  setCurrentLetterType(letterType);
                  setIsApplicationFormOpen(true);
                }}
              />
            ))}
        </div>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <LetterTypeForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleAddEdit}
          initialData={currentLetterType}
          viewMode={viewMode}
        />
      </Suspense>

      <ApplicationForm
        isOpen={isApplicationFormOpen}
        onClose={() => setIsApplicationFormOpen(false)}
        letterType={currentLetterType}
        onApply={handleApplyLetter}
      />

      <CustomAlertDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        title={alertData.title}
        description={alertData.description}
      />
    </div>
  );
};

export default ListLetter;
