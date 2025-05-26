import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../profile/services/user.service';
import { SignInRequest } from '../models/sign-in.model';
import { SignUpRequest } from '../models/sign-up.model';
import { TokenService } from './token.service';

export interface SignInResponse {
  id: number;
  token: string;
}

export interface SignUpResponse {
  id: number;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // BehaviorSubject to track authentication state - it holds the current value and emits it to new subscribers
  public authStateSubject: BehaviorSubject<boolean>;

  // Observable that components can subscribe to
  public authState$: Observable<boolean>;
  private apiUrl = environment.apiUrl;

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
    // Replace mock with actual endpoint
    return this.http.post<SignInResponse>(`${this.apiUrl}/auth/login`, request).pipe(
      tap((response) => {
        if (response && response.token) {
          // Store both token and userId
          this.tokenService.saveAccessToken(response.token, response.id);

          // Get user data based on userId from token
          this.userService.getUserById(response.id).subscribe({
            next: (userData) => {
              this.authStateSubject.next(true);

              // Rediriger vers l'interface admin si l'utilisateur est un administrateur
              if (userData && userData.role === 'ADMIN') {
                this.router.navigate(['/admin']);
              } else {
                this.router.navigate(['/listings']);
              }
            },
            error: (error) => console.error('Error getting user data:', error),
          });
        }
      })
    );
  }

  // Mock signUp implementation
  signUp(request: SignUpRequest): Observable<SignUpResponse> {
    // Replace mock with actual endpoint
    return this.http.post<SignUpResponse>(`${this.apiUrl}/auth/signup`, request).pipe(
      tap((response) => {
        if (response && response.token) {
          // Store both token and userId
          this.tokenService.saveAccessToken(response.token, response.id);
          // Get user data based on userId from token
          this.userService.getUserById(response.id).subscribe({
            next: () => {
              this.authStateSubject.next(true);
              this.router.navigate(['/listings']);
            },
            error: (error) => console.error('Error getting user data:', error),
          });
        }
      }),
      catchError((error) => {
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
    this.router.navigate(['/auth/sign-in']);
  }

  isAuthenticated(): boolean {
    return this.tokenService.hasValidToken();
  }
}
