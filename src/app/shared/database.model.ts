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
  password?: string; // Often excluded from frontend models
  email: string;
  phone_number: string;
  address?: string; // Optional based on usage
  role: UserRole;
  is_partner: boolean;
  avatar_url?: string;
  join_date: string; // Or Date
  client_rating?: number;
  client_reviews?: number;
  partner_rating?: number;
  partner_reviews?: number;
  longitude?: number;
  latitude?: number;
  city?: City; // Optional relation object
}

export type ListingStatus = 'active' | 'archived' | 'inactive';

export interface Listing {
  id: number;
  title: string;
  description: string;
  price_per_day: number;
  status: ListingStatus;
  is_premium: boolean;
  premium_start_date?: string; // Or Date
  premium_end_date?: string; // Or Date
  created_at: string; // Or Date
  delivery_option: boolean;
  category?: Category; // Optional relation object
  city?: City; // Optional relation object
  partner?: User; // Optional relation object
  images?: Image[]; // Optional relation object
  availabilities?: Availability[]; // Optional relation object
}

export type ReservationStatus = 'pending' | 'confirmed' | 'ongoing' | 'canceled' | 'completed';

export interface Reservation {
  id: number;
  start_date: string; // Or Date
  end_date: string; // Or Date
  total_cost: number;
  status: ReservationStatus;
  contract_url?: string;
  created_at: string; // Or Date
  delivery_option: boolean;
  client?: User; // Optional relation object
  partner?: User; // Optional relation object
  listing?: Listing; // Optional relation object
  payment?: Payment; // Optional relation object
  reviews?: Review[]; // Optional relation object
}

export interface Availability {
  listing_id: number; // Foreign key (part of composite key potentially)
  start_date: string; // Or Date
  end_date: string; // Or Date
  listing?: Listing; // Optional relation object
}

export interface Image {
  id: number;
  url: string;
  listing?: Listing; // Optional relation object
}

export type ReviewType = 'forObject' | 'forClient' | 'forPartner';

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  is_visible: boolean;
  created_at: string; // Or Date
  type: ReviewType;
  reviewer?: User; // Optional relation object
  reviewee?: User; // Optional relation object
  reservation?: Reservation; // Optional relation object
  listing?: Listing; // Optional relation object
}

export type NotificationType = 'reservation' | 'review' | 'reminder' | 'system';

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  is_read: boolean;
  created_at: string; // Or Date
  user?: User; // Optional relation object
}

export type PaymentStatus = 'pending' | 'completed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'paypal';

export interface Payment {
  id: number;
  amount: number;
  commission_fee: number;
  partner_payout: number;
  payment_date: string; // Or Date
  status: PaymentStatus;
  payment_method: PaymentMethod;
  transaction_id?: string;
  client?: User; // Optional relation object
  partner?: User; // Optional relation object
  reservation?: Reservation; // Optional relation object
}