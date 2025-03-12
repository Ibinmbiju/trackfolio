
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Application, Status } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

interface ApplicationContextType {
  applications: Application[];
  loading: boolean;
  error: string | null;
  addApplication: (application: Omit<Application, 'id' | 'statusHistory'>) => Promise<void>;
  updateApplication: (id: string, application: Partial<Application>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  updateStatus: (id: string, status: Status) => Promise<void>;
  getApplicationById: (id: string) => Application | undefined;
}

const ApplicationContext = createContext<ApplicationContextType>({
  applications: [],
  loading: false,
  error: null,
  addApplication: async () => {},
  updateApplication: async () => {},
  deleteApplication: async () => {},
  updateStatus: async () => {},
  getApplicationById: () => undefined,
});

export const useApplications = () => useContext(ApplicationContext);

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved applications from localStorage
    const loadApplications = () => {
      try {
        const savedApplications = localStorage.getItem('applications');
        if (savedApplications) {
          setApplications(JSON.parse(savedApplications));
        }
      } catch (err) {
        console.error('Failed to load applications:', err);
        setError('Failed to load applications');
      }
    };

    loadApplications();
  }, []);

  // Save applications to localStorage whenever they change
  useEffect(() => {
    // We need to remove the actual File object before saving to localStorage
    const applicationsForStorage = applications.map(app => {
      const { cvFile, ...appWithoutFile } = app;
      return appWithoutFile;
    });
    
    localStorage.setItem('applications', JSON.stringify(applicationsForStorage));
  }, [applications]);

  const addApplication = async (newApp: Omit<Application, 'id' | 'statusHistory'>) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newApplication: Application = {
        ...newApp,
        id: uuidv4(),
        statusHistory: [
          { 
            date: new Date().toISOString(), 
            status: newApp.status 
          }
        ],
      };
      
      setApplications(prev => [...prev, newApplication]);
      toast({
        title: "Success",
        description: "Application added successfully",
      });
    } catch (err) {
      console.error('Failed to add application:', err);
      setError('Failed to add application');
      toast({
        title: "Error",
        description: "Failed to add application",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplication = async (id: string, updatedData: Partial<Application>) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setApplications(prev => 
        prev.map(app => {
          if (app.id === id) {
            // If we're updating the CV file, we need to handle it specially
            if (updatedData.cvFile) {
              // In a real app, we'd upload the file to a server here
              console.log('Would upload file:', updatedData.cvFile.name);
              // For now, we just store the filename
              toast({
                title: "CV Uploaded",
                description: `${updatedData.cvFile.name} successfully uploaded`,
              });
            }
            
            return { ...app, ...updatedData };
          }
          return app;
        })
      );
      
      if (!updatedData.cvFile) {
        toast({
          title: "Success",
          description: "Application updated successfully",
        });
      }
    } catch (err) {
      console.error('Failed to update application:', err);
      setError('Failed to update application');
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: Status) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setApplications(prev => 
        prev.map(app => {
          if (app.id === id) {
            const newStatusHistory = [
              ...app.statusHistory,
              { date: new Date().toISOString(), status }
            ];
            return { 
              ...app, 
              status,
              statusHistory: newStatusHistory
            };
          }
          return app;
        })
      );
      toast({
        title: "Success",
        description: `Status updated to ${status}`,
      });
    } catch (err) {
      console.error('Failed to update status:', err);
      setError('Failed to update status');
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (id: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setApplications(prev => prev.filter(app => app.id !== id));
      toast({
        title: "Success",
        description: "Application deleted successfully",
      });
    } catch (err) {
      console.error('Failed to delete application:', err);
      setError('Failed to delete application');
      toast({
        title: "Error",
        description: "Failed to delete application",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getApplicationById = (id: string) => {
    return applications.find(app => app.id === id);
  };

  return (
    <ApplicationContext.Provider 
      value={{ 
        applications, 
        loading, 
        error, 
        addApplication, 
        updateApplication, 
        deleteApplication, 
        updateStatus,
        getApplicationById
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
