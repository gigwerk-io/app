import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceDetailPage } from './marketplace-detail.page';

describe('MarketplaceDetailPage', () => {
  let component: MarketplaceDetailPage;
  let fixture: ComponentFixture<MarketplaceDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
