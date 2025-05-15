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

// Add these properties to the ListingDetailComponent class:
showPartnerReviewsModal = false;
selectedPartnerId: number | null = null;

// Add to ListingDetailComponent class properties
needsDelivery: boolean = false;
deliveryFee: number = 10; // Default delivery fee - could be fetched from config or backend


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

  // Add this method to ListingDetailComponent class
toggleDelivery(): void {
  this.needsDelivery = !this.needsDelivery;
  this.cdRef.markForCheck();
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

 /* private initCalendar(element: HTMLElement): void {
    if (this.calendarInstance || !this.listingData) {
      return;
    }

    console.log("Initializing calendar with listing data:", this.listingData);

      // Helper function to normalize any date format to YYYY-MM-DD
  const formatToYYYYMMDD = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

    const enabledDates =
      this.listingData.availabilities?.map((availability) => {
        return {
          from: availability.start_date, // Doit être au format YYYY-MM-DD
          to: availability.end_date, // Doit être au format YYYY-MM-DD
        };
      }) || [];

  // Extract booked dates
  const bookedDates: string[] = [];
  if (this.listingData.booked && this.listingData.booked.length > 0) {
    console.log("Processing booked dates:", this.listingData.booked);
    
    this.listingData.booked.forEach(booking => {
      // Handle ISO format with microseconds
      const startStr = formatToYYYYMMDD(booking.start_date);
      const endStr = formatToYYYYMMDD(booking.end_date);
      
      const start = new Date(startStr);
      const end = new Date(endStr);
      
      // Validate dates before processing
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error(`Invalid booking dates: ${booking.start_date} - ${booking.end_date}`);
        return;
      }
      
      console.log(`Processing booked range: ${startStr} to ${endStr}`);
      
      // Loop through each day and add it to bookedDates
      const currentDate = new Date(start);
      while (currentDate <= end) {
        const dateStr = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
        bookedDates.push(dateStr);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
  }
  
  console.log("Booked dates to disable:", bookedDates);

    this.calendarInstance = flatpickr(element, {
      mode: 'range',
      inline: true,
      dateFormat: 'Y-m-d', // Format standard pour la logique
      minDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      showMonths: 2,
      locale: english,
      enable: enabledDates.length > 0 ? enabledDates : [],
      disable: bookedDates,
    onChange: (selectedDates, _dateStr, _instance) => {
      // Check if any selected date is in bookedDates
      const hasBookedDate = selectedDates.some(date => {
        const dateStr = date.toISOString().split('T')[0];
        return bookedDates.includes(dateStr);
      });
      
      if (hasBookedDate) {
        // Reset selection if trying to select a booked date
        this.calendarInstance?.clear();
        this.selectedStartDate = null;
        this.selectedEndDate = null;
        this.rentalCost = null;
        this.totalPrice = null;
        console.warn("Cannot select booked dates");
        // Optionally show a message to the user
        this.reservationError = "Some selected dates are already booked. Please choose different dates.";
        setTimeout(() => {
          this.reservationError = null;
          this.cdRef.markForCheck();
        }, 5000);
      } else {
        this.reservationError = null;
        this.updatePriceCalculation(selectedDates);
      }
      this.cdRef.markForCheck();
    },
    onDayCreate: function(dObj, dStr, fp, dayElem) {
      const dateStr = dayElem.dateObj.toISOString().split('T')[0];
      if (bookedDates.includes(dateStr)) {
        dayElem.classList.add('reserved');
      }
    }
    });

    if (enabledDates.length === 0) {
      console.warn(
        "Aucune date de disponibilité n'est configurée pour cette annonce."
      );
    }
  } */

  private initCalendar(element: HTMLElement): void {
  if (this.calendarInstance || !this.listingData) {
    return;
  }

  console.log("Initializing calendar with listing data:", this.listingData);
  
  // Helper function to extract just the date part (YYYY-MM-DD) from any date string
  const extractDatePart = (dateStr: string): string => {
    // For ISO format dates, split on T and take first part
    if (dateStr.includes('T')) {
      return dateStr.split('T')[0];
    }
    // For YYYY-MM-DD format, return as is
    return dateStr;
  };

  // Extract available date ranges - keep as is since they're already in YYYY-MM-DD format
  const enabledDates = this.listingData.availabilities?.map((availability) => {
    return {
      from: availability.start_date,
      to: availability.end_date,
    };
  }) || [];
  
  console.log("Available date ranges:", enabledDates);

  // Extract booked dates
  const bookedDates: string[] = [];
  if (this.listingData.booked && this.listingData.booked.length > 0) {
    console.log("Processing booked dates:", this.listingData.booked);
    
    this.listingData.booked.forEach(booking => {
      // Extract just the date parts from the ISO strings
      const startDateStr = extractDatePart(booking.start_date);
      const endDateStr = extractDatePart(booking.end_date);
      
      console.log(`Processing booked range: ${startDateStr} to ${endDateStr}`);
      
      // Parse dates using YYYY-MM-DD format to avoid timezone issues
      const [startYear, startMonth, startDay] = startDateStr.split('-').map(Number);
      const [endYear, endMonth, endDay] = endDateStr.split('-').map(Number);
      
      // Create dates setting hours to noon to avoid timezone shifts
      const startDate = new Date(startYear, startMonth - 1, startDay, 12, 0, 0);
      const endDate = new Date(endYear, endMonth - 1, endDay, 12, 0, 0);
      
      // Validate dates
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error(`Invalid booking dates: ${startDateStr} - ${endDateStr}`);
        return;
      }
      
      // Generate all days in the range
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        
        const formattedDate = `${year}-${month}-${day}`;
        bookedDates.push(formattedDate);
        
        // Move to next day without timezone issues
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
  }
  
  console.log("Booked dates to disable:", bookedDates);

  this.calendarInstance = flatpickr(element, {
    mode: 'range',
    inline: true,
    dateFormat: 'Y-m-d',
    minDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    showMonths: 2,
    locale: english,
    enable: enabledDates.length > 0 ? enabledDates : [],
    disable: bookedDates,
    onChange: (selectedDates, _dateStr, _instance) => {
      // Check if any selected date is in bookedDates
      const hasBookedDate = selectedDates.some(date => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        return bookedDates.includes(dateStr);
      });
      
      if (hasBookedDate) {
        // Reset selection if trying to select a booked date
        this.calendarInstance?.clear();
        this.selectedStartDate = null;
        this.selectedEndDate = null;
        this.rentalCost = null;
        this.totalPrice = null;
        console.warn("Cannot select booked dates");
        this.reservationError = "Some selected dates are already booked. Please choose different dates.";
        setTimeout(() => {
          this.reservationError = null;
          this.cdRef.markForCheck();
        }, 5000);
      } else {
        this.reservationError = null;
        this.updatePriceCalculation(selectedDates);
      }
      this.cdRef.markForCheck();
    },
    onDayCreate: function(dObj, dStr, fp, dayElem) {
      // Format date to match our bookedDates format
      const date = dayElem.dateObj;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      if (bookedDates.includes(dateStr)) {
        dayElem.classList.add('reserved');
      }
    }
  });

  if (enabledDates.length === 0) {
    console.warn("No availability dates configured for this listing.");
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

  // Create the request object - always include delivery_option (true/false)
  const request: CreateReservationRequest = {
    listing_id: this.listingData.id,
    start_date: formatDateForApi(this.selectedStartDate),
    end_date: formatDateForApi(this.selectedEndDate),
    client_id: clientId,
    delivery_option: this.needsDelivery
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

  // Add this method to the ListingDetailComponent class:
// Add this method to the ListingDetailComponent class:
viewPartnerReviews(partnerId: number | undefined): void {
  console.log('Opening partner reviews modal for partner ID:', partnerId);
  
  if (!partnerId) {
    console.warn('Partner ID is undefined, cannot show reviews');
    return;
  }
  
  this.selectedPartnerId = partnerId;
  this.showPartnerReviewsModal = true;
  
  // Force change detection to ensure modal appears immediately
  this.cdRef.detectChanges();
  console.log('Partner reviews modal opened, partner ID:', this.selectedPartnerId);
}

// Add this method to close the modal:
closePartnerReviewsModal(): void {
  console.log('Closing partner reviews modal');
  this.showPartnerReviewsModal = false;
  this.selectedPartnerId = null;
  
  // Force change detection to ensure modal is removed from DOM
  this.cdRef.detectChanges();
  console.log('Partner reviews modal closed');
}
}
