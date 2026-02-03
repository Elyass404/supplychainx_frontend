import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { RawMaterialService } from '../../../api/raw-material.service';
import { SupplierService } from '../../../api/supplier.service'; 
import { Supplier } from '../../../api/supplier.model';

@Component({
  selector: 'app-raw-material-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './raw-material-form.html',
  styleUrls: []
})
export class RawMaterialForm implements OnInit {
  
  private fb = inject(FormBuilder);
  private materialService = inject(RawMaterialService);
  private supplierService = inject(SupplierService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // The Form
  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    unit: ['', Validators.required], 
    stock: [0, [Validators.required, Validators.min(0)]],
    stockMin: [10, [Validators.required, Validators.min(1)]],
    supplierIds: [[], Validators.required] // Stores array of IDs [1, 5, ...]
  });

  // Signals for State
  isSubmitting = signal(false);
  isEditMode = signal(false);
  currentId: number | null = null;
  errorMessage = signal<string | null>(null);
  
  // List of available suppliers for the pills
  availableSuppliers = signal<Supplier[]>([]);

  ngOnInit() {
    // 1. Load the list of suppliers immediately
    this.loadSuppliers();

    // 2. Check if we are in Edit Mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.currentId = Number(id);
      this.loadMaterialData(this.currentId);
    }
  }

  loadSuppliers() {
    this.supplierService.getSuppliers(0, 100).subscribe({
      next: (data) => this.availableSuppliers.set(data),
      error: () => this.errorMessage.set('Could not load suppliers list.')
    });
  }

  loadMaterialData(id: number) {
    this.form.disable();
    this.materialService.getById(id).subscribe({
      next: (data) => {
        this.form.patchValue(data);
        this.form.enable();
      },
      error: () => {
        this.errorMessage.set('Could not load material data.');
        this.form.enable();
      }
    });
  }

  // --- PILL SELECTION LOGIC ---

  // Check if a supplier is currently selected (for styling blue vs white)
  isSupplierSelected(id: number): boolean {
    const currentIds = this.form.get('supplierIds')?.value as number[] || [];
    return currentIds.includes(id);
  }

  // Add or Remove ID from the array when clicked
  toggleSupplier(id: number) {
    const currentIds = this.form.get('supplierIds')?.value as number[] || [];
    let newIds: number[];

    if (currentIds.includes(id)) {
      // Remove it
      newIds = currentIds.filter(x => x !== id);
    } else {
      // Add it
      newIds = [...currentIds, id];
    }

    this.form.patchValue({ supplierIds: newIds });
    this.form.markAsDirty();
  }

  // --- SUBMIT ---

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const data = this.form.value;

    if (this.isEditMode() && this.currentId) {
      this.materialService.update(this.currentId, data).subscribe({
        next: () => this.router.navigate(['/procurement/raw-materials']),
        error: (err) => this.handleError(err)
      });
    } else {
      this.materialService.create(data).subscribe({
        next: () => this.router.navigate(['/procurement/raw-materials']),
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleError(err: any) {
    console.error(err);
    this.errorMessage.set('Operation failed.');
    this.isSubmitting.set(false);
  }
}