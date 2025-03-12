import React, { useState } from 'react';
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
  Clock,
  Upload,
  Link as LinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useApplications } from '@/context/ApplicationContext';
import { Status } from '@/types';
import { Calendar } from '@/components/ui/calendar';

const statusColors: Record<Status, { bg: string, text: string }> = {
  'Applied': { bg: 'bg-blue-600', text: 'text-white' },
  'Interview': { bg: 'bg-amber-500', text: 'text-white' },
  'Offer': { bg: 'bg-green-600', text: 'text-white' },
  'Rejected': { bg: 'bg-red-600', text: 'text-white' },
};

const statusBgColors: Record<Status, string> = {
  'Applied': 'bg-blue-50 border-blue-200',
  'Interview': 'bg-amber-50 border-amber-200',
  'Offer': 'bg-green-50 border-green-200',
  'Rejected': 'bg-red-50 border-red-200',
};

const ApplicationDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getApplicationById, deleteApplication, updateApplication } = useApplications();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showCvUploadDialog, setShowCvUploadDialog] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);
  
  const application = id ? getApplicationById(id) : undefined;
  
  const [interviewDate, setInterviewDate] = useState<Date | undefined>(
    application?.interviewDate ? new Date(application.interviewDate) : undefined
  );
  const [interviewLink, setInterviewLink] = useState(application?.interviewLink || '');
  
  const handleDelete = async () => {
    if (id) {
      await deleteApplication(id);
      navigate('/dashboard');
    }
  };
  
  const handleCvUpload = async () => {
    if (id && cvFile) {
      await updateApplication(id, {
        cvFileName: cvFile.name,
        cvFile: cvFile
      });
      setShowCvUploadDialog(false);
    }
  };
  
  const handleSaveInterviewDetails = async () => {
    if (id) {
      await updateApplication(id, {
        interviewDate: interviewDate ? interviewDate.toISOString() : undefined,
        interviewLink: interviewLink || undefined
      });
      setShowInterviewDialog(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
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
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:shadow-md"
            onClick={() => navigate('/dashboard')}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const statusColorClass = statusBgColors[application!.status];

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
      
      <div className={`rounded-lg shadow-sm p-6 ${statusColorClass}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">{application!.position}</h1>
            <p className="text-gray-600 text-lg">{application!.companyName}</p>
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
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <CalendarDays className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Applied On</p>
                <p className="font-medium">{formatDate(application.applicationDate)}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <Clock className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge className={statusColors[application.status].bg}>
                  {application.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <Globe className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Job Posting</p>
                {application.jobUrl ? (
                  <a 
                    href={application.jobUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center font-medium"
                  >
                    View Posting <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                ) : (
                  <p className="text-gray-500">Not provided</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* CV and Interview Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                CV Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {application.cvFileName ? (
                <div className="flex items-center justify-between">
                  <p className="text-gray-700">{application.cvFileName}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1 text-blue-700 border-blue-200"
                    onClick={() => setShowCvUploadDialog(true)}
                  >
                    <Upload className="h-3 w-3" /> Update
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 mb-3">No CV uploaded yet</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1 text-blue-700 border-blue-200"
                    onClick={() => setShowCvUploadDialog(true)}
                  >
                    <Upload className="h-3 w-3" /> Upload CV
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {application!.status === 'Interview' && (
            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-amber-600" />
                  Interview Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {application!.interviewDate ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Interview Date</p>
                        <p className="font-medium">{formatDate(application!.interviewDate)}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1 text-amber-700 border-amber-200"
                        onClick={() => setShowInterviewDialog(true)}
                      >
                        <Edit className="h-3 w-3" /> Edit
                      </Button>
                    </div>
                    
                    {application!.interviewLink && (
                      <div>
                        <p className="text-sm text-gray-500">Interview Link</p>
                        <a 
                          href={application!.interviewLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:underline flex items-center text-sm mt-1"
                        >
                          <LinkIcon className="h-3 w-3 mr-1" /> {application!.interviewLink}
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
                      onClick={() => setShowInterviewDialog(true)}
                    >
                      <CalendarDays className="h-3 w-3" /> Set Interview Details
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        {application.notes && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-3">Notes</h2>
            <Card className="bg-white">
              <CardContent className="p-4">
                <p className="whitespace-pre-line">{application.notes}</p>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div>
          <h2 className="text-lg font-bold mb-3">Status History</h2>
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="space-y-4">
                {application.statusHistory.map((history, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`rounded-full p-2 mt-0.5 ${
                      statusColors[history.status].bg.replace('bg-', 'bg-').replace('600', '100')} ${
                      statusColors[history.status].text.replace('text-white', 'text-' + history.status.toLowerCase() + '-700')}`}>
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[history.status].bg}>
                          {history.status}
                        </Badge>
                        <span className="text-gray-500 text-sm">
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
              <label htmlFor="cv-file-upload" className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
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
                  id="cv-file-upload" 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
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
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white" 
              onClick={handleCvUpload}
              disabled={!cvFile}
            >
              Upload CV
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
              Add details for your upcoming interview at {application!.companyName}.
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
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {interviewDate ? format(interviewDate, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={interviewDate}
                    onSelect={(date) => setInterviewDate(date)}
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
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white" 
              onClick={handleSaveInterviewDetails}
            >
              Save Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationDetail;
