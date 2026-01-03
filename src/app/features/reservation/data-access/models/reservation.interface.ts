

export interface PaginationEvent {
  rows: number; // Number of rows per page
  page: number; // Current page number (0-based)
}

export interface Reservation {
  reservationId: string;
  patient: Patient;
  appointment: Appointment;
  payment: Payment;
  status: string;
  clinic: Clinic;
  createdAt: string;
  notes?: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
}

export interface Appointment {
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

export interface Payment {
  method: string;
  amount: number;
  currency: string;
  paid?: boolean;
}

export interface Clinic {
  id: string;
  name: string;
  room: string;
}
