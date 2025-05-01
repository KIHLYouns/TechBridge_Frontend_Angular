import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs'; // Import throwError
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
      return throwError(() => new Error('User ID not found')); // Return an error observable
    }
    // Replace with actual API call
    // Example: return this.http.get<User>(`${this.apiUrl}/${userId}`);

    // --- Mock Data Example ---
    const mockUser: User = {
      id: userId,
      username: 'younsk', // Added username
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
      is_partner: false, // Added is_partner
      latitude: 35.5785, // Added latitude
      longitude: -5.3684, // Added longitude
      client_reviews: 5 // Example value for review count
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
    // Simulate fetching the current user to merge updates
    const currentMockUser: User = { // Re-create or fetch the current state
        id: userId,
        username: 'younsk',
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
        role: 'USER',
        is_partner: false,
        latitude: 35.5785,
        longitude: -5.3684,
        client_reviews: 5 // Keep existing review count unless updated
    };

    // Merge existing data with updates
    const updatedMockUser: User = {
      ...currentMockUser, // Start with current data
      ...userData, // Apply updates
      // Ensure avatar updates if name changes (example logic)
      avatar_url: userData.firstname || userData.lastname
        ? `https://ui-avatars.com/api/?name=${userData.firstname || currentMockUser.firstname}+${userData.lastname || currentMockUser.lastname}`
        : currentMockUser.avatar_url,
    };
    console.log('Returning updated mock user:', updatedMockUser);
    return of(updatedMockUser);
    // --- End Mock Update ---
  }

  // Add other methods as needed (e.g., uploadAvatar)
}
