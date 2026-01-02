import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';

/**
 * Reservations Page
 *
 * Page component for managing reservations.
 * Follows the project architecture pattern.
 */
@Component({
  selector: 'app-reservations-page',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  template: `
    <div class="w-full min-h-full p-8">
      <div class="mb-8">
        <h1 class="mb-2 text-3xl font-bold text-slate-900" *transloco="let t">{{ t('menu.reservations') }}</h1>
        <p class="text-base text-slate-500" *transloco="let t">
          {{ t('reservations.description') }}
        </p>
      </div>

      <div class="rounded-xl bg-white p-8 shadow-sm">
        <!-- Reservations content will go here -->
        <div class="py-12 text-center text-slate-400">
          <p *transloco="let t">{{ t('reservations.empty') }}</p>
        </div>
      </div>
    </div>
  `
})
export class ReservationsPage { }

