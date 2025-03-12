
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApplications } from '@/context/ApplicationContext';
import { Status } from '@/types';

// Import refactored components
import { StatusBadge } from '@/components/application-detail/StatusBadge';
import { ApplicationInfoGrid } from '@/components/application-detail/ApplicationInfoCard';
import { ResumeCard } from '@/components/application-detail/ResumeCard';
import { InterviewCard } from '@/components/application-detail/InterviewCard';
import { NotesSection } from '@/components/application-detail/NotesSection';
import { StatusHistoryList } from '@/components/application-detail/StatusHistoryList';
import { ApplicationDetailHeader } from '@/components/application-detail/ApplicationDetailHeader';
import { ResumeDialog } from '@/components/application-detail/ResumeDialog';
import { InterviewDialog } from '@/components/application-detail/InterviewDialog';
import { DeleteDialog } from '@/components/application-detail/DeleteDialog';

const ApplicationDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getApplicationById, deleteApplication, updateApplication } = useApplications();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);
  
  const application = id ? getApplicationById(id) : undefined;
  
  const [interviewDate, setInterviewDate] = useState<Date | undefined>(
    application?.interviewDate ? new Date(application.interviewDate) : undefined
  );
  const [interviewLink, setInterviewLink] = useState(application?.interviewLink || '');
  const [resumeLink, setResumeLink] = useState(application?.resumeLink || '');
  
  const handleDelete = async () => {
    if (id) {
      await deleteApplication(id);
      navigate('/dashboard');
    }
  };
  
  const handleSaveResumeLink = async () => {
    if (id && resumeLink) {
      await updateApplication(id, {
        resumeLink: resumeLink
      });
      setShowResumeDialog(false);
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

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto">
        <button 
          className="flex items-center mb-6 -ml-2 gap-2 hover:bg-gray-100 p-2 rounded-md"
          onClick={() => navigate('/dashboard')}
        >
          <span className="sr-only">Back to Dashboard</span>
          Back to Dashboard
        </button>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-xl font-bold mb-4">Application Not Found</h1>
          <p className="text-app-text-secondary mb-6">
            The application you're looking for does not exist or has been deleted.
          </p>
          <button 
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded hover:shadow-md"
            onClick={() => navigate('/dashboard')}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ApplicationDetailHeader
        id={id!}
        position={application.position}
        companyName={application.companyName}
        status={application.status}
        onDeleteClick={() => setShowDeleteDialog(true)}
      >
        <ApplicationInfoGrid
          applicationDate={application.applicationDate}
          status={application.status}
          jobUrl={application.jobUrl}
        />
      </ApplicationDetailHeader>
      
      {/* Resume Link and Interview Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-6">
        <ResumeCard
          resumeLink={application.resumeLink}
          onOpenResumeDialog={() => setShowResumeDialog(true)}
        />
        
        {application.status === 'Interview' && (
          <InterviewCard
            interviewDate={application.interviewDate}
            interviewLink={application.interviewLink}
            companyName={application.companyName}
            onOpenInterviewDialog={() => setShowInterviewDialog(true)}
          />
        )}
      </div>
      
      <NotesSection notes={application.notes} />
      
      <StatusHistoryList statusHistory={application.statusHistory} />
      
      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        position={application.position}
        companyName={application.companyName}
        onDelete={handleDelete}
      />
      
      <ResumeDialog
        open={showResumeDialog}
        onOpenChange={setShowResumeDialog}
        resumeLink={resumeLink}
        setResumeLink={setResumeLink}
        companyName={application.companyName}
        onSave={handleSaveResumeLink}
      />
      
      <InterviewDialog
        open={showInterviewDialog}
        onOpenChange={setShowInterviewDialog}
        interviewDate={interviewDate}
        setInterviewDate={setInterviewDate}
        interviewLink={interviewLink}
        setInterviewLink={setInterviewLink}
        companyName={application.companyName}
        onSave={handleSaveInterviewDetails}
      />
    </div>
  );
};

export default ApplicationDetail;
