import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductionOrderService } from '../../../api/production-order.service';
import { ProductionOrder, OrderStatus } from '../../../api/production-order.model';

@Component({
  selector: 'app-production-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './production-list.html', // Points to the file below
  styleUrls: []
})
export class ProductionList implements OnInit {

  private orderService = inject(ProductionOrderService);

  orders = signal<ProductionOrder[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading.set(true);
    this.orderService.getAll().subscribe({
      next: (data) => {
        this.orders.set(data);
        console.log(data)
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  // Helper for Status Colors (Yellow/Blue/Green)
  getStatusColor(status: OrderStatus): string {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'IN_PRODUCTION': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  }

  //-----------------------------------------------------------------------


  // Update a single order in the list after a change
    private updateLocalOrder(updatedOrder: ProductionOrder) {
      this.orders.update(currentList => 
        currentList.map(o => o.id === updatedOrder.id ? updatedOrder : o)
      );
    }

    // --- ACTIONS ---

    onStart(order: ProductionOrder) {
      this.orderService.start(order.id).subscribe({
        next: (updated) => this.updateLocalOrder(updated),
        error: (err) => alert('Could not start order. Check inventory.')
      });
    }

    onComplete(order: ProductionOrder) {
      if(confirm('Is manufacturing 100% done?')) {
        this.orderService.complete(order.id).subscribe({
          next: (updated) => this.updateLocalOrder(updated),
          error: (err) => alert('Could not complete order.')
        });
      }
    }

    onCancel(order: ProductionOrder) {
      if(confirm('Are you sure you want to CANCEL this plan?')) {
        this.orderService.cancel(order.id).subscribe({
          next: (updated) => this.updateLocalOrder(updated),
          error: (err) => alert('Could not cancel order.')
        });
      }
    }
}