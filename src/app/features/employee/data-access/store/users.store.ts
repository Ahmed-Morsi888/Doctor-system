/**
 * Store Layer - Users Store
 * 
 * The Store handles state, not logic.
 * Responsibilities:
 * ✓ Storing the state of items
 * ✓ Storing selected items
 * ✓ Storing loading state
 * ✓ Storing pagination
 * ✓ Storing errors
 * ✓ Storing UI state (selected tab, modal, etc.)
 * ✓ Exposing data to components
 * ✓ General aspects of state
 * 
 * Rules:
 * ✓ The store calls the API or Services, but contains no business logic
 */

import { Injectable, signal, computed } from '@angular/core';
import { CreateUserService, User } from '../services/create-user.service';

export interface UsersState {
  users: User[];
  selectedUserId: string | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsersStore {
  // State signals
  private state = signal<UsersState>({
    users: [],
    selectedUserId: null,
    isLoading: false,
    error: null,
    currentPage: 1,
    pageSize: 10,
    totalCount: 0
  });

  // Computed values
  readonly users = computed(() => this.state().users);
  readonly selectedUserId = computed(() => this.state().selectedUserId);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly error = computed(() => this.state().error);
  readonly selectedUser = computed(() => 
    this.state().users.find(u => u.id === this.state().selectedUserId) || null
  );

  constructor(private createUserService: CreateUserService) {}

  // Actions
  async addUser(user: { name: string; email: string }): Promise<void> {
    this.updateState({ isLoading: true, error: null });
    
    try {
      const newUser = await this.createUserService.createUser(user).toPromise();
      if (newUser) {
        this.updateState({
          users: [...this.state().users, newUser],
          isLoading: false
        });
      }
    } catch (error) {
      this.updateState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create user'
      });
    }
  }

  setSelectedUserId(userId: string | null): void {
    this.updateState({ selectedUserId: userId });
  }

  setPage(page: number): void {
    this.updateState({ currentPage: page });
  }

  private updateState(partial: Partial<UsersState>): void {
    this.state.update(current => ({ ...current, ...partial }));
  }
}

