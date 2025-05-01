import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; // Import 'of' for mock data
import { User } from '../../../shared/database.model'; // Adjust path as needed

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Replace with your actual API endpoint
  private apiUrl = '/api/users'; // Example API endpoint

  constructor(private http: HttpClient) { }

  // Placeholder: Implement logic to get the current user's ID
  // This might involve an authentication service or state management
  getCurrentUserId(): number | null {
    // Example: return this.authService.getUserId();
    return 1; // Mock User ID
  }

  // Method to get the profile of the currently logged-in user
  getCurrentUserProfile(): Observable<User> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      // Handle case where user is not logged in or ID is unavailable
      return of({} as User); // Or throw an error, or return an empty observable
    }
    // Replace with actual API call
    // Example: return this.http.get<User>(`${this.apiUrl}/${userId}`);

    // --- Mock Data Example ---
    const mockUser: User = {
      id: userId,
      firstname: 'Youns',
      lastname: 'Kihl',
      email: 'youns.dev@example.com',
      phone_number: '123-456-7890',
      address: '123 Main St, Tetouan',
      avatar_url: `https://ui-avatars.com/api/?name=Kihl+Youns`, // Placeholder image
      client_rating: 4.8,
      partner_rating: null,
      join_date: new Date('2022-01-15'),
      city: { id: 1, name: 'Tétouan' },
      role: 'USER', // Added role
      is_partner: false // Added is_partner
    };
    return of(mockUser);
    // --- End Mock Data ---
  }

  // Method to update a user's profile
  updateUserProfile(userId: number, userData: Partial<User>): Observable<User> {
    // Replace with actual API call
    // Example: return this.http.patch<User>(`${this.apiUrl}/${userId}`, userData);

    // --- Mock Update Example (returns updated mock data) ---
    console.log('Updating user profile:', userId, userData);
    // In a real scenario, you'd merge userData with existing user data
    // For mock, just return a slightly modified user object
    const updatedMockUser: User = {
      id: userId,
      firstname: userData.firstname || 'Youns', // Example update logic
      lastname: userData.lastname || 'Kihl',
      email: userData.email || 'youns.dev@example.com',
      phone_number: userData.phone_number || '123-456-7890',
      address: userData.address || '123 Main St, Tétouan',
      avatar_url: userData.avatar_url || `https://ui-avatars.com/api/?name=${userData.firstname}+${userData.lastname }`,
      client_rating: 4.8,
      partner_rating: null,
      join_date: new Date('2022-01-15'),
      city: { id: 1, name: 'Tétouan' },
      role: 'USER', // Added role
      is_partner: false // Added is_partner
    };
    return of(updatedMockUser);
    // --- End Mock Update ---
  }

  // Add other methods as needed (e.g., uploadAvatar)
}
