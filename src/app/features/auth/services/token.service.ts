import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'access_token';

  constructor() {}

  saveAccessToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  clearStorage(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  hasValidToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    
    try {
      // Parse the token
      const payload = this.parseJwt(token);
      
      // Check if token is expired
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < expiryTime;
    } catch (e) {
      console.error('Error validating token:', e);
      return false;
    }
  }

  parseJwt(token: string): any {
    try {
      // Get the payload part of the JWT (second part)
      const base64Payload = token.split('.')[1];
      // Replace characters and decode
      const payload = JSON.parse(atob(base64Payload));
      return payload;
    } catch (e) {
      console.error('Error parsing JWT:', e);
      throw e;
    }
  }



  getUserIdFromToken(): number | null {
    try {
      const token = this.getAccessToken();
      if (!token) return null;
      
      const payload = this.parseJwt(token);
      // The user ID could be in different claims depending on your JWT structure
      // Check common places where it might be
      return payload.userId || payload.sub || null;
    } catch (e) {
      console.error('Error getting user ID from token:', e);
      return null;
    }
  }

}