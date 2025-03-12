
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, Edit, Link2 } from 'lucide-react';

interface ResumeCardProps {
  resumeLink?: string;
  onOpenResumeDialog: () => void;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({ resumeLink, onOpenResumeDialog }) => {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Resume
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {resumeLink ? (
          <div className="flex items-center justify-between">
            <a 
              href={resumeLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center"
            >
              View Resume <ExternalLink className="h-3 w-3 ml-1" />
            </a>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 text-blue-700 border-blue-200"
              onClick={onOpenResumeDialog}
            >
              <Edit className="h-3 w-3" /> Update
            </Button>
          </div>
        ) : (
          <div className="text-center py-4">
            <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 mb-3">No resume link added yet</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 text-blue-700 border-blue-200"
              onClick={onOpenResumeDialog}
            >
              <Link2 className="h-3 w-3" /> Add Resume Link
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
