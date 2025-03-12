
import React from 'react';
import { format } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  CalendarDays, 
  ExternalLink, 
  Edit, 
  Trash2,
  FileText,
  Globe,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useApplications } from '@/context/ApplicationContext';
import { Status } from '@/types';

const statusColors: Record<Status, string> = {
  'Applied': 'bg-app-indigo text-white',
  'Interview': 'bg-warning text-white',
  'Offer': 'bg-success text-white',
  'Rejected': 'bg-danger text-white',
};

const ApplicationDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getApplicationById, deleteApplication } = useApplications();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  
  const application = id ? getApplicationById(id) : undefined;
  
  const handleDelete = async () => {
    if (id) {
      await deleteApplication(id);
      navigate('/dashboard');
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6 -ml-2 gap-2"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-xl font-bold mb-4">Application Not Found</h1>
          <p className="text-app-text-secondary mb-6">
            The application you're looking for does not exist or has been deleted.
          </p>
          <Button 
            className="gradient-btn"
            onClick={() => navigate('/dashboard')}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Button 
        variant="ghost" 
        className="mb-6 -ml-2 gap-2"
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">{application.position}</h1>
            <p className="text-app-text-secondary text-lg">{application.companyName}</p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => navigate(`/application/${id}/edit`)}
            >
              <Edit className="h-4 w-4" /> Edit
            </Button>
            <Button 
              variant="destructive" 
              className="gap-2"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-app-text-secondary">Applied On</p>
                <p className="font-medium">{formatDate(application.applicationDate)}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-app-text-secondary">Status</p>
                <Badge className={statusColors[application.status]}>
                  {application.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-app-text-secondary">Job Posting</p>
                {application.jobUrl ? (
                  <a 
                    href={application.jobUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-app-indigo hover:underline flex items-center font-medium"
                  >
                    View Posting <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                ) : (
                  <p className="text-app-text-secondary">Not provided</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {application.notes && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-3">Notes</h2>
            <Card>
              <CardContent className="p-4">
                <p className="whitespace-pre-line">{application.notes}</p>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div>
          <h2 className="text-lg font-bold mb-3">Status History</h2>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                {application.statusHistory.map((history, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[history.status]}>
                          {history.status}
                        </Badge>
                        <span className="text-app-text-secondary text-sm">
                          {formatDate(history.date)}
                        </span>
                      </div>
                      {index < application.statusHistory.length - 1 && (
                        <div className="ml-3 h-8 w-px bg-border" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
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
    </div>
  );
};

export default ApplicationDetail;
