import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  options: { value: string; label: string }[];
}

interface FilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, string>) => void;
  filterOptions: FilterOption[];
}

const Filter: React.FC<FilterProps> = ({
  isOpen,
  onClose,
  onApply,
  filterOptions,
}) => {
  const [activeFilters, setActiveFilters] = useState<
    { id: string; value: string }[]
  >([]);

  const handleAddFilter = () => {
    if (filterOptions.length > activeFilters.length) {
      const newFilter = filterOptions[activeFilters.length];
      setActiveFilters([...activeFilters, { id: newFilter.id, value: '' }]);
    }
  };

  const handleRemoveFilter = (index: number) => {
    setActiveFilters(activeFilters.filter((_, i) => i !== index));
  };

  const handleFilterChange = (index: number, value: string) => {
    const newFilters = [...activeFilters];
    newFilters[index].value = value;
    setActiveFilters(newFilters);
  };

  const handleApply = () => {
    const filters = activeFilters.reduce(
      (acc, filter) => {
        if (filter.value) {
          acc[filter.id] = filter.value;
        }
        return acc;
      },
      {} as Record<string, string>,
    );
    onApply(filters);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {activeFilters.map((filter, index) => (
            <div key={index} className="flex items-center gap-2">
              <Select
                value={filter.value}
                onValueChange={(value) => handleFilterChange(index, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      filterOptions.find((opt) => opt.id === filter.id)
                        ?.label || 'Select filter'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions
                    .find((opt) => opt.id === filter.id)
                    ?.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveFilter(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {activeFilters.length < filterOptions.length && (
            <Button variant="outline" onClick={handleAddFilter}>
              <Plus className="mr-2 h-4 w-4" /> Add Filter
            </Button>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleApply}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Filter;
