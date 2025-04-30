import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import flatpickr from 'flatpickr';
import { english } from 'flatpickr/dist/l10n/default';
import { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance';
import * as L from 'leaflet';
import { Observable, Subscription } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { Listing } from '../../../../shared/database.model';
import { ListingsService } from '../../services/listings.service';

const defaultIcon = L.icon({
  iconUrl: 'assets/images/marker-icon.png',
  iconRetinaUrl: 'assets/images/marker-icon-2x.png',
  shadowUrl: 'assets/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

@Component({
  selector: 'app-listing-detail',
  standalone: false,
  templateUrl: './listing-detail.component.html',
  styleUrls: ['./listing-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListingDetailComponent
  implements OnInit, AfterViewInit, OnDestroy
{

  listing$: Observable<Listing | null>;
  listingData: Listing | null = null;
  selectedImageUrl: string | null = null;

  private map!: L.Map;
  private mapInitialized = false;
  private calendarInstance: FlatpickrInstance | null = null;

  selectedStartDate: string | null = null;
  selectedEndDate: string | null = null;
  numberOfDays: number = 0;
  rentalCost: number | null = null;
  totalPrice: number | null = null;

  private routeSub!: Subscription;
  private listingSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private listingsService: ListingsService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {
    this.listing$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        if (!id) {
          this.router.navigate(['/']);
          return [];
        }
        return this.listingsService.getListingById(+id);
      }),
      tap((listing) => {
        if (listing) {
          this.listingData = listing;
          this.selectedImageUrl = listing.images?.[0]?.url || null;
          this.cdRef.markForCheck();
          this.initializeMapAndCalendar();
        } else {
          this.router.navigate(['/not-found']);
        }
      }),
      filter((listing): listing is Listing => !!listing)
    );
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeMapAndCalendar();
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.listingSub) {
      this.listingSub.unsubscribe();
    }
    if (this.map) {
      this.map.remove();
    }
    if (this.calendarInstance) {
      this.calendarInstance.destroy();
    }
  }

  selectImage(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;
    this.cdRef.markForCheck();
  }

  // Méthode qui récupère les éléments via document.getElementById
  private initializeMapAndCalendar(): void {
    if (this.listingData) {
      setTimeout(() => {
        // Initialiser la carte si l'élément est présent et si non déjà initialisée
        const mapDiv = document.getElementById('map');
        if (mapDiv && !this.mapInitialized) {
          this.initMap();
        }
        // Initialiser le calendrier
        const calendarDiv = document.getElementById('reservation-calendar');
        if (calendarDiv && !this.calendarInstance) {
          this.initCalendar(calendarDiv);
        }
      }, 0);
    }
  }

  private initMap(): void {
    if (
      !this.listingData?.partner?.latitude ||
      !this.listingData?.partner?.longitude ||
      this.mapInitialized
    ) {
      console.warn(
        'Map initialization skipped: Missing partner coordinates or already initialized.'
      );
      return;
    }

    try {
      this.mapInitialized = true;
      const lat = this.listingData.partner.latitude;
      const lon = this.listingData.partner.longitude;
      const approxRadius = 350;

      this.map = L.map('map', {
        center: [lat, lon],
        zoom: 14,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(this.map);

      L.circle([lat, lon], {
        color: 'rgba(212, 178, 16, 0.6)',
        weight: 1,
        fillColor: 'rgba(244, 206, 20, 0.3)',
        fillOpacity: 0.3,
        radius: approxRadius,
      }).addTo(this.map);

      L.control
        .attribution({
          position: 'bottomright',
          prefix: '',
        })
        .addTo(this.map);

      setTimeout(() => this.map.invalidateSize(), 100);
      this.cdRef.markForCheck();
    } catch (e) {
      console.error('Error initializing map:', e);
      this.mapInitialized = false;
    }
  }

  private initCalendar(element: HTMLElement): void {
    if (this.calendarInstance || !this.listingData) {
      return;
    }

    this.calendarInstance = flatpickr(element, {
      mode: 'range',
      inline: true,
      dateFormat: 'Y-m-d',
      minDate: 'today',
      showMonths: 2,
      locale: english,
      onChange: (selectedDates, dateStr, instance) => {
        this.updatePriceCalculation(selectedDates);
        this.cdRef.markForCheck();
      },
    });
  }

  private updatePriceCalculation(dates: Date[]): void {
    if (dates.length === 2 && this.listingData?.price_per_day) {
      const start = dates[0];
      const end = dates[1];
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      this.numberOfDays = diffDays;
      this.selectedStartDate = this.formatDate(start);
      this.selectedEndDate = this.formatDate(end);
      this.rentalCost = diffDays * this.listingData.price_per_day;
      this.totalPrice = this.rentalCost;
    } else {
      this.numberOfDays = 0;
      this.selectedStartDate = null;
      this.selectedEndDate = null;
      this.rentalCost = null;
      this.totalPrice = null;
    }
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getStarArray(rating: number | undefined | null): number[] {
    return rating ? Array(Math.floor(rating)).fill(0) : [];
  }

  rentObject() {
    throw new Error('Method not implemented.');
  }
}
