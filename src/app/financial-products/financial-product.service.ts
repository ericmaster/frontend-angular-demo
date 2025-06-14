import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface FinancialProduct {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}
export interface FinancialProductResponse {
  data: FinancialProduct[];
}

@Injectable({
  providedIn: 'root'
})
export class FinancialProductService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Obtener todos los productos financieros
  getProducts(): Observable<FinancialProduct[]> {
    return this.http.get<FinancialProductResponse>(this.apiUrl)
      .pipe(
        map((response: FinancialProductResponse) => {
          // Si la respuesta contiene un array en data, lo retornamos
          if (response && response.data) {
            return response.data;
          }
          // Si la respuesta es directamente un array de productos
          if (Array.isArray(response)) {
            return response as unknown as FinancialProduct[];
          }
          // Por defecto, retornar un array vacío
          return [];
        })
      );
  }

  // Verificar si existe un ID
  verifyId(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verification/${id}`);
  }

  // Crear un nuevo producto financiero
  createProduct(product: FinancialProduct): Observable<FinancialProduct> {
    return this.http.post<FinancialProduct>(this.apiUrl, product);
  }

  // Actualizar un producto financiero existente
  updateProduct(product: FinancialProduct): Observable<FinancialProduct> {
    return this.http.put<FinancialProduct>(`${this.apiUrl}/${product.id}`, product);
  }

  // Eliminar un producto financiero
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
  // Obtener un producto específico por su ID
  getProductById(id: string): Observable<FinancialProduct> {
    return this.http.get<FinancialProduct>(`${this.apiUrl}/${id}`);
  }
}
