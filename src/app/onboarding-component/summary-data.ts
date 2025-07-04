// summary-data.model.ts (you can put it in a shared folder)
export interface SummaryData {
  name: string;
  surname: string;
  dob: string; // or Date if you're handling as Date
  email: string;
  phone: string;
  emergencyPhone: string;

  role: 'Frontend' | 'Backend' | 'Fullstack';

  frontend?: {
    languages: string[];
    frameworks: string[];
  };

  backend?: {
    languages: string[];
    frameworks: string[];
  };
}
