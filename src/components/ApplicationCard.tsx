
import React, { useState } from 'react';
import { format } from 'date-fns';
import { MoreHorizontal, FileText, ExternalLink, Trash2, Calendar, Link, Upload } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface ApplicationCardProps {
  application: Application;
}

const statusColors: Record<Status, { bg: string, text: string, border: string, hoverBg: string }> = {
  'Applied': { 
    bg: 'bg-blue-50', 
    text: 'text-blue-700',
    border: 'border-blue-200',
    hoverBg: 'hover:bg-blue-100'
  },
  'Interview': { 
    bg: 'bg-amber-50', 
    text: 'text-amber-700',
    border: 'border-amber-200',
    hoverBg: 'hover:bg-amber-100'
  },
  'Offer': { 
    bg: 'bg-green-50', 
    text: 'text-green-700',
    border: 'border-green-200',
    hoverBg: 'hover:bg-green-100'
  },
  'Rejected': { 
    bg: 'bg-red-50', 
    text: 'text-red-700',
    border: 'border-red-200',
    hoverBg: 'hover:bg-red-100'
  },
};

export function ApplicationCard({ application }: ApplicationCardProps) {
  const navigate = useNavigate();
  const { updateStatus, updateApplication, deleteApplication } = useApplications();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);
  const [showCvUploadDialog, setShowCvUploadDialog] = useState(false);
  const [interviewDate, setInterviewDate] = useState<Date | undefined>(
    application.interviewDate ? new Date(application.interviewDate) : undefined
  );
  const [interviewLink, setInterviewLink] = useState(application.interviewLink || '');
  const [cvFile, setCvFile] = useState<File | null>(null);
  
  const handleStatusChange = async (status: Status) => {
    if (status === 'Interview' && application.status !== 'Interview') {
      setShowInterviewDialog(true);
      await updateStatus(application.id, status);
    } else {
      await updateStatus(application.id, status);
    }
  };
  
  const handleSaveInterviewDetails = async () => {
    await updateApplication(application.id, {
      interviewDate: interviewDate ? interviewDate.toISOString() : undefined,
      interviewLink: interviewLink || undefined
    });
    setShowInterviewDialog(false);
  };
  
  const handleCvUpload = async () => {
    if (cvFile) {
      await updateApplication(application.id, {
        cvFileName: cvFile.name,
        cvFile: cvFile
      });
    }
    setShowCvUploadDialog(false);
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

  const handleCardClick = () => {
    navigate(`/application/${application.id}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const statusColorClasses = statusColors[application.status];

  return (
    <>
      <Card 
        className={`h-full transition-all duration-300 cursor-pointer ${statusColorClasses.bg} ${statusColorClasses.border} border-2 ${statusColorClasses.hoverBg} shadow-sm hover:shadow-md`}
        onClick={handleCardClick}
      >
        <CardHeader className={`pb-2 ${statusColorClasses.text}`}>
          <div className="flex justify-between items-start" onClick={(e) => e.stopPropagation()}>
            <div>
              <CardTitle className="text-lg font-semibold line-clamp-1">
                {application.companyName}
              </CardTitle>
              <p className="text-sm font-medium opacity-90 line-clamp-1">
                {application.position}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-current">
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
                <DropdownMenuItem onClick={() => setShowCvUploadDialog(true)}>
                  Upload CV
                </DropdownMenuItem>
                {application.status === 'Interview' && (
                  <DropdownMenuItem onClick={() => setShowInterviewDialog(true)}>
                    Set interview details
                  </DropdownMenuItem>
                )}
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
              <Calendar className={`h-4 w-4 mr-1 ${statusColorClasses.text}`} />
              <span className={`text-xs ${statusColorClasses.text}`}>
                Applied: {formatDate(application.applicationDate)}
              </span>
            </div>
            {application.jobUrl && (
              <a 
                href={application.jobUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                Job post <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            )}
          </div>
          
          {application.interviewDate && application.status === 'Interview' && (
            <div className="flex items-center mb-3 p-2 bg-amber-100 rounded-md">
              <Calendar className="h-4 w-4 text-amber-700 mr-2" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-amber-800">
                  Interview: {formatDate(application.interviewDate)}
                </span>
                {application.interviewLink && (
                  <a 
                    href={application.interviewLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center text-xs mt-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link className="h-3 w-3 mr-1" /> Meeting link
                  </a>
                )}
              </div>
            </div>
          )}
          
          {application.cvFileName && (
            <div className="flex items-center text-xs mb-3">
              <FileText className={`h-4 w-4 mr-1 ${statusColorClasses.text}`} />
              <span className={statusColorClasses.text}>CV: {application.cvFileName}</span>
            </div>
          )}
          
          {application.notes && (
            <p className={`text-sm opacity-80 line-clamp-2 mb-3 ${statusColorClasses.text}`}>
              {application.notes}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between pt-0" onClick={(e) => e.stopPropagation()}>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColorClasses.text} ${statusColorClasses.bg}`}>
            {application.status}
          </span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className={statusColorClasses.text}>Update Status</Button>
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
      
      {/* Delete Dialog */}
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
      
      {/* Interview Details Dialog */}
      <Dialog open={showInterviewDialog} onOpenChange={setShowInterviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Interview Details</DialogTitle>
            <DialogDescription>
              Add details for your upcoming interview at {application.companyName}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="interview-date">Interview Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !interviewDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {interviewDate ? format(interviewDate, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={interviewDate}
                    onSelect={setInterviewDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="interview-link">Interview Link (optional)</Label>
              <Input 
                id="interview-link" 
                placeholder="https://meet.google.com/..." 
                value={interviewLink} 
                onChange={(e) => setInterviewLink(e.target.value)} 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInterviewDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-gradient-primary text-white" onClick={handleSaveInterviewDetails}>
              Save Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* CV Upload Dialog */}
      <Dialog open={showCvUploadDialog} onOpenChange={setShowCvUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Your CV</DialogTitle>
            <DialogDescription>
              Upload a CV for your application to {application.companyName}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="cv-file">CV File</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium mb-1">
                    {cvFile ? cvFile.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF or DOCX (max 5MB)
                  </p>
                </div>
                <Input 
                  id="cv-file" 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              {application.cvFileName && (
                <p className="text-xs text-gray-500">
                  Current CV: {application.cvFileName}
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCvUploadDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-gradient-primary text-white" 
              onClick={handleCvUpload}
              disabled={!cvFile}
            >
              Upload CV
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
