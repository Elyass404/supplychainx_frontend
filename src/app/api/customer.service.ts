import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { enviroment } from "../../enviroments/enviroment.dev";
import { Observable } from "rxjs";
import { Customer, CustomerRequest } from "./customer.model";


@Injectable({
  providedIn: 'root'
})

export class CustomerService{
  
  private http = inject(HttpClient);
  private apiUrl = `${enviroment.apiUrl}/delivery/customers`

  //Get All
  getAll(): Observable<Customer[]>{
    return this.http.get<Customer[]>(this.apiUrl)
  }

  // SEARCH
  search(name: string): Observable<Customer[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Customer[]>(`${this.apiUrl}/search`, { params });
  }

  // CREATE
  create(customer: CustomerRequest): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  // UPDATE
  update(id: number, customer: CustomerRequest): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer);
  }

  // DELETE
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}