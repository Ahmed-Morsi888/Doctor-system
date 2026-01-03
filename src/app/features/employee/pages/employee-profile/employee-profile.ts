import { Component, computed, OnInit, inject, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { form, Field, required, email } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LanguageService } from '../../../../core/services';
import { employees } from '../../data-access/data/employee';
import { Employee, EmployeeRole } from '../../data-access/models/employee.interface';

/**
 * Employee Profile Page
 *
 * Displays comprehensive employee information with tabs for:
 * - Information (Personal, Professional)
 * - Schedule (for doctors/receptionists)
 * - Performance (reviews, metrics)
 * - Documents
 */
@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [
    CommonModule,
    Field,
    TranslocoModule,
    ButtonModule,
    TagModule,
    AvatarModule,
    ToastModule,
  ],
  templateUrl: './employee-profile.html',
  styleUrl: './employee-profile.css',
  providers: [MessageService],
})
export class EmployeeProfile implements OnInit {
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  protected readonly languageService = inject(LanguageService);
  private readonly t = inject(TranslocoService);

  readonly id = input<string>();
  protected readonly employee = computed<Employee | undefined>(() =>
    employees.find((employee) => employee.id === this.id())
  );

  // Active tab
  protected readonly activeTab = signal<'information' | 'schedule' | 'performance' | 'documents'>('information');

  // Edit mode
  protected readonly isEditMode = signal(false);

  // Form model signal for Angular 21 Signal Forms
  protected readonly employeeModel = signal({
    name: '',
    email: '',
    phoneNumber: '',
    role: 'Receptionist' as EmployeeRole,
    department: '',
    specialization: '',
    hireDate: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  // Signal form with validation
  protected readonly employeeForm = form(this.employeeModel, (schemaPath) => {
    required(schemaPath.name);
    required(schemaPath.email);
    email(schemaPath.email);
    required(schemaPath.phoneNumber);
  });

  // Role options for dropdown (with translated labels)
  protected readonly roleOptions = computed<Array<{ label: string; value: EmployeeRole }>>(() => [
    { label: this.t.translate('employee.roles.doctor'), value: 'Doctor' as EmployeeRole },
    { label: this.t.translate('employee.roles.receptionist'), value: 'Receptionist' as EmployeeRole },
  ]);

  // Status options (with translated labels)
  protected readonly statusOptions = computed<Array<{ label: string; value: 'Active' | 'Inactive' }>>(() => [
    { label: this.t.translate('employee.status.active'), value: 'Active' as 'Active' | 'Inactive' },
    { label: this.t.translate('employee.status.inactive'), value: 'Inactive' as 'Active' | 'Inactive' },
  ]);

  ngOnInit(): void {
    console.log('employee profile', this.id());
    if (!this.employee()) {
      // Employee not found, redirect back to list
      this.router.navigate(['/employees']);
      return;
    }

    // Initialize form with employee data
    this.initializeForm();
  }

  /**
   * Initialize the signal form with employee data
   */
  private initializeForm(): void {
    const employee = this.employee();
    if (!employee) return;

    this.employeeModel.set({
      name: employee.name || '',
      email: employee.email || '',
      phoneNumber: employee.phoneNumber || '',
      role: employee.role || 'Receptionist',
      department: employee.department || '',
      specialization: employee.specialization || '',
      hireDate: employee.hireDate || '',
      status: employee.status || 'Active',
    });
  }

  /**
   * Set active tab
   */
  setActiveTab(tab: 'information' | 'schedule' | 'performance' | 'documents'): void {
    this.activeTab.set(tab);
  }

  /**
   * Toggle edit mode
   */
  toggleEditMode(): void {
    if (this.isEditMode()) {
      // Cancel edit - reset form to original values
      this.initializeForm();
    }
    this.isEditMode.set(!this.isEditMode());
  }

  /**
   * Save employee data
   */
  saveEmployee(): void {
    // Check form validity using signal form
    if (!this.employeeForm().valid()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields correctly.',
      });
      return;
    }

    const formValue = this.employeeModel();
    const employee = this.employee();
    if (!employee) return;

    // Update employee data in the array
    const employeeIndex = employees.findIndex((e) => e.id === employee.id);
    if (employeeIndex !== -1) {
      employees[employeeIndex] = {
        ...employees[employeeIndex],
        name: formValue.name,
        email: formValue.email,
        phoneNumber: formValue.phoneNumber,
        role: formValue.role,
        department: formValue.department,
        specialization: formValue.specialization,
        hireDate: formValue.hireDate,
        status: formValue.status,
      };

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Employee information updated successfully.',
      });

      // Exit edit mode
      this.isEditMode.set(false);
    }
  }

  /**
   * Cancel editing
   */
  cancelEdit(): void {
    this.initializeForm();
    this.isEditMode.set(false);
  }

  /**
   * Navigate back to employee list
   */
  goBack(): void {
    this.router.navigate(['/employees']);
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
}
