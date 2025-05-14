import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Claim, Listing, User } from '../../../shared/database.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Utilisateurs
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/admin/users`);
  }

  toggleSuspendUser(userId: number): Observable<any> {
    return this.http.post(`${this.API_URL}/admin/users/${userId}/toggle-suspend`, {});
  }

  // Annonces
  getListings(status?: string): Observable<Listing[]> {
    let url = `${this.API_URL}/admin/listings`;
    if (status) {
      url += `?status=${status}`;
    }
    return this.http.get<Listing[]>(url);
  }

  updateListingStatus(listingId: number, action: 'toggleStatus' | 'toggleArchivedStatus'): Observable<any> {
    const endpoint = action === 'toggleStatus' 
      ? `/listings/${listingId}/toggle-status` 
      : `/listings/${listingId}/toggle-archived`;
    return this.http.patch(`${this.API_URL}${endpoint}`, {});
  }

  // Réclamations
  getClaims(): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.API_URL}/admin/claims`);
  }

  updateClaimStatus(claimId: number, status: string): Observable<any> {
    return this.http.patch(`${this.API_URL}/admin/claims/${claimId}/status`, { status });
  }
}
