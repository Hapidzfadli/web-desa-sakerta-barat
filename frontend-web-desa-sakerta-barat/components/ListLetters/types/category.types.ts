export interface LetterCategory {
  id: number;
  name: string;
  description: string;
}

export interface CategoryFormData {
  id?: number;
  name: string;
  description: string;
}

export interface FilterOption {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  type: 'select' | 'checkbox';
}

export interface FilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, string | string[]>) => void;
  filterOptions: FilterOption[];
}
