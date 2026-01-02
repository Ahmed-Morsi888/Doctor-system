# Project Architecture Guide

This document outlines the architecture and folder structure for the N-Brite project.

## 📁 Folder Structure

```
src/
├── app/
│   ├── core/                    # Singleton services & global logic
│   │   ├── services/            # Application-wide singleton services
│   │   ├── interceptors/        # HTTP interceptors (auth, error handling)
│   │   └── guards/              # Route guards (auth, authorization)
│   │
│   ├── shared/                  # Reusable UI components & tools
│   │   ├── components/          # Shared components used across features
│   │   ├── directives/          # Shared directives
│   │   ├── pipes/               # Shared pipes for data transformation
│   │   └── ui/                  # Design system atoms (buttons, inputs, etc.)
│   │
│   ├── layout/                  # Global shell (header / sidebar / footer)
│   │   └── main-layout.component.ts
│   │
│   ├── features/                # Self-contained feature modules
│   │   ├── auth/               # Authentication feature
│   │   ├── users/              # Users management feature
│   │   ├── roles/              # Roles management feature
│   │   ├── dashboard/          # Dashboard feature
│   │   └── ...                 # Other features
│   │
│   ├── store/                   # Global state management
│   │
│   ├── config/                  # Application configuration
│   │   └── app.config.ts
│   │
│   ├── environments/            # Environment configurations
│   │   ├── environment.ts      # Development
│   │   └── environment.prod.ts # Production
│   │
│   ├── app.ts                   # Root component
│   ├── app.routes.ts            # Application routes
│   ├── app.html                 # Root template
│   └── app.css                  # Root styles
│
├── assets/                      # Static assets (images, fonts, etc.)
├── index.html
├── main.ts                      # Application bootstrap
└── styles.css                   # Global styles
```

## 🎯 Directory Purposes

### **`core/`** - Singleton services & global logic
- **Purpose**: Application-wide services that should only have one instance
- **Contains**:
  - `services/` - Singleton services (auth, logging, etc.)
  - `interceptors/` - HTTP interceptors for global request/response handling
  - `guards/` - Route guards for authentication and authorization

**Example:**
```typescript
// core/interceptors/auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Add auth token to all requests
  return next(req);
};
```

### **`shared/`** - Reusable UI components & tools
- **Purpose**: Components, directives, pipes, and UI atoms used across multiple features
- **Contains**:
  - `components/` - Shared components (modals, cards, etc.)
  - `directives/` - Shared directives (click-outside, auto-focus, etc.)
  - `pipes/` - Shared pipes (currency, date-format, etc.)
  - `ui/` - Design system atoms (buttons, inputs, cards - smallest reusable UI blocks)

**Example:**
```typescript
// shared/ui/button/button.component.ts
@Component({
  selector: 'app-button',
  standalone: true,
  template: `...`
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' = 'primary';
}
```

### **`layout/`** - Global shell
- **Purpose**: Layout components that wrap the entire application
- **Contains**: Header, sidebar, footer, main layout wrapper

**Example:**
```typescript
// layout/main-layout.component.ts
@Component({
  selector: 'app-main-layout',
  template: `
    <header>...</header>
    <aside>...</aside>
    <main><router-outlet></router-outlet></main>
    <footer>...</footer>
  `
})
export class MainLayoutComponent {}
```

### **`features/`** - Self-contained feature modules
- **Purpose**: Independent feature modules that can be developed in isolation
- **Structure**: Each feature follows the layered architecture:
  ```
  features/
    └── feature-name/
        ├── api/          # API layer - HTTP requests only
        ├── services/     # Business logic layer
        ├── store/        # State management
        ├── components/   # Feature-specific UI components
        ├── pages/        # Smart page components
        ├── hooks/        # Feature-specific hooks/composables
        ├── utils/        # Feature-specific utilities
        └── index.ts      # Feature barrel export
  ```

**Example Features:**
- `auth/` - Authentication (login, register, password reset)
- `users/` - User management (CRUD operations)
- `roles/` - Role management
- `dashboard/` - Dashboard with widgets and charts

### **`store/`** - Global state management
- **Purpose**: Application-wide state that spans multiple features
- **Usage**: Shared state, global settings, user preferences

### **`config/`** - Application configuration
- **Purpose**: Application-wide configuration files
- **Contains**: `app.config.ts` with providers and configuration

### **`environments/`** - Environment configurations
- **Purpose**: Environment-specific settings (API URLs, feature flags, etc.)
- **Files**:
  - `environment.ts` - Development settings
  - `environment.prod.ts` - Production settings

## 🔄 Feature Architecture (Within Each Feature)

Each feature follows a strict layered architecture:

### Layer Communication Flow

```
Pages (Smart Components)
    ↓
Store (State Management)
    ↓
Services (Business Logic)
    ↓
API (HTTP Requests)
    ↓
Backend
```

### Layer Rules

1. **API Layer** (`api/`)
   - ✅ Makes HTTP requests only
   - ❌ No business logic
   - ❌ No transformations
   - ❌ No state management

2. **Services Layer** (`services/`)
   - ✅ Business logic
   - ✅ Data transformation
   - ✅ Orchestration
   - ✅ Calls API layer
   - ❌ No state management
   - ❌ No UI logic

3. **Store Layer** (`store/`)
   - ✅ State management
   - ✅ Calls Services or API
   - ✅ Exposes state to components
   - ❌ No business logic

4. **Components Layer** (`components/`)
   - ✅ Pure presentational components
   - ✅ Receives data via props
   - ✅ Emits events via callbacks
   - ❌ No API calls
   - ❌ No store access
   - ❌ No business logic

5. **Pages Layer** (`pages/`)
   - ✅ Smart components/orchestrators
   - ✅ Connects to Store and Services
   - ✅ Handles routing
   - ✅ Passes data to components
   - ❌ No business logic
   - ❌ No direct API calls

## 📝 Best Practices

1. **Use Barrel Exports**: Always create `index.ts` files for clean imports
2. **Feature Isolation**: Features should be independent and self-contained
3. **Shared Code**: Put reusable code in `shared/` or `core/`
4. **Environment Config**: Use environment files for configuration
5. **Type Safety**: Use TypeScript interfaces for all data structures

## 🚀 Creating a New Feature

1. Create feature folder: `app/features/your-feature-name/`
2. Create layer folders: `api/`, `services/`, `store/`, `components/`, `pages/`, `hooks/`, `utils/`
3. Build in order:
   - Define types/interfaces
   - Build API layer
   - Build Services layer
   - Build Store layer
   - Build Components
   - Build Pages
   - Connect everything
4. Export from `features/index.ts`

## 📚 Example: Users Feature

See `app/features/users/` for a complete example implementation following this architecture.

## 🔗 Import Examples

```typescript
// Import from core
import { authInterceptor } from '@/app/core/interceptors';
import { authGuard } from '@/app/core/guards';

// Import from shared
import { ButtonComponent } from '@/app/shared/ui/button';

// Import from features
import { UsersStore, CreateUserService } from '@/app/features/users';

// Import from layout
import { MainLayoutComponent } from '@/app/layout';

// Import environment
import { environment } from '@/app/environments';
```

---

**This architecture ensures:**
- ✅ Clear separation of concerns
- ✅ Reusable components
- ✅ Independent feature development
- ✅ Scalable structure
- ✅ Easy maintenance

