import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, City, User, Image, Listing } from '../../../shared/database.model';

@Injectable({
  providedIn: 'root',
})
export class ListingsService {
  mockCities: City[] = [
    { id: 1, name: 'Paris' },
    { id: 2, name: 'Lyon' },
    { id: 3, name: 'Marseille' },
  ];

  mockCategories: Category[] = [
    { id: 1, name: 'Heavy Machinery' },
    { id: 2, name: 'Power Tools' },
    { id: 3, name: 'Hand Tools' },
  ];

  mockPartners: User[] = [
    {
      id: 101,
      username: 'pro_builder',
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean.dupont@example.com',
      phone_number: '0123456789',
      role: 'USER',
      is_partner: true,
      join_date: '2023-01-15T10:00:00Z',
      partner_rating: 4.5,
      partner_reviews: 15,
      city: this.mockCities[0],
      avatar_url: 'https://via.placeholder.com/50/0000FF/808080?text=JD',
    },
    {
      id: 102,
      username: 'tool_master',
      firstname: 'Alice',
      lastname: 'Martin',
      email: 'alice.martin@example.com',
      phone_number: '0987654321',
      role: 'USER',
      is_partner: true,
      join_date: '2022-11-20T14:30:00Z',
      partner_rating: 4.8,
      partner_reviews: 25,
      city: this.mockCities[1],
      avatar_url: 'https://via.placeholder.com/50/FF0000/FFFFFF?text=AM',
    },
    {
      id: 103,
      username: 'fixit_felix',
      firstname: 'Felix',
      lastname: 'Bernard',
      email: 'felix.bernard@example.com',
      phone_number: '0611223344',
      role: 'USER',
      is_partner: true,
      join_date: '2024-02-10T09:00:00Z',
      partner_rating: 4.2,
      partner_reviews: 8,
      city: this.mockCities[2],
    },
  ];

  mockImages: Image[][] = [
    [
      {
        id: 1,
        url: 'https://via.placeholder.com/600x400/cccccc/000000?text=Excavator+1',
      },
      {
        id: 2,
        url: 'https://via.placeholder.com/100x80/cccccc/000000?text=Excavator+2',
      },
    ],
    [
      {
        id: 3,
        url: 'https://via.placeholder.com/600x400/999999/ffffff?text=Drill+1',
      },
      {
        id: 4,
        url: 'https://via.placeholder.com/100x80/999999/ffffff?text=Drill+2',
      },
    ],
    [
      {
        id: 5,
        url: 'https://via.placeholder.com/600x400/666666/ffffff?text=Hammer+Set+1',
      },
    ],
    [
      {
        id: 6,
        url: 'https://via.placeholder.com/600x400/333333/ffffff?text=Crane+1',
      },
      {
        id: 7,
        url: 'https://via.placeholder.com/100x80/333333/ffffff?text=Crane+2',
      },
      {
        id: 8,
        url: 'https://via.placeholder.com/100x80/333333/ffffff?text=Crane+3',
      },
    ],
    [
      {
        id: 9,
        url: 'https://via.placeholder.com/600x400/aaaaaa/000000?text=Saw+1',
      },
    ],
  ];

  mockListings: Listing[] = [
    {
      id: 1,
      title: 'Mini Excavator 1.5T',
      description:
        'Compact and powerful mini excavator, perfect for small to medium construction sites. Easy to operate.',
      price_per_day: 150,
      status: 'active',
      is_premium: true,
      premium_start_date: '2025-04-01T00:00:00Z',
      premium_end_date: '2025-05-01T00:00:00Z',
      created_at: '2024-03-10T08:00:00Z',
      delivery_option: true,
      category: this.mockCategories[0],
      city: this.mockCities[0],
      partner: this.mockPartners[0],
      images: this.mockImages[0],
      availabilities: [],
    },
    {
      id: 2,
      title: 'Professional Cordless Drill Set',
      description:
        'High-performance cordless drill with two batteries and charger. Suitable for various drilling tasks.',
      price_per_day: 25,
      status: 'active',
      is_premium: false,
      created_at: '2024-04-15T11:30:00Z',
      delivery_option: false,
      category: this.mockCategories[1],
      city: this.mockCities[1],
      partner: this.mockPartners[1],
      images: this.mockImages[1],
      availabilities: [],
    },
    {
      id: 3,
      title: 'Complete Hammer Set',
      description:
        'Set of various hammers for different applications, including claw hammer, mallet, and sledgehammer.',
      price_per_day: 10,
      status: 'active',
      is_premium: false,
      created_at: '2024-04-20T16:45:00Z',
      delivery_option: false,
      category: this.mockCategories[2],
      city: this.mockCities[2],
      partner: this.mockPartners[2],
      images: this.mockImages[2],
      availabilities: [],
    },
    {
      id: 4,
      title: 'Mobile Tower Crane',
      description:
        'Versatile mobile tower crane with high lifting capacity. Requires certified operator.',
      price_per_day: 500,
      status: 'active',
      is_premium: true,
      premium_start_date: '2025-03-15T00:00:00Z',
      premium_end_date: '2025-06-15T00:00:00Z',
      created_at: '2024-02-01T09:15:00Z',
      delivery_option: true,
      category: this.mockCategories[0],
      city: this.mockCities[0],
      partner: this.mockPartners[0],
      images: this.mockImages[3],
      availabilities: [],
    },
    {
      id: 5,
      title: 'Heavy Duty Circular Saw',
      description:
        'Powerful circular saw for cutting wood and other materials. Blade included.',
      price_per_day: 35,
      status: 'active',
      is_premium: false,
      created_at: '2024-01-25T14:00:00Z',
      delivery_option: true,
      category: this.mockCategories[1],
      city: this.mockCities[1],
      partner: this.mockPartners[1],
      images: this.mockImages[4],
      availabilities: [],
    },
  ];

  constructor(private http: HttpClient) {}

  getListings(): Observable<Listing[]> {
    return new Observable<Listing[]>((observer) => {
      observer.next(this.mockListings);
      observer.complete();
    });
  }

  getListingById(id: number): Observable<Listing> {
    return new Observable<Listing>((observer) => {
      const listingFound = this.mockListings.find(
        (listing) => listing.id === id
      );
      if (listingFound) {
        observer.next(listingFound);
        observer.complete();
      } else {
        observer.error(`Listing with id ${id} not found`);
      }
    });
  }
}
