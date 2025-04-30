import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../../../../shared/database.model';
import { ListingsService } from '../../../services/listings.service';

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  categories$!: Observable<Category[]>;
  activeCategory: Category | null = null;

  constructor(private listingsService: ListingsService) {}

  ngOnInit(): void {
    this.categories$ = this.listingsService.getCategories();
    this.setActiveCategory(null);
  }

  setActiveCategory(category: Category | null): void {
    this.activeCategory = category;
  }
}
