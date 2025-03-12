
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Status } from '@/types';

interface ApplicationDetailHeaderProps {
  id: string;
  position: string;
  companyName: string;
  status: Status;
  onDeleteClick: () => void;
}

const statusBgColors: Record<Status, string> = {
  'Applied': 'bg-blue-50 border-blue-200',
  'Interview': 'bg-amber-50 border-amber-200',
  'Offer': 'bg-green-50 border-green-200',
  'Rejected': 'bg-red-50 border-red-200',
};

export const ApplicationDetailHeader: React.FC<ApplicationDetailHeaderProps> = ({
  id,
  position,
  companyName,
  status,
  onDeleteClick
}) => {
  const navigate = useNavigate();
  const statusColorClass = statusBgColors[status];

  return (
    <>
      <Button 
        variant="ghost" 
        className="mb-6 -ml-2 gap-2"
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <div className={`rounded-lg shadow-sm p-6 ${statusColorClass}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">{position}</h1>
            <p className="text-gray-600 text-lg">{companyName}</p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
              onClick={() => navigate(`/application/${id}/edit`)}
            >
              <Edit className="h-4 w-4" /> Edit
            </Button>
            <Button 
              variant="destructive" 
              className="gap-2"
              onClick={onDeleteClick}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
