import React from "react";
import { Trash2 } from 'lucide-react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

const DeleteAction = ({ handleDelete, row, deleteType, label = "Delete" }) => {
  return (
    <DropdownMenuItem
      onClick={() => handleDelete([row.original._id], deleteType)}
      className="flex items-center gap-2 cursor-pointer"
    >
      <Trash2 className="w-4 h-4" />
      {label}
    </DropdownMenuItem>
  );
};

export default DeleteAction;
