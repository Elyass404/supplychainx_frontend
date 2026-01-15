import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Supplier } from './supplier.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/suppliers';

  //  Return Observable<Supplier[]> (Array) instead of Page
  getSuppliers(page: number = 0, size: number = 10): Observable<Supplier[]> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<Supplier[]>(this.apiUrl, { params });
  }

  createSupplier(supplier: Partial<Supplier>): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, supplier);
  }
}