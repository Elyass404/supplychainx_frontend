import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router'; // 🟢 Added ActivatedRoute
import { SupplierService } from '../../../api/supplier.service';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './supplier-form.html',
  styleUrls: []
})
export class SupplierForm implements OnInit {
  
  private fb = inject(FormBuilder);
  private supplierService = inject(SupplierService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); //Inject Route to read URL

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    rating: [10, [Validators.required, Validators.min(0), Validators.max(10)]],
    leadTime: [1, [Validators.required, Validators.min(1)]]
  });

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  
  // State for Edit Mode
  isEditMode = signal(false);
  currentId: number | null = null;

  ngOnInit() {
    // CHECK URL: Do we have an 'id' parameter?
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.isEditMode.set(true);
      this.currentId = Number(id);
      this.loadSupplierData(this.currentId);
    }
  }

  // Fetch data and fill the form
  loadSupplierData(id: number) {
    this.form.disable(); // Disable form while loading
    
    this.supplierService.getSupplierById(id).subscribe({
      next: (supplier) => {
        // FILL THE FORM
        this.form.patchValue(supplier);
        this.form.enable();
      },
      error: (err) => {
        console.error('Failed to load supplier', err);
        this.errorMessage.set('Could not load supplier data.');
        this.form.enable();
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    // Create or Update?
    if (this.isEditMode() && this.currentId) {
      
      // --- UPDATE MODE ---
      this.supplierService.updateSupplier(this.currentId, this.form.value).subscribe({
        next: () => {
          console.log('Updated successfully');
          this.router.navigate(['/procurement/suppliers']);
        },
        error: (err) => {
          this.handleError(err);
        }
      });

    } else {
      
      // --- CREATE MODE ---
      this.supplierService.createSupplier(this.form.value).subscribe({
        next: () => {
          console.log('Created successfully');
          this.router.navigate(['/procurement/suppliers']);
        },
        error: (err) => {
          this.handleError(err);
        }
      });
    }
  }

  private handleError(err: any) {
    console.error('Operation failed', err);
    this.errorMessage.set('Operation failed. Please check the server.');
    this.isSubmitting.set(false);
  }
}

//comment
//comment
//comment
//comment