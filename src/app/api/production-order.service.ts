import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductionOrder } from './production-order.model';
import { enviroment } from '../../enviroments/enviroment.dev'; // 

@Injectable({
  providedIn: 'root'
})
export class ProductionOrderService {
  
  private http = inject(HttpClient);
  
  // Base URL: http://localhost:8080/api/v1/production-orders
  private apiUrl = `${enviroment.apiUrl}/production/orders`;

  // GET ALL
  getAll(page: number = 0, size: number = 10): Observable<ProductionOrder[]> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ProductionOrder[]>(this.apiUrl, { params });
  }

  // GET ONE
  getById(id: number): Observable<ProductionOrder> {
    return this.http.get<ProductionOrder>(`${this.apiUrl}/${id}`);
  }

  // CREATE
  create(order: Partial<ProductionOrder>): Observable<ProductionOrder> {
    return this.http.post<ProductionOrder>(this.apiUrl, order);
  }

  // UPDATE
  update(id: number, order: Partial<ProductionOrder>): Observable<ProductionOrder> {
    return this.http.put<ProductionOrder>(`${this.apiUrl}/${id}`, order);
  }

  // DELETE
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Start Order (PENDING -> IN_PRODUCTION)
  start(id: number): Observable<ProductionOrder> {
    return this.http.put<ProductionOrder>(`${this.apiUrl}/${id}/start`, {});
  }

  // Complete Order (IN_PRODUCTION -> COMPLETED)
  complete(id: number): Observable<ProductionOrder> {
    return this.http.put<ProductionOrder>(`${this.apiUrl}/${id}/complete`, {});
  }

  // Cancel Order (PENDING -> CANCELLED)
  cancel(id: number): Observable<ProductionOrder> {
    return this.http.put<ProductionOrder>(`${this.apiUrl}/${id}/cancel`, {});
  }

  // Block Order (Manual Block)
  block(id: number): Observable<ProductionOrder> {
    return this.http.put<ProductionOrder>(`${this.apiUrl}/${id}/block`, {});
  }
}