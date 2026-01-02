import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { LanguageService, SidebarService } from '../../../core/services';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  translationKey: string;
  children?: MenuItem[];
}

/**
 * Side Menu Component
 *
 * Global sidebar navigation component matching the design.
 * Features:
 * - Collapsible menu items
 * - Active route highlighting
 * - Icon support
 * - Responsive design
 * - RTL/LTR support
 * - Uses CSS variables for styling
 */
@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule, LanguageSwitcherComponent],
  template: `
    <aside
      class="side-menu"
      [class.collapsed]="sidebarService.isCollapsed()"
      [class.rtl]="languageService.isRTL()"
    >
      <!-- Logo/Header -->
      <div class="side-menu-header">
        <div class="logo-container">
          <div class="logo-icon">B</div>
          <span class="logo-text" *transloco="let t" [class.hidden]="sidebarService.isCollapsed()">
            {{ t('app.title') }}
          </span>
        </div>
        <button
          type="button"
          class="toggle-button"
          (click)="toggleSidebar()"
          [attr.aria-label]="sidebarService.isCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
          [attr.title]="sidebarService.isCollapsed() ? 'Expand' : 'Collapse'"
        >
          <span class="toggle-icon">{{ sidebarService.isCollapsed() ? '→' : '←' }}</span>
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="side-menu-nav">
        <ul class="menu-list">
          <li *ngFor="let item of menuItems" class="menu-item">
            <a
              [routerLink]="item.route"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: item.route === '/' }"
              class="menu-link"
              [title]="item.label"
            >
              <span class="menu-icon">{{ item.icon }}</span>
              <span class="menu-label" *transloco="let t" [class.hidden]="sidebarService.isCollapsed()">
                {{ t(item.translationKey) }}
              </span>
            </a>
          </li>
        </ul>
      </nav>

      <!-- Footer Actions -->
      <div class="side-menu-footer" [class.collapsed]="sidebarService.isCollapsed()">
        <app-language-switcher [isCollapsed]="sidebarService.isCollapsed()"></app-language-switcher>
      </div>
    </aside>
  `,
  styles: [`
    .side-menu {
      width: var(--sidebar-width);
      height: 100vh;
      background-color: var(--bg-sidebar);
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: var(--z-sidebar);
      border-right: 1px solid var(--border-color-dark);
      transition: width var(--transition-base);
    }

    .side-menu.collapsed {
      width: var(--sidebar-width-collapsed);
      min-width: var(--sidebar-width-collapsed);
      max-width: var(--sidebar-width-collapsed);
    }

    .side-menu.rtl {
      left: auto;
      right: 0;
      border-right: none;
      border-left: 1px solid var(--border-color-dark);
    }

    /* Header */
    .side-menu-header {
      height: var(--sidebar-header-height);
      padding: var(--spacing-md) var(--spacing-lg);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      position: relative;
    }

    .side-menu.collapsed .side-menu-header {
      padding: var(--spacing-md);
      justify-content: center;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      flex: 1;
      min-width: 0;
    }

    .side-menu.collapsed .logo-container {
      flex: none;
      justify-content: center;
      width: 100%;
    }

    .logo-text {
      color: var(--text-inverse);
      font-size: 1.25rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      transition: opacity var(--transition-base), width var(--transition-base);
    }

    .logo-text.hidden {
      width: 0;
      opacity: 0;
    }

    .toggle-button {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: var(--text-sidebar);
      cursor: pointer;
      padding: var(--spacing-sm);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      transition: all var(--transition-base);
      flex-shrink: 0;
    }

    .side-menu.collapsed .toggle-button {
      position: absolute;
      top: var(--spacing-md);
      right: var(--spacing-sm);
    }

    .side-menu.collapsed.rtl .toggle-button {
      right: auto;
      left: var(--spacing-sm);
    }

    .toggle-button:hover {
      background: rgba(255, 255, 255, 0.15);
      color: var(--text-sidebar-active);
    }

    .toggle-icon {
      font-size: 1rem;
      transition: transform var(--transition-base);
      display: inline-block;
    }

    /* RTL: Arrow points left when expanded, right when collapsed */
    .side-menu.rtl:not(.collapsed) .toggle-icon {
      transform: rotate(180deg);
    }

    /* LTR: Arrow points right when collapsed */
    .side-menu:not(.rtl).collapsed .toggle-icon {
      transform: rotate(180deg);
    }

    /* RTL collapsed: Arrow points left */
    .side-menu.rtl.collapsed .toggle-icon {
      transform: rotate(0deg);
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-inverse);
      font-weight: 700;
      font-size: 1.25rem;
      flex-shrink: 0;
    }


    /* Navigation */
    .side-menu-nav {
      flex: 1;
      overflow-y: auto;
      padding: var(--spacing-md) 0;
    }

    .menu-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .menu-item {
      margin: 0;
    }

    .menu-link {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md) var(--spacing-lg);
      color: var(--text-sidebar);
      text-decoration: none;
      transition: all var(--transition-base);
      height: var(--sidebar-item-height);
      position: relative;
    }

    .menu-link:hover {
      background-color: rgba(255, 255, 255, 0.05);
      color: var(--text-sidebar-active);
    }

    .menu-link.active {
      background-color: rgba(255, 255, 255, 0.1);
      color: var(--text-sidebar-active);
      font-weight: 600;
    }

    .menu-link.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background-color: var(--color-primary);
    }

    .side-menu.rtl .menu-link.active::before {
      left: auto;
      right: 0;
    }

    .menu-icon {
      font-size: 1.25rem;
      width: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .menu-label {
      font-size: 0.9375rem;
      white-space: nowrap;
      overflow: hidden;
      transition: opacity var(--transition-base), width var(--transition-base);
    }

    .menu-label.hidden {
      width: 0;
      opacity: 0;
    }

    /* Collapsed state adjustments */
    .side-menu.collapsed .menu-link {
      justify-content: center;
      padding: var(--spacing-md);
    }

    .side-menu.collapsed .menu-link.active::before {
      width: 2px;
    }

    /* Footer */
    .side-menu-footer {
      padding: var(--spacing-md) var(--spacing-lg);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .side-menu-footer.collapsed {
      padding: var(--spacing-md);
      display: flex;
      justify-content: center;
    }

    /* Scrollbar Styling */
    .side-menu-nav::-webkit-scrollbar {
      width: 6px;
    }

    .side-menu-nav::-webkit-scrollbar-track {
      background: transparent;
    }

    .side-menu-nav::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
    }

    .side-menu-nav::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  `]
})
export class SideMenuComponent {
  protected readonly languageService = inject(LanguageService);
  protected readonly sidebarService = inject(SidebarService);

  /**
   * Toggle sidebar collapsed state
   */
  toggleSidebar(): void {
    this.sidebarService.toggle();
  }

  /**
   * Menu items configuration
   * Add new menu items here following the same structure
   */
  protected readonly menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: '📊',
      route: '/dashboard',
      translationKey: 'menu.dashboard'
    },
    {
      label: 'Reservations',
      icon: '📅',
      route: '/reservations',
      translationKey: 'menu.reservations'
    },
    {
      label: 'Patients',
      icon: '👥',
      route: '/patients',
      translationKey: 'menu.patients'
    },
    {
      label: 'Employees',
      icon: '👤',
      route: '/employees',
      translationKey: 'menu.employees'
    }
  ];
}

