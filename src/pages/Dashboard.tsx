
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Briefcase, 
  Search,
  CalendarDays,
  Clock,
  ArrowDownAZ,
  ArrowUpAZ,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApplications } from '@/context/ApplicationContext';
import { ApplicationCard } from '@/components/ApplicationCard';
import { Application, Status } from '@/types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { applications, loading } = useApplications();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.notes && app.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const dateA = new Date(a.applicationDate).getTime();
    const dateB = new Date(b.applicationDate).getTime();
    
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-xl shadow-md text-white mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Job Applications</h1>
            <p className="text-blue-100">
              Track and manage your job applications
            </p>
          </div>
          <Button 
            className="bg-white text-indigo-700 hover:bg-blue-50 shadow-lg gap-2" 
            onClick={() => navigate('/application/new')}
          >
            <Plus className="h-4 w-4" /> Add Application
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:gap-4 bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
          <Input
            placeholder="Search applications..."
            className="pl-9 border-blue-200 focus-visible:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as Status | 'All')}
          >
            <SelectTrigger className="w-[160px] border-blue-200">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-blue-500" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Interview">Interview</SelectItem>
              <SelectItem value="Offer">Offer</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline"
            className="gap-2 border-blue-200 text-blue-700"
            onClick={toggleSortOrder}
          >
            {sortOrder === 'asc' ? (
              <ArrowUpAZ className="h-4 w-4" />
            ) : (
              <ArrowDownAZ className="h-4 w-4" />
            )}
            Date
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg">
          {applications.length === 0 ? (
            <>
              <Briefcase className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-lg font-medium text-blue-800 mb-2">No applications yet</h3>
              <p className="text-blue-600 mb-6">Start tracking your job applications.</p>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white gap-2" 
                onClick={() => navigate('/application/new')}
              >
                <Plus className="h-4 w-4" /> Add your first application
              </Button>
            </>
          ) : (
            <>
              <Search className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-lg font-medium text-blue-800 mb-2">No matching applications</h3>
              <p className="text-blue-600">
                Try adjusting your search or filter criteria
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.map((application) => (
            <ApplicationCard 
              key={application.id} 
              application={application} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
