/**
 * Services Layer - Create User Service
 *
 * Services handle business logic, NOT state.
 * Responsibilities:
 * ✓ Orchestration
 * ✓ Transforming API responses
 * ✓ Combining multiple API calls
 * ✓ Business logic
 * ✓ Filtering data
 * ✓ Data sanitization
 * ✓ Formatting
 * ✓ Calling APIs
 *
 * Rules:
 * ✗ They DO NOT share state
 * ✗ They do NOT control UI
 */

import { Injectable } from '@angular/core';
import { Reservation } from '../models/reservation.interface';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  constructor(private reservationService: ReservationService) { }

  getReservations(request: Reservation): Observable<Reservation> {
    // Business logic: Validate email format
    // Call API and transform response
    return this.reservationService.getReservations(request).pipe(
      map((response: Reservation) => ({
        reservationId: response.reservationId,
        patient: response.patient,
        appointment: response.appointment,
        payment: response.payment,
        status: response.status,
        clinic: response.clinic,
        createdAt: response.createdAt,
        notes: response.notes,
      }))
    );
  }
}

