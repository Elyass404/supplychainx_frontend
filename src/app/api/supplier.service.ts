import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Supplier } from './supplier.model';
import { enviroment } from '../../enviroments/enviroment.dev';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private http = inject(HttpClient);
  private apiUrl = `${enviroment.apiUrl}/suppliers` ;

  //  Return Observable<Supplier[]> (Array) instead of Page
  getSuppliers(page: number = 0, size: number = 10): Observable<Supplier[]> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<Supplier[]>(this.apiUrl, { params });
  }

  //create the supplier
  createSupplier(supplier: Partial<Supplier>): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, supplier);
  }

  getSupplierById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
  }

  updateSupplier(id: number, supplier: Partial<Supplier>): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.apiUrl}/${id}`, supplier);
  }

  //delete the supplier 
  deleteSupplier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}