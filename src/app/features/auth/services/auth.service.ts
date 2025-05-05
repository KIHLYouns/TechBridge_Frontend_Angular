import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { SignUpRequest, SignUpResponse } from '../models/sign-up.model';
import { SignInRequest, SignInResponse } from '../models/sign-in.model';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { UserService } from '../../profile/services/user.service';

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

  login(request: SignInRequest): Observable<SignInResponse> {
    // the user will send his credentials
    // and get a token in response
    // we will simulate the creation of the token here
    // Create mock token with claims
    const mockToken = this.createMockJwt({
      sub: 'user-' + Math.floor(Math.random() * 10000),
      userId: 1,
      roles: ['USER'],
    });

    return of({
      'access-token': mockToken,
    }).pipe(
      delay(1000),
      tap((response) => {
        if (response && response['access-token']) {
          // when the token arrives we will persist it to local storage.
          this.tokenService.saveAccessToken(response['access-token']);
          // we will extract the userID from the token
          const userId = this.tokenService.getUserIdFromToken();
          if (userId) {
            // then we will get the user by its ID so that ist saved to our local storage
            this.userService.getUserById(userId).subscribe({
              next: () => {
                // after this will emit a true value so the nav bar changes 
                this.authStateSubject.next(true);
                // and then we route to listings
                this.router.navigate(['/listings']);
              },
              error: (error) =>
                console.error('Error getting user data:', error),
            });
          } else {
            this.authStateSubject.next(true);
            this.router.navigate(['/listings']);
          }
        }
      })
    );
  }

  signUp(request: SignUpRequest): Observable<SignUpResponse> {
    // Mock implementation
    console.log('Sign up request:', request);

    console.log('here the backend should use : ');
    console.log(request.coordinates);
    console.log('and extract the city');

    let city = 'Unknown';
    if (request.coordinates) {
      const cities = [
        'Paris',
        'Lyon',
        'Marseille',
        'Bordeaux',
        'Lille',
        'Toulouse',
      ];
      const randomIndex =
        Math.floor(
          Math.abs(
            request.coordinates.latitude + request.coordinates.longitude
          ) * 100
        ) % cities.length;
      city = cities[randomIndex];
    }

    // Create mock token with all user data in claims
    const mockToken = this.createMockJwt({
      sub: 'user-' + Math.floor(Math.random() * 10000),
      userId: 1,
      roles: ['USER'],
    });

    return of({
      'access-token': mockToken,
    }).pipe(
      delay(1500),
      tap((response) => {
        if (response && response['access-token']) {
          this.tokenService.saveAccessToken(response['access-token']);
          this.authStateSubject.next(true);
          this.router.navigate(['/listings']);
        }
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

  private createMockJwt(claims: any): string {
    // Create a header
    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    // Add standard claims
    const payload = {
      ...claims,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
    };

    // Base64 encode parts
    const base64Header = btoa(JSON.stringify(header));
    const base64Payload = btoa(JSON.stringify(payload));

    // Create a signature
    const signature = btoa('mockSignature');

    return `${base64Header}.${base64Payload}.${signature}`;
  }
}
