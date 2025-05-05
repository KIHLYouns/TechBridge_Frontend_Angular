// User location coordinates
export interface UserCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

// Sign-Up Request model
export interface SignUpRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  isPartner?: boolean;
  coordinates?: UserCoordinates; 
}

// Sign-Up Response model
export interface SignUpResponse {
  'access-token': string;
}