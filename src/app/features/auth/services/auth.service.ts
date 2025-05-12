import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { UserService } from '../../profile/services/user.service';
import { SignUpRequest } from '../models/sign-up.model';
import { SignInRequest } from '../models/sign-in.model';

// To this
export interface SignInResponse {
  userId: number;
  token: string;
}


// To this
export interface SignUpResponse {
  userId: number;
  token: string;
}


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // BehaviorSubject to track authentication state - it holds the current value and emits it to new subscribers
  private authStateSubject: BehaviorSubject<boolean>;

  // Observable that components can subscribe to
  public authState$: Observable<boolean>;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router,
    private userService: UserService
  ) {
    const initialAuthState = this.tokenService.hasValidToken();
    this.authStateSubject = new BehaviorSubject<boolean>(initialAuthState);
    this.authState$ = this.authStateSubject.asObservable();

    if (initialAuthState) {
      this.initializeUserData();
    }
  }

  // Add this new method
  private initializeUserData(): void {
    const userId = this.tokenService.getUserIdFromToken();
    if (userId) {
      // Load user data based on the ID from token
      this.userService.getUserById(userId).subscribe({
        next: () => console.log('User data loaded on app initialization'),
        error: (error) => {
          console.error('Failed to load user data:', error);
          this.authStateSubject.next(false);
        },
      });
    }
  }

// Mock login implementation
login(request: SignInRequest): Observable<SignInResponse> {
  
  // Create mock response (simulating Laravel Sanctum response)
  /*const mockResponse: SignInResponse = {
    userId: 1,
    token: `mock_token_${Math.random().toString(36).substring(2)}`
  };*/

  // Return mock Observable with delay to simulate network request
  /*return of(mockResponse).pipe(
    delay(1000), // 1 second delay to simulate network
    tap((response) => {
      if (response && response.token) {
        // Store both token and userId
        this.tokenService.saveAccessToken(response.token, response.userId);
        
        // Get user data based on userId from token
        this.userService.getUserById(response.userId).subscribe({
          next: () => {
            this.authStateSubject.next(true);
            this.router.navigate(['/listings']);
          },
          error: (error) => console.error('Error getting user data:', error)
        });
      }
    }),
    catchError(error => {
      console.error('Login error:', error);
      return throwError(() => new Error('Login failed. Please check your credentials.'));
    })
  ); */

    // Replace mock with actual endpoint
  return this.http.post<SignInResponse>(`/api/auth/login`, request).pipe(
    tap((response) => {
      if (response && response.token) {
        // Store both token and userId
        this.tokenService.saveAccessToken(response.token, response.userId);
        
        // Get user data based on userId from token
        this.userService.getUserById(response.userId).subscribe({
          next: () => {
            this.authStateSubject.next(true);
            this.router.navigate(['/listings']);
          },
          error: (error) => console.error('Error getting user data:', error)
        });
      }
    }),
    catchError(error => {
      console.error('Login error:', error);
      return throwError(() => new Error('Login failed. Please check your credentials.'));
    })
  );
}

// Mock signUp implementation
signUp(request: SignUpRequest): Observable<SignUpResponse> {
  
  // Create mock response
  /*const mockResponse: SignUpResponse = {
    userId: 1,
    token: `mock_token_${Math.random().toString(36).substring(2)}`
  };*/

  // Return mock Observable with delay
  /*return of(mockResponse).pipe(
    delay(1500), // 1.5 second delay to simulate network
    tap((response) => {
      if (response && response.token) {
        // Store both token and userId
        this.tokenService.saveAccessToken(response.token, response.userId);
        this.authStateSubject.next(true);
        this.router.navigate(['/listings']);
      }
    }),
    catchError(error => {
      console.error('Signup error:', error);
      return throwError(() => new Error('Registration failed. Please try again.'));
    })
  );*/

    // Replace mock with actual endpoint
  return this.http.post<SignUpResponse>(`/api/auth/signup`, request).pipe(
    tap((response) => {
      if (response && response.token) {
        // Store both token and userId
        this.tokenService.saveAccessToken(response.token, response.userId);
        this.authStateSubject.next(true);
        this.router.navigate(['/listings']);
      }
    }),
    catchError(error => {
      console.error('Signup error:', error);
      return throwError(() => new Error('Registration failed. Please try again.'));
    })
  );
}

  checkAndRestoreAuth(): boolean {
    const isAuthenticated = this.tokenService.hasValidToken();
    console.log(
      'checkAndRestoreAuth: Token validity check result:',
      isAuthenticated
    );

    // Make sure the auth state is updated
    this.authStateSubject.next(isAuthenticated);

    if (!isAuthenticated) {
      this.tokenService.clearStorage();
    }

    return isAuthenticated;
  }

  logout(): void {
    this.tokenService.clearStorage();
    this.userService.reset();
    this.authStateSubject.next(false);
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return this.tokenService.hasValidToken();
  }

}
