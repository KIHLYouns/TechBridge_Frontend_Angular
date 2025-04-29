import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access-token';

  constructor() { }

  public saveAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  public getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  public decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid token specified:', error);
      return null;
    }
  }

  public getExpiresAt(token: string): number | null {
    try {
      const decodedToken: any = this.decodeToken(token);
      // JWT typically uses the 'exp' claim for expiration timestamp
      return decodedToken ? decodedToken.exp * 1000 : null; // Convert to milliseconds
    } catch (error) {
      console.error('Error extracting expiration time:', error);
      return null;
    }
  }

  public isTokenExpired(token: string): boolean {
    const expiresAt = this.getExpiresAt(token);
    return expiresAt ? Date.now() > expiresAt : true;
  }

  public getTokenClaims(): any {
    const token = this.getAccessToken();
    if (token && !this.isTokenExpired(token)) {
      return this.decodeToken(token);
    }
    return null;
  }

  public getUser(): any {
    const claims = this.getTokenClaims();
    if (claims) {
      return {
        id: claims.sub,
        username: claims.username,
        email: claims.email,
        firstName: claims.firstName,
        lastName: claims.lastName,
        city: claims.city,
        roles: claims.roles
      };
    }
    return null;
  }

  public getCity(): string | null {
    const claims = this.getTokenClaims();
    return claims?.city || null;
  }

  public hasValidToken(): boolean {
    const token = this.getAccessToken();
    return token !== null && !this.isTokenExpired(token);
  }

  public clearStorage(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }

}