
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import ApplicationForm from '@/components/ApplicationForm';
import { useApplications } from '@/context/ApplicationContext';

const EditApplication: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getApplicationById } = useApplications();
  
  const application = id ? getApplicationById(id) : undefined;
  
  if (!application) {
    return (
      <div className="max-w-3xl mx-auto">
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
            The application you're trying to edit could not be found.
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
    <div className="max-w-3xl mx-auto">
      <Button 
        variant="ghost" 
        className="mb-6 -ml-2 gap-2"
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Application</h1>
        <ApplicationForm mode="edit" existingApplication={application} />
      </div>
    </div>
  );
};

export default EditApplication;
