import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of, tap, throwError } from 'rxjs';
import { TokenService } from '../../auth/services/token.service';
import { User } from '../../../shared/database.model'; // Adjust path as needed

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private mockUser: User = {
    id: 1,
    username: 'younsk', // Added username
    firstname: 'Youns',
    lastname: 'Kihl',
    email: 'youns.dev@example.com',
    phone_number: '123-456-7890',
    address: '123 Main St, Tetouan',
    avatar_url: `https://ui-avatars.com/api/?name=Kihl+Youns`,
    client_rating: 4.8,
    partner_rating: null,
    join_date: new Date('2022-01-15'),
    city: { id: 1, name: 'Tétouan' },
    role: 'USER', // Added role
    is_partner: false, // Added is_partner
    latitude: 35.5785, // Added latitude
    longitude: -5.3684, // Added longitude
    client_reviews: 5 // Example value for review count
  };

  private readonly CURRENT_USER_KEY = 'currentUser';

  // BehaviorSubject to track partner status
  private isPartnerSubject = new BehaviorSubject<boolean>(false);

  // Observable that components can subscribe to
  public isPartner$ = this.isPartnerSubject.asObservable();

  private apiUrl = '/api/users'; // Example API endpoint

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  // state management

  public initializePartnerStatus(): void {
    const userJson = localStorage.getItem(this.CURRENT_USER_KEY);
    if (userJson) {
      try {
        const user: User = JSON.parse(userJson);
        if (user) {
          this.isPartnerSubject.next(user.is_partner);
        }
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }
  }

  public isPartner(): boolean {
    return this.isPartnerSubject.value;
  }

  public reset(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.isPartnerSubject.next(false);
  }

  // User management

  public getUserById(userId: number): Observable<User> {
    console.log(`Getting user by ID: ${userId}`);

    return of(this.mockUser).pipe(
      delay(300),
      tap((user) => {
        // Save to localStorage
        this.saveUserToStorage(user);
        // Update partner status
        this.isPartnerSubject.next(user.is_partner);
      })
    );
  }

  public getCurrentUserFromLocalStorage(): User | null {
    const userJson = localStorage.getItem(this.CURRENT_USER_KEY);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson) as User;
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
      return null;
    }
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  public switchToPartner(): Observable<boolean> {
    console.log('Switching user to partner role');
    return of(true).pipe(
      delay(1000),
      tap(() => {
        this.mockUser.is_partner = true;
        // Get current user from storage
        const user = this.getCurrentUserFromLocalStorage();
        if (!user) {
          console.error('No user found in storage');
          return;
        }
        // Update is_partner flag
        user.is_partner = true;
        // Save updated user to storage
        this.saveUserToStorage(user);
        // Publish partner status change
        this.isPartnerSubject.next(true);
      })
    );
  }

  public switchToClient(): Observable<boolean> {
    console.log('Switching user to client-only role');

    return of(true).pipe(
      delay(1000), // Simulate network delay
      tap(() => {
        this.mockUser.is_partner = false;
        const user = this.getCurrentUserFromLocalStorage();
        if (!user) {
          console.error('No user found in storage');
          return;
        }
        // Set is_partner flag to false
        user.is_partner = false;
        // Save updated user to storage
        this.saveUserToStorage(user);
        // Publish partner status change
        this.isPartnerSubject.next(false);
      })
    );
  }

  getCurrentUserId(): number | null {
    return this.tokenService.getUserIdFromToken();
  }

  getCurrentUserProfile(): Observable<User> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return of({} as User);
    }
     return this.getUserById(userId);
  }
  // Method to update a user's profile
  updateUserProfile(userId: number, userData: Partial<User>): Observable<User> {
    console.log('Updating user profile:', userId, userData);

    // Merge existing data with updates
    const updatedMockUser: User = {
      ...this.mockUser, // Start with current data
      ...userData, // Apply updates
      // Ensure avatar updates if name changes (example logic)
      avatar_url: userData.firstname || userData.lastname
        ? `https://ui-avatars.com/api/?name=${userData.firstname || this.mockUser.firstname}+${userData.lastname || this.mockUser.lastname}`
        : this.mockUser.avatar_url,
    };
    console.log('Returning updated mock user:', updatedMockUser);
    return of(updatedMockUser).pipe(
      delay(500),
      tap((data) => {
        this.saveUserToStorage(data);
      })
    );
    // --- End Mock Update ---
  }

  // Add other methods as needed (e.g., uploadAvatar)
}
