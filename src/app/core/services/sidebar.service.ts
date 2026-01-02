import { Injectable, signal, computed } from '@angular/core';

/**
 * Sidebar Service
 * 
 * Manages the sidebar collapsed/expanded state.
 * Persists state in localStorage for user preference.
 * 
 * Why a service:
 * - Shared state across components
 * - Can be accessed from header toggle button
 * - Persistent state across page reloads
 */
@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  // Collapsed state signal
  private readonly _isCollapsed = signal<boolean>(false);

  // Public computed property
  readonly isCollapsed = computed(() => this._isCollapsed());

  constructor() {
    // Load saved state from localStorage
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState !== null) {
        this._isCollapsed.set(savedState === 'true');
      }
    }
  }

  /**
   * Toggle sidebar collapsed state
   */
  toggle(): void {
    const newState = !this._isCollapsed();
    this._isCollapsed.set(newState);
    
    // Persist state
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', String(newState));
    }
  }

  /**
   * Set collapsed state explicitly
   */
  setCollapsed(collapsed: boolean): void {
    this._isCollapsed.set(collapsed);
    
    // Persist state
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', String(collapsed));
    }
  }
}

