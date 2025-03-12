
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface NotesSectionProps {
  notes?: string;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ notes }) => {
  if (!notes) return null;
  
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-3">Notes</h2>
      <Card className="bg-white">
        <CardContent className="p-4">
          <p className="whitespace-pre-line">{notes}</p>
        </CardContent>
      </Card>
    </div>
  );
};
