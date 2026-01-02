/**
 * Utils Layer - User Utilities
 * 
 * Feature-specific utility functions
 * These are pure functions that can be used across the feature
 */

import { User } from '../services/create-user.service';

export function formatUserName(user: User): string {
  return `${user.name} (${user.email})`;
}

export function sortUsersByName(users: User[]): User[] {
  return [...users].sort((a, b) => a.name.localeCompare(b.name));
}

