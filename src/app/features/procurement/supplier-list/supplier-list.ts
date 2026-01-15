import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // 
import { SupplierService } from '../../../api/supplier.service'; 
import { Supplier } from '../../../api/supplier.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './supplier-list.html',
  styleUrls: [] 
})
export class SupplierList implements OnInit {
  
  private supplierService = inject(SupplierService);

  //Signals to hold our data
  suppliers = signal<Supplier[]>([]);
  totalItems = signal<number>(0);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.isLoading.set(true);
    
    // We now expect a simple array (Supplier[])
    this.supplierService.getSuppliers(0, 10).subscribe({
      next: (data) => {
        console.log('🔥 DATA FROM BACKEND:', data); //to be shown in the backend 

        // Since 'data' IS the array, we assign it directly
        this.suppliers.set(data);
        this.totalItems.set(data.length); // We count the array length
        
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load suppliers', err);
        this.error.set('Could not load suppliers.');
        this.isLoading.set(false);
      }
    });
  }
}