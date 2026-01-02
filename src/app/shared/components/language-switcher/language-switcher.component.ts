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
      class="flex w-full items-center gap-2 transition-[flex-direction,gap] duration-200 ease-in-out"
      [class.flex-col]="isCollapsed"
      [class.items-stretch]="isCollapsed"
      [class.gap-1]="isCollapsed"
      [attr.dir]="languageService.isRTL() ? 'rtl' : 'ltr'"
      [class.flex-row-reverse]="languageService.isRTL() && !isCollapsed"
    >
      @for (lang of languages; track lang.code) {
        <button
          type="button"
          class="w-full min-w-[50px] rounded border border-white/20 bg-white/10 px-4 py-2 text-center text-sm font-medium text-slate-300 transition-all duration-200 hover:border-white/30 hover:bg-white/15 focus:outline-none focus:outline-2 focus:outline-blue-600 focus:outline-offset-2"
          [class.flex-none]="isCollapsed"
          [class.min-w-0]="isCollapsed"
          [class.p-2]="isCollapsed"
          [class.text-xs]="isCollapsed"
          [class.bg-blue-600]="languageService.currentLanguage() === lang.code"
          [class.border-blue-600]="languageService.currentLanguage() === lang.code"
          [class.text-white]="languageService.currentLanguage() === lang.code"
          [class.hover:bg-blue-800]="languageService.currentLanguage() === lang.code"
          [class.hover:border-blue-800]="languageService.currentLanguage() === lang.code"
          (click)="switchLanguage(lang.code)"
          [attr.aria-label]="lang.label"
          [attr.aria-pressed]="languageService.currentLanguage() === lang.code"
          [title]="isCollapsed ? lang.label : ''"
        >
          {{ lang.label }}
        </button>
      }
    </div>
  `
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
