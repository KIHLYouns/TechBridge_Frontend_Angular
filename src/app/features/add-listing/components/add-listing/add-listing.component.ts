import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ListingsService } from '../../../listings/services/listings.service';
import { Category, Listing } from '../../../../shared/database.model';

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
  isEditMode = false;
  listing_id: number | null = null;
  private routeSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private listingsService: ListingsService,
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
      premium_duration: [0]
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
      }
    });
  }

  onSubmit(): void {
    if (this.listingForm.invalid) return;
    const formData = { ...this.listingForm.value };
    formData.is_premium = formData.premium_duration > 0;
    if (formData.is_premium) {
      const now = new Date();
      formData.premium_start_date = now.toISOString();
      const endDate = new Date(now);
      endDate.setDate(now.getDate() + formData.premium_duration);
      formData.premium_end_date = endDate.toISOString();
    }
    delete formData.premium_duration;

    if (this.isEditMode && this.listing_id) {
      console.log('Updating listing:', formData);
    } else {
      console.log('Creating listing:', formData);
    }
    this.router.navigate(['/partner-dashboard']);
  }

  onCancel(): void {
    this.router.navigate(['/partner-dashboard']);
  }
}
