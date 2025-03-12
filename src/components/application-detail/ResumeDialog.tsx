
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

interface ResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeLink: string;
  setResumeLink: (link: string) => void;
  companyName: string;
  onSave: () => void;
}

export const ResumeDialog: React.FC<ResumeDialogProps> = ({
  open,
  onOpenChange,
  resumeLink,
  setResumeLink,
  companyName,
  onSave
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Resume Link</DialogTitle>
          <DialogDescription>
            Add a Google Drive link to your resume for {companyName}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="resume-link">Resume Link</Label>
            <Input 
              id="resume-link" 
              placeholder="https://drive.google.com/file/..." 
              value={resumeLink} 
              onChange={(e) => setResumeLink(e.target.value)} 
            />
            <p className="text-xs text-gray-500">
              Paste a Google Drive link to your resume document
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white" 
            onClick={onSave}
            disabled={!resumeLink}
          >
            Save Resume Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
