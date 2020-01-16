import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MainCategory} from '../../interfaces/main-marketplace/main-category';

@Component({
  selector: 'favr-category-card-buttons',
  templateUrl: './favr-category-card-buttons.component.html',
  styleUrls: ['./favr-category-card-buttons.component.scss'],
})
export class FavrCategoryCardButtonsComponent implements OnInit {
  @Input() categories: MainCategory[];
  @Output() selectedCategory: EventEmitter<MainCategory> = new EventEmitter();

  private _currentActive: HTMLButtonElement;

  constructor() { }

  ngOnInit() {}

  private get getCurrentActive(): HTMLButtonElement {
    return this._currentActive;
  }

  private set setCurrentActive(categoryButton: HTMLButtonElement) {
    if (this.getCurrentActive) {
      this.getCurrentActive.classList.remove('active');
    }

    this._currentActive = categoryButton;
    this._currentActive.classList.add('active');
  }

  private selectCategory(categoryButton: HTMLButtonElement, category?: MainCategory): void {
    this.setCurrentActive = categoryButton;
    this.selectedCategory.emit(category);
  }
}
