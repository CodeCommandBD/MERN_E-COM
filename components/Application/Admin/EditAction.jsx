import Link from 'next/link';
import React from 'react';
import { Edit } from 'lucide-react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

const EditAction = ({ href }) => {
  return (
    <DropdownMenuItem asChild>
      <Link href={href} className="flex items-center gap-2 cursor-pointer">
        <Edit className="w-4 h-4" />
        Edit
      </Link>
    </DropdownMenuItem>
  );
};

export default EditAction;
