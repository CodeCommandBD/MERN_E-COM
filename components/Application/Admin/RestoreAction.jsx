import React from 'react';
import { RotateCcw } from 'lucide-react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

const RestoreAction = ({ handleDelete, row, deleteType }) => {
  return (
    <DropdownMenuItem
      onClick={() => handleDelete([row.original._id], deleteType)}
      className="flex items-center gap-2 cursor-pointer"
    >
      <RotateCcw className="w-4 h-4" />
      Restore
    </DropdownMenuItem>
  );
};

export default RestoreAction;
