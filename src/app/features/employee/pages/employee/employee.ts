import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { PaginatorModule } from 'primeng/paginator';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DrawerModule } from 'primeng/drawer';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LanguageService } from '../../../../core/services';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { employees } from '../../data-access/data/employee';
import { Employee, PaginationEvent, EmployeeRole } from '../../data-access/models/employee.interface';
import { Router } from '@angular/router';

/**
 * Employee Management Page
 *
 * Manages system employees including receptionists and doctors.
 * Features:
 * - Employee table with search and pagination
 * - Filter by role (Receptionist/Doctor)
 * - Add/Edit/Delete employees
 * - Status management
 */
@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslocoModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    TagModule,
    AvatarModule,
    PaginatorModule,
    IconFieldModule,
    InputIconModule,
    DrawerModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  templateUrl: './employee.html',
  styleUrl: './employee.css',
  providers: [ConfirmationService, MessageService],
})
export class EmployeePage implements OnInit, OnDestroy {
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  t = inject(TranslocoService);
  languageService = inject(LanguageService);
  router = inject(Router);

  // Drawer position based on language direction
  drawerPosition = computed(() => (this.languageService.isRTL() ? 'left' : 'right'));

  // Drawer visibility
  visible = signal(false);
  newEmployeeVisible = signal(false);
  editEmployeeVisible = signal(false);

  searchValue = signal('');
  selectedRole = signal<EmployeeRole | 'All'>('All');

  // RxJS Subject for debounced search
  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();
  private readonly paginationSubject = new Subject<PaginationEvent>();

  // Public observable for pagination changes
  readonly pagination$ = this.paginationSubject.asObservable();

  // Table data
  employees = signal<Employee[]>(employees);

  // Pagination
  first = signal(0);
  rows = signal(10);
  totalRecords = signal(employees.length);

  // Filtered employees based on search and role
  filteredEmployees = signal<Employee[]>(this.employees());

  // Role options for filter
  readonly roleOptions: Array<{ label: string; value: EmployeeRole | 'All' }> = [
    { label: 'All', value: 'All' },
    { label: 'Doctor', value: 'Doctor' },
    { label: 'Receptionist', value: 'Receptionist' },
  ];

  /**
   * Initialize component and set up debounced search and pagination
   */
  ngOnInit(): void {
    // Set up debounced search subscription
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((searchTerm) => {
        this.performSearch(searchTerm);
      });

    this.pagination$
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        console.log('Pagination changed:', event);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handle search input with debouncing
   */
  onSearchInput(value: string): void {
    this.searchValue.set(value);
    this.searchSubject.next(value);
  }

  /**
   * Perform search filtering
   */
  private performSearch(searchTerm: string): void {
    const search = searchTerm.toLowerCase().trim();
    const roleFilter = this.selectedRole();

    let filtered = this.employees();

    // Apply role filter
    if (roleFilter !== 'All') {
      filtered = filtered.filter((emp) => emp.role === roleFilter);
    }

    // Apply search filter
    if (search) {
      filtered = filtered.filter(
        (employee) =>
          employee.name.toLowerCase().includes(search) ||
          employee.id.toLowerCase().includes(search) ||
          employee.email.toLowerCase().includes(search) ||
          employee.phoneNumber.toLowerCase().includes(search)
      );
    }

    this.filteredEmployees.set(filtered);
    this.totalRecords.set(filtered.length);
  }

  /**
   * Handle role filter change
   */
  onRoleFilterChange(role: EmployeeRole | 'All'): void {
    this.selectedRole.set(role);
    this.performSearch(this.searchValue());
  }

  /**
   * Clear search
   */
  clearSearch(): void {
    this.searchValue.set('');
    this.searchSubject.next('');
  }

  /**
   * Handle pagination change
   */
  onPageChange(event: any): void {
    this.first.set(event.first);
    this.rows.set(event.rows);
    const paginationEvent: PaginationEvent = {
      first: event.first,
      rows: event.rows,
      page: event.page || Math.floor(event.first / event.rows),
    };
    this.paginationSubject.next(paginationEvent);
  }

  /**
   * Get status severity for PrimeNG Tag
   */
  getStatusSeverity(status: string): 'success' | 'secondary' {
    return status === 'Active' ? 'success' : 'secondary';
  }

  /**
   * Get role severity for PrimeNG Tag
   */
  getRoleSeverity(role: EmployeeRole): 'info' | 'warn' {
    return role === 'Doctor' ? 'info' : 'warn';
  }

  /**
   * Confirm delete employee
   */
  confirmDelete(employee: Employee): void {
    this.confirmationService.confirm({
      message: this.t.translate('employee.deleteConfirmation'),
      header: this.t.translate('employee.deleteConfirmationHeader'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: this.t.translate('employee.confirmed'),
          detail: this.t.translate('employee.recordDeleted'),
        });
        this.onDelete(employee);
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.t.translate('employee.rejected'),
          detail: this.t.translate('employee.youHaveRejected'),
        });
      },
    });
  }

  /**
   * Delete employee
   */
  onDelete(employee: Employee): void {
    this.employees.set(this.employees().filter((e) => e.id !== employee.id));
    this.performSearch(this.searchValue());
    this.totalRecords.set(this.employees().length);
  }

  /**
   * Navigate to employee profile
   */
  onEmployeeClick(employeeId: string): void {
    this.router.navigate(['/employees', employeeId]);
  }
}
