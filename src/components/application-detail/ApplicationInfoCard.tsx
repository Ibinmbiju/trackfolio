
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, ExternalLink, Clock, Globe } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { Status } from '@/types';
import { format } from 'date-fns';

interface ApplicationInfoCardProps {
  icon: React.ReactNode;
  label: string;
  content: React.ReactNode;
}

const InfoCard: React.FC<ApplicationInfoCardProps> = ({ icon, label, content }) => {
  return (
    <Card className="bg-white">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="rounded-full bg-blue-100 p-2">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          {content}
        </div>
      </CardContent>
    </Card>
  );
};

interface ApplicationInfoGridProps {
  applicationDate: string;
  status: Status;
  jobUrl?: string;
}

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'MMMM d, yyyy');
  } catch (error) {
    return dateString;
  }
};

export const ApplicationInfoGrid: React.FC<ApplicationInfoGridProps> = ({ 
  applicationDate, 
  status, 
  jobUrl 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <InfoCard 
        icon={<CalendarDays className="h-5 w-5 text-blue-700" />}
        label="Applied On"
        content={<p className="font-medium">{formatDate(applicationDate)}</p>}
      />
      
      <InfoCard 
        icon={<Clock className="h-5 w-5 text-blue-700" />}
        label="Status"
        content={<StatusBadge status={status} />}
      />
      
      <InfoCard 
        icon={<Globe className="h-5 w-5 text-blue-700" />}
        label="Job Posting"
        content={
          jobUrl ? (
            <a 
              href={jobUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center font-medium"
            >
              View Posting <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          ) : (
            <p className="text-gray-500">Not provided</p>
          )
        }
      />
    </div>
  );
};
