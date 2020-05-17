import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavrMarketplaceCardComponent } from './favr-marketplace-card.component';

describe('FavrMarketplaceCardComponent', () => {
  let component: FavrMarketplaceCardComponent;
  let fixture: ComponentFixture<FavrMarketplaceCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavrMarketplaceCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavrMarketplaceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
