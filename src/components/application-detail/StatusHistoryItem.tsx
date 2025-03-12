
import React from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { StatusBadge } from './StatusBadge';
import { StatusHistory, Status } from '@/types';

interface StatusHistoryItemProps {
  history: StatusHistory;
  isLast: boolean;
}

const statusColors: Record<Status, { bg: string, text: string }> = {
  'Applied': { bg: 'bg-blue-600', text: 'text-white' },
  'Interview': { bg: 'bg-amber-500', text: 'text-white' },
  'Offer': { bg: 'bg-green-600', text: 'text-white' },
  'Rejected': { bg: 'bg-red-600', text: 'text-white' },
};

export const StatusHistoryItem: React.FC<StatusHistoryItemProps> = ({ history, isLast }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`rounded-full p-2 mt-0.5 ${
        statusColors[history.status].bg.replace('bg-', 'bg-').replace('600', '100')} ${
        statusColors[history.status].text.replace('text-white', 'text-' + history.status.toLowerCase() + '-700')}`}>
        <Clock className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <StatusBadge status={history.status} />
          <span className="text-gray-500 text-sm">
            {formatDate(history.date)}
          </span>
        </div>
        {!isLast && (
          <div className="ml-3 h-8 w-px bg-border" />
        )}
      </div>
    </div>
  );
};
