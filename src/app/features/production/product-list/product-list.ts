import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../api/product.service';
import { Product } from '../../../api/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrls: []
})
export class ProductList implements OnInit {

  private productService = inject(ProductService);

  // Signals
  products = signal<Product[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading.set(true);
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          // Remove from UI immediately without refreshing
          this.products.update(current => current.filter(p => p.id !== id));
        },
        error: (err) => alert('Could not delete product.')
      });
    }
  }
}