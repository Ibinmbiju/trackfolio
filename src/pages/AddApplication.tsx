
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ApplicationForm from '@/components/ApplicationForm';

const AddApplication: React.FC = () => {
  const navigate = useNavigate();

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
        <h1 className="text-2xl font-bold mb-6">Add New Application</h1>
        <ApplicationForm mode="add" />
      </div>
    </div>
  );
};

export default AddApplication;
