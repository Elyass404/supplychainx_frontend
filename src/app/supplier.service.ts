import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Supplier } from './supplier.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  // Your Backend URL
  private apiUrl = 'http://localhost:8080/api/v1/suppliers';

  constructor(private http: HttpClient) {}

  // 🟢 METHOD: Create a Supplier
  createSupplier(supplier: Supplier): Observable<Supplier> {
    // We don't need to add headers manually! The Interceptor handles it.
    return this.http.post<Supplier>(this.apiUrl, supplier);
  }
  
  // 🟢 METHOD: Get All Suppliers (Useful to test)
  getAllSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl);
  }
}