
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface InterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interviewDate: Date | undefined;
  setInterviewDate: (date: Date | undefined) => void;
  interviewLink: string;
  setInterviewLink: (link: string) => void;
  companyName: string;
  onSave: () => void;
}

export const InterviewDialog: React.FC<InterviewDialogProps> = ({
  open,
  onOpenChange,
  interviewDate,
  setInterviewDate,
  interviewLink,
  setInterviewLink,
  companyName,
  onSave
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Interview Details</DialogTitle>
          <DialogDescription>
            Add details for your upcoming interview at {companyName}.
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white" 
            onClick={onSave}
          >
            Save Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
