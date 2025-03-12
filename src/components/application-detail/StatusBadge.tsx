
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Status } from '@/types';

interface StatusBadgeProps {
  status: Status;
}

const statusColors: Record<Status, { bg: string, text: string }> = {
  'Applied': { bg: 'bg-blue-600', text: 'text-white' },
  'Interview': { bg: 'bg-amber-500', text: 'text-white' },
  'Offer': { bg: 'bg-green-600', text: 'text-white' },
  'Rejected': { bg: 'bg-red-600', text: 'text-white' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <Badge className={statusColors[status].bg}>
      {status}
    </Badge>
  );
};
