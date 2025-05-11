import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Category } from '../../../../shared/database.model';
import { ListingsService } from '../../../listings/services/listings.service';
import { UserService } from '../../../profile/services/user.service';

@Component({
  selector: 'app-add-listing',
  standalone: false,
  templateUrl: './add-listing.component.html',
  styleUrls: ['./add-listing.component.scss']
})
export class AddListingComponent implements OnInit, OnDestroy {
  listingForm!: FormGroup;
  categories$!: Observable<Category[]>;
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  existingImageUrls: { id: number, url: string }[] = [];
  isEditMode = false;
  listing_id: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  private routeSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private listingsService: ListingsService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.categories$ = this.listingsService.getCategories();
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.listing_id = +id;
        this.loadListingData(this.listing_id);
      } else {
        this.addAvailabilityPeriod();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) this.routeSub.unsubscribe();
  }

  private initForm(): void {
    this.listingForm = this.fb.group({
      title: ['', Validators.required],
      category_id: [null, Validators.required],
      price_per_day: [null, [Validators.required, Validators.min(1)]],
      description: ['', Validators.required],
      availabilities: this.fb.array([]),
      delivery_option: [false],
      is_premium: [false],
      premium_duration: [0, Validators.required]
    });
  }

  get availabilitiesFormArray(): FormArray {
    return this.listingForm.get('availabilities') as FormArray;
  }

  private createAvailabilityPeriod(start: string | null = null, end: string | null = null): FormGroup {
    return this.fb.group({
      start_date: [start, Validators.required],
      end_date: [end, Validators.required]
    });
  }

  addAvailabilityPeriod(): void {
    this.availabilitiesFormArray.push(this.createAvailabilityPeriod());
  }

  removeAvailabilityPeriod(index: number): void {
    if (this.availabilitiesFormArray.length > 1) {
      this.availabilitiesFormArray.removeAt(index);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      files.slice(0, 5 - this.selectedFiles.length).forEach(file => {
        if (file.type.match('image.*') && file.size <= 5 * 1024 * 1024) {
          this.selectedFiles.push(file);
          const reader = new FileReader();
          reader.onload = (e: any) => this.imagePreviews.push(e.target.result);
          reader.readAsDataURL(file);
        }
      });
      input.value = '';
    }
  }

  removeImage(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  private loadListingData(id: number): void {
    this.listingsService.getListingById(id).subscribe(listing => {
      if (listing) {
        this.listingForm.patchValue({
          title: listing.title,
          category_id: listing.category?.id,
          price_per_day: listing.price_per_day,
          description: listing.description,
          delivery_option: listing.delivery_option,
          premium_duration: listing.is_premium ? 30 : 0
        });
        this.availabilitiesFormArray.clear();
        listing.availabilities?.forEach(avail =>
          this.availabilitiesFormArray.push(this.createAvailabilityPeriod(avail.start_date, avail.end_date))
        );
        this.imagePreviews = listing.images?.map(img => img.url) || [];
        this.existingImageUrls = listing.images?.map(img => ({ id: img.id, url: img.url })) || [];
      }
    });
  }

  onSubmit(): void {
    if (this.listingForm.invalid) {
      this.listingForm.markAllAsTouched();
      this.errorMessage = "Please fill all required fields correctly.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formValue = this.listingForm.value;
    const formData = new FormData();
    const partnerId = this.userService.getCurrentUserId();

    if (partnerId) {
      formData.append('partner_id', partnerId.toString());
    } else {
      this.errorMessage = "User not identified. Cannot create listing.";
      this.isLoading = false;
      return;
    }

    if (!this.isEditMode) { // Seulement pour la création
      formData.append('status', 'active'); // Valeur par défaut pour une nouvelle annonce
    }

    formData.append('title', formValue.title);
    formData.append('category_id', formValue.category_id);
    formData.append('price_per_day', formValue.price_per_day.toString());
    formData.append('description', formValue.description);
    formData.append('delivery_option', formValue.delivery_option ? '1' : '0');

    const premiumDuration = parseInt(formValue.premium_duration, 10);
    formData.append('is_premium', premiumDuration > 0 ? '1' : '0');
    if (premiumDuration > 0) {
      formData.append('premium_duration', premiumDuration.toString());
    }

    formValue.availabilities.forEach((avail: { start_date: string, end_date: string }, index: number) => {
      formData.append(`availabilities[${index}][start_date]`, avail.start_date);
      formData.append(`availabilities[${index}][end_date]`, avail.end_date);
    });

    // Gestion des images
    this.imagePreviews.forEach(imgPreview => {
      if ((imgPreview as any).file && !(imgPreview as any).markedForRemoval) {
        formData.append('new_images[]', (imgPreview as any).file, (imgPreview as any).file.name);
      } else if ((imgPreview as any).id && (imgPreview as any).markedForRemoval) {
        formData.append('deleted_images[]', (imgPreview as any).id.toString());
      }
    });

    if (this.isEditMode && this.listing_id) {
      formData.append('_method', 'PUT');

      this.listingsService.updateListing(this.listing_id, formData).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: () => this.router.navigate(['/partner-dashboard']),
        error: (err: HttpErrorResponse) => this.handleFormError(err, 'updating')
      });
    } else {
      this.listingsService.createListing(formData).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: () => this.router.navigate(['/partner-dashboard']),
        error: (err: HttpErrorResponse) => this.handleFormError(err, 'creating')
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/partner-dashboard']);
  }

  private handleFormError(err: HttpErrorResponse, action: string): void {
    this.errorMessage = `An error occurred while ${action} the listing. Please try again later.`;
    console.error(err);
  }
}
