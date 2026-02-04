import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../api/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrls: []
})
export class ProductForm implements OnInit {
  
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Matches the Java DTO: ProductRequest
  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    productionTime: [60, [Validators.required, Validators.min(1)]], // Default 60 mins
    cost: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]]
  });

  isSubmitting = signal(false);
  isEditMode = signal(false);
  currentId: number | null = null;
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.currentId = Number(id);
      this.loadData(this.currentId);
    }
  }

  loadData(id: number) {
    this.form.disable();
    this.productService.getById(id).subscribe({
      next: (data) => {
        this.form.patchValue(data);
        this.form.enable();
      },
      error: () => {
        this.errorMessage.set('Could not load product.');
        this.form.enable();
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    
    this.isSubmitting.set(true);
    const data = this.form.value;

    if (this.isEditMode() && this.currentId) {
      this.productService.update(this.currentId, data).subscribe({
        next: () => this.router.navigate(['/production/products']),
        error: (err) => this.handleError(err)
      });
    } else {
      this.productService.create(data).subscribe({
        next: () => this.router.navigate(['/production/products']),
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleError(err: any) {
    console.error(err);
    this.errorMessage.set('Failed to save product. Check backend logs.');
    this.isSubmitting.set(false);
  }
}