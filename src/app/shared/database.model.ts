export interface City {
  id: number;
  name: string;
  // Add other relevant city properties if needed
}

export interface Category {
  id: number;
  name: string;
}

export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: number;
  username?: string; // Assuming username might be available
  firstname: string;
  lastname: string;
  email: string;
  phone_number: string | null;
  address: string | null;
  avatar_url: string | null;
  client_rating: number | null;
  partner_rating: number | null; // If applicable
  join_date: string | Date; // Use string if it comes as ISO string, Date otherwise
  city: City | null; // Assuming city is an object or null
  role: UserRole;
  is_partner: boolean;
  password?: string;
  client_reviews?: number;
  partner_reviews?: number;
  longitude?: number;
  latitude?: number;
  // Add other relevant user properties
}

export type ListingStatus = 'active' | 'archived' | 'paused';

export interface Listing {
  id: number;
  title: string;
  description: string;
  price_per_day: number;
  status: ListingStatus;
  is_premium: boolean;
  premium_start_date?: string;
  premium_end_date?: string;
  created_at: string;
  delivery_option: boolean;
  category?: Category;
  city?: City;
  partner?: User;
  images?: Image[];
  main_image?: string;
  availabilities?: Availability[];
}

export type ReservationStatus =
  | 'pending'
  | 'confirmed'
  | 'ongoing'
  | 'canceled'
  | 'completed';

export interface Reservation {
  id: number;
  start_date: string;
  end_date: string;
  total_cost: number;
  status: ReservationStatus;
  contract_url?: string;
  created_at: string;
  delivery_option: boolean;
  client?: User;
  partner?: User;
  listing?: Listing;
  payment?: Payment;
  reviews?: Review[];
  isReviewedByCurrentUser?: boolean;
}

export interface Availability {
  listing_id: number;
  start_date: string;
  end_date: string;
  listing?: Listing;
}

export interface Image {
  id: number;
  url: string;
  listing?: Listing;
}

export type ReviewType = 'forObject' | 'forClient' | 'forPartner';

export interface Review {
  id: number;
  reviewer?: Partial<User>; // Information about the person who left the review
  reviewee?: Partial<User>; // Information about the person being reviewed (likely the current user)
  rating: number;
  comment: string | null;
  is_visible: boolean;
  created_at: string | Date;
  type: ReviewType;
  reservation?: Reservation;
  listing?: Listing;
  // Add other relevant review properties
}

export type NotificationType = 'reservation' | 'review' | 'reminder' | 'system';

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  is_read: boolean;
  created_at: string;
  user?: User;
}

export type PaymentStatus = 'pending' | 'completed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'paypal';

export interface Payment {
  id: number;
  amount: number;
  commission_fee: number;
  partner_payout: number;
  payment_date: string;
  status: PaymentStatus;
  payment_method: PaymentMethod;
  transaction_id?: string;
  client?: User;
  partner?: User;
  reservation?: Reservation;
}
