/**
 * UI Layer - User Card Component
 *
 * Components are responsible for rendering UI.
 * Responsibilities:
 * ✓ Pure functions (presentational)
 * ✓ Receive data via props
 * ✓ Emit events via callbacks
 *
 * Rules:
 * ✗ No business logic
 * ✗ No state management
 * ✗ No API calls
 * ✗ No services
 * ✗ No store
 *
 * Components = dumb UI elements
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../data-access/services/create-user.service';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="m-2 cursor-pointer rounded border border-gray-300 p-4 transition-colors hover:bg-gray-100" (click)="onClick()">
      <h3 class="mb-2 text-lg font-semibold text-slate-900">{{ user.name }}</h3>
      <p class="mb-4 text-sm text-slate-600">{{ user.email }}</p>
      <button 
        class="rounded bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600" 
        (click)="onDelete($event)" 
        type="button"
      >
        Delete
      </button>
    </div>
  `
})
export class UserCardComponent {
  @Input({ required: true }) user!: User;
  @Output() userClick = new EventEmitter<User>();
  @Output() userDelete = new EventEmitter<User>();

  onClick(): void {
    this.userClick.emit(this.user);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.userDelete.emit(this.user);
  }
}

