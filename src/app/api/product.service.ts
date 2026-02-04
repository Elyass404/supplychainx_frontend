import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.model';
import { enviroment } from '../../enviroments/enviroment.dev'; 

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private http = inject(HttpClient);
  private apiUrl = `${enviroment.apiUrl}/production/products`;

  // GET ALL
  getAll(page: number = 0, size: number = 10): Observable<Product[]> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Product[]>(this.apiUrl, { params });
  }

  // GET ONE
  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // CREATE
  create(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  // UPDATE
  update(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  // DELETE
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}