import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../../auth/services/token.service';
import {
  ReservationsService,
  Reservation,
} from '../../../my-rentals/services/reservations.service';

@Component({
  selector: 'app-partner-bookings',
  standalone: false,
  templateUrl: './partner-bookings.component.html',
  styleUrls: ['./partner-bookings.component.scss'],
})
export class PartnerBookingsComponent implements OnInit {
  activeTab: 'current' | 'history' = 'current';
  currentBookings: Reservation[] = [];
  pastBookings: Reservation[] = [];

  isLoadingCurrent = false;
  isLoadingPast = false;
  errorMessage = '';

  // For review modal (will implement later)
  showReviewModal = false;
  showClientReviewsModal = false;
  selectedReservation: Reservation | null = null;
  selectedClientId: number | null = null;
  currentUserId!: number | null;

  // Action states
  processingAction: {
    bookingId: number;
    action: 'accept' | 'decline' | 'cancel';
  } | null = null;
  actionError: string | null = null;
  actionSuccess: string | null = null;

  constructor(
    private partnerBookingsService: ReservationsService,
    private router: Router,
    private tokenService: TokenService,
    private cdRef: ChangeDetectorRef // Add this
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.tokenService.getUserIdFromToken();
    this.loadBookings();
  }

  setActiveTab(tab: 'current' | 'history'): void {
    this.activeTab = tab;
  }

  loadBookings(): void {
    this.loadCurrentBookings();
    this.loadPastBookings();
  }

  loadCurrentBookings(): void {
    this.isLoadingCurrent = true;
    this.errorMessage = '';

    this.partnerBookingsService.getCurrentPartnerReservations().subscribe({
      next: (data) => {
        this.currentBookings = data;
        this.isLoadingCurrent = false;
      },
      error: (err) => {
        console.error('Error loading current bookings:', err);
        this.errorMessage =
          'Could not load current bookings. Please try again later.';
        this.isLoadingCurrent = false;
      },
    });
  }

  loadPastBookings(): void {
    this.isLoadingPast = true;
    this.partnerBookingsService.getPastPartnerReservations().subscribe({
      next: (data) => {
        this.pastBookings = data;
        this.isLoadingPast = false;
      },
      error: (err) => {
        console.error('Error loading past bookings:', err);
        if (!this.errorMessage || this.currentBookings.length > 0) {
          this.errorMessage =
            'Could not load booking history. Please try again later.';
        }
        this.isLoadingPast = false;
      },
    });
  }

  // Calculate days between dates (same as in MyRentalsComponent)
  calculateDays(
    startDateStr: string | undefined,
    endDateStr: string | undefined
  ): number | null {
    if (!startDateStr || !endDateStr) {
      return null;
    }
    try {
      const start = new Date(startDateStr);
      const end = new Date(endDateStr);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error(
          'Invalid date format provided:',
          startDateStr,
          endDateStr
        );
        return null;
      }
      const diffTime = end.getTime() - start.getTime();
      const diffDays =
        Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24))) + 1;
      return diffDays;
    } catch (e) {
      console.error('Error calculating days:', e);
      return null;
    }
  }

  acceptBooking(bookingId: number): void {
    // Confirm before accepting
    /*if (
      !confirm(
        'Are you sure you want to accept this booking? This will confirm the reservation.'
      )
    ) {
      return;
    } */

    this.processingAction = { bookingId, action: 'accept' };
    this.actionError = null;

    this.partnerBookingsService.acceptReservation(bookingId).subscribe({
      next: () => {
        this.actionSuccess =
          'Booking accepted successfully. Client has been notified.';
        setTimeout(() => {
          this.actionSuccess = null;
          this.cdRef.markForCheck();
        }, 3000);

        this.loadBookings(); // Reload all bookings
        this.processingAction = null;
      },
      error: (error) => {
        this.actionError =
          error.message || 'Failed to accept booking. Please try again.';
        this.processingAction = null;
        this.cdRef.markForCheck();
      },
    });
  }

  declineBooking(bookingId: number): void {
    // Confirm before declining
    // if (
    //   !confirm(
    //     'Are you sure you want to decline this booking? This cannot be undone.'
    //   )
    // ) {
    //   return;
    // }

    this.processingAction = { bookingId, action: 'decline' };
    this.actionError = null;

    this.partnerBookingsService.declineReservation(bookingId).subscribe({
      next: () => {
        this.actionSuccess =
          'Booking declined successfully. Client has been notified.';
        setTimeout(() => {
          this.actionSuccess = null;
          this.cdRef.markForCheck();
        }, 3000);

        this.loadBookings(); // Reload all bookings
        this.processingAction = null;
      },
      error: (error) => {
        this.actionError =
          error.message || 'Failed to decline booking. Please try again.';
        this.processingAction = null;
        this.cdRef.markForCheck();
      },
    });
  }

  cancelBooking(bookingId: number): void {
    // Confirm before canceling
    // if (
    //   !confirm(
    //     'Are you sure you want to cancel this confirmed booking? Client will be notified.'
    //   )
    // ) {
    //   return;
    // }

    this.processingAction = { bookingId, action: 'cancel' };
    this.actionError = null;

    this.partnerBookingsService
      .cancelReservationByPartner(bookingId)
      .subscribe({
        next: () => {
          this.actionSuccess =
            'Booking canceled successfully. Client has been notified.';
          setTimeout(() => {
            this.actionSuccess = null;
            this.cdRef.markForCheck();
          }, 3000);

          this.loadBookings(); // Reload all bookings
          this.processingAction = null;
        },
        error: (error) => {
          this.actionError =
            error.message || 'Failed to cancel booking. Please try again.';
          this.processingAction = null;
          this.cdRef.markForCheck();
        },
      });
  }

  contactClient(clientId: number | undefined): void {
    /*  if (!clientId) return;
    console.log(`Contacting client ${clientId}`);
    // Implement contact functionality or navigation
    alert(`Action: Contact client ${clientId}`); // Placeholder */
  }

  goToListing(listing_id: number | undefined): void {
    if (!listing_id) return;
    this.router.navigate(['/listings', listing_id]);
  }

  // Client review functionality
  leaveReview(bookingId: number): void {
    const booking = this.pastBookings.find((b) => b.id === bookingId);
    if (booking && booking.status === 'completed') {
      this.selectedReservation = booking;
      this.showReviewModal = true;
    } else {
      console.error('Cannot leave review: booking not found or not completed');
    }
  }

  viewClientReviews(clientId: number | undefined): void {
    if (!clientId) return;

    this.selectedClientId = clientId;
    this.showClientReviewsModal = true;
    console.log(`Viewing reviews for client ${clientId}`);
  }

  closeReviewModal(success: boolean): void {
    if (success && this.selectedReservation) {
      // If review was successful, reload past bookings to update status
      this.loadPastBookings();
    }

    this.showReviewModal = false;
    this.selectedReservation = null;
  }

  closeClientReviewsModal(): void {
    this.showClientReviewsModal = false;
    this.selectedClientId = null;
  }
}
