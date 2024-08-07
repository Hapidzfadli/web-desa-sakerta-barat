import React from 'react';
import { Button } from '../../ui/button';
import { Plus, Filter, Settings } from 'lucide-react';

interface ActionButtonsProps {
  userRole: string | undefined;
  onAdd: () => void;
  onSettings: () => void;
  onFilter: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  userRole,
  onAdd,
  onSettings,
  onFilter,
}) => {
  return (
    <div className="flex gap-2 text-gray-500">
      {userRole !== 'WARGA' && (
        <Button
          className="bg-save hover:bg-gray-100 h-8 w-10 p-0 rounded-lg"
          title="Tambah"
          onClick={onAdd}
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}

      <Button
        className="bg-save hover:bg-gray-100 h-8 px-2 rounded-lg"
        title="Filter"
        onClick={onFilter}
      >
        <Filter className="h-4 w-4 mr-2" />
        Filter
      </Button>
      {userRole !== 'WARGA' && (
        <Button
          className="bg-save hover:bg-gray-100 h-8 w-10 p-0 rounded-lg"
          title="Setting"
          onClick={onSettings}
        >
          <Settings className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
