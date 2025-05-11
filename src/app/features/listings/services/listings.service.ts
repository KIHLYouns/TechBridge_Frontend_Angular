import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  Category,
  City,
  Listing,
} from '../../../shared/database.model';

@Injectable({
  providedIn: 'root',
})
export class ListingsService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getListings(filters?: {
    categoryId?: number;
    cityId?: number;
    minPrice?: number;
    maxPrice?: number;
    equipment_rating_gte?: number;
    partner_rating_gte?: number;
  }): Observable<Listing[]> {
    let params = new HttpParams();
    if (filters) {
      if (filters.categoryId !== undefined && filters.categoryId !== null) params = params.append('category_id', filters.categoryId.toString());
      if (filters.cityId !== undefined && filters.cityId !== null) params = params.append('city_id', filters.cityId.toString());
      if (filters.minPrice !== undefined && filters.minPrice !== null) params = params.append('min_price', filters.minPrice.toString());
      if (filters.maxPrice !== undefined && filters.maxPrice !== null) params = params.append('max_price', filters.maxPrice.toString());
      if (filters.equipment_rating_gte !== undefined && filters.equipment_rating_gte > 0) {
        params = params.append('equipment_rating', filters.equipment_rating_gte.toString());
      }
      if (filters.partner_rating_gte !== undefined && filters.partner_rating_gte > 0) {
        // Pour JSON Server, si partner_rating est imbriqué, cela peut nécessiter une gestion spécifique
        // ou que le backend expose un paramètre direct comme 'partner_rating_gte'.
        // En supposant que le backend gère 'partner_rating' pour 'partner.partner_rating'.
        params = params.append('partner_rating', filters.partner_rating_gte.toString());
      }
    }
    console.log(params);
    return this.http.get<Listing[]>(`${this.apiUrl}/listings`, { params }).pipe(
      catchError(this.handleError<Listing[]>('getListings', []))
    );
  }

  getListingById(id: number): Observable<Listing | undefined> {
    return this.http.get<Listing>(`${this.apiUrl}/listings/${id}`).pipe(
      catchError(this.handleError<Listing | undefined>(`getListingById id=${id}`))
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`).pipe(
      catchError(this.handleError<Category[]>('getCategories', []))
    );
  }

  getCities(): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}/cities`).pipe(
      catchError(this.handleError<City[]>('getCities', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`, error);
      return of(result as T);
    };
  }
}