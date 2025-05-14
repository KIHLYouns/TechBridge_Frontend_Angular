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
import {
  ListingReview,
  ReviewService,
} from '../../../../core/services/review.service';
import { Listing, Review } from '../../../../shared/database.model';
import { TokenService } from '../../../auth/services/token.service';
import {
  CreateReservationRequest,
  ReservationsService,
} from '../../../my-rentals/services/reservations.service';
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
  reviews: Review[] = [];

  private map!: L.Map;
  private mapInitialized = false;
  private calendarInstance: FlatpickrInstance | null = null;

  selectedStartDate: string | null = null;
  selectedEndDate: string | null = null;
  numberOfDays: number = 0;
  rentalCost: number | null = null;
  totalPrice: number | null = null;

  isSubmittingReservation: boolean = false;
  reservationSubmittedSuccess: boolean = false;
  reservationError: string | null = null;

  private routeSub!: Subscription;
  private listingSub!: Subscription;

  listingReviews: ListingReview[] = [];
  isLoadingReviews: boolean = false;
  reviewsError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private listingsService: ListingsService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private tokenService: TokenService,
    private reservationsService: ReservationsService,
    private reviewService: ReviewService
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
          this.selectedImageUrl = listing.images?.[0]?.full_url || null;
          this.cdRef.markForCheck();
          // Retarder l'initialisation pour garantir que le DOM est prêt
          setTimeout(() => {
            this.initializeMapAndCalendar();
          }, 100);
          this.loadListingReviews(listing.id);
        } else {
          this.router.navigate(['/not-found']);
        }
      }),
      filter((listing): listing is Listing => !!listing)
    );
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

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

  private initializeMapAndCalendar(): void {
    if (!this.listingData) {
      console.warn('listingData non disponible.');
      return;
    }
    // Vérifier et initialiser la carte
    const mapDiv = document.getElementById('map');
    if (mapDiv && !this.mapInitialized) {
      this.initMap();
    } else if (!mapDiv) {
      console.warn('Conteneur #map non trouvé dans le template.');
    }
    // Vérifier et initialiser le calendrier
    const calendarDiv = document.getElementById('reservation-calendar');
    if (calendarDiv && !this.calendarInstance) {
      this.initCalendar(calendarDiv);
    } else if (!calendarDiv) {
      console.warn('Conteneur #reservation-calendar non trouvé dans le template.');
    }
    this.cdRef.markForCheck();
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

      setTimeout(() => {
        if (this.map) {
          // Vérifier si la carte existe toujours (au cas où le composant serait détruit rapidement)
          this.map.invalidateSize();
        }
      }, 100);
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

    const enabledDates =
      this.listingData.availabilities?.map((availability) => {
        return {
          from: availability.start_date, // Doit être au format YYYY-MM-DD
          to: availability.end_date, // Doit être au format YYYY-MM-DD
        };
      }) || [];

    this.calendarInstance = flatpickr(element, {
      mode: 'range',
      inline: true,
      dateFormat: 'Y-m-d', // Format standard pour la logique
      minDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      showMonths: 2,
      locale: english,
      enable: enabledDates.length > 0 ? enabledDates : [],
      onChange: (selectedDates, _dateStr, _instance) => {
        this.updatePriceCalculation(selectedDates);
        this.cdRef.markForCheck();
      },
    });

    if (enabledDates.length === 0) {
      console.warn(
        "Aucune date de disponibilité n'est configurée pour cette annonce."
      );
    }
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

  rentObject(): void {
    if (!this.selectedStartDate || !this.selectedEndDate || !this.listingData) {
      this.reservationError = 'Please select reservation dates.';
      return;
    }

    // Reset states
    this.isSubmittingReservation = true;
    this.reservationError = null;
    this.reservationSubmittedSuccess = false;

    // Get client ID from the token service
    const clientId = this.tokenService.getUserIdFromToken();
    if (!clientId) {
      this.isSubmittingReservation = false;
      this.reservationError =
        'You must be logged in to make a reservation. Please sign in first.';
      this.cdRef.markForCheck();
      return;
    }

    // Format dates to YYYY-MM-DD as required by API
    const formatDateForApi = (dateStr: string): string => {
      const parts = dateStr.split(' '); // "Mar 15" -> ["Mar", "15"]
      const month = new Date(Date.parse(parts[0] + ' 1, 2025')).getMonth() + 1;
      const day = parseInt(parts[1]);
      const year = new Date().getFullYear(); // Current year or use hard-coded 2025
      return `${year}-${month.toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')}`;
    };

    // Create the request object
    const request: CreateReservationRequest = {
      listing_id: this.listingData.id,
      start_date: formatDateForApi(this.selectedStartDate),
      end_date: formatDateForApi(this.selectedEndDate),
      client_id: clientId,
      delivery_option: !!this.listingData.delivery_option,
    };

    console.log('the suubmitted reservation :');
    console.log(request);

    this.reservationsService.createReservation(request).subscribe({
      next: () => {
        this.isSubmittingReservation = false;
        this.reservationSubmittedSuccess = true;
        this.cdRef.markForCheck();
        setTimeout(() => {
          this.router.navigate(['/my-rentals']);
        }, 2000);
      },
      error: (error) => {
        this.isSubmittingReservation = false;
        this.reservationError =
          error.message || 'Failed to create reservation. Please try again.';
        this.cdRef.markForCheck();
      },
    });
  }

  // Add method to load listing reviews
  loadListingReviews(listingId: number): void {
    this.isLoadingReviews = true;
    this.reviewsError = null;

    this.reviewService.getListingReviews(listingId).subscribe({
      next: (reviews) => {
        this.listingReviews = reviews;
        this.isLoadingReviews = false;
        this.cdRef.markForCheck();
      },
      error: (error) => {
        console.error('Error loading listing reviews:', error);
        this.reviewsError = 'Failed to load reviews. Please try again.';
        this.isLoadingReviews = false;
        this.cdRef.markForCheck();
      },
    });
  }

  // Add helper method for stars
  getStarArray2(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getDefaultAvatar(event: Event, username?: string): void {
    const target = event.target as HTMLImageElement;
    const name = username || 'Default User';

    const encodedName = encodeURIComponent(name.trim()).replace(/%20/g, '+');
    target.src = `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=128`;
    target.onerror = null; // Prevents infinite error loops
  }
}
