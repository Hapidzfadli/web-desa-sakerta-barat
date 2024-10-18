import React from 'react';
import { Button } from '../../ui/button';
import { Search, ArrowUpAZ, ArrowDownAZ, CirclePlus } from 'lucide-react';

interface SearchSortBarProps {
  search: string;
  setSearch: (search: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  showAddButton: boolean;
  onAddClick: () => void;
}

const SearchSortBar: React.FC<SearchSortBarProps> = ({
  search,
  setSearch,
  sortOrder,
  setSortOrder,
  showAddButton,
  onAddClick,
}) => {
  return (
    <div
      className={`flex items-center mb-4 ${showAddButton ? 'justify-between' : 'justify-end'}`}
    >
      {showAddButton && (
        <Button
          className="bg-bank-gradient h-8 shadow-sm text-white"
          onClick={onAddClick}
        >
          Tambah <CirclePlus className="h-4 w-4 ml-2 text-white" />
        </Button>
      )}

      <div className="shadow-card rounded-full">
        <div className="flex gap-2 items-center">
          <div className="flex-grow max-w-md mx-2 md:block py-2 px-0 text-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8F9BBA] h-5" />
              <input
                type="text"
                placeholder="Cari disini..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full h-8 text-[#8F9BBA] bg-[#F4F7FE] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mr-4">
            <Button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="focus:outline-none"
            >
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
  );
};

export default SearchSortBar;
