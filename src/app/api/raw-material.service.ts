import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { enviroment } from "../../enviroments/enviroment.dev";
import { Observable } from "rxjs";
import { RawMaterial } from "./raw-material-model";

@Injectable({
  providedIn: 'root'
})
export class RawMaterialService{

private http  = inject(HttpClient);
private apiUrl = `${enviroment.apiUrl}/raw-materials`;

//to get all the raw materials
 getAll(page: number = 0, size: number = 10 ): Observable<RawMaterial>{
  const params = new HttpParams()
  .set('page', page)
  .set('size', size)
  return this.http.get<RawMaterial[]> (this.apiUrl,{params});
 }

 //to get just one raw material by id 
 getById (id: number): Observable<RawMaterial>{
  return this.http.get<RawMaterial>(`${this.apiUrl}/${id}`)
 }

 //to create a new raw material 
 create(material: Partial<RawMaterial>){
  return this.http.post<RawMaterial>(`${this.apiUrl}`,material)
 }

 




}

 //the method to get all the raw materials

