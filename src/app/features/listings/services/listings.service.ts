import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  Category,
  City,
  Image,
  Listing,
  User,
} from '../../../shared/database.model';

@Injectable({
  providedIn: 'root',
})
export class ListingsService {
  mockCities: City[] = [
    { id: 1, name: 'Casablanca' },
    { id: 2, name: 'Marrakech' },
    { id: 3, name: 'Rabat' },
    { id: 4, name: 'Tétouan' },
    { id: 5, name: 'Tangier' },
  ];

  mockCategories: Category[] = [
    { id: 1, name: 'Gaming & eSports' },
    { id: 2, name: 'Drones & Aerial Technology' },
    { id: 3, name: 'Professional Photo & Video' },
    { id: 4, name: 'Audio & Studio Equipment' },
    { id: 6, name: 'Virtual/Augmented Reality' },
    { id: 7, name: 'Professional Technology' },
  ];

  mockPartners: User[] = [
    {
      id: 101,
      username: 'hmed_samaki',
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean.dupont@example.com',
      phone_number: '0123456789',
      address: '123 Rue Principale, Casablanca',
      client_rating: 4.5,
      role: 'USER',
      is_partner: true,
      join_date: '2023-01-15T10:00:00Z',
      partner_rating: 4.7,
      partner_reviews: 22,
      city: this.mockCities[0],
      avatar_url: 'https://ui-avatars.com/api/?name=Jean+Dupont',
      longitude: -5.364456,
      latitude: 35.56219,
    },
    {
      id: 102,
      username: 'samir_mofakir',
      firstname: 'Alice',
      lastname: 'Martin',
      email: 'alice.martin@example.com',
      phone_number: '0987654321',
      address: '45 Avenue Hassan II, Marrakech',
      client_rating: 4.8,
      role: 'USER',
      is_partner: true,
      join_date: '2022-11-20T14:30:00Z',
      partner_rating: 4.9,
      partner_reviews: 35,
      city: this.mockCities[1],
      avatar_url: 'https://ui-avatars.com/api/?name=Alice+Martin',
      longitude: -5.364456,
      latitude: 35.56219,
    },
    {
      id: 103,
      username: 'ilyas_lmatag',
      firstname: 'Felix',
      lastname: 'Bernard',
      email: 'felix.bernard@example.com',
      phone_number: '0611223344',
      address: null,
      client_rating: null,
      role: 'USER',
      is_partner: true,
      join_date: '2024-02-10T09:00:00Z',
      partner_rating: 4.5,
      partner_reviews: 18,
      city: this.mockCities[2],
      avatar_url: 'https://ui-avatars.com/api/?name=Felix+Bernard',
      longitude: -5.364456,
      latitude: 35.56219,
    },
    {
      id: 104,
      username: 'wadi3',
      firstname: 'Sophie',
      lastname: 'Leroy',
      email: 'sophie.leroy@example.com',
      phone_number: '0712345678',
      address: '78 Boulevard Mohammed V, Tétouan',
      client_rating: 4.2,
      role: 'USER',
      is_partner: true,
      join_date: '2023-05-25T11:00:00Z',
      partner_rating: 4.6,
      partner_reviews: 28,
      city: this.mockCities[3],
      avatar_url: 'https://ui-avatars.com/api/?name=Sophie+Leroy',
      longitude: -5.364456,
      latitude: 35.56219,
    },
  ];

  mockImages: Image[][] = [
    [
      { id: 1, url: 'https://picsum.photos/600/400?random=1' },
      { id: 2, url: 'https://picsum.photos/100/80?random=2' },
    ],
    [
      { id: 3, url: 'https://picsum.photos/600/400?random=3' },
      { id: 4, url: 'https://picsum.photos/100/80?random=4' },
    ],
    [{ id: 5, url: 'https://picsum.photos/600/400?random=5' }],
    [
      { id: 6, url: 'https://picsum.photos/600/400?random=6' },
      { id: 7, url: 'https://picsum.photos/100/80?random=7' },
      { id: 8, url: 'https://picsum.photos/100/80?random=8' },
    ],
    [{ id: 9, url: 'https://picsum.photos/600/400?random=9' }],
    [
      { id: 10, url: 'https://picsum.photos/600/400?random=10' },
      { id: 11, url: 'https://picsum.photos/100/80?random=11' },
    ],
    [{ id: 12, url: 'https://picsum.photos/600/400?random=12' }],
  ];

  mockListings: Listing[] = [
    {
      id: 1,
      title: 'PlayStation 5 Slim',
      description:
        'Next-gen gaming console with ultra-fast SSD and immersive DualSense controller. Includes 2 controllers and popular game.',
      price_per_day: 35,
      status: 'active',
      is_premium: true,
      premium_start_date: '2025-03-20T00:00:00Z',
      premium_end_date: '2025-06-20T00:00:00Z',
      created_at: '2024-02-15T09:15:00Z',
      delivery_option: false,
      category: this.mockCategories.find((cat) => cat.id === 1),
      city: this.mockCities[0],
      partner: this.mockPartners[0],
      images: this.mockImages[0],
      availabilities: [],
    },
    {
      id: 2,
      title: 'DJI Mini 4 Pro Drone',
      description:
        'Compact and powerful drone with 4K HDR video recording and advanced obstacle sensing. Easy to fly, perfect for aerial photography.',
      price_per_day: 50,
      status: 'active',
      is_premium: false,
      created_at: '2024-01-20T14:00:00Z',
      delivery_option: true,
      category: this.mockCategories.find((cat) => cat.id === 2),
      city: this.mockCities[1],
      partner: this.mockPartners[1],
      images: this.mockImages[1],
      availabilities: [],
    },
    {
      id: 3,
      title: 'Sony Alpha a7 IV Camera',
      description:
        'Full-frame mirrorless camera with exceptional image quality and autofocus performance. Includes 24-70mm lens.',
      price_per_day: 60,
      status: 'active',
      is_premium: true,
      premium_start_date: '2025-04-01T00:00:00Z',
      premium_end_date: '2025-05-01T00:00:00Z',
      created_at: '2024-03-05T10:00:00Z',
      delivery_option: true,
      category: this.mockCategories.find((cat) => cat.id === 3),
      city: this.mockCities[2],
      partner: this.mockPartners[2],
      images: this.mockImages[2],
      availabilities: [],
    },
    {
      id: 4,
      title: 'Shure SM7B Microphone',
      description:
        'Legendary vocal microphone for studio recording, podcasting, and streaming. Requires audio interface.',
      price_per_day: 20,
      status: 'active',
      is_premium: false,
      created_at: '2024-04-15T11:30:00Z',
      delivery_option: false,
      category: this.mockCategories.find((cat) => cat.id === 4),
      city: this.mockCities[3],
      partner: this.mockPartners[3],
      images: this.mockImages[3],
      availabilities: [],
    },
    {
      id: 5,
      title: 'Meta Quest 3 VR Headset',
      description:
        'Immersive virtual reality headset with high-resolution display and intuitive controllers. Access a vast library of games and experiences.',
      price_per_day: 40,
      status: 'active',
      is_premium: true,
      premium_start_date: '2025-04-10T00:00:00Z',
      premium_end_date: '2025-07-10T00:00:00Z',
      created_at: '2024-03-15T08:00:00Z',
      delivery_option: true,
      category: this.mockCategories.find((cat) => cat.id === 6),
      city: this.mockCities[4],
      partner: this.mockPartners[0],
      images: this.mockImages[4],
      availabilities: [],
    },
    {
      id: 6,
      title: 'BenQ TK700 4K Projector',
      description:
        'High-brightness 4K projector ideal for home cinema and gaming. Low input lag for responsive gameplay.',
      price_per_day: 55,
      status: 'active',
      is_premium: false,
      created_at: '2024-04-10T16:45:00Z',
      delivery_option: false,
      category: this.mockCategories.find((cat) => cat.id === 7),
      city: this.mockCities[0],
      partner: this.mockPartners[1],
      images: this.mockImages[5],
      availabilities: [],
    },
    {
      id: 7,
      title: 'GoPro HERO12 Black',
      description:
        'Latest action camera with stunning 5.3K video, HyperSmooth stabilization, and rugged waterproof design.',
      price_per_day: 25,
      status: 'active',
      is_premium: false,
      created_at: '2024-04-25T12:00:00Z',
      delivery_option: true,
      category: this.mockCategories.find((cat) => cat.id === 3),
      city: this.mockCities[1],
      partner: this.mockPartners[2],
      images: this.mockImages[6],
      availabilities: [],
    },
  ];

  constructor(private http: HttpClient) {}

  getListings(): Observable<Listing[]> {
    const activeListings = this.mockListings.filter(
      (listing) => listing.status === 'active'
    );
    return of(activeListings).pipe(delay(500));
  }

  getListingById(id: number): Observable<Listing | undefined> {
    const listing = this.mockListings.find((l) => l.id === id);
    return of(listing).pipe(delay(100));
  }

  getCategories(): Observable<Category[]> {
    return of(this.mockCategories).pipe(delay(100));
  }

  getAllListings(): Observable<Listing[]> {
    return of(this.mockListings).pipe(delay(200));
  }
}
