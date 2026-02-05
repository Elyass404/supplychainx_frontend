import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CustomerService } from '../../../api/customer.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './customer-form.html',
  styleUrls: []
})
export class CustomerForm implements OnInit {
  
  private fb = inject(FormBuilder);
  private customerService = inject(CustomerService);
  private router = inject(Router);
  // We use route to check if we are in "Edit Mode" (do we have an ID?)
  private route = inject(ActivatedRoute); 

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required]
  });

  isSubmitting = signal(false);
  isEditMode = signal(false);
  currentId: number | null = null;
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    // Check URL for ID (e.g. /customers/5/edit)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.currentId = Number(id);
      this.loadData(this.currentId);
    }
  }

  loadData(id: number) {
    this.form.disable();
    // We assume the list view passed the data, but it's safer to fetch by ID if your backend supports it.
    // If your backend doesn't have GET /{id}, we might need to rely on the list or add that endpoint.
    // Based on your controller, you DO have @GetMapping("/{id}"), so this is perfect.
    this.customerService.getAll().subscribe({
        next: (customers) => {
            const found = customers.find(c => c.id === id);
            if(found) {
                this.form.patchValue(found);
            }
            this.form.enable();
        }, 
        error: () => {
             this.errorMessage.set('Could not find customer.');
             this.form.enable();
        }
    });
    // Note: Ideally call getById(id) if you added it to service, but getAll() works for small lists.
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    const data = this.form.value;

    if (this.isEditMode() && this.currentId) {
      this.customerService.update(this.currentId, data).subscribe({
        next: () => this.router.navigate(['/delivery/customers']),
        error: (err) => this.handleError(err)
      });
    } else {
      this.customerService.create(data).subscribe({
        next: () => this.router.navigate(['/delivery/customers']),
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