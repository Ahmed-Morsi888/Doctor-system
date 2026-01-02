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
    <div class="flex min-h-screen w-screen max-w-screen overflow-x-hidden bg-slate-50" [class.rtl]="languageService.isRTL()">
      <!-- Side Menu -->
      <app-side-menu></app-side-menu>

      <!-- Main Content Area -->
      <div
        class="flex min-w-0 flex-1 flex-col transition-[margin-left,margin-right,width] duration-200 ease-in-out max-md:ml-0 rtl:max-md:mr-0"
        [style.margin-left]="languageService.isRTL() ? '0' : (sidebarService.isCollapsed() ? '80px' : 'clamp(250px, 30vw, 350px)')"
        [style.margin-right]="languageService.isRTL() ? (sidebarService.isCollapsed() ? '80px' : 'clamp(250px, 30vw, 350px)') : '0'"
        [style.width]="sidebarService.isCollapsed() ? 'calc(100vw - 80px)' : 'calc(100vw - clamp(250px, 30vw, 350px))'"
      >
        <!-- Page Content -->
        <main class="min-w-0 flex-1 overflow-y-auto bg-slate-50 p-0">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
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

