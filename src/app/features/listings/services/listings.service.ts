import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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

  getListingsByPartnerId(partnerId: number): Observable<Listing[]> {
    return this.http.get<Listing[]>(`${this.apiUrl}/listings/partner/${partnerId}`).pipe(
      catchError(this.handleError<Listing[]>('getListingsByPartnerId', []))
    );
  }

  toggleListingStatus(id: number): Observable<{ status: string }> {
    return this.http.patch<{ status: string }>(`${this.apiUrl}/listings/${id}/toggle-status`, {}).pipe(
      catchError(this.handleError<{ status: string }>(`toggleListingStatus id=${id}`))
    );
  }

  toggleListingArchivedStatus(id: number): Observable<{ message: string; warning?: string }> {
    return this.http.patch<{ message: string; warning?: string }>(`${this.apiUrl}/listings/${id}/toggle-archived`, {}).pipe(
      catchError(this.handleError<{ message: string; warning?: string }>(`toggleListingArchivedStatus id=${id}`))
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

  createListing(formData: FormData): Observable<Listing> {
    return this.http.post<Listing>(`${this.apiUrl}/listings`, formData).pipe(
      catchError(this.handleError<Listing>('createListing'))
    );
  }

  updateListing(id: number, data: Partial<Listing> | FormData): Observable<Listing> {
    if (data instanceof FormData) {
      return this.http.post<Listing>(`${this.apiUrl}/listings/${id}`, data).pipe(
        catchError(this.handleError<Listing>(`updateListing id=${id} with FormData`))
      );
    } else {
      return this.http.put<Listing>(`${this.apiUrl}/listings/${id}`, data).pipe(
        catchError(this.handleError<Listing>(`updateListing id=${id} with JSON`))
      );
    }
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}