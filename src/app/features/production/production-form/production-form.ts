import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProductionOrderService } from '../../../api/production-order.service';

// Import Product Service & Model
import { ProductService } from '../../../api/product.service';
import { Product } from '../../../api/product.model';

@Component({
  selector: 'app-production-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './production-form.html',
  styleUrls: []
})
export class ProductionForm implements OnInit {
  
  private fb = inject(FormBuilder);
  private orderService = inject(ProductionOrderService);
  // Inject Product Service
  private productService = inject(ProductService); 
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup = this.fb.group({
    productId: [null, [Validators.required]], // Stores the ID (e.g., 5)
    quantity: [1, [Validators.required, Validators.min(1)]],
    startDate: [new Date().toISOString().split('T')[0]],
    status: ['PENDING']
  });

  isSubmitting = signal(false);
  isEditMode = signal(false);
  currentId: number | null = null;
  errorMessage = signal<string | null>(null);

  // Signal to store the list of products for the dropdown
  availableProducts = signal<Product[]>([]);

  ngOnInit() {
    // Load Products immediately
    this.loadProducts();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.currentId = Number(id);
      this.loadOrderData(this.currentId);
    }
  }

  // Fetch logic
  loadProducts() {
    this.productService.getAll(0, 100).subscribe({
      next: (data) => this.availableProducts.set(data),
      error: () => this.errorMessage.set('Could not load product list.')
    });
  }

  loadOrderData(id: number) {
    this.form.disable();
    this.orderService.getById(id).subscribe({
      next: (data) => {
        // 1. Patch the normal fields (quantity, status, etc.)
        this.form.patchValue(data);

      // Manually extract the Product ID from the nested object
        // "If there is a product object, grab its ID and set it to 'productId'"
        if (data.product) {
          this.form.patchValue({ productId: data.product.id });
        }

        this.form.enable();
      },
      error: () => {
        this.errorMessage.set('Could not load order details.');
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
    const formValue = this.form.value;

    const requestPayload = {
      productId: Number(formValue.productId),
      quantity: Number(formValue.quantity)
    };

    if (this.isEditMode() && this.currentId) {
      this.orderService.update(this.currentId, requestPayload).subscribe({
        next: () => this.router.navigate(['/production/orders']),
        error: (err) => this.handleError(err)
      });
    } else {
      this.orderService.create(requestPayload).subscribe({
        next: () => this.router.navigate(['/production/orders']),
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