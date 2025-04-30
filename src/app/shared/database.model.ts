export interface City {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  password?: string;
  email: string;
  phone_number: string;
  address?: string;
  role: UserRole;
  is_partner: boolean;
  avatar_url?: string;
  join_date: string;
  client_rating?: number;
  client_reviews?: number;
  partner_rating?: number;
  partner_reviews?: number;
  longitude?: number;
  latitude?: number;
  city?: City;
}

export type ListingStatus = 'active' | 'archived' | 'inactive';

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
  rating: number;
  comment?: string;
  is_visible: boolean;
  created_at: string;
  type: ReviewType;
  reviewer?: User;
  reviewee?: User;
  reservation?: Reservation;
  listing?: Listing;
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
