import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rental } from '../models/rental.model';

@Injectable({
  providedIn: 'root',
})
export class RentalsService {
  mockRentals: Rental[] = [
    {
      id: 1,
      name: 'Pro Lighting',
      location: 'Rabat',
      price: 100,
      description: 'Contact me for more details',
      isPremium: true,
      mainImage: 'images/item-placeholder-.jpg',
      thumbnail1: 'images/item-placeholder-.jpg',
      thumbnail2: 'images/item-placeholder-.jpg',
    },
    {
      id: 2,
      name: 'Camera Canon 1000d',
      location: 'Tétouan',
      price: 200,
      description:
        'Capture stunning photos with the Canon 1000d, a versatile DSLR camera perfect for both beginners and enthusiasts. This camera delivers high-quality images with its 10.1 MP sensor and advanced features.',
      isPremium: false,
      mainImage: 'images/item-placeholder1.jpg',
      thumbnail1: 'images/item-placeholder1.jpg',
      thumbnail2: 'images/item-placeholder1.jpg',
    },
    {
      id: 3,
      name: 'Playstation 1',
      location: 'Casablanca',
      price: 10,
      description:
        'Searching for some Nostalgia, this is the right place !!! rent my playstation 1 for only 10$ a Week',
      isPremium: false,
      mainImage: 'images/playstation1.jpg',
      thumbnail1: 'images/playstation1.jpg',
      thumbnail2: 'images/playstation1.jpg',
    },
    {
      id: 4,
      name: 'Pro Lighting',
      location: 'Rabat',
      price: 100,
      description: 'Contact me for more details',
      isPremium: true,
      mainImage: 'images/item-placeholder-.jpg',
      thumbnail1: 'images/item-placeholder-.jpg',
      thumbnail2: 'images/item-placeholder-.jpg',
    },
    {
      id: 5,
      name: 'Camera Canon 1000d',
      location: 'Tétouan',
      price: 200,
      description:
        'Capture stunning photos with the Canon 1000d, a versatile DSLR camera perfect for both beginners and enthusiasts. This camera delivers high-quality images with its 10.1 MP sensor and advanced features.',
      isPremium: false,
      mainImage: 'images/item-placeholder1.jpg',
      thumbnail1: 'images/item-placeholder1.jpg',
      thumbnail2: 'images/item-placeholder1.jpg',
    }
  ];

  constructor() {}

  getRentals(): Observable<Rental[]> {
    return new Observable<Rental[]>((observer) => {
      observer.next(this.mockRentals);
      observer.complete();
    });
  }

  getRentalById(id: number): Observable<Rental> {
    return new Observable<Rental>((observer) => {
      const rentalFound = this.mockRentals.find(rental => rental.id === id);
      if (rentalFound) {
        observer.next(rentalFound);
        observer.complete();
      } else {
        observer.error(`Rental with id ${id} not found`);
      }
    });
  }
}
