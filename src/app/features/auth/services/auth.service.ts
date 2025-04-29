import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { SignUpRequest, SignUpResponse } from '../models/sign-up.model';
import { SignInRequest, SignInResponse } from '../models/sign-in.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private tokenService: TokenService) { }


  private createMockJwt(claims: any): string {
    // Create a header
    const header = {
      alg: 'HS256',
      typ: 'JWT'
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

  login(request: SignInRequest): Observable<SignInResponse> {
    console.log('Login request:', request);
    
    // Create mock token with claims
    const mockToken = this.createMockJwt({
      sub: 'user-' + Math.floor(Math.random() * 10000),
      username: request.username,
      email: request.username.includes('@') ? request.username : `${request.username}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      city: 'Paris',
      roles: ['USER']
    });
    
    return of({
      'access-token': mockToken
    }).pipe(
      delay(1000),
      tap(response => {
        if (response && response['access-token']) {
          this.tokenService.saveAccessToken(response['access-token']);
        }
      })
    );
  }


  signUp(request: SignUpRequest): Observable<SignUpResponse> {
    // Mock implementation
    console.log('Sign up request:', request);


    console.log("here the backend should use : ");
    console.log(request.coordinates);
    console.log("and extract the city");

    let city = 'Unknown';
    if (request.coordinates) {
      const cities = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille', 'Toulouse'];
      const randomIndex = Math.floor(Math.abs(request.coordinates.latitude + 
                                    request.coordinates.longitude) * 100) % cities.length;
      city = cities[randomIndex];
    }
    
    // Create mock token with all user data in claims
    const mockToken = this.createMockJwt({
      sub: 'username',
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName,
      city: city,
      roles: request.isPartner ? ['CLIENT', 'PARTNER'] : ['CLIENT']
    });
    
    return of({
      'access-token': mockToken
    }).pipe(
      delay(1500),
      tap(response => {
        if (response && response['access-token']) {
          this.tokenService.saveAccessToken(response['access-token']);
        }
      })
    );
  }

  checkAndRestoreAuth(): boolean {
    if (this.tokenService.hasValidToken()) {
      return true;
    } else {
      this.tokenService.clearStorage();
      return false;
    }
  }

  getUser(): any {
    return this.tokenService.getUser();
  }


  logout(): void {
    this.tokenService.clearStorage();
  }

  isAuthenticated(): boolean {
    return this.tokenService.hasValidToken();
  }
}