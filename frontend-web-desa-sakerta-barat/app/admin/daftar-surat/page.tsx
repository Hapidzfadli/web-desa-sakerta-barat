'use client';
import React, { useEffect, useState } from 'react';
import { fetchLetterCategory } from '../../../lib/actions/list-letter.action';
import ListLetter from '../../../components/page/list-letter/ListLetter';
import { cn } from '../../../lib/utils';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';

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
      <div className="mb-6 ">
        <nav className="flex space-x-4 border-b">
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
        </nav>
      </div>

      <div className="mt-6">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default DaftarSurat;
