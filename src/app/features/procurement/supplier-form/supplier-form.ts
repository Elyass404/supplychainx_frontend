import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms'; 
import { Router, RouterLink } from '@angular/router';
import { SupplierService } from '../../../api/supplier.service';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  // Add ReactiveFormsModule to imports
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './supplier-form.html',
  styleUrls: []
})
export class SupplierForm {
  
  private fb = inject(FormBuilder);
  private supplierService = inject(SupplierService);
  private router = inject(Router);

  // Define the Form Structure & Rules
  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    rating: [10, [Validators.required, Validators.min(0), Validators.max(10)]],
    leadTime: [1, [Validators.required, Validators.min(1)]]
  });

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  // The Action when user clicks "Save"
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Show red errors on all fields
      return;
    }

    this.isSubmitting.set(true);

    // Send data to Backend
    this.supplierService.createSupplier(this.form.value).subscribe({
      next: () => {
        // Success! Go back to the list
        console.log('Supplier created successfully');
        this.router.navigate(['/procurement/suppliers']);
      },
      error: (err) => {
        console.error('Error creating supplier', err);
        this.errorMessage.set('Failed to create supplier. Server might be down.');
        this.isSubmitting.set(false);
      }
    });
  }
}