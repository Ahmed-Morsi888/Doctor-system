/**
 * Pages Layer - Users Page
 *
 * Pages orchestrate components, services, and store.
 * Responsibilities:
 * ✓ Smart components (containers)
 * ✓ Connect to services
 * ✓ Connect to store
 * ✓ Handle routing
 * ✓ Handle user interactions
 * ✓ Pass data to components
 * ✓ Receive events from components
 *
 * Rules:
 * ✗ No business logic
 * ✗ No API calls
 *
 * Pages = orchestrators of the feature
 */

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../data-access/services/create-user.service';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, TranslocoPipe],
  template: `
    <div class="p-8 w-full min-h-full">
      <h1 class="text-2xl font-bold text-primary mb-4">{{ 'patients.management' | transloco }}</h1>

      <div class="flex flex-wrap gap-4">
          <!-- <app-user-card
            [user]="user"
            (userClick)="onUserClick($event)"
            (userDelete)="onUserDelete($event)"
          /> -->
      </div>

      <div class="text-center text-muted">
        <p>{{ 'patients.empty' | transloco }}</p>
      </div>
    </div>
  `,

})
export class UsersPageComponent implements OnInit {
  newUserName = signal('');
  newUserEmail = signal('');

  constructor() { }

  ngOnInit(): void {
    // Initialize page data if needed
  }

  onUserClick(user: User): void {
    // Handle user click - update store
  }

  onUserDelete(user: User): void {
    // Handle user delete - call store action
    // Note: You would implement delete in store/service
    console.log('Delete user:', user);
  }

  async onAddUser(): Promise<void> {
    if (!this.newUserName().trim() || !this.newUserEmail().trim()) {
      return;
    }

    // Clear form
    this.newUserName.set('');
    this.newUserEmail.set('');
  }
}

