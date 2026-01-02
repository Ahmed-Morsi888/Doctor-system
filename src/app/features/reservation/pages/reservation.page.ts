import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-reservation-page',
  standalone: true,
  imports: [CommonModule, TranslocoModule, ButtonModule, TranslocoModule, TableModule],
  templateUrl: './reservation.page.html',
})
export class ReservationPage {}
