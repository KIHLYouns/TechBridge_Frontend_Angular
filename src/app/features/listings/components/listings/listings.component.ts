import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Listing } from '../../../../shared/database.model';
import { ListingsService } from '../../services/listings.service';
import { AppliedFilters } from './filters-side-bar/filters-side-bar.component'; // Importer l'interface

interface InternalFilters {
  categoryId?: number | null;
  cityId?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  partner_rating_gte?: number | null;
  equipment_rating_gte?: number | null;
}

@Component({
  selector: 'app-listings',
  standalone: false,
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss'] // Corrigé en styleUrls
})
export class ListingsComponent implements OnInit {
  public listings$!: Observable<Listing[]>;
  private filtersSubject = new BehaviorSubject<InternalFilters>({});

  // Pour mapper les options de tri du front-end aux paramètres du service
  private sortOptionMap: { [key: string]: { field: string, order: 'asc' | 'desc' } } = {
    'recently_added': { field: 'id', order: 'desc' }, // ou un champ 'createdAt' si disponible
    'price_asc': { field: 'price_per_day', order: 'asc' },
    'price_desc': { field: 'price_per_day', order: 'desc' }
  };

  constructor(private listingsService: ListingsService) {}

  ngOnInit(): void {
    this.listings$ = this.filtersSubject.pipe(
      switchMap(filters => {
        const serviceFilters: any = { ...filters }; // Copie pour éviter de modifier l'original
        
        // Supprimer les filtres de notation si "Tous" (0) est sélectionné
        if (serviceFilters.partner_rating_gte === 0) delete serviceFilters.partner_rating_gte;
        if (serviceFilters.equipment_rating_gte === 0) delete serviceFilters.equipment_rating_gte;
        
        return this.listingsService.getListings(serviceFilters);
      }),
      map(listings => { // Ajout de l'opérateur map pour le tri
        return listings.sort((a, b) => {
          if (a.is_premium && !b.is_premium) {
            return -1; // a vient avant b
          }
          if (!a.is_premium && b.is_premium) {
            return 1; // b vient avant a
          }
          return 0; // l'ordre reste inchangé
        });
      }),
      startWith([]) // Émettre un tableau vide initialement
    );
    this.loadListingsWithCurrentFilters(); // Premier chargement
  }

  loadListingsWithCurrentFilters(): void {
    this.filtersSubject.next(this.filtersSubject.value);
  }

  onCategorySelected(categoryId: number | null): void {
    const currentFilters = this.filtersSubject.value;
    this.filtersSubject.next({ ...currentFilters, categoryId: categoryId });
  }

  onFiltersApplied(appliedFilters: AppliedFilters): void {
    const currentFilters = this.filtersSubject.value;
    const newInternalFilters: InternalFilters = {
      ...currentFilters, // Conserver categoryId
      cityId: appliedFilters.cityId,
      minPrice: appliedFilters.minPrice,
      maxPrice: appliedFilters.maxPrice,
      partner_rating_gte: appliedFilters.minPartnerRating,
      equipment_rating_gte: appliedFilters.minEquipmentRating,
    };
    this.filtersSubject.next(newInternalFilters);
  }
}