import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-reservation-page',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './reservation.page.html',
})
export class ReservationPage {}
