export interface PaginationEvent {
  first: number; // First row index
  rows: number; // Number of rows per page
  page: number; // Current page number (0-based)
}

export type EmployeeRole = 'Receptionist' | 'Doctor';
export type EmployeeStatus = 'Active' | 'Inactive';

export interface Employee {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  department?: string;
  specialization?: string; // For doctors
  hireDate: string;
  avatar?: string;
}

