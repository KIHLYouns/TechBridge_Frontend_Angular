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
  existingImages: { id: number, url: string }[] = [];
  imagesToDelete_ids: number[] = [];
  imagePreviews: string[] = [];
  isEditMode = false;
  listing_id: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  private routeSub!: Subscription;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private listingsService: ListingsService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
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
    this.subscriptions.unsubscribe();
  }

  private initForm(): void {
    this.listingForm = this.fb.group({
      title: ['', Validators.required],
      category_id: [null, Validators.required],
      price_per_day: [null, [Validators.required, Validators.min(1)]],
      description: ['', Validators.required],
      availabilities: this.fb.array([]),
      delivery_option: [false],
      premium_duration: [0, Validators.required]
    });

    /* this.subscriptions.add(
      this.listingForm.get('is_premium')!.valueChanges.subscribe(isPremium => {
        const durationControl = this.listingForm.get('premium_duration');
        if (isPremium) {
          durationControl!.enable();
          durationControl!.setValue(durationControl!.value || 7);
        } else {
          durationControl!.disable();
          durationControl!.setValue(null);
        }
      })
    ); */
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
      const remainingSlots = 5 - this.imagePreviews.length;
      files.slice(0, remainingSlots).forEach(file => {
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
    const removedPreviewUrl = this.imagePreviews[index];
    const existingImgIndex = this.existingImages.findIndex(img => img.url === removedPreviewUrl);
    if (existingImgIndex !== -1) {
      this.imagesToDelete_ids.push(this.existingImages[existingImgIndex].id);
      this.existingImages.splice(existingImgIndex, 1);
    } else {
      const newFileIndex = index - this.existingImages.length;
      if (newFileIndex >= 0) this.selectedFiles.splice(newFileIndex, 1);
    }
    this.imagePreviews.splice(index, 1);
  }

  private loadListingData(id: number): void {
    this.isLoading = true;
    this.listingsService.getListingById(id).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (listing) => {
        if (listing) {
          let calculatedPremiumDuration = 0;
          let isCurrentlyPremiumAndActive = false;

          if (listing.is_premium && listing.premium_start_date && listing.premium_end_date) {
            const endDate = new Date(listing.premium_end_date);
            if (endDate > new Date()) { // Vérifier si la période premium est toujours active
              isCurrentlyPremiumAndActive = true;
              const startDate = new Date(listing.premium_start_date);
              // Calculer la durée originale de la période premium
              const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
              const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

              if ([7, 15, 30].includes(diffDays)) {
                calculatedPremiumDuration = diffDays;
              }
            }
          }

          this.listingForm.patchValue({
            title: listing.title,
            category_id: listing.category?.id,
            price_per_day: listing.price_per_day,
            description: listing.description,
            delivery_option: listing.delivery_option,
            premium_duration: calculatedPremiumDuration
          });

          const premiumDurationControl = this.listingForm.get('premium_duration');
          if (premiumDurationControl) {
            if (isCurrentlyPremiumAndActive) {
              premiumDurationControl.disable(); // Désactiver si déjà premium et actif
            } else {
              premiumDurationControl.enable();  // Activer sinon (par ex. premium expiré ou jamais premium)
            }
          }

          this.availabilitiesFormArray.clear();
          if (listing.availabilities && listing.availabilities.length > 0) {
            listing.availabilities?.forEach(avail =>
              this.availabilitiesFormArray.push(this.createAvailabilityPeriod(avail.start_date, avail.end_date))
            );
          } else {
            this.addAvailabilityPeriod();
          }
          this.existingImages = listing.images?.map(img => ({ id: img.id, url: img.full_url })) || [];
          this.imagePreviews = this.existingImages.map(img => img.url);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = "Failed to load listing data. " + (err.error?.message || err.message);
      }
    });
  }

  onSubmit(): void {
    if (this.listingForm.invalid || (!this.isEditMode && this.selectedFiles.length === 0 && this.imagePreviews.length === 0)) {
      this.errorMessage = "Please fill all required fields correctly and add at least one image.";
      Object.values(this.listingForm.controls).forEach(control => {
        control.markAsTouched();
      });
      if (this.availabilitiesFormArray.invalid) {
        this.availabilitiesFormArray.markAllAsTouched();
      }
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    // Utilisez getRawValue() pour obtenir toutes les valeurs, y compris celles des contrôles désactivés
    const formValue = this.listingForm.getRawValue();

    const partnerId = this.userService.getCurrentUserId();
    if (partnerId) {
      formData.append('partner_id', partnerId.toString());
    } else {
      this.errorMessage = "User not identified. Cannot create or update listing.";
      this.isLoading = false;
      return;
    }

    if (!this.isEditMode) {
      formData.append('status', 'active'); // Statut par défaut pour les nouvelles annonces
    }
    // Pour le mode édition, le statut est géré séparément par d'autres actions (pause, archive)
    // et ne devrait pas être modifié ici sauf si c'est une intention explicite.
    // Si vous avez besoin de modifier le statut via ce formulaire en mode édition, ajoutez un champ de statut.

    formData.append('title', formValue.title);
    formData.append('category_id', formValue.category_id);
    formData.append('price_per_day', formValue.price_per_day.toString());
    formData.append('description', formValue.description);
    formData.append('delivery_option', formValue.delivery_option ? '1' : '0');

    const premiumDurationControl = this.listingForm.get('premium_duration');

    // Envoyer les informations premium seulement si :
    // 1. C'est une nouvelle annonce (isEditMode = false)
    // 2. C'est une annonce existante ET le contrôle premium_duration est activé (c.a.d. pas un premium actif non modifiable)
    if (!this.isEditMode || (premiumDurationControl && premiumDurationControl.enabled)) {
      formData.append('is_premium', formValue.premium_duration > 0 ? '1' : '0');
      if (formValue.premium_duration > 0) {
        formData.append('premium_duration', formValue.premium_duration.toString());
      }
    }
    // Si c'est le mode édition et que premiumDurationControl est désactivé,
    // is_premium et premium_duration ne sont PAS envoyés.
    // Le backend devrait alors préserver le statut premium existant.


    formValue.availabilities.forEach((avail: { start_date: string, end_date: string }, index: number) => {
      formData.append(`availabilities[${index}][start_date]`, avail.start_date);
      formData.append(`availabilities[${index}][end_date]`, avail.end_date);
    });

    this.selectedFiles.forEach(file => formData.append('new_images[]', file, file.name));
    if (this.isEditMode) { // N'envoyer les images à supprimer qu'en mode édition
        this.imagesToDelete_ids.forEach(id => formData.append('deleted_images[]', id.toString()));
    }


    const request = this.isEditMode && this.listing_id
      ? this.listingsService.updateListing(this.listing_id, formData)
      : this.listingsService.createListing(formData);

    request.pipe(finalize(() => this.isLoading = false)).subscribe({
      next: (response) => {
        // Naviguer vers le tableau de bord du partenaire après succès
        this.router.navigate(['/partner-dashboard']);
      },
      error: (err: HttpErrorResponse) => this.handleFormError(err, this.isEditMode ? 'updating' : 'creating')
    });
  }

  onCancel(): void {
    this.router.navigate(['/partner-dashboard']);
  }

  private handleFormError(err: HttpErrorResponse, action: string): void {
    this.errorMessage = `An error occurred while ${action} the listing. Please try again later.`;
    console.error(err);
    if (err.error && err.error.errors) {
      this.errorMessage = "Please correct the validation errors.";
      const validationErrors = err.error.errors;
      Object.keys(validationErrors).forEach(key => {
        const control = this.listingForm.get(key);
        if (control) {
          control.setErrors({ serverError: validationErrors[key][0] });
        }
      });
    }
  }
}
