import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { City } from '../../../../../shared/database.model';
import { ListingsService } from '../../../services/listings.service';
import { Observable } from 'rxjs';

export interface AppliedFilters {
  cityId?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  minPartnerRating?: number | null;
  minEquipmentRating?: number | null;
}

@Component({
  selector: 'app-filters-side-bar',
  standalone: false,
  templateUrl: './filters-side-bar.component.html',
  styleUrls: ['./filters-side-bar.component.scss']
})
export class FiltersSideBarComponent implements OnInit {
  @Output() filtersApplied = new EventEmitter<AppliedFilters>();

  cities$!: Observable<City[]>;

  selectedCityId: number | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedPartnerRating: number = 0;
  selectedEquipmentRating: number = 0;

  partnerRatingOptions = [
    { value: 4, label: '4★ & plus' },
    { value: 3, label: '3★ & plus' },
    { value: 0, label: 'Tous' }
  ];
  equipmentRatingOptions = [
    { value: 4, label: '4★ & plus' },
    { value: 3, label: '3★ & plus' },
    { value: 0, label: 'Tous' }
  ];


  constructor(private listingsService: ListingsService) {}

  ngOnInit(): void {
    this.cities$ = this.listingsService.getCities();
  }

  applyFilters(): void {
    const filters: AppliedFilters = {
      cityId: this.selectedCityId,
      minPrice: this.minPrice === null || String(this.minPrice).trim() === '' ? null : Number(this.minPrice),
      maxPrice: this.maxPrice === null || String(this.maxPrice).trim() === '' ? null : Number(this.maxPrice),
      minPartnerRating: this.selectedPartnerRating,
      minEquipmentRating: this.selectedEquipmentRating,
    };
    this.filtersApplied.emit(filters);
  }

  clearFilters(): void {
    this.selectedCityId = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.selectedPartnerRating = 0;
    this.selectedEquipmentRating = 0;
    this.applyFilters();
  }

  onModelChange(): void {
    this.applyFilters();
  }
}