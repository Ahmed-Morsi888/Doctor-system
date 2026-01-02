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
import { UsersStore } from '../data-access/store/users.store';
import { UserCardComponent } from '../components/user-card.component';
import { User } from '../data-access/services/create-user.service';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, UserCardComponent],
  template: `
    <div class="users-page">
      <h1>Users Management</h1>

      @if (store.isLoading()) {
        <p>Loading...</p>
      }

      @if (store.error()) {
        <div class="error">{{ store.error() }}</div>
      }

      <div class="users-list">
        @for (user of store.users(); track user.id) {
          <app-user-card
            [user]="user"
            (userClick)="onUserClick($event)"
            (userDelete)="onUserDelete($event)"
          />
        }
      </div>

      <div class="add-user-form">
        <input
          type="text"
          placeholder="Name"
          [value]="newUserName()"
          (input)="newUserName.set($any($event.target).value)"
        />
        <input
          type="email"
          placeholder="Email"
          [value]="newUserEmail()"
          (input)="newUserEmail.set($any($event.target).value)"
        />
        <button (click)="onAddUser()" type="button">Add User</button>
      </div>
    </div>
  `,
  styles: [`
    .users-page {
      padding: 2rem;
    }
    .users-list {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .add-user-form {
      margin-top: 2rem;
      display: flex;
      gap: 1rem;
    }
    .error {
      color: red;
      padding: 1rem;
      background-color: #ffe6e6;
    }
  `]
})
export class UsersPageComponent implements OnInit {
  newUserName = signal('');
  newUserEmail = signal('');

  constructor(public store: UsersStore) { }

  ngOnInit(): void {
    // Initialize page data if needed
  }

  onUserClick(user: User): void {
    // Handle user click - update store
    this.store.setSelectedUserId(user.id);
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

    await this.store.addUser({
      name: this.newUserName(),
      email: this.newUserEmail()
    });

    // Clear form
    this.newUserName.set('');
    this.newUserEmail.set('');
  }
}

