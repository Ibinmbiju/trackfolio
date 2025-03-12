
export type Status = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export interface Application {
  id: string;
  companyName: string;
  position: string;
  jobUrl?: string;
  applicationDate: string;
  status: Status;
  cvFileName?: string;
  notes?: string;
  statusHistory: StatusHistory[];
}

export interface StatusHistory {
  date: string;
  status: Status;
}

export interface User {
  id: string;
  email: string;
  username: string;
}
