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
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import { FilterProps, FilterOption } from '../ListLetters/types/category.types';

const Filter: React.FC<FilterProps> = ({
  isOpen,
  onClose,
  onApply,
  filterOptions,
}) => {
  const [activeFilters, setActiveFilters] = useState<
    { id: string; value: string | string[] }[]
  >([]);

  const handleAddFilter = () => {
    if (filterOptions.length > activeFilters.length) {
      const newFilter = filterOptions[activeFilters.length];
      setActiveFilters([
        ...activeFilters,
        { id: newFilter.id, value: newFilter.type === 'select' ? '' : [] },
      ]);
    }
  };

  const handleRemoveFilter = (index: number) => {
    setActiveFilters(activeFilters.filter((_, i) => i !== index));
  };

  const handleFilterChange = (index: number, value: string | string[]) => {
    const newFilters = [...activeFilters];
    newFilters[index].value = value;
    setActiveFilters(newFilters);
  };

  const handleCheckboxChange = (
    index: number,
    optionValue: string,
    isChecked: boolean,
  ) => {
    const newFilters = [...activeFilters];
    const currentValues = newFilters[index].value as string[];
    if (isChecked) {
      newFilters[index].value = [...currentValues, optionValue];
    } else {
      newFilters[index].value = currentValues.filter((v) => v !== optionValue);
    }
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
      {} as Record<string, string | string[]>,
    );
    onApply(filters);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="head-form">Filter</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {activeFilters.map((filter, index) => (
            <div key={index} className="flex items-center gap-2">
              {filterOptions.find((opt) => opt.id === filter.id)?.type ===
              'select' ? (
                <Select
                  value={filter.value as string}
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
              ) : (
                <div className="w-full">
                  <p className="mb-2">
                    {filterOptions.find((opt) => opt.id === filter.id)?.label}
                  </p>
                  {filterOptions
                    .find((opt) => opt.id === filter.id)
                    ?.options.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2 mb-1"
                      >
                        <Checkbox
                          id={`${filter.id}-${option.value}`}
                          checked={(filter.value as string[]).includes(
                            option.value,
                          )}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(
                              index,
                              option.value,
                              checked as boolean,
                            )
                          }
                        />
                        <label
                          htmlFor={`${filter.id}-${option.value}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                </div>
              )}
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
          <Button className="bg-save" onClick={handleApply}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Filter;
