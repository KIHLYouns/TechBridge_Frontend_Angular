import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../../auth/services/token.service';
import { ReservationsService, Reservation } from '../../../my-rentals/services/reservations.service';

@Component({
  selector: 'app-partner-bookings',
  standalone: false,
  templateUrl: './partner-bookings.component.html',
  styleUrls: ['./partner-bookings.component.scss']
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

  constructor(
    private partnerBookingsService: ReservationsService,
    private router: Router,
    private tokenService: TokenService
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
        this.errorMessage = 'Could not load current bookings. Please try again later.';
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
          this.errorMessage = 'Could not load booking history. Please try again later.';
        }
        this.isLoadingPast = false;
      },
    });
  }

  // Calculate days between dates (same as in MyRentalsComponent)
  calculateDays(startDateStr: string | undefined, endDateStr: string | undefined): number | null {
    if (!startDateStr || !endDateStr) {
      return null;
    }
    try {
      const start = new Date(startDateStr);
      const end = new Date(endDateStr);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error('Invalid date format provided:', startDateStr, endDateStr);
        return null;
      }
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24))) + 1;
      return diffDays;
    } catch (e) {
      console.error('Error calculating days:', e);
      return null;
    }
  }

  // Partner-specific actions
  acceptBooking(bookingId: number): void {
   /* this.partnerBookingsService.updateBookingStatus(bookingId, 'confirmed').subscribe({
      next: () => {
        // Update local data to reflect the change
        const booking = this.currentBookings.find(b => b.id === bookingId);
        if (booking) {
          booking.status = 'confirmed';
          // Optionally show success message
          console.log('Booking accepted successfully');
        }
      },
      error: (err) => {
        console.error('Error accepting booking:', err);
        // Show error message
      }
    }); */
  }

  declineBooking(bookingId: number): void {
   /* this.partnerBookingsService.updateBookingStatus(bookingId, 'canceled').subscribe({
      next: () => {
        // Update or remove the booking from the current list
        this.currentBookings = this.currentBookings.filter(b => b.id !== bookingId);
        this.loadPastBookings(); // Refresh past bookings to include the canceled one
        console.log('Booking declined successfully');
      },
      error: (err) => {
        console.error('Error declining booking:', err);
        // Show error message
      }
    }); */
  }

  cancelBooking(bookingId: number): void {
    // Same implementation as decline, but semantically different for the user
  /*  this.partnerBookingsService.updateBookingStatus(bookingId, 'canceled').subscribe({
      next: () => {
        this.currentBookings = this.currentBookings.filter(b => b.id !== bookingId);
        this.loadPastBookings();
        console.log('Booking canceled successfully');
      },
      error: (err) => {
        console.error('Error canceling booking:', err);
      }
    }); */
  }

  contactClient(clientId: number | undefined): void {
  /*  if (!clientId) return;
    console.log(`Contacting client ${clientId}`);
    // Implement contact functionality or navigation
    alert(`Action: Contact client ${clientId}`); // Placeholder */
  }

  goToListing(listingId: number | undefined): void {
    if (!listingId) return;
    this.router.navigate(['/listings', listingId]);
  }

  // Client review functionality
  leaveReview(bookingId: number): void {    
    const booking = this.pastBookings.find(b => b.id === bookingId);
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