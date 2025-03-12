
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Edit, LinkIcon } from 'lucide-react';
import { format } from 'date-fns';

interface InterviewCardProps {
  interviewDate?: string;
  interviewLink?: string;
  companyName: string;
  onOpenInterviewDialog: () => void;
}

export const InterviewCard: React.FC<InterviewCardProps> = ({
  interviewDate,
  interviewLink,
  companyName,
  onOpenInterviewDialog
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-amber-600" />
          Interview Details
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {interviewDate ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Interview Date</p>
                <p className="font-medium">{formatDate(interviewDate)}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 text-amber-700 border-amber-200"
                onClick={onOpenInterviewDialog}
              >
                <Edit className="h-3 w-3" /> Edit
              </Button>
            </div>
            
            {interviewLink && (
              <div>
                <p className="text-sm text-gray-500">Interview Link</p>
                <a 
                  href={interviewLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline flex items-center text-sm mt-1"
                >
                  <LinkIcon className="h-3 w-3 mr-1" /> {interviewLink}
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <CalendarDays className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 mb-3">No interview details added</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 text-amber-700 border-amber-200"
              onClick={onOpenInterviewDialog}
            >
              <CalendarDays className="h-3 w-3" /> Set Interview Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
