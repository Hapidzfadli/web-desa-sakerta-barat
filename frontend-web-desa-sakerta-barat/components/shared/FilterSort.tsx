import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FilterSortProps {
  onFilter: (filter: string) => void;
  onSort: (sort: string) => void;
}

const FilterSort: React.FC<FilterSortProps> = ({ onFilter, onSort }) => {
  const [filterValue, setFilterValue] = React.useState('');

  return (
    <div className="flex space-x-2 mb-4">
      <Input
        placeholder="Filter by name..."
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
      />
      <Button onClick={() => onFilter(filterValue)}>Filter</Button>
      <Select onValueChange={onSort}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name_asc">Name (A-Z)</SelectItem>
          <SelectItem value="name_desc">Name (Z-A)</SelectItem>
          <SelectItem value="date_asc">Date (Oldest)</SelectItem>
          <SelectItem value="date_desc">Date (Newest)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterSort;
