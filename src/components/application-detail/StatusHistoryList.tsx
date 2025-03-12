
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StatusHistory } from '@/types';
import { StatusHistoryItem } from './StatusHistoryItem';

interface StatusHistoryListProps {
  statusHistory: StatusHistory[];
}

export const StatusHistoryList: React.FC<StatusHistoryListProps> = ({ statusHistory }) => {
  return (
    <div>
      <h2 className="text-lg font-bold mb-3">Status History</h2>
      <Card className="bg-white">
        <CardContent className="p-4">
          <div className="space-y-4">
            {statusHistory.map((history, index) => (
              <StatusHistoryItem 
                key={index} 
                history={history} 
                isLast={index === statusHistory.length - 1} 
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
