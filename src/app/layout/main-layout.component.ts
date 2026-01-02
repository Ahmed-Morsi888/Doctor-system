/**
 * Main Layout Component
 *
 * Global shell component that wraps the entire application
 * Contains header, sidebar, footer, and main content area
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="main-layout">
      <header class="header">
        <h1>Brite</h1>
        <!-- Header content -->
      </header>

      <div class="layout-body">
        <aside class="sidebar">
          <!-- Sidebar navigation -->
        </aside>

        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>

      <footer class="footer">
        <!-- Footer content -->
      </footer>
    </div>
  `,
  styles: [`
    .main-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .header {
      background-color: #333;
      color: white;
      padding: 1rem;
    }
    .layout-body {
      display: flex;
      flex: 1;
    }
    .sidebar {
      width: 250px;
      background-color: #f5f5f5;
      padding: 1rem;
    }
    .main-content {
      flex: 1;
      padding: 2rem;
    }
    .footer {
      background-color: #333;
      color: white;
      padding: 1rem;
      text-align: center;
    }
  `]
})
export class MainLayoutComponent { }

