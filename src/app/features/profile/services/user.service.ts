import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../../../shared/database.model'; // Adjust path as needed
import { TokenService } from '../../auth/services/token.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private mockUser: User = {
    id: 105,
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
  private readonly INTERFACE_PREFERENCE_KEY = 'interfaceMode';

  private isPartnerInterfaceSubject = new BehaviorSubject<boolean>(false);
  public isPartnerInterface$ = this.isPartnerInterfaceSubject.asObservable();

  private interfaceToggleStateSubject = new BehaviorSubject<boolean>(false);
public interfaceToggleState$ = this.interfaceToggleStateSubject.asObservable();

private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private tokenService: TokenService) {
    // Initialize interface preference from localStorage
    this.initializeInterfacePreference();
  }

  private initializeInterfacePreference(): void {
    // Try to get the stored preference
    const storedPreference = localStorage.getItem(this.INTERFACE_PREFERENCE_KEY);
    
    if (storedPreference !== null) {
      // If there's a stored preference, use it
      const isPartner = storedPreference === 'partner';
      this.isPartnerInterfaceSubject.next(isPartner);
      console.log(`UserService: Initialized interface from stored preference: ${isPartner ? 'Partner' : 'Client'}`);
    } else {
      // Otherwise, get the current user and check if they're a partner
      const currentUser = this.getCurrentUserFromLocalStorage();
      if (currentUser) {
        // Only default to partner mode if they are a partner
        const defaultToPartner = currentUser.is_partner || false;
        this.isPartnerInterfaceSubject.next(defaultToPartner);
        // Save this preference
        localStorage.setItem(this.INTERFACE_PREFERENCE_KEY, defaultToPartner ? 'partner' : 'client');
        console.log(`UserService: Initialized interface from user data: ${defaultToPartner ? 'Partner' : 'Client'}`);
      }
    }
  }


  public reset(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    localStorage.removeItem(this.INTERFACE_PREFERENCE_KEY);
    this.isPartnerInterfaceSubject.next(false);
  }

  public getUserById(userId: number): Observable<User> {

    return this.http
      .get<{ success: boolean; data: User }>(`${this.apiUrl}/users/${userId}/profile`)
      .pipe(
        map((response) => response.data),
        tap((user) => {
          // Save to localStorage
          this.saveUserToStorage(user);
          // Update partner status
          // If there's no stored interface preference, initialize based on user data
          if (localStorage.getItem(this.INTERFACE_PREFERENCE_KEY) === null) {
            this.isPartnerInterfaceSubject.next(user.is_partner);
            localStorage.setItem(this.INTERFACE_PREFERENCE_KEY, user.is_partner ? 'partner' : 'client');
          }
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

  public becomePartner(): Observable<boolean> {
    console.log('Switching user to partner role');
    return of(true).pipe(
      delay(1000),
      tap(() => {
        const userId = this.getCurrentUserId();
        if (!userId) {
          console.error('No user ID found');
          return;
        }
        this.updateUserProfile(userId, { is_partner: true }).subscribe({
          next: (user) => {
            // Save updated user to storage
            this.saveUserToStorage(user);
            
            // Don't automatically switch to partner interface - let the user decide
            // But if they're not currently in partner mode, ask if they want to switch
            if (!this.isPartnerInterfaceSubject.value) {
              const wantToSwitch = confirm('You are now a partner! Would you like to switch to the Partner interface?');
              if (wantToSwitch) {
                this.switchInterface(true);
              }
            }
          },
          error: (err) => console.error('Error updating user profile:', err),
        });
      })
    );
  }

  public switchInterface(isPartnerInterface: boolean): void {
    console.log(`UserService: Setting interface mode to ${isPartnerInterface ? 'Partner' : 'Client'}`);
    
    // Update BehaviorSubject
    this.isPartnerInterfaceSubject.next(isPartnerInterface);
    
    // Save preference to localStorage
    localStorage.setItem(this.INTERFACE_PREFERENCE_KEY, isPartnerInterface ? 'partner' : 'client');
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
    return this.http
      .patch<{ success: boolean; message: string; data: User }>(
        `${this.apiUrl}/users/${userId}/profile`,
        userData
      )
      .pipe(
        map((response) => response.data),
        tap((data) => {
          this.saveUserToStorage(data);
        })
      );
  }

  // Add other methods as needed (e.g., uploadAvatar)
}
