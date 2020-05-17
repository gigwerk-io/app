import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavrNavComponent } from './favr-nav.component';

describe('FavrNavComponent', () => {
  let component: FavrNavComponent;
  let fixture: ComponentFixture<FavrNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavrNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavrNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
