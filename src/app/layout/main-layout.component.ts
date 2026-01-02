/**
 * Main Layout Component
 *
 * Global shell component that wraps the entire application.
 * Contains header, sidebar, and main content area.
 *
 * Design matches the provided image with:
 * - Fixed sidebar on the left
 * - Header at the top
 * - Main content area with proper spacing
 * - Uses CSS variables for all styling
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { SideMenuComponent } from '../shared/components/side-menu/side-menu.component';
import { LanguageService, SidebarService } from '../core/services';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TranslocoModule, SideMenuComponent],
  template: `
    <div class="main-layout" [class.rtl]="languageService.isRTL()">
      <!-- Side Menu -->
      <app-side-menu></app-side-menu>

      <!-- Main Content Area -->
      <div
        class="main-content-wrapper"
        [class.sidebar-collapsed]="sidebarService.isCollapsed()"
      >
        <!-- Page Content -->
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .main-layout {
      display: flex;
      min-height: 100vh;
      width: 100vw;
      max-width: 100vw;
      background-color: var(--bg-secondary);
      overflow-x: hidden;
    }

    .main-content-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: var(--sidebar-width);
      min-width: 0; /* Allow flex item to shrink */
      transition: margin-left var(--transition-base), width var(--transition-base);
      width: calc(100vw - var(--sidebar-width));
      max-width: none;
    }

    .main-content-wrapper.sidebar-collapsed {
      margin-left: var(--sidebar-width-collapsed);
      width: calc(100vw - var(--sidebar-width-collapsed));
      max-width: none;
    }

    .main-layout.rtl .main-content-wrapper {
      margin-left: 0;
      margin-right: var(--sidebar-width);
      transition: margin-right var(--transition-base), width var(--transition-base);
      width: calc(100vw - var(--sidebar-width));
      max-width: none;
    }

    .main-layout.rtl .main-content-wrapper.sidebar-collapsed {
      margin-right: var(--sidebar-width-collapsed);
      width: calc(100vw - var(--sidebar-width-collapsed));
      max-width: none;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      overflow-y: auto;
      background-color: var(--bg-secondary);
      width: 100%;
      min-width: 0;
      padding: 0;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .main-content-wrapper {
        margin-left: 0;
      }

      .main-layout.rtl .main-content-wrapper {
        margin-right: 0;
      }
    }
  `]
})
export class MainLayoutComponent {
  protected readonly languageService = inject(LanguageService);
  protected readonly sidebarService = inject(SidebarService);

  /**
   * Toggle sidebar collapsed state
   */
  toggleSidebar(): void {
    this.sidebarService.toggle();
  }
}

