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
    <div class="page-container">
      <div class="page-header">
        <h1 *transloco="let t">{{ t('menu.reservations') }}</h1>
        <p class="page-description" *transloco="let t">
          {{ t('reservations.description') }}
        </p>
      </div>

      <div class="page-content">
        <!-- Reservations content will go here -->
        <div class="empty-state">
          <p *transloco="let t">{{ t('reservations.empty') }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: var(--spacing-xl);
      width: 100%;
      min-height: 100%;
    }

    .page-header {
      margin-bottom: var(--spacing-xl);
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: var(--spacing-sm);
    }

    .page-description {
      color: var(--text-secondary);
      font-size: 1rem;
    }

    .page-content {
      background: var(--bg-primary);
      border-radius: var(--radius-lg);
      padding: var(--spacing-xl);
      box-shadow: var(--shadow-sm);
    }

    .empty-state {
      text-align: center;
      padding: var(--spacing-2xl);
      color: var(--text-muted);
    }
  `]
})
export class ReservationsPage {}

