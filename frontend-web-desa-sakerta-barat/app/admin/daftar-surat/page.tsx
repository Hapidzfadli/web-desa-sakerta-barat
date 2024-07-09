'use client';
import React, { useEffect, useState } from 'react';
import { fetchLetterCategory } from '../../../lib/actions/list-letter.action';
import ListLetter from '../../../components/page/list-letter/ListLetter';
import { cn } from '../../../lib/utils';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import { Button } from '../../../components/ui/button';
import { CirclePlus, EyeIcon, PencilIcon, Trash2Icon } from 'lucide-react';

const DaftarSurat = () => {
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [letterCategoryData, setLetterCategoryData] = useState<
    LetterCategoryProps[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabs, setTabs] = useState<Tab[]>([]);

  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        const data = await fetchLetterCategory();
        setLetterCategoryData(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load category data');
        setIsLoading(false);
      }
    };
    loadCategoryData();
  }, []);

  useEffect(() => {
    if (letterCategoryData.length > 0) {
      const newTabs = letterCategoryData.map((data) => ({
        id: data.id,
        label: data.name,
        component: <ListLetter categoryId={data.id} />,
      }));
      setTabs(newTabs);
      setActiveTab(newTabs[0].id);
    }
  }, [letterCategoryData]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 relative">
        <nav className="flex justify-between space-x-4 border-b">
          <div>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'py-2 px-4 text-sm font-medium',
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className='grid grid-cols-3 gap-4'>
          <Button
            className="bg-red-500 hover:bg-red-600 h-8 rounded-lg px-2 py-1 text-white"
            title="Hapus"
            onClick={() => {}}
          >
            Hapus
            
          </Button>
          <Button
            className="bg-edit hover:bg-[#fe3c01] h-8 rounded-lg px-2 py-1 text-white"
            title="Edit"
            onClick={() => {}}
          >
            Edit
          </Button>
          <Button
            className="bg-bank-gradient hover:bg-blue-500 h-8 rounded-lg px-2 py-1 text-white"
            title="Lihat"
          >
            Tambah
          </Button>
          </div>
          
        </nav>
      </div>

      <div className="mt-6">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default DaftarSurat;
