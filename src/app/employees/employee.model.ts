export interface Employee {
  id: string;
  user_uuid: string;
  employee_code: string;
  designation: string;
  department_id: number;
  salary: number;
  date_of_joining: string; // ISO date string (e.g., "2020-01-10")
  employment_type: 'Full-time' | 'Part-time' | 'Contract' | string;
  status: 'active' | 'inactive' | string;
  created_at: string; // ISO timestamp (e.g., "2024-05-03T14:45:00+00:00")
}
