import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of, tap } from 'rxjs';
import { TokenService } from '../../auth/services/token.service';

export type UserRole = 'CLIENT' | 'PARTNER';

export interface User {
  accessToken: string;
  expiresIn: number;
  is_partner: boolean,
  id: number;
  roles: UserRole[];
  tokenType: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly CURRENT_USER_KEY = 'currentUser';

  // BehaviorSubject to track partner status
  private isPartnerSubject = new BehaviorSubject<boolean>(false);
  
  // Observable that components can subscribe to
  public isPartner$ = this.isPartnerSubject.asObservable();

  constructor() {
    // Initialize with partner status from localStorage if available
    this.initializePartnerStatus();
  }
  
  private initializePartnerStatus(): void {
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


   public getCurrentUser(): User | null {
    const userJson = localStorage.getItem(this.CURRENT_USER_KEY);
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson) as User;
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
      return null;
    }
  }
  
  /**
   * Save user to localStorage
   */
  private saveUserToStorage(user: User): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  public isPartner(): boolean {
    return this.isPartnerSubject.value;
  }
  
  /**
   * Switch user to partner role
   */
  public switchToPartner(): Observable<boolean> {
    console.log('Switching user to partner role');
    
    // Simulate API call
    return of(true).pipe(
      delay(1000), // Simulate network delay
      tap(() => {
        // Get current user from storage
        const user = this.getCurrentUser();
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
  
  /**
   * Switch user back to client role only
   */
  public switchToClient(): Observable<boolean> {
    console.log('Switching user to client-only role');
    
    // Simulate API call
    return of(true).pipe(
      delay(1000), // Simulate network delay
      tap(() => {
        // Get current user from storage
        const user = this.getCurrentUser();
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
}
