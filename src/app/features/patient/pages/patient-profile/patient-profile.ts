import { Component, computed, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { form, Field, required, email } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LanguageService } from '../../../../core/services';
import { patients } from '../../data-access/data/patient';
import { Patient } from '../../data-access/models/patient.interface';

/**
 * Patient Profile Page
 *
 * Displays comprehensive patient information with tabs for:
 * - Information (Personal, Medical, Insurance)
 * - Check-up History
 * - Digital Notes
 * - Billing History
 */
@Component({
  selector: 'app-patient-profile',
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
  templateUrl: './patient-profile.html',
  styleUrl: './patient-profile.css',
  providers: [MessageService],
})
export class PatientProfile implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  protected readonly languageService = inject(LanguageService);

  protected readonly patientId = computed(() => this.route.snapshot.paramMap.get('patientId') || '');
  protected readonly patient = computed<Patient | undefined>(() =>
    patients.find(patient => patient.id === this.patientId())
  );

  // Active tab
  protected readonly activeTab = signal<'information' | 'checkup' | 'notes' | 'billing'>('information');

  // Edit mode
  protected readonly isEditMode = signal(false);

  // Form model signal
  protected readonly patientModel = signal({
    name: '',
    gender: 'Male' as 'Male' | 'Female',
    phoneNumber: '',
    assignedDentist: '',
    dateOfBirth: '',
    address: '',
    email: '',
    referredBy: '',
    reasonForVisit: '',
    medicalConditions: '',
    allergies: '',
    currentMedications: '',
    dentalHistory: '',
    insuranceProvider: '',
    policyNumber: '',
  });

  // Signal form with validation
  protected readonly patientForm = form(this.patientModel, (schemaPath) => {
    required(schemaPath.name);
    required(schemaPath.phoneNumber);
    email(schemaPath.email);
  });

  // Gender options for dropdown
  protected readonly genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];

  ngOnInit(): void {
    if (!this.patient()) {
      // Patient not found, redirect back to list
      this.router.navigate(['/patients']);
      return;
    }

    // Initialize form with patient data
    this.initializeForm();
  }

  /**
   * Initialize the signal form with patient data
   */
  private initializeForm(): void {
    const patient = this.patient();
    if (!patient) return;

    this.patientModel.set({
      name: patient.name || '',
      gender: patient.gender || 'Male',
      phoneNumber: patient.phoneNumber || '',
      assignedDentist: patient.assignedDentist?.name || '',
      dateOfBirth: patient.dateOfBirth || '',
      address: patient.address || '',
      email: patient.email || '',
      referredBy: patient.referredBy || '',
      reasonForVisit: patient.reasonForVisit || '',
      medicalConditions: patient.medicalConditions || '',
      allergies: patient.allergies || '',
      currentMedications: patient.currentMedications || '',
      dentalHistory: patient.dentalHistory || '',
      insuranceProvider: patient.insuranceProvider || '',
      policyNumber: patient.policyNumber || '',
    });
  }

  /**
   * Set active tab
   */
  setActiveTab(tab: 'information' | 'checkup' | 'notes' | 'billing'): void {
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
   * Save patient data
   */
  savePatient(): void {
    // Check form validity using signal form
    // Call the form as a function to get FieldState, then access valid()
    console.log('patientForm', this.patientForm().value());
    if (!this.patientForm().valid()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields correctly.',
      });
      return;
    }

    const formValue = this.patientModel();
    const patient = this.patient();
    if (!patient) return;

    // Update patient data in the array
    const patientIndex = patients.findIndex((p) => p.id === patient.id);
    if (patientIndex !== -1) {
      patients[patientIndex] = {
        ...patients[patientIndex],
        name: formValue.name,
        gender: formValue.gender,
        phoneNumber: formValue.phoneNumber,
        assignedDentist: formValue.assignedDentist
          ? { name: formValue.assignedDentist }
          : null,
        dateOfBirth: formValue.dateOfBirth,
        address: formValue.address,
        email: formValue.email,
        referredBy: formValue.referredBy,
        reasonForVisit: formValue.reasonForVisit,
        medicalConditions: formValue.medicalConditions,
        allergies: formValue.allergies,
        currentMedications: formValue.currentMedications,
        dentalHistory: formValue.dentalHistory,
        insuranceProvider: formValue.insuranceProvider,
        policyNumber: formValue.policyNumber,
      };

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Patient information updated successfully.',
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
   * Navigate back to patient list
   */
  goBack(): void {
    this.router.navigate(['/patients']);
  }

  /**
   * Get status severity for PrimeNG Tag
   */
  getStatusSeverity(status: string): 'success' | 'secondary' {
    return status === 'Active' ? 'success' : 'secondary';
  }
}
