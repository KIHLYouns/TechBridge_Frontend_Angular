// User location coordinates
export interface UserCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

// Sign-Up Request model
export interface SignUpRequest {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone_number: string;
  latitude: number;
  longitude: number;
}

// Sign-Up Response model
export interface SignUpResponse {
  'access-token': string;
}
