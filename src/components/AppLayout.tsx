
import React, { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from './Header';

const AppLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if the user is authenticated
  if (!isLoading && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-app-background">
      <Header 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        showSearch={true}
      />
      
      <main className="flex-1 container py-4 sm:py-6 px-3 sm:px-4 md:px-6 mx-auto w-full max-w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
