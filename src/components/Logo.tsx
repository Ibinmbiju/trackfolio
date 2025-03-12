
import React from 'react';
import { Briefcase } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
        <Briefcase className="h-6 w-6 text-white" />
      </div>
      <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-primary">JobTrackr</span>
    </div>
  );
};

export default Logo;
