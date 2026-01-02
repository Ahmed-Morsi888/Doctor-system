import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),

    providePrimeNG({
      theme: {
        preset: 'my',
        options: {
          prefix: 'p',
          darkModeSelector: 'system',
          cssLayer: false,
          overlayAppendTo: 'body',
          zIndex: {
            modal: 1100,    // dialog, sidebar
            overlay: 1000,  // dropdown, overlaypanel
            menu: 1000,     // overlay menus
            tooltip: 1100   // tooltip
          },
          options: {
            cssLayer: {
              name: 'primeng',
              order: 'app-styles, primeng, another-css-library'
            }
          }

        }
      },
    }),
  ]
};
