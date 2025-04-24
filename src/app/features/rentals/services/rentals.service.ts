import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rental } from '../models/rental.model';

@Injectable({
  providedIn: 'root'
})
export class RentalsService {

  constructor() { }
  
  getRentals(): Observable<Rental[]> {
    return new Observable<Rental[]>((observer) => {
      const mockRentals: Rental[] = [
        { id: 1, name: 'Rental 1', location: 'Location 1', price: 100 },
        { id: 2, name: 'Rental 2', location: 'Location 2', price: 200 },
        { id: 3, name: 'Rental 3', location: 'Location 3', price: 300 },
      ];
      observer.next(mockRentals);
      observer.complete();
    });
  }
}
