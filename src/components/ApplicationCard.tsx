
import React, { useState } from 'react';
import { format } from 'date-fns';
import { MoreHorizontal, FileText, ExternalLink, Trash2 } from 'lucide-react';
import { Application, Status } from '@/types';
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useApplications } from '@/context/ApplicationContext';

interface ApplicationCardProps {
  application: Application;
}

const statusColors: Record<Status, string> = {
  'Applied': 'status-applied',
  'Interview': 'status-interview',
  'Offer': 'status-offer',
  'Rejected': 'status-rejected',
};

export function ApplicationCard({ application }: ApplicationCardProps) {
  const navigate = useNavigate();
  const { updateStatus, deleteApplication } = useApplications();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const handleStatusChange = async (status: Status) => {
    await updateStatus(application.id, status);
  };
  
  const handleDelete = async () => {
    await deleteApplication(application.id);
    setShowDeleteDialog(false);
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <>
      <Card className="h-full hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-semibold line-clamp-1">
                {application.companyName}
              </CardTitle>
              <p className="text-sm font-medium text-app-text-secondary line-clamp-1">
                {application.position}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(`/application/${application.id}`)}>
                  View details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/application/${application.id}/edit`)}>
                  Edit application
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-app-text-secondary mr-1" />
              <span className="text-xs text-app-text-secondary">
                Applied: {formatDate(application.applicationDate)}
              </span>
            </div>
            {application.jobUrl && (
              <a 
                href={application.jobUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-app-indigo hover:underline flex items-center text-xs"
              >
                Job post <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            )}
          </div>
          
          {application.notes && (
            <p className="text-sm text-app-text-secondary line-clamp-2 mb-3">
              {application.notes}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between pt-0">
          <span className={`status-badge ${statusColors[application.status]}`}>
            {application.status}
          </span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">Update Status</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleStatusChange('Applied')}>
                Applied
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('Interview')}>
                Interview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('Offer')}>
                Offer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('Rejected')}>
                Rejected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this application for {application.position} at {application.companyName}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
