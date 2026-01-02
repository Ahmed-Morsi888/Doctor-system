import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, Language } from '../../../core/services';

/**
 * Language Switcher Component
 *
 * A simple, reusable component for switching between languages.
 *
 * Features:
 * - Clean UI with EN/AR buttons
 * - Active language highlighting
 * - Accessible (ARIA labels)
 * - Standalone component (Angular 21 best practice)
 *
 * Usage:
 * <app-language-switcher></app-language-switcher>
 */
@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="language-switcher" 
      [attr.dir]="languageService.isRTL() ? 'rtl' : 'ltr'"
      [class.collapsed]="isCollapsed"
    >
      @for (lang of languages; track lang.code) {
        <button
          type="button"
          [class.active]="languageService.currentLanguage() === lang.code"
          (click)="switchLanguage(lang.code)"
          [attr.aria-label]="lang.label"
          [attr.aria-pressed]="languageService.currentLanguage() === lang.code"
          class="lang-button"
          [title]="isCollapsed ? lang.label : ''"
        >
          {{ lang.label }}
        </button>
      }
    </div>
  `,
  styles: [`
    .language-switcher {
      display: flex;
      gap: var(--spacing-sm);
      align-items: center;
      width: 100%;
      transition: flex-direction var(--transition-base), gap var(--transition-base);
    }

    .language-switcher.collapsed {
      flex-direction: column;
      gap: var(--spacing-xs);
      align-items: stretch;
    }

    .lang-button {
      flex: 1;
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-sidebar);
      cursor: pointer;
      border-radius: var(--radius-sm);
      transition: all var(--transition-base);
      font-size: 0.875rem;
      font-weight: 500;
      min-width: 50px;
      width: 100%;
      text-align: center;
    }

    .language-switcher.collapsed .lang-button {
      flex: none;
      min-width: auto;
      width: 100%;
      padding: var(--spacing-sm);
      font-size: 0.75rem;
    }

    .lang-button:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .lang-button:focus {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    .lang-button.active {
      background: var(--color-primary);
      color: var(--text-inverse);
      border-color: var(--color-primary);
    }

    .lang-button.active:hover {
      background: var(--color-primary-dark);
      border-color: var(--color-primary-dark);
    }

    /* RTL support - only when not collapsed */
    .language-switcher[dir="rtl"]:not(.collapsed) {
      flex-direction: row-reverse;
    }

    /* RTL collapsed - keep column layout */
    .language-switcher[dir="rtl"].collapsed {
      flex-direction: column;
    }
  `]
})
export class LanguageSwitcherComponent {
  protected readonly languageService = inject(LanguageService);
  
  // Input to receive collapsed state from parent
  @Input() isCollapsed = false;

  protected readonly languages: Array<{ code: Language; label: string }> = [
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'AR' }
  ];

  /**
   * Switch to the selected language
   * This will:
   * - Update Transloco active language
   * - Update HTML dir/lang attributes
   * - Save preference to localStorage
   * - Trigger re-render of all translated content
   */
  switchLanguage(language: Language): void {
    if (this.languageService.currentLanguage() === language) {
      return; // Already active
    }

    this.languageService.setLanguage(language);
  }
}
