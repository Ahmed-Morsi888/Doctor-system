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
    <div class="user-card" (click)="onClick()">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <button (click)="onDelete($event)" type="button">Delete</button>
    </div>
  `,
  styles: [`
    .user-card {
      border: 1px solid #ccc;
      padding: 1rem;
      margin: 0.5rem;
      cursor: pointer;
    }
    .user-card:hover {
      background-color: #f5f5f5;
    }
  `]
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

